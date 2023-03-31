async function benchmark() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // QapturLandERC721A
    const Qland721A = await ethers.getContractFactory("QapturLandERC721A");
    const qland721A = await Qland721A.deploy();

    console.log("QapturLandERC721A address:", qland721A.address);

    // QapturLandERC721oz
    const Qland721oz = await ethers.getContractFactory("QapturLandERC721oz");
    const qland721oz = await Qland721oz.deploy();

    console.log("QapturLandERC721oz address:", qland721oz.address);

    // QapturLandERC1155oz
    const Qland1155oz = await ethers.getContractFactory("QapturLandERC1155oz");
    const qland1155oz = await Qland1155oz.deploy();

    console.log("QapturLandERC1155oz address:", qland1155oz.address);

}

benchmark()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });