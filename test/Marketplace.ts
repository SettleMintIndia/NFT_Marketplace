import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { Marketplace } from "../typechain-types/contracts/Marketplace.sol/Marketplace";
import { MetaDog } from "../typechain-types/contracts/test/MetaDog";
import { USDC } from "../typechain-types/contracts/test/USDC";
import { Marketplace__factory } from "../typechain-types/factories/contracts/Marketplace.sol/Marketplace__factory";

chai.use(solidity);

describe("Marketplace", () => {
  let marketplace: Marketplace;
  let usdc: USDC;
  let metadog: MetaDog;
  let MPowner: SignerWithAddress;
  let nftOwner: SignerWithAddress;
  let buyer: SignerWithAddress;
  let owner: SignerWithAddress;
  const firstTokenId = 1;
  const pricePerItem = "1000000";
  const baseURLPlaceholder =
    "ipfs://bafybeibrrkjo3kaih6rgyufi76pttatd7geqdjckqklapx7clo7ltponhq/";
  beforeEach(async () => {
    [MPowner, nftOwner, buyer, owner] = await ethers.getSigners();
    const usdcFactory = await ethers.getContractFactory("USDC", owner.address);
    usdc = (await usdcFactory.deploy("USDC", "USDC", "999999999")) as USDC;
    await usdc.deployed();
    console.log(`usdc deployed to: ${usdc.address}`);

    usdc.transfer(buyer.address, "10000000");

    const factory = await ethers.getContractFactory<Marketplace__factory>(
      "Marketplace",
      MPowner.address
    );
    marketplace = await factory.deploy();
    await marketplace.deployed();
    console.log(`marketplace deployed to: ${marketplace.address}`);

    const metadogFactory = await ethers.getContractFactory(
      "MetaDog",
      nftOwner.address
    );
    metadog = (await metadogFactory.deploy(
      "MetaDog",
      "MTD",
      baseURLPlaceholder,
      "0x0000000000000000000000000000000000000000",
      nftOwner.address
    )) as MetaDog;
    await metadog.deployed();
    console.log(`metdog deployed to: ${metadog.address}`);
  });
  describe("pre Requisites", () => {
    it("platformFee", async function () {
      expect(await marketplace.platformFee()).to.equal(0);
    });
    it("initialize", async function () {
      expect(await marketplace.initialize(MPowner.address, 25));
    });
  });
  describe("collection address", () => {
    it("address", async function () {
      await marketplace.collectionAddress(metadog.address);
      expect(await marketplace.collectionAddress(metadog.address));
    });
  });
  describe("listing", () => {
    it("listing details", async function () {
      await metadog.collectReserves();
      expect(
        await marketplace.listings(
          metadog.address,
          firstTokenId,
          nftOwner.address
        )
      );
    });
  });
  describe("listing nft", () => {
    it("listing the nft", async function () {
      await metadog.collectReserves();
      const settingApproval = metadog.connect(nftOwner);
      await settingApproval.setApprovalForAll(marketplace.address, true);
      expect(
        await settingApproval.isApprovedForAll(
          nftOwner.address,
          marketplace.address
        )
      ).to.equal(true);
      marketplace
        .connect(nftOwner)
        .listItem(
          metadog.address,
          firstTokenId,
          1,
          usdc.address,
          pricePerItem,
          1654076707
        );
      expect(
        await marketplace.listings(
          metadog.address,
          firstTokenId,
          nftOwner.address
        )
      );
    });
  });
  describe("selling", () => {
    it("selling the nft", async function () {
      await usdc
        .connect(buyer)
        .increaseAllowance(marketplace.address, 999999999999999);
      await metadog.collectReserves();
      const approval = metadog.connect(nftOwner);
      await approval.setApprovalForAll(marketplace.address, true);
      expect(
        await approval.isApprovedForAll(nftOwner.address, marketplace.address)
      ).to.equal(true);
      expect(await marketplace.initialize(MPowner.address, 25));
      await marketplace
        .connect(nftOwner)
        .listItem(
          metadog.address,
          firstTokenId,
          1,
          usdc.address,
          pricePerItem,
          1654076707
        );
      await marketplace.listings(
        metadog.address,
        firstTokenId,
        nftOwner.address
      );

      await marketplace
        .connect(buyer)
        .buyItem(
          metadog.address,
          ethers.BigNumber.from(firstTokenId),
          usdc.address,
          nftOwner.address
        );
      expect(await usdc.connect(buyer).balanceOf(buyer.address)).to.equal(
        9000000
      );
      expect(await metadog.ownerOf(1)).to.equal(buyer.address);
    });
  });
});





// describe('', () => {
//   it('',async function () {

//   });
// });

// console.log('MPowner',MPowner.address);
// console.log('marketplace',marketplace.address);
// console.log('nftseller',nftseller.address);
// console.log('nftOwner',nftOwner.address);
// console.log('buyer',buyer.address);
// console.log('owner',owner.address);
