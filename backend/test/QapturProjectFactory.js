const { expect } = require("chai");
const { provider } = require("@nomiclabs/hardhat-ethers");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("QapturProjectFactory contract", function () {
  async function deployQapturProjectFactoryFixture() {
    const [owner, addr1, addr2, qlandMarketplace] = await ethers.getSigners();
    const zeroAddr = ethers.constants.AddressZero;
    const decimals = 1e6;

    // QapturState is needed for the constructor
    const QapturState = await ethers.getContractFactory("QapturState");
    const qapturState = await QapturState.deploy();
    await qapturState.deployed();

    const QapturProjectFactory = await ethers.getContractFactory(
      "QapturProjectFactory"
    );
    const factory = await QapturProjectFactory.deploy(
      qapturState.address,
      qlandMarketplace.address
    );
    await factory.deployed();

    // needed fo the test
    await qapturState.setFactoryAddress(factory.address);

    /** Fixtures for easier tests */
    const project = {
      id: 1,
      name: "A wonderful project",
      url: "https://ipfs.io/ipfs/BlaBlaBla",
      totalSupply: 100, // total supply
      price: 10 * decimals, // price
    };
    const projectValues = [
      "A wonderful project",
      "https://ipfs.io/ipfs/BlaBlaBla",
      100, // total supply
      10 * decimals, // price
    ];

    return {
      QapturProjectFactory,
      factory,
      qapturState,
      zeroAddr,
      provider,
      owner,
      addr1,
      addr2,
      project,
      projectValues,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { factory, owner } = await loadFixture(
        deployQapturProjectFactoryFixture
      );
      expect(await factory.owner()).to.equal(owner.address);
    });
  });

  describe("createNewProject", function () {
    it("Should revert if not call by owner", async function () {
      const { factory, addr1, projectValues } = await loadFixture(
        deployQapturProjectFactoryFixture
      );
      await expect(
        factory.connect(addr1).createNewProject(...projectValues)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should store parameters of the project in QapturState", async function () {
      const { factory, qapturState, projectValues, project, owner } =
        await loadFixture(deployQapturProjectFactoryFixture);
      await factory.connect(owner).createNewProject(...projectValues);
      const projectStored = await qapturState.projects(project.id);
      expect(projectStored.totalSupply).to.equal(project.totalSupply);
      expect(projectStored.availableSupply).to.equal(project.totalSupply);
      expect(projectStored.price).to.equal(project.price);
      expect(projectStored.url).to.equal(project.url);
    });
    it("Should emit event ProjectCollectionsCreated", async function () {
      const { factory, owner, zeroAddr, project, projectValues, provider } =
        await loadFixture(deployQapturProjectFactoryFixture);

      // const qlandAddr = await factory
      //   .connect(factory)
      //   .deployQlandSmartContract(project.name);
      // console.log(qlandAddr);
      const qco2Addr = zeroAddr; // temporary solution
      expect(
        await factory.connect(owner).createNewProject(...projectValues)
      ).to.emit(factory, "ProjectCollectionsCreated");
      //.withArgs(qlandAddr, qco2Addr, provider.getBlock("latest").timestamp);

      // Issue here difficult to verify the args of the event because the address is
      // generated by an internal function.
      // possible approach to capture arg: https://ethereum.stackexchange.com/a/133753
      // other approach heritage: https://medium.com/@danielque/solidity-unit-testing-internal-functions-4e9a728298a0
    });
  });
});
