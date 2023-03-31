require

async function benchmark() {
    const [deployer, addr1, addr2] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // QapturLandTemplate
    const QlandProject = await ethers.getContractFactory("QapturLandProject");
    const qlandProject = await QlandProject.deploy();

    console.log("QapturLandProject address:", qlandProject.address);

    // QapturLandFactory
    const QlandFactory = await ethers.getContractFactory("QapturLandProjectFactory");
    const qlandFactory = await QlandFactory.deploy();

    console.log("QapturLandProjectFactory address:", qlandFactory.address);

    // QapturLandState
    const QlandState = await ethers.getContractFactory("QapturLandState");
    const qlandState = await QlandState.deploy();

    console.log("QapturLandState address:", qlandState.address);

    //  Update contract addresses in QlandState
    await qlandState.setContractAddresses(qlandFactory.address, qlandProject.address);
    console.log("Adresses added");

    // Add QlandState contract address to admin list in QlandFactory
    await qlandFactory.addAdmin(qlandState.address);
    console.log("Admin address added");

    console.log("--------");
    console.log("Deploying new smart contract using factory");

    result = await qlandState.createNewProject("My wonderful project", "ffgaizfblsbaia");
    console.log("contract1:", await qlandState.callStatic.getProjectAddress(1));

    //  callStatis to get the value returned by the function
    result = await qlandState.createNewProject("My wonderful project 2", "ffgairtylsbaia");
    const addrQland = await qlandState.callStatic.getProjectAddress(2);
    console.log("contract2:", addrQland);

    //const qlandCollection = await ethers.getContractAt("contracts/QapturLandProject.sol:QapturLandProject", contractAddress); //OK
    const qlandCollection = await ethers.getContractAt("QapturLandProject", addrQland); //OK
    // const qlandCollectionOwner = qlandCollection.connect(deployer); //default
    const qlandCollectionAddr1 = qlandCollection.connect(addr1);
    const qlandCollectionAddr2 = qlandCollection.connect(addr2);

    console.log("father owner:", await qlandFactory.owner());
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