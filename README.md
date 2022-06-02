# ERC721 Trading Cards

## Usage

Described below is the flow that is programmed into the deployment scripts in the `deploy` folder.
This is by no means the only way to run your ERC721 project, if you plan not to follow the playbook
below, you can use it to setup your own flow easily.

### Phase 0: Image generation

The image generation code is based on the a Hardhat task found in the `tasks` folder. This task is written especially for the
cards for this example project, but it should be fairly simple to adapt it to your needs.

In short, replace the images in the `assets/layers` folder, change the logic in the `task/generate-assets.ts` file. To generate the trading cards execute `yarn artengine:build --common 10 --limited 5 --rare 2 --unique 1 --ipfsnode <key of your ipfsnode>`. The ipfs node key can be found in `.secrets/default.hardhat.config.ts`.

### Phase 1: Initial Setup

The first step of the process is to deploy the ERC721 contract, and claim the reserve tokens.

Reserves are an initital amount of tokens that are created at the start of the sale. This is used
typically to generate tokens for the team members and to mint tokens for later use (e.g. for marketing
purposes).

During this setup phase, some of the important parameters of the sale and collection are set. In the
contract look for the `Configuration` section and tweak the parameters as needed.

```solidity
  //////////////////////////////////////////////////////////////////
  // CONFIGURATION                                                //
  //////////////////////////////////////////////////////////////////

  uint256 public constant RESERVES = 5; // amount of tokens for the team, or to sell afterwards
  uint256 public constant PRICE_IN_WEI_WHITELIST = 0.0069 ether; // price per token in the whitelist sale
  uint256 public constant PRICE_IN_WEI_PUBLIC = 0.0420 ether; // price per token in the public sale
  uint256 public constant MAX_PER_TX = 6; // maximum amount of tokens one can mint in one transaction
  uint256 public constant MAX_SUPPLY = 100; // the total amount of tokens for this NFT
```

Furthermore, the collection will be launched without exposing any of the metadata or art, leaving the
reveal for after the public sale. In the `assets/placeholder` folder, modify the artwork and metadata
which will be exposed until the reveal.

Also make sure to go through the files in the `deploy` folder to change any of the values to match your project.

When you are happy with the setup, you can deploy the contract and claim the reserves by running.

```bash
yarn smartcontract:deploy:setup
```

### Phase 2: Building the whitelist

To have a successful launch, you will engage in a lot of marketing efforts and community building. Typically
before engaging in the actual sale, various marketing actions are taken to build a whitelist. This list
is to allow people to buy in before the public sale. Allowing a person on the whitelist should be close to a
concrete commitment to the sale.

Thw whitelist process is built to be very gas efficient using [Merkle Trees](https://medium.com/@ItsCuzzo/using-merkle-trees-for-nft-whitelists-523b58ada3f9). You start by filling the `assets/whitelist.json` file
with the addresses of the whitelisted participants and they amount they can buy in the pre-sale.

When you have enough commitments we will built the Merkle Tree, generate all the proofs and stire the Merkle Root
in the contract.

```bash
yarn smartcontract:deploy:whitelist
```

This will export the proofs needed to include in your dAPP in the `./assets/generated/whitelist.json` file. Your dAPP
will provide a page where the participants connects their wallet to. Using the address of the wallet, you can load the
proofs and allowances from this JSON file. The dAPP will then configure a form where the participant can choose,
with a maximum of their allowance, how many tokens they want to buy. Pressing the submit button will trigger a transaction
to the `whitelistMint` function with all the parameters filled in and the correct amount of ETH/MATIC/etc as a value.
The user signs this transaction in their wallet and the transaction is sent to the network.

To display the state of the sale, the items minted, the items left, use the GraphQL endpoint from the The Graph node you can
launch in the SettleMint platform.

### Phase 3: Opening up the pre-sale

As soon as you execute the following command, the pre-sale is live.

```bash
yarn smartcontract:deploy:presale
```

### Phase 4: Opening up the public sale

As soon as you execute the following command, the pre-sale is terminated and the public sale is live.

```bash
yarn smartcontract:deploy:publicsale
```

### Phase 5: The big reveal

At some point during the process, you will want to reveal the metadata. Some projects choose to reveal immediately, others choose to
reveal after the whitelist sale, and others will wait until a point during the public sale or even after it has concluded.

Revealing the metadata is done by switching the baseURI to the final IPFS folder with setBaseURI. This can be followed up by running the following to freeze the metadata and prevent further changes.

```bash
yarn smartcontract:deploy:reveal
```

## More Information

- [Leverage the Graph Middleware to index on chain data](./docs/graph-middleware.md)
- [Collaborate with your colleagues over GitHub](./docs/collaborate-over-github.md)
- [Learn about the different tasks available for development](./docs/development-tasks.md)
- [What all the folders and files in this set are for](./docs/project-structure.md)
