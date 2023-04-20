const { ethers } = require("hardhat");
const fs = require("fs");
const { logPriceStable, exportContractData } = require("../helper/index");
const priceStableFormat = (amount) => ethers.utils.formatUnits(amount, 6);

async function qaptur() {
  // get signers
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // get chainId
  const { chainId } = await ethers.provider.getNetwork();
  console.log("chainId:", chainId);

  /** DEPLOY CONTRACTS */
  // Deploy or reuse ERC20 stable contract
  let Usdc, usdc, usdcAddr;
  /* chainId 31337 localhost
        USDC: (homemade: children please don't do this at home!!!)
    */
  if (chainId == 31337) {
    Usdc = await ethers.getContractFactory("USDCTest");
    usdc = await Usdc.deploy();
  } else {
    //https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses
    //6 decimals
    switch (chainId) {
      /* chainId 5 goerli
                DAI (Aave): 0xBa8DCeD3512925e52FE67b1b5329187589072A55
                USDC (Aave): 0x65aFADD39029741B3b8f0756952C74678c9cEC93
            */
      case 5:
        usdcAddr = "0x65aFADD39029741B3b8f0756952C74678c9cEC93";
        break;

      /* chainId 11155111 sepolia
                DAI (Aave): 0x68194a729C2450ad26072b3D33ADaCbcef39D574
                USDC (Aave): 0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f
            */
      case 11155111:
        usdcAddr = "0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f";
        break;

      /* chainId 80001 mumbai
                DAI (Aave): 0xF14f9596430931E177469715c591513308244e8F
                USDC (Aave): 0xe9DcE89B076BA6107Bb64EF30678efec11939234
            */
      case 80001:
        usdcAddr = "0xe9DcE89B076BA6107Bb64EF30678efec11939234";
        break;

      default:
        console.log("ChainID unknown");
        return;
    }
    usdc = await ethers.getContractAt("IERC20", usdcAddr);
  }

  const usdcAddrtest = usdc.connect(addr1);
  await usdcAddrtest.approve(addr2.address, 100 * 1e6);
  logPriceStable(
    "marketplace allowance for addr1",
    await usdcAddrtest.allowance(addr1.address, addr2.address)
  );

  console.log("USDC address:", usdc.address);
  // logPriceStable("total supply", await usdc.totalSupply());
  // logPriceStable("deployer balance", await usdc.balanceOf(deployer.address));

  console.log("--------------------------------------");
  // Deploy QapturState contract
  const QapturState = await ethers.getContractFactory("QapturState");
  const qapturState = await QapturState.deploy();
  console.log("QapturState address:", qapturState.address);

  console.log("--------------------------------------");
  // Deploy QLAND Marketplace contract
  const QlandMarketplace = await ethers.getContractFactory(
    "QapturLandMarketplace"
  );
  const qlandMarketplace = await QlandMarketplace.deploy(
    qapturState.address,
    usdc.address,
    deployer.address
  );
  console.log("QapturLandMarketplace address:", qlandMarketplace.address);

  // console.log("--------------------------------------");
  // Deploy QCO2 Marketplace contract
  // const Qco2Marketplace = await ethers.getContractFactory("QapturCo2Marketplace");
  // const qco2Marketplace = await Qco2Marketplace.deploy(qapturState.address, usdc.address, deployer.address);
  // console.log("QapturCo2Marketplace address:", qco2Marketplace.address);

  console.log("--------------------------------------");
  // Deploy QapturProjectFactory contract
  const Factory = await ethers.getContractFactory("QapturProjectFactory");
  const factory = await Factory.deploy(
    qapturState.address,
    qlandMarketplace.address /*, qco2Marketplace.address*/
  );
  console.log("QapturProjectFactory address:", factory.address);

  console.log("--------------------------------------");
  // Deploy QapturProjectReward contract
  const Reward = await ethers.getContractFactory("QapturProjectReward");
  const reward = await Reward.deploy();
  console.log("QapturProjectReward address:", reward.address);

  console.log("--------------------------------------");
  console.log("QapturState contract configuration");
  // QapturState configuration contract
  await qapturState.setFactoryAddress(factory.address);
  await qapturState.setQlandMarketplaceAddress(qlandMarketplace.address);
  //await qapturState.setQco2MarketplaceAddress(qco2Marketplace.address);
  await qapturState.setRewardAddress(reward.address);

  console.log("Export contracts addresses in a json file");
  console.log("--------------------------------------");
  /** JSON DATA EXPORT: contract addresses for frontend */
  const jsonContent = {
    deployer: deployer.address,
    main: {
      address: qapturState.address,
      // deployBlock: qapturState.deployTransaction.blockNumber,
    },
    factory: {
      address: factory.address,
      // deployBlock: factory.deployTransaction.blockNumber,
    },
    qlandMarketplace: {
      address: qlandMarketplace.address,
      // deployBlock: qlandMarketplace.deployTransaction.blockNumber,
    },
    reward: {
      address: reward.address,
      // deployBlock: reward.deployTransaction.blockNumber,
    },
    usdc: {
      address: usdc.address,
      // deployBlock: usdc.deployTransaction.blockNumber,
    },
  };
  exportContractData(chainId, jsonContent);
  console.log("--------------------------------------");

  console.log("Export abi in the front contracts folder");
  /** CONTRACT ABI COPY: contract's abi for frontend */
  const contractsAbi = [
    "QapturCo2",
    "QapturLand",
    "QapturLandMarketplace",
    "QapturProjectFactory",
    "QapturProjectReward",
    "QapturState",
    "USDCTest",
  ];
  contractsAbi.forEach((contract) => {
    // destination will be created or overwritten by default.
    fs.copyFile(
      `./artifacts/contracts/${contract}.sol/${contract}.json`,
      `../frontend/contracts/${contract}.json`,
      (err) => {
        if (err) throw err;
        console.log(`File ${contract} was copied to destination`);
      }
    );
  });
  console.log("--------------------------------------");
  console.log("-----------DEPLOYMENT ENDED-----------");
  console.log("--------------------------------------");
}

qaptur()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
