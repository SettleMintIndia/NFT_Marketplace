import { BigInt, log } from '@graphprotocol/graph-ts';
import { IERC721Metadata } from '../../generated/marketplace/IERC721Metadata';
import { ItemListed, ItemSold, RegisterCollection } from '../../generated/marketplace/Marketplace';
import { Collection, ListTransaction, SoldTransaction } from '../../generated/schema';

export function handleRegisterCollection(event: RegisterCollection): void {
  const nftAddress = event.params.nftAddress;
  let collection = Collection.load(nftAddress);

  // log.debug('console nftAddress {}', [nftAddress]);

  // const contract = ERC721Contract.load(Bytes.fromHexString(nftAddress));
  // const contract = ERC721Contract.load(Bytes.fromHexString(nftAddress.toHex()));

  // if (contract !== null) {
  // const erc721 = IERC721.bind(nftAddress);
  // const symbol = erc721.symbol();
  // const symbol = try_symbol.reverted ? '' : try_symbol.value;

  // log.debug('console symbol {}', [symbol]);

  // const try_name = erc721.try_name();
  // const name = try_name.reverted ? '' : try_name.value;

  // log.debug('console name {}', [name]);

  if (collection === null) {
    collection = new Collection(nftAddress);
  }

  collection.address = nftAddress;
  // collection.name = name;
  // collection.symbol = symbol;
  collection.owner = event.params.owner;

  collection.save();
}

export function handleItemListed(event: ItemListed): void {
  const transactionHash = event.transaction.hash;

  // const erc721 = IERC721.bind(event.params.nft);
  // const try_tokenURI = erc721.try_tokenURI(event.params.tokenId);
  // const uri = try_tokenURI.reverted ? '' : try_tokenURI.value;

  const erc721 = IERC721Metadata.bind(event.params.nft);
  //const try_balanceOf = erc721.try_balanceOf(Address.fromString('0x8d452A8aFe1883e62FD83Bc78139c409ff05A42D'));
  const try_tokenURI = erc721.try_tokenURI(event.params.tokenId);
  log.debug('logged', [try_tokenURI.value])

  let transaction = ListTransaction.load(transactionHash);

  if (transaction === null) {
    transaction = new ListTransaction(transactionHash);
  }

  // transaction.uri = uri;
  transaction.uri = try_tokenURI.reverted ? '' : try_tokenURI.value;
  transaction.transactionHash = transactionHash;
  transaction.nftAddress = event.params.nft;
  transaction.tokenId = event.params.tokenId;
  transaction.from = event.params.owner;
  //transaction.salePrice = try_balanceOf.reverted ? BigInt.fromI32(0) : try_balanceOf.value;

  transaction.save();
}


//////////////////////////////////////////////////////////////////////////////////////////


export function handleItemSold(event: ItemSold): void {
  const transactionHash = event.transaction.hash;

  // const erc721 = IERC721.bind(event.params.nft);
  // const try_tokenURI = erc721.try_tokenURI(event.params.tokenId);
  // const uri = try_tokenURI.reverted ? '' : try_tokenURI.value;

  const erc721 = IERC721Metadata.bind(event.params.nft);
  //const try_balanceOf = erc721.try_balanceOf();
  const try_tokenURI = erc721.try_tokenURI(event.params.tokenId);
  log.debug('logged', [try_tokenURI.value]);
  let transaction = SoldTransaction.load(transactionHash);

  if (transaction === null) {
    transaction = new SoldTransaction(transactionHash);
  }

  // transaction.uri = uri;
  transaction.uri = try_tokenURI.reverted ? '' : try_tokenURI.value;
  transaction.transactionHash = transactionHash;
  transaction.nftAddress = event.params.nft;
  transaction.tokenId = event.params.tokenId;
  transaction.from = event.params.seller;
  transaction.to = event.params.buyer;
  //transaction.salePrice = try_balanceOf.reverted ? BigInt.fromI32(0) : try_balanceOf.value;

  transaction.save();
}