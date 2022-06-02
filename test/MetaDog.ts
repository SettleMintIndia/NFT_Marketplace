import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai, { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { MetaDog } from '../typechain-types/contracts/MetaDog';
import { MetaDog__factory } from '../typechain-types/factories/contracts/MetaDog__factory';

chai.use(solidity);

describe('MetaDog', () => {
  let metaDog: MetaDog;
  let owner: SignerWithAddress;
  let projectwallet: SignerWithAddress;
  let teamMemberOne: SignerWithAddress;
  let teamMemberTwo: SignerWithAddress;
  let whitelistOne: SignerWithAddress;
  let whitelistTwo: SignerWithAddress;
  let regularOne: SignerWithAddress;
  let regularTwo: SignerWithAddress;

  const baseURLPlaceholder = 'ipfs://bafybeifc23vyo52i6dtlba7u7kmbcpc5oxfcwjaz3oisagq3kq7i2dbo6q/';
  const baseURLRevealed = 'ipfs://bafybeihxsckb6gl6yzyn4sjwyspf2lldlhmxo7usqebkdvol2l6uehryei/';

  beforeEach(async () => {
    [owner, projectwallet, teamMemberOne, teamMemberTwo, whitelistOne, whitelistTwo, regularOne, regularTwo] =
      await ethers.getSigners();

    const factory = await ethers.getContractFactory<MetaDog__factory>('MetaDog', owner);
    metaDog = await factory.deploy(
      'MetaDogs',
      'MTD',
      baseURLPlaceholder,
      '0x0000000000000000000000000000000000000000',
      projectwallet.address
    );
  });

  describe('Pre Requisites', () => {
    it('has a name', async function () {
      expect(await metaDog.name()).to.equal('MetaDogs');
    });
    it('has a symbol', async function () {
      expect(await metaDog.symbol()).to.equal('MTD');
    });
    it('has a wallet', async function () {
      expect(await metaDog.wallet()).to.equal(projectwallet.address);
    });
    it('is not frozen', async function () {
      expect(await metaDog.frozen()).to.be.false;
    });
    it('is not paused', async function () {
      expect(await metaDog.paused()).to.be.false;
    });
    it('is not mint paused', async function () {
      expect(await metaDog.mintPaused()).to.be.false;
    });
    it('has no tokens minted', async function () {
      expect(await metaDog.totalSupply()).to.equal(0);
    });
    it('has an owner', async function () {
      expect(await metaDog.owner()).to.equal(owner.address);
    });
  });

  describe('before presale', () => {
    it('can collect reserved tokens', async function () {
      await metaDog.collectReserves();
      expect(await metaDog.totalSupply()).to.equal(5);
    });
    it('has 5 tokens minted', async function () {
      await metaDog.collectReserves();
      expect(await metaDog.totalSupply()).to.equal(5);
    });
    it('can get the token url for the first token', async function () {
      await metaDog.collectReserves();
      expect(await metaDog.tokenURI(1)).to.equal(`${baseURLPlaceholder}1.json`);
    });
    it('mints the reserves in the address of the wallet', async function () {
      await metaDog.collectReserves();
      expect(await metaDog.ownerOf(1)).to.equal(projectwallet.address);
      expect(await metaDog.ownerOf(3)).to.equal(projectwallet.address);
    });
    it('cannot collect the reserves twice', async function () {
      await metaDog.collectReserves();
      await expect(metaDog.collectReserves()).to.be.revertedWith('Reserves already collected');
    });
    it('can transfer tokens to team members', async function () {
      await metaDog.collectReserves();
      const projectWalletMetaDog = metaDog.connect(projectwallet);
      await projectWalletMetaDog.transferFrom(projectwallet.address, teamMemberOne.address, 2);
      expect(await metaDog.ownerOf(2)).to.equal(teamMemberOne.address);
    });
  });

  describe('presale', () => {
    let mintproofOne: string[];
    let mintproofTwo: string[];
    let whitelistRoot: string;

    beforeEach(async () => {
      const whitelist = {
        [whitelistOne.address]: '2',
        [whitelistTwo.address]: '1',
      };
      const whiteListLeaves = Object.entries(whitelist).map(([address, amount]) =>
        Buffer.from(ethers.utils.solidityKeccak256(['address', 'string'], [address, amount]).slice(2), 'hex')
      );
      const whitelistTree = new MerkleTree(whiteListLeaves, keccak256, { sortPairs: true });
      whitelistRoot = whitelistTree.getHexRoot();
      mintproofOne = whitelistTree.getHexProof(whiteListLeaves[0]);
      mintproofTwo = whitelistTree.getHexProof(whiteListLeaves[1]);
      expect(whitelistTree.verify(mintproofOne, whiteListLeaves[0], whitelistRoot)).to.be.true;
      expect(whitelistTree.verify(mintproofTwo, whiteListLeaves[1], whitelistRoot)).to.be.true;
      await metaDog.collectReserves();
      await metaDog.setWhitelistMerkleRoot(whitelistRoot);
    });

    it('can buy in the presale', async function () {
      const whitelistOneMetaDog = metaDog.connect(whitelistOne);
      await whitelistOneMetaDog.whitelistMint(2, 2, mintproofOne, { value: ethers.utils.parseEther(`${0.0069 * 2}`) });
      expect(await metaDog.ownerOf(6)).to.equal(whitelistOne.address);
    });

    it('can buy less than allowance in the presale', async function () {
      const whitelistOneMetaDog = metaDog.connect(whitelistOne);
      await whitelistOneMetaDog.whitelistMint(1, 2, mintproofOne, { value: ethers.utils.parseEther(`${0.0069}`) });
      expect(await metaDog.ownerOf(6)).to.equal(whitelistOne.address);
    });

    it("can't buy more than allowance in the presale", async function () {
      const whitelistOneMetaDog = metaDog.connect(whitelistOne);
      await expect(
        whitelistOneMetaDog.whitelistMint(3, 2, mintproofOne, { value: ethers.utils.parseEther(`${0.0069 * 3}`) })
      ).to.be.revertedWith('Exceeds whitelist allowance');
    });
  });

  describe('public sale', () => {
    let mintproofOne: string[];
    let mintproofTwo: string[];
    let whitelistRoot: string;

    beforeEach(async () => {
      const whitelist = {
        [whitelistOne.address]: '2',
        [whitelistTwo.address]: '1',
      };
      const whiteListLeaves = Object.entries(whitelist).map(([address, amount]) =>
        Buffer.from(ethers.utils.solidityKeccak256(['address', 'string'], [address, amount]).slice(2), 'hex')
      );
      const whitelistTree = new MerkleTree(whiteListLeaves, keccak256, { sortPairs: true });
      whitelistRoot = whitelistTree.getHexRoot();
      mintproofOne = whitelistTree.getHexProof(whiteListLeaves[0]);
      mintproofTwo = whitelistTree.getHexProof(whiteListLeaves[1]);
      expect(whitelistTree.verify(mintproofOne, whiteListLeaves[0], whitelistRoot)).to.be.true;
      expect(whitelistTree.verify(mintproofTwo, whiteListLeaves[1], whitelistRoot)).to.be.true;
      await metaDog.collectReserves();
      await metaDog.setWhitelistMerkleRoot(whitelistRoot);
    });

    it('can start the public sale', async function () {
      await metaDog.startPublicSale();
    });

    it('allows regular users to buy in the public sale', async function () {
      await metaDog.startPublicSale();
      const regularOneMetaDog = metaDog.connect(regularOne);
      await regularOneMetaDog.publicMint(3, { value: ethers.utils.parseEther(`${0.042 * 3}`) });
      expect(await metaDog.balanceOf(regularOne.address)).to.equal(3);
    });
  });

  describe('metadata reveal', () => {
    beforeEach(async () => {
      await metaDog.collectReserves();
    });
    it('can reveal the metadata', async function () {
      expect(await metaDog.tokenURI(1)).to.equal(`${baseURLPlaceholder}1.json`);
      await metaDog.setBaseURI(baseURLRevealed);
      expect(await metaDog.tokenURI(1)).to.equal(`${baseURLRevealed}1.json`);
    });
  });
});
