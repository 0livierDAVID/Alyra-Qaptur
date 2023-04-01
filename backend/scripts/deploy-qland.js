const { ethers } = require("hardhat");

async function benchmark() {
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
    console.log("total supply:", ethers.utils.formatUnits(await usdc.totalSupply(), 6), "USDC");
    console.log("deployer balance:", ethers.utils.formatUnits(await usdc.balanceOf(deployer.address), 6), "USDC");

    return;





    // QapturLand template
    const Qland = await ethers.getContractFactory("QapturLand");
    const qland = await Qland.deploy();

    console.log("QapturLand address:", qland.address);

    // QapturProjectFactory
    const Factory = await ethers.getContractFactory("QapturProjectFactory");
    const factory = await Factory.deploy();

    console.log("QapturProjectFactory address:", factory.address);

    // QLAND Marketplace
    // const Factory = await ethers.getContractFactory("QapturProjectFactory");
    // const factory = await Factory.deploy();

    console.log("QapturProjectFactory address:", factory.address);

    // QapturState
    const QapturState = await ethers.getContractFactory("QapturState");
    const qapturState = await QapturState.deploy();

    console.log("QapturLandState address:", qapturState.address);

    //  Update contract addresses in QapturState
    await qapturState.setContractAddresses(factory.address, qland.address);
    console.log("Adresses added");

    /* TODO:
        - load marketplace
        - addresses
    */

    // Add qapturState contract address to admin list in factory
    await factory.addAdmin(qapturState.address);
    console.log("Admin address added");

    console.log("--------");
    console.log("Deploying new smart contract using factory");

    result = await qapturState.createNewProject("My wonderful project", "ffgaizfblsbaia");
    console.log("contract1:", await qapturState.callStatic.getProjectAddress(1));

    //  callStatis to get the value returned by the function
    result = await qapturState.createNewProject("My wonderful project 2", "ffgairtylsbaia");
    const addrQland = await qapturState.callStatic.getProjectAddress(2);
    console.log("contract2:", addrQland);

    //const qlandCollection = await ethers.getContractAt("contracts/QapturLandProject.sol:QapturLandProject", contractAddress); //OK
    const qlandCollection = await ethers.getContractAt("QapturLandProject", addrQland); //OK
    // const qlandCollectionOwner = qlandCollection.connect(deployer); //default
    const qlandCollectionAddr1 = qlandCollection.connect(addr1);
    const qlandCollectionAddr2 = qlandCollection.connect(addr2);

    console.log("father owner:", await factory.owner());
    console.log("child owner:", await qlandCollection.owner());

    console.log("--------");
    console.log("Mint tests");

    // supply and batch balance before mint
    console.log("total supply:", await qlandCollection.totalSupply(0));
    console.log("balances:",
        await qlandCollection.callStatic.balanceOfBatch(
            [deployer.address, addr1.address, addr1.address],
            [0, 0, 0]
        )
    );

    await qlandCollection.mint(deployer.address, 0, 100, []);
    await qlandCollection.mint(addr1.address, 0, 100, []);
    await qlandCollection.mint(addr2.address, 0, 100, []);
    console.log("mint done");

    // supply and batch balance after mint
    console.log("total supply:", await qlandCollection.totalSupply(0));
    console.log("balances:",
        await qlandCollection.callStatic.balanceOfBatch(
            [deployer.address, addr1.address, addr1.address],
            [0, 0, 0]
        )
    );

    console.log("----");
    console.log("Transfer tests");
    // Transfer
    await qlandCollectionAddr1.setApprovalForAll(deployer.address, true);
    await qlandCollectionAddr2.setApprovalForAll(deployer.address, true);
    await qlandCollection.safeTransferFrom(addr1.address, deployer.address, 0, 50, []);
    await qlandCollection.safeTransferFrom(addr2.address, deployer.address, 0, 50, []);

    console.log("transfer done");
    console.log("balances:",
        await qlandCollection.callStatic.balanceOfBatch(
            [deployer.address, addr1.address, addr1.address],
            [0, 0, 0]
        )
    );

    console.log("----");

}

benchmark()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });