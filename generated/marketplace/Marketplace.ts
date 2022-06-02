// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Initialized extends ethereum.Event {
  get params(): Initialized__Params {
    return new Initialized__Params(this);
  }
}

export class Initialized__Params {
  _event: Initialized;

  constructor(event: Initialized) {
    this._event = event;
  }

  get version(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class ItemCanceled extends ethereum.Event {
  get params(): ItemCanceled__Params {
    return new ItemCanceled__Params(this);
  }
}

export class ItemCanceled__Params {
  _event: ItemCanceled;

  constructor(event: ItemCanceled) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ItemListed extends ethereum.Event {
  get params(): ItemListed__Params {
    return new ItemListed__Params(this);
  }
}

export class ItemListed__Params {
  _event: ItemListed;

  constructor(event: ItemListed) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get quantity(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get payToken(): Address {
    return this._event.parameters[4].value.toAddress();
  }

  get pricePerItem(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get startingTime(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class ItemSold extends ethereum.Event {
  get params(): ItemSold__Params {
    return new ItemSold__Params(this);
  }
}

export class ItemSold__Params {
  _event: ItemSold;

  constructor(event: ItemSold) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get buyer(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get quantity(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get payToken(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get pricePerItem(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class OfferCanceled extends ethereum.Event {
  get params(): OfferCanceled__Params {
    return new OfferCanceled__Params(this);
  }
}

export class OfferCanceled__Params {
  _event: OfferCanceled;

  constructor(event: OfferCanceled) {
    this._event = event;
  }

  get creator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class RegisterCollection extends ethereum.Event {
  get params(): RegisterCollection__Params {
    return new RegisterCollection__Params(this);
  }
}

export class RegisterCollection__Params {
  _event: RegisterCollection;

  constructor(event: RegisterCollection) {
    this._event = event;
  }

  get nftAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[1].value.toString();
  }

  get owner(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class Marketplace__collectionRoyaltiesResult {
  value0: i32;
  value1: Address;
  value2: Address;

  constructor(value0: i32, value1: Address, value2: Address) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set(
      "value0",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value0))
    );
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromAddress(this.value2));
    return map;
  }

  getRoyalty(): i32 {
    return this.value0;
  }

  getCreator(): Address {
    return this.value1;
  }

  getFeeRecipient(): Address {
    return this.value2;
  }
}

export class Marketplace__listingsResult {
  value0: BigInt;
  value1: Address;
  value2: BigInt;
  value3: BigInt;

  constructor(value0: BigInt, value1: Address, value2: BigInt, value3: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    return map;
  }

  getQuantity(): BigInt {
    return this.value0;
  }

  getPayToken(): Address {
    return this.value1;
  }

  getPricePerItem(): BigInt {
    return this.value2;
  }

  getStartingTime(): BigInt {
    return this.value3;
  }
}

export class Marketplace__offersResult {
  value0: Address;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;

  constructor(value0: Address, value1: BigInt, value2: BigInt, value3: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    return map;
  }

  getPayToken(): Address {
    return this.value0;
  }

  getQuantity(): BigInt {
    return this.value1;
  }

  getPricePerItem(): BigInt {
    return this.value2;
  }

  getDeadline(): BigInt {
    return this.value3;
  }
}

export class Marketplace extends ethereum.SmartContract {
  static bind(address: Address): Marketplace {
    return new Marketplace("Marketplace", address);
  }

  collectionAddress(_nftAddress: Address): boolean {
    let result = super.call(
      "collectionAddress",
      "collectionAddress(address):(bool)",
      [ethereum.Value.fromAddress(_nftAddress)]
    );

    return result[0].toBoolean();
  }

  try_collectionAddress(_nftAddress: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "collectionAddress",
      "collectionAddress(address):(bool)",
      [ethereum.Value.fromAddress(_nftAddress)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  collectionRoyalties(param0: Address): Marketplace__collectionRoyaltiesResult {
    let result = super.call(
      "collectionRoyalties",
      "collectionRoyalties(address):(uint16,address,address)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new Marketplace__collectionRoyaltiesResult(
      result[0].toI32(),
      result[1].toAddress(),
      result[2].toAddress()
    );
  }

  try_collectionRoyalties(
    param0: Address
  ): ethereum.CallResult<Marketplace__collectionRoyaltiesResult> {
    let result = super.tryCall(
      "collectionRoyalties",
      "collectionRoyalties(address):(uint16,address,address)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Marketplace__collectionRoyaltiesResult(
        value[0].toI32(),
        value[1].toAddress(),
        value[2].toAddress()
      )
    );
  }

  feeReceipient(): Address {
    let result = super.call("feeReceipient", "feeReceipient():(address)", []);

    return result[0].toAddress();
  }

  try_feeReceipient(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "feeReceipient",
      "feeReceipient():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  listings(
    param0: Address,
    param1: BigInt,
    param2: Address
  ): Marketplace__listingsResult {
    let result = super.call(
      "listings",
      "listings(address,uint256,address):(uint256,address,uint256,uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
        ethereum.Value.fromAddress(param2)
      ]
    );

    return new Marketplace__listingsResult(
      result[0].toBigInt(),
      result[1].toAddress(),
      result[2].toBigInt(),
      result[3].toBigInt()
    );
  }

  try_listings(
    param0: Address,
    param1: BigInt,
    param2: Address
  ): ethereum.CallResult<Marketplace__listingsResult> {
    let result = super.tryCall(
      "listings",
      "listings(address,uint256,address):(uint256,address,uint256,uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
        ethereum.Value.fromAddress(param2)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Marketplace__listingsResult(
        value[0].toBigInt(),
        value[1].toAddress(),
        value[2].toBigInt(),
        value[3].toBigInt()
      )
    );
  }

  minters(param0: Address, param1: BigInt): Address {
    let result = super.call("minters", "minters(address,uint256):(address)", [
      ethereum.Value.fromAddress(param0),
      ethereum.Value.fromUnsignedBigInt(param1)
    ]);

    return result[0].toAddress();
  }

  try_minters(param0: Address, param1: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "minters",
      "minters(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  offers(
    param0: Address,
    param1: BigInt,
    param2: Address
  ): Marketplace__offersResult {
    let result = super.call(
      "offers",
      "offers(address,uint256,address):(address,uint256,uint256,uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
        ethereum.Value.fromAddress(param2)
      ]
    );

    return new Marketplace__offersResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt()
    );
  }

  try_offers(
    param0: Address,
    param1: BigInt,
    param2: Address
  ): ethereum.CallResult<Marketplace__offersResult> {
    let result = super.tryCall(
      "offers",
      "offers(address,uint256,address):(address,uint256,uint256,uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
        ethereum.Value.fromAddress(param2)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Marketplace__offersResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt()
      )
    );
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  platformFee(): i32 {
    let result = super.call("platformFee", "platformFee():(uint16)", []);

    return result[0].toI32();
  }

  try_platformFee(): ethereum.CallResult<i32> {
    let result = super.tryCall("platformFee", "platformFee():(uint16)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  royalties(param0: Address, param1: BigInt): i32 {
    let result = super.call(
      "royalties",
      "royalties(address,uint256):(uint16)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toI32();
  }

  try_royalties(param0: Address, param1: BigInt): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "royalties",
      "royalties(address,uint256):(uint16)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }
}

export class BuyItemCall extends ethereum.Call {
  get inputs(): BuyItemCall__Inputs {
    return new BuyItemCall__Inputs(this);
  }

  get outputs(): BuyItemCall__Outputs {
    return new BuyItemCall__Outputs(this);
  }
}

export class BuyItemCall__Inputs {
  _call: BuyItemCall;

  constructor(call: BuyItemCall) {
    this._call = call;
  }

  get _nftAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _payToken(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _owner(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class BuyItemCall__Outputs {
  _call: BuyItemCall;

  constructor(call: BuyItemCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _feeRecipient(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _platformFee(): i32 {
    return this._call.inputValues[1].value.toI32();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class ListItemCall extends ethereum.Call {
  get inputs(): ListItemCall__Inputs {
    return new ListItemCall__Inputs(this);
  }

  get outputs(): ListItemCall__Outputs {
    return new ListItemCall__Outputs(this);
  }
}

export class ListItemCall__Inputs {
  _call: ListItemCall;

  constructor(call: ListItemCall) {
    this._call = call;
  }

  get _nftAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _quantity(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _payToken(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _pricePerItem(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _startingTime(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class ListItemCall__Outputs {
  _call: ListItemCall;

  constructor(call: ListItemCall) {
    this._call = call;
  }
}

export class RegisterCollectionCall extends ethereum.Call {
  get inputs(): RegisterCollectionCall__Inputs {
    return new RegisterCollectionCall__Inputs(this);
  }

  get outputs(): RegisterCollectionCall__Outputs {
    return new RegisterCollectionCall__Outputs(this);
  }
}

export class RegisterCollectionCall__Inputs {
  _call: RegisterCollectionCall;

  constructor(call: RegisterCollectionCall) {
    this._call = call;
  }

  get nftAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get name(): string {
    return this._call.inputValues[1].value.toString();
  }

  get owner(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class RegisterCollectionCall__Outputs {
  _call: RegisterCollectionCall;

  constructor(call: RegisterCollectionCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
