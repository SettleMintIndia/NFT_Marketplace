// SPDX-License-Identifier: MIT
// SettleMint.com

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../library/token/ERC721/extensions/ERC721Whitelist.sol";
import "../library/token/ERC721/extensions/ERC721Freezable.sol";
import "../library/token/ERC721/extensions/ERC721MintPausable.sol";
import "../library/token/ERC721/extensions/ERC721OpenSeaGassLess.sol";
import "../library/token/ERC721/extensions/ERC721Batch.sol";

contract MetaDog is
  ERC721Enumerable,
  ERC721Burnable,
  ERC721Pausable,
  ERC721Whitelist,
  ERC721Freezable,
  ERC721MintPausable,
  ERC721OpenSeaGassLess,
  ERC721Batch,
  Ownable,
  ReentrancyGuard
{
  using Counters for Counters.Counter;

  //////////////////////////////////////////////////////////////////
  // CONFIGURATION                                                //
  //////////////////////////////////////////////////////////////////

  uint256 public constant RESERVES = 5; // amount of tokens for the team, or to sell afterwards
  uint256 public constant PRICE_IN_WEI_WHITELIST = 0.0069 ether; // price per token in the whitelist sale
  uint256 public constant PRICE_IN_WEI_PUBLIC = 0.0420 ether; // price per token in the public sale
  uint256 public constant MAX_PER_TX = 6; // maximum amount of tokens one can mint in one transaction
  uint256 public constant MAX_SUPPLY = 100; // the total amount of tokens for this NFT

  //////////////////////////////////////////////////////////////////
  // TOKEN STORAGE                                                //
  //////////////////////////////////////////////////////////////////

  Counters.Counter private _tokenIdTracker;
  string private _baseTokenURI; // the IPFS url to the folder holding the metadata.

  //////////////////////////////////////////////////////////////////
  // CROWDSALE STORAGE                                            //
  //////////////////////////////////////////////////////////////////

  address payable private _wallet; // adress of the wallet which received the funds
  mapping(address => uint256) public _addressToMinted; // the amount of tokens an address has minted

  constructor(
    string memory name_,
    string memory symbol_,
    string memory baseTokenURI_,
    address proxyRegistryAddress_,
    address payable wallet_
  ) ERC721(name_, symbol_) ERC721OpenSeaGassLess(proxyRegistryAddress_) {
    _baseTokenURI = baseTokenURI_;
    _wallet = wallet_;
  }

  //////////////////////////////////////////////////////////////////
  // CORE FUNCTIONS                                               //
  //////////////////////////////////////////////////////////////////

  function setBaseURI(string memory baseTokenURI_) public onlyOwner whenURINotFrozen {
    _baseTokenURI = baseTokenURI_;
  }

  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    string memory tokenUri = super.tokenURI(tokenId);
    return bytes(tokenUri).length > 0 ? string(abi.encodePacked(tokenUri, ".json")) : "";
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable, ERC721Pausable, ERC721MintPausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Freezable) {
    super._afterTokenTransfer(from, to, tokenId);
  }

  //////////////////////////////////////////////////////////////////
  // RESERVE TOKENS                                               //
  //////////////////////////////////////////////////////////////////

  function collectReserves() external onlyOwner {
    require(_tokenIdTracker.current() == 0, "Reserves already collected");
    for (uint256 i = 1; i <= RESERVES; i++) {
      _tokenIdTracker.increment();
      _mint(_wallet, _tokenIdTracker.current());
    }
  }

  function gift(address[] calldata recipients_) external onlyOwner {
    require(_tokenIdTracker.current() > 0, "Reserves not taken yet");
    uint256 recipients = recipients_.length;
    require(_tokenIdTracker.current() + recipients <= MAX_SUPPLY, "Excedes max supply");
    for (uint256 i = 0; i < recipients; i++) {
      _tokenIdTracker.increment();
      _mint(recipients_[i], _tokenIdTracker.current());
    }
  }

  //////////////////////////////////////////////////////////////////
  // WHITELIST SALE                                               //
  //////////////////////////////////////////////////////////////////

  function setWhitelistMerkleRoot(bytes32 whitelistMerkleRoot_) external onlyOwner {
    _setWhitelistMerkleRoot(whitelistMerkleRoot_);
  }

  function whitelistMint(
    uint256 count,
    uint256 allowance,
    bytes32[] calldata proof
  ) external payable nonReentrant {
    require(_tokenIdTracker.current() > 0, "Reserves not taken yet");
    require(_tokenIdTracker.current() + count <= MAX_SUPPLY, "Excedes max supply");
    require(_validateWhitelistMerkleProof(allowance, proof), "Invalid Merkle Tree proof supplied");
    require(_addressToMinted[_msgSender()] + count <= allowance, "Exceeds whitelist allowance");
    require(count * PRICE_IN_WEI_WHITELIST == msg.value, "Invalid funds provided");
    _addressToMinted[_msgSender()] += count;
    for (uint256 i; i < count; i++) {
      _tokenIdTracker.increment();
      _mint(_msgSender(), _tokenIdTracker.current());
    }
  }

  //////////////////////////////////////////////////////////////////
  // PUBLIC SALE                                                  //
  //////////////////////////////////////////////////////////////////

  function startPublicSale() external onlyOwner {
    _disableWhitelistMerkleRoot();
  }

  function publicMint(uint256 count) external payable nonReentrant {
    require(_whitelistMerkleRoot == 0, "Public sale not active");
    require(_tokenIdTracker.current() > 0, "Reserves not taken yet");
    require(_tokenIdTracker.current() + count <= MAX_SUPPLY, "Excedes max supply");
    require(count < MAX_PER_TX, "Exceeds max per transaction");
    require(count * PRICE_IN_WEI_PUBLIC == msg.value, "Invalid funds provided");

    for (uint256 i; i < count; i++) {
      _tokenIdTracker.increment();
      _mint(_msgSender(), _tokenIdTracker.current());
    }
  }

  //////////////////////////////////////////////////////////////////
  // POST SALE MANAGEMENT                                         //
  //////////////////////////////////////////////////////////////////

  function withdraw() public {
    _wallet.transfer(address(this).balance);
  }

  function wallet() public view returns (address) {
    return _wallet;
  }

  function burn(uint256 tokenId) public override {
    super._burn(tokenId);
  }

  function freeze() external onlyOwner {
    super._freeze();
  }

  //////////////////////////////////////////////////////////////////
  // GASLESS LISTING FOR OPENSEA                                  //
  //////////////////////////////////////////////////////////////////

  function setProxyRegistryAddress(address proxyRegistryAddress_) external onlyOwner {
    _setProxyRegistryAddress(proxyRegistryAddress_);
  }

  function isApprovedForAll(address _owner, address operator)
    public
    view
    override(ERC721, ERC721OpenSeaGassLess)
    returns (bool)
  {
    return super.isApprovedForAll(_owner, operator);
  }

  //////////////////////////////////////////////////////////////////
  // Pausable & MintPausable                                      //
  //////////////////////////////////////////////////////////////////

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function pauseMint() public onlyOwner {
    _pauseMint();
  }

  function unpauseMint() public onlyOwner {
    _unpauseMint();
  }

  //////////////////////////////////////////////////////////////////
  // ERC165                                                       //
  //////////////////////////////////////////////////////////////////

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return
      interfaceId == type(Ownable).interfaceId ||
      interfaceId == type(ERC721Burnable).interfaceId ||
      interfaceId == type(ERC721Enumerable).interfaceId ||
      interfaceId == type(ERC721Whitelist).interfaceId ||
      interfaceId == type(ERC721Freezable).interfaceId ||
      interfaceId == type(ERC721MintPausable).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}

