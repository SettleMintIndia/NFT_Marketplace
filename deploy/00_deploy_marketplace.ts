import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
// import { Marketplace } from '../typechain-types/contracts/Marketplace.sol/Marketplace';
import { Marketplace } from '../typechain-types/contracts/Marketplace.sol/Marketplace';

// If you have more than one IPFS node, use the key from the default.hardhat.config.ts file to choose which one to use.
const preferredIpfsNode: string | undefined = undefined;

const migrate: DeployFunction = async ({
  getNamedAccounts,
  run,
  deployments: { deploy },
  config,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts();
  if (!deployer) {
    console.error(
      '\n\nERROR!\n\nThe node you are deploying to does not have access to a private key to sign this transaction. Add a Private Key in this application to solve this.\n\n'
    );
    process.exit(1);
  }

  console.log('console 1111');

  await deploy('Marketplace', {
    from: deployer,
    args: [],
    log: true,
  });

  const token = await ethers.getContract<Marketplace>('Marketplace', deployer);

  const initializeRes = await token.initialize('0xbB57028ba73f6aa8608726AB48B97f5b5C3dd9B7', '5');
  await initializeRes.wait(2);
  console.log('Marketplace Initialized!');

  const registerCollectionRes = await token.registerCollection(
    '0x2f2F97914cb634dA06548B0187602b4Fb16d76c8',
    'Metadog',
    '0xbB57028ba73f6aa8608726AB48B97f5b5C3dd9B7'
  );
  await registerCollectionRes.wait(2);
  console.log('Collection Registered!');

  let hasEtherScanInstance = false;
  try {
    await run('verify:get-etherscan-endpoint');
    hasEtherScanInstance = true;
  } catch (e) {
    // ignore
  }
  if (hasEtherScanInstance) {
    await run('sourcify');
    if (!config.verify?.etherscan?.apiKey) {
      console.error(
        `\n\nERROR!\n\nYou have not set your Etherscan API key in your hardhat.config.ts file. Set it and run\n\nyarn hardhat --network '${network.name}' etherscan-verify\n\n`
      );
    } else {
      await new Promise((resolve) => {
        setTimeout(resolve, 10 * 1000);
      }); // allow etherscan to catch up
      await run('etherscan-verify');
    }
  }

  return true;
};

export default migrate;

migrate.id = '00_deploy_marketplace';
migrate.tags = ['marketplace', 'setup'];
