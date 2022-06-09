// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

interface ITokenRegistry {
  function enabled(address) external view returns (bool);
}

contract Marketplace is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
  using SafeERC20 for IERC20;
  using EnumerableSet for EnumerableSet.AddressSet;
  EnumerableSet.AddressSet private _nftCollectionAddress;
  using EnumerableSet for EnumerableSet.UintSet;
  EnumerableSet.UintSet private _nftCollectionTokenId;

  /// @notice Structure for listed items
  struct Listing {
    uint256 quantity;
    address payToken;
    uint256 pricePerItem;
    uint256 startingTime;
  }

  /// @notice Structure for offer
  struct Offer {
    IERC20 payToken;
    uint256 quantity;
    uint256 pricePerItem;
    uint256 deadline;
  }

  struct CollectionRoyalty {
    uint16 royalty;
    address creator;
    address feeRecipient;
  }

  // mapping(address => EnumerableSet.AddressSet) public _nftCollectionAddressSet;
  mapping(address => mapping(uint256 => EnumerableSet.UintSet)) private _nftCollectionSet;
  /// @notice NftAddress -> Token ID -> Owner -> Listing item
  mapping(address => mapping(uint256 => mapping(address => Listing))) public listings;

  /// @notice Platform fee
  uint16 public platformFee;

  /// @notice Platform fee receipient
  address payable public feeReceipient;

  /// @notice NftAddress -> Token ID -> Minter
  mapping(address => mapping(uint256 => address)) public minters;

  /// @notice NftAddress -> Token ID -> Royalty
  mapping(address => mapping(uint256 => uint16)) public royalties;

  /// @notice NftAddress -> Token ID -> Offerer -> Offer
  mapping(address => mapping(uint256 => mapping(address => Offer))) public offers;

  /// @notice NftAddress -> Royalty
  mapping(address => CollectionRoyalty) public collectionRoyalties;

  /// @notice Events for the contract
  event RegisterCollection(address nftAddress, string name, string owner);

  event ItemListed(
    address owner,
    address nft,
    uint256 tokenId,
    uint256 quantity,
    address payToken,
    uint256 pricePerItem,
    uint256 startingTime
  );

  event ItemSold(
    address indexed seller,
    address indexed buyer,
    address indexed nft,
    uint256 tokenId,
    uint256 quantity,
    address payToken,
    uint256 pricePerItem
  );

  event OfferCanceled(address indexed creator, address indexed nft, uint256 tokenId);

  event ItemCanceled(address indexed owner, address indexed nft, uint256 tokenId);

  modifier isListed(
    address _nftAddress,
    uint256 _tokenId,
    address _owner
  ) {
    Listing memory listing = listings[_nftAddress][_tokenId][_owner];
    require(listing.quantity > 0, "not listed item");
    _;
  }

  modifier notListed(
    address _nftAddress,
    uint256 _tokenId,
    address _owner
  ) {
    Listing memory listing = listings[_nftAddress][_tokenId][_owner];
    //require(listing.quantity == 0, "already listed");
    _;
  }

  modifier validListing(
    address _nftAddress,
    uint256 _tokenId,
    address _owner
  ) {
    Listing memory listedItem = listings[_nftAddress][_tokenId][_owner];

    IERC721 nft = IERC721(_nftAddress);
    require(nft.ownerOf(_tokenId) == _owner, "not owning item");

    require(_getNow() >= listedItem.startingTime, "item not buyable");
    _;
  }

  function initialize(address payable _feeRecipient, uint16 _platformFee) public initializer {
    platformFee = _platformFee;
    feeReceipient = _feeRecipient;

    __Ownable_init();
    __ReentrancyGuard_init();
  }

  function registerCollection(
    address nftAddress,
    string memory name,
    string memory owner
  ) public {
    emit RegisterCollection(nftAddress, name, owner);
  }

  function listItem(
    address _nftAddress,
    uint256 _tokenId,
    uint256 _quantity,
    address _payToken,
    uint256 _pricePerItem,
    uint256 _startingTime
  ) external notListed(_nftAddress, _tokenId, _msgSender()) {
    IERC721 nft = IERC721(_nftAddress);
    require(nft.ownerOf(_tokenId) == _msgSender(), "not owning item");
    require(nft.isApprovedForAll(_msgSender(), address(this)), "item not approved");

    // _validPayToken(_payToken);
    // _payToken = 0xe11A86849d99F524cAC3E7A0Ec1241828e332C62; // TODO: Remove this- Static pay token address for now
    listings[_nftAddress][_tokenId][_msgSender()] = Listing(_quantity, _payToken, _pricePerItem, _startingTime);
    _nftCollectionAddress.add(_nftAddress);
    _nftCollectionTokenId.add(_tokenId);
    emit ItemListed(_msgSender(), _nftAddress, _tokenId, _quantity, _payToken, _pricePerItem, _startingTime);
  }

  /// @notice Method for buying listed NFT
  /// @param _nftAddress NFT contract address
  /// @param _tokenId TokenId
  function buyItem(
    address _nftAddress,
    uint256 _tokenId,
    address _payToken,
    address _owner
  ) external nonReentrant isListed(_nftAddress, _tokenId, _owner) {
    Listing memory listedItem = listings[_nftAddress][_tokenId][_owner];
    require(listedItem.payToken == _payToken, "invalid pay token");

    _buyItem(_nftAddress, _tokenId, _payToken, _owner);
  }

  function _buyItem(
    address _nftAddress,
    uint256 _tokenId,
    address _payToken,
    address _owner
  ) private {
    Listing memory listedItem = listings[_nftAddress][_tokenId][_owner];

    uint256 price = listedItem.pricePerItem * (listedItem.quantity);
    uint256 feeAmount = (price * (platformFee)) / (1e3);

    IERC20(_payToken).safeTransferFrom(_msgSender(), feeReceipient, feeAmount);

    address minter = minters[_nftAddress][_tokenId];
    uint16 royalty = royalties[_nftAddress][_tokenId];
    if (minter != address(0) && royalty != 0) {
      uint256 royaltyFee = price - ((feeAmount) * (royalty)) / (10000);

      IERC20(_payToken).safeTransferFrom(_msgSender(), minter, royaltyFee);

      feeAmount = feeAmount + (royaltyFee);
    } else {
      minter = collectionRoyalties[_nftAddress].feeRecipient;
      royalty = collectionRoyalties[_nftAddress].royalty;
      if (minter != address(0) && royalty != 0) {
        uint256 royaltyFee = price - ((feeAmount) * (royalty)) / (10000);

        IERC20(_payToken).safeTransferFrom(_msgSender(), minter, royaltyFee);

        feeAmount = feeAmount + (royaltyFee);
      }
    }

    IERC20(_payToken).safeTransferFrom(_msgSender(), _owner, price - (feeAmount));

    // Transfer NFT to buyer
    IERC721(_nftAddress).safeTransferFrom(_owner, _msgSender(), _tokenId);

    // IFantomBundleMarketplace(addressRegistry.bundleMarketplace())
    //     .validateItemSold(_nftAddress, _tokenId, listedItem.quantity);

    //_validateItemSold(_nftAddress, _tokenId, _owner, _msgSender());

    emit ItemSold(
      _owner,
      _msgSender(),
      _nftAddress,
      _tokenId,
      listedItem.quantity,
      _payToken,
      price / (listedItem.quantity)
    );
    delete (listings[_nftAddress][_tokenId][_owner]);
  }

  /**
   * @notice Validate and cancel listing
   * @dev Only bundle marketplace can access
   */
  function _validateItemSold(
    address _nftAddress,
    uint256 _tokenId,
    address _seller,
    address _buyer
  ) internal {
    Listing memory item = listings[_nftAddress][_tokenId][_seller];
    if (item.quantity > 0) {
      _cancelListing(_nftAddress, _tokenId, _seller);
    }
    delete (offers[_nftAddress][_tokenId][_buyer]);
    emit OfferCanceled(_buyer, _nftAddress, _tokenId);
  }

  function _getNow() internal view virtual returns (uint256) {
    return block.timestamp;
  }

  function _cancelListing(
    address _nftAddress,
    uint256 _tokenId,
    address _owner
  ) private {
    // Listing memory listedItem = listings[_nftAddress][_tokenId][_owner];

    IERC721 nft = IERC721(_nftAddress);
    require(nft.ownerOf(_tokenId) == _owner, "not owning item");

    delete (listings[_nftAddress][_tokenId][_owner]);
    _nftCollectionAddress.remove(_nftAddress);
    _nftCollectionTokenId.remove(_tokenId);
    emit ItemCanceled(_owner, _nftAddress, _tokenId);
  }

  function collectionAddress(address _nftAddress) public view returns (bool) {
    //require(_nftCollectionAddress.contains(_nftAddress) == true, "not added to collection");
    if (_nftCollectionAddress.contains(_nftAddress)) return true;
  }
}
