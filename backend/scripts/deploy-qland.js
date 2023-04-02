const { ethers } = require("hardhat");

const priceStableFormat = (amount) => ethers.utils.formatUnits(amount, 6);
const logPriceStable = (msg, amount) =>
  console.log(msg, priceStableFormat(amount), "USDC");

async function qland() {
  /* GET SIGNERS */
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const { chainId } = await ethers.provider.getNetwork();
  console.log("chainId:", chainId);

  /* GET USDC CONTRACT */
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

  console.log("USDC address:", usdc.address);
  logPriceStable("total supply", await usdc.totalSupply());
  logPriceStable("deployer balance", await usdc.balanceOf(deployer.address));

  // QapturState
  const QapturState = await ethers.getContractFactory("QapturState");
  const qapturState = await QapturState.deploy();
  console.log("QapturState address:", qapturState.address);

  // QapturProjectFactory
  const Factory = await ethers.getContractFactory("QapturProjectFactory");
  const factory = await Factory.deploy(qapturState.address);
  console.log("QapturProjectFactory address:", factory.address);

  // QLAND Marketplace
  const QlandMarketplace = await ethers.getContractFactory(
    "QapturLandMarketplace"
  );
  const qlandMarketplace = await QlandMarketplace.deploy(
    qapturState.address,
    usdc.address,
    deployer.address
  );
  console.log("QapturLandMarketplace address:", qlandMarketplace.address);

  // QCO2 Marketplace
  // const Qco2Marketplace = await ethers.getContractFactory("QapturCo2Marketplace");
  // const qco2Marketplace = await Qco2Marketplace.deploy(qapturState.address, usdc.address, deployer.address);
  // console.log("QapturCo2Marketplace address:", qco2Marketplace.address);

  // QapturProjectReward
  const Reward = await ethers.getContractFactory("QapturProjectReward");
  const reward = await Reward.deploy();
  console.log("QapturProjectReward address:", reward.address);

  // QapturState configuration
  qapturState.setFactoryAddress(factory.address);
  qapturState.setQlandMarketplaceAddress(qlandMarketplace.address);
  //qapturState.setQco2MarketplaceAddress(qco2Marketplace.address);
  qapturState.setRewardAddress(reward.address);

  console.log("--------");
  console.log("Deploying new smart contracts using factory");

  result = await factory.createNewProject(
    "My wonderful project",
    "http://blabla.bla",
    100,
    10 * 1e6
  );
  let [addrQland] = await qapturState.projects(1);
  console.log("contract1:", addrQland);

  //  callStatis to get the value returned by the function
  result = await factory.createNewProject(
    "My wonderful project 2",
    "http://blabla.bla",
    200,
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
  usdcAddr1.approve(qlandMarketplace.address, 100 * 1e6);
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
  await qlandMarketplaceAddr1.addItemToMarketplace(1, 10, 150);
  //qland allowance to sc
  console.log("allowance");
  await qlandAdr1.setApprovalForAll(qlandMarketplace.address, true);

  console.log("--------");
  console.log("Buy from market place");

  // approve on ERC20 contract
  const usdcAddr2 = usdc.connect(addr2);
  usdcAddr2.approve(qlandMarketplace.address, 450 * 1e6);
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
  await qlandMarketplaceAddr2.buyFromMarketplace(addr1.address, 1, 3, 150);
  console.log("Sell done");
  logPriceStable("buyer balance", await usdc.balanceOf(addr1.address));
  logPriceStable("deployer balance", await usdc.balanceOf(deployer.address));
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

qland()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
