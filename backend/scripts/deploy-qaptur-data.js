const { ethers } = require("hardhat");

const fs = require("fs");

const priceStableFormat = (amount) => ethers.utils.formatUnits(amount, 6);

const logPriceStable = (msg, amount) =>
  console.log(msg, priceStableFormat(amount), "USDC");

const exportContractData = (chainId, jsonContent) => {
  const fileName = "../frontend/contracts/contracts.json";
  const file = require(`../${fileName}`);
  // console.log(file);
  file[chainId] = jsonContent;
  // console.log(file);
  fs.writeFileSync(fileName, JSON.stringify(file, null, 2));
};

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
  logPriceStable("total supply", await usdc.totalSupply());
  logPriceStable("deployer balance", await usdc.balanceOf(deployer.address));

  // Deploy QapturState contract
  const QapturState = await ethers.getContractFactory("QapturState");
  const qapturState = await QapturState.deploy();
  console.log("QapturState address:", qapturState.address);

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

  // Deploy QCO2 Marketplace contract
  // const Qco2Marketplace = await ethers.getContractFactory("QapturCo2Marketplace");
  // const qco2Marketplace = await Qco2Marketplace.deploy(qapturState.address, usdc.address, deployer.address);
  // console.log("QapturCo2Marketplace address:", qco2Marketplace.address);

  // Deploy QapturProjectFactory contract
  const Factory = await ethers.getContractFactory("QapturProjectFactory");
  const factory = await Factory.deploy(
    qapturState.address,
    qlandMarketplace.address /*, qco2Marketplace.address*/
  );
  console.log("QapturProjectFactory address:", factory.address);

  // Deploy QapturProjectReward contract
  const Reward = await ethers.getContractFactory("QapturProjectReward");
  const reward = await Reward.deploy();
  console.log("QapturProjectReward address:", reward.address);

  // Deploy QapturState configuration contract
  await qapturState.setFactoryAddress(factory.address);
  await qapturState.setQlandMarketplaceAddress(qlandMarketplace.address);
  //await qapturState.setQco2MarketplaceAddress(qco2Marketplace.address);
  await qapturState.setRewardAddress(reward.address);

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

  /** DATA ADDITION for contract testing */
  console.log("--------");
  console.log("Deploying new smart contracts using factory");

  result = await factory.createNewProject(
    "Afforestation Of Degraded Grasslands In Vichada",
    "https://ipfs.io/ipfs/bafkreih2jw4ckqysahsvbp7wasnvnab6rhyaswdyef7a4ygxdv25desteq",
    30,
    10 * 1e6
  );
  let [addrQland] = await qapturState.projects(1);
  console.log("contract1:", addrQland);

  //  callStatis to get the value returned by the function
  result = await factory.createNewProject(
    "Withoneseed Timor Leste Community Forestry Program",
    "https://ipfs.io/ipfs/bafkreigu7u22uidmq53pibl6wmoqnnqwqqeiqp5ejxsa4b6bqxucpq2v34",
    15,
    20 * 1e6
  );

  console.log("--------");
  console.log("Connect to qland smart contract");
  const qland = await ethers.getContractAt("QapturLand", addrQland); //OK
  const qlandAdr1 = await qland.connect(addr1);
  const qlandAdr2 = await qland.connect(addr2);

  console.log("--------");
  console.log("Buy initial supply");

  // approve on ERC20 contract
  const usdcAddr1 = usdc.connect(addr1);
  await usdcAddr1.approve(qlandMarketplace.address, 100 * 1e6);
  logPriceStable(
    "marketplace allowance for addr1",
    await usdcAddr1.allowance(addr1.address, qlandMarketplace.address)
  );

  // buy on qlandMarket
  console.log(
    "p1 qland available supply:",
    (await qapturState.getAvailableSupply(1)).toString()
  );
  const qlandMarketplaceAddr1 = qlandMarketplace.connect(addr1);
  logPriceStable("buyer balance", await usdc.balanceOf(addr1.address));
  logPriceStable("deployer balance", await usdc.balanceOf(deployer.address));
  await qlandMarketplaceAddr1.buyFromInitialSupply(1, 10);
  console.log("Sell done");
  logPriceStable("buyer balance", await usdc.balanceOf(addr1.address));
  logPriceStable("deployer balance", await usdc.balanceOf(deployer.address));
  console.log(
    "p1 qland available supply:",
    (await qapturState.getAvailableSupply(1)).toString()
  );
  console.log(
    "adr1 p1 qland balance:",
    (await qland.balanceOf(addr1.address, 0)).toString()
  );

  console.log("--------");
  console.log("Add to market place");

  console.log("add");
  await qlandMarketplaceAddr1.addItemToMarketplace(1, 10, 150 * 1e6);
  //qland allowance to sc
  console.log("allowance");
  await qlandAdr1.setApprovalForAll(qlandMarketplace.address, true);

  console.log("--------");
  console.log("Buy from market place");

  // approve on ERC20 contract
  const usdcAddr2 = usdc.connect(addr2);
  await usdcAddr2.approve(qlandMarketplace.address, 450 * 1e6);
  logPriceStable(
    "marketplace allowance for addr1",
    await usdcAddr1.allowance(addr2.address, qlandMarketplace.address)
  );

  console.log(
    "p1 qland on sale:",
    await qlandMarketplace.getProjectItemsOnSale(1)
  );
  const qlandMarketplaceAddr2 = qlandMarketplace.connect(addr2);
  logPriceStable("buyer balance", await usdc.balanceOf(addr2.address));
  logPriceStable("seller balance", await usdc.balanceOf(addr1.address));
  await qlandMarketplaceAddr2.buyFromMarketplace(
    addr1.address,
    1,
    3,
    150 * 1e6
  );
  console.log("Sell done");
  logPriceStable("buyer balance", await usdc.balanceOf(addr2.address));
  logPriceStable("seller balance", await usdc.balanceOf(addr1.address));
  console.log(
    "p1 qland on sale:",
    await qlandMarketplace.getProjectItemsOnSale(1)
  );
  console.log(
    "adr1 p1 qland balance:",
    (await qland.balanceOf(addr1.address, 0)).toString()
  );
  console.log(
    "adr2 p1 qland balance:",
    (await qland.balanceOf(addr2.address, 0)).toString()
  );
}

qaptur()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
