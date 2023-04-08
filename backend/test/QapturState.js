const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("QapturState contract", function () {
  async function deployQapturStateFixture() {
    const [owner, addr1, addr2, internal, contract, qland, qco2] =
      await ethers.getSigners();
    const zeroAddr = ethers.constants.AddressZero;

    const QapturState = await ethers.getContractFactory("QapturState");
    const qapturState = await QapturState.deploy();
    await qapturState.deployed();

    /** Fixtures load for easier tests */
    // add an internal contract address set as factoryAddress
    await qapturState.connect(owner).setFactoryAddress(internal.address);

    // load a project in the contract
    const project = {
      id: 1,
      qlandAddr: qland.address,
      qco2Addr: qco2.address,
      totalSupply: ethers.BigNumber.from("100"), // total supply
      availableSupply: ethers.BigNumber.from("100"), // available supply
      price: ethers.BigNumber.from("10"), // price
      lastDistribution: ethers.BigNumber.from("0"), // last distribution
      url: "https://ipfs.io/ipfs/BlaBlaBla",
    };
    const projectValues = [
      qland.address,
      qco2.address,
      ethers.BigNumber.from("100"), // total supply
      ethers.BigNumber.from("10"), // price
      "https://ipfs.io/ipfs/BlaBlaBla",
    ];

    return {
      QapturState,
      qapturState,
      zeroAddr,
      owner,
      addr1,
      addr2,
      internal,
      contract,
      project,
      projectValues,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { qapturState, owner } = await loadFixture(
        deployQapturStateFixture
      );
      expect(await qapturState.owner()).to.equal(owner.address);
    });
  });

  // solution for private variable?
  describe("setFactoryAddress", function () {
    it("Should revert if not call by the owner", async function () {
      const { qapturState, addr1, addr2 } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(addr1).setFactoryAddress(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should revert if address parameter is address 0", async function () {
      const { qapturState, owner, zeroAddr } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(owner).setFactoryAddress(zeroAddr)
      ).to.be.revertedWith("Address should be defined");
    });
    it("Should emit ContractAdressUpdated if contract address is updated", async function () {
      const { qapturState, addr2 } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(qapturState.setFactoryAddress(addr2.address))
        .to.emit(qapturState, "ContractAdressUpdated")
        .withArgs("Factory", addr2.address);
    });
  });

  // solution for private variable?
  describe("setRewardAddress", function () {
    it("Should revert if not call by the owner", async function () {
      const { qapturState, addr1, addr2 } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(addr1).setRewardAddress(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should revert if address parameter is address 0", async function () {
      const { qapturState, owner, zeroAddr } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(owner).setRewardAddress(zeroAddr)
      ).to.be.revertedWith("Address should be defined");
    });
    it("Should emit ContractAdressUpdated if contract address is updated", async function () {
      const { qapturState, addr1 } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(qapturState.setRewardAddress(addr1.address))
        .to.emit(qapturState, "ContractAdressUpdated")
        .withArgs("Reward", addr1.address);
    });
  });

  // solution for private variable?
  describe("setQlandMarketplaceAddress", function () {
    it("Should revert if not call by the owner", async function () {
      const { qapturState, addr1, addr2 } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(addr1).setQlandMarketplaceAddress(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should revert if address parameter is address 0", async function () {
      const { qapturState, owner, zeroAddr } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(owner).setQlandMarketplaceAddress(zeroAddr)
      ).to.be.revertedWith("Address should be defined");
    });
    it("Should emit ContractAdressUpdated if contract address is updated", async function () {
      const { qapturState, addr2 } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(qapturState.setQlandMarketplaceAddress(addr2.address))
        .to.emit(qapturState, "ContractAdressUpdated")
        .withArgs("QLAND marketplace", addr2.address);
    });
  });

  describe("getQlandMarketplaceAddress", function () {
    it("Should revert if not call by an internal contract", async function () {
      const { qapturState, owner } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(owner).getQlandMarketplaceAddress()
      ).to.be.revertedWith("Access denied");
    });
    it("Should return the value stored", async function () {
      const { qapturState, owner, internal, contract, zeroAddr } =
        await loadFixture(deployQapturStateFixture);
      // get value with internal
      const initialAddr = await qapturState
        .connect(internal)
        .getQlandMarketplaceAddress();
      expect(initialAddr).to.equal(zeroAddr);
      // set value (contract) as owner
      await qapturState
        .connect(owner)
        .setQlandMarketplaceAddress(contract.address);
      // get value with internal (new )
      expect(
        await qapturState.connect(internal).getQlandMarketplaceAddress()
      ).to.equal(contract.address);
    });
  });

  describe("addProjectData", function () {
    it("Should revert if not call by an internal contract", async function () {
      const { qapturState, owner, projectValues } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(owner).addProjectData(...projectValues)
      ).to.be.revertedWith("Access denied");
    });
    it("Should store parameters of the project in mapping struct", async function () {
      const { qapturState, projectValues, project, internal } =
        await loadFixture(deployQapturStateFixture);
      await qapturState.connect(internal).addProjectData(...projectValues);
      const projectStored = await qapturState.projects(project.id);
      expect(projectStored.qlandAddr).to.equal(project.qlandAddr);
      expect(projectStored.qco2Addr).to.equal(project.qco2Addr);
      expect(projectStored.totalSupply).to.equal(project.totalSupply);
      expect(projectStored.availableSupply).to.equal(project.availableSupply);
      expect(projectStored.price).to.equal(project.price);
      expect(projectStored.lastDistribution).to.equal(project.lastDistribution);
      expect(projectStored.url).to.equal(project.url);
    });
    it("Should emit event NewProjectDeployed", async function () {
      const { qapturState, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      await expect(
        qapturState.connect(internal).addProjectData(...projectValues)
      )
        .to.emit(qapturState, "NewProjectDeployed")
        .withArgs(
          project.id,
          project.qlandAddr,
          project.qco2Addr,
          project.totalSupply,
          project.price
        );
    });
  });

  describe("addProjectData", function () {
    it("Should revert if not call by an internal contract", async function () {
      const { qapturState, owner, projectValues } = await loadFixture(
        deployQapturStateFixture
      );
      await expect(
        qapturState.connect(owner).addProjectData(...projectValues)
      ).to.be.revertedWith("Access denied");
    });
    it("Should store parameters of the project in mapping struct", async function () {
      const { qapturState, projectValues, project, internal } =
        await loadFixture(deployQapturStateFixture);
      await qapturState.connect(internal).addProjectData(...projectValues);
      const projectStored = await qapturState.projects(project.id);
      expect(projectStored.qlandAddr).to.equal(project.qlandAddr);
      expect(projectStored.qco2Addr).to.equal(project.qco2Addr);
      expect(projectStored.totalSupply).to.equal(project.totalSupply);
      expect(projectStored.availableSupply).to.equal(project.availableSupply);
      expect(projectStored.price).to.equal(project.price);
      expect(projectStored.lastDistribution).to.equal(project.lastDistribution);
      expect(projectStored.url).to.equal(project.url);
    });
    it("Should emit event NewProjectDeployed", async function () {
      const { qapturState, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      await expect(
        qapturState.connect(internal).addProjectData(...projectValues)
      )
        .to.emit(qapturState, "NewProjectDeployed")
        .withArgs(
          project.id,
          project.qlandAddr,
          project.qco2Addr,
          project.totalSupply,
          project.price
        );
    });
  });

  describe("updateUrl", function () {
    it("Should revert if not call by an internal contract", async function () {
      const { qapturState, owner, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      // update value
      const newUrl = "https://ipfs.io/ipfs/DaDaDa";
      await expect(
        qapturState.connect(owner).updateUrl(project.id, newUrl)
      ).to.be.revertedWith("Access denied");
    });
    it("Should update url parameter of the project in mapping struct", async function () {
      const { qapturState, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      //valid initial value
      expect((await qapturState.projects(project.id)).url).to.equal(
        project.url
      );
      // update value
      const newUrl = "https://ipfs.io/ipfs/DaDaDa";
      await qapturState.connect(internal).updateUrl(project.id, newUrl);
      expect((await qapturState.projects(project.id)).url).to.equal(newUrl);
    });
    it("Should emit event UrlUpdated", async function () {
      const { qapturState, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      // update value
      const newUrl = "https://ipfs.io/ipfs/DaDaDa";
      await expect(qapturState.connect(internal).updateUrl(project.id, newUrl))
        .to.emit(qapturState, "UrlUpdated")
        .withArgs(project.id, newUrl);
    });
  });

  describe("updateAvailableSupply", function () {
    it("Should revert if not call by an internal contract", async function () {
      const { qapturState, owner, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      // update value
      const newValue = ethers.BigNumber.from("75");
      await expect(
        qapturState.connect(owner).updateAvailableSupply(project.id, newValue)
      ).to.be.revertedWith("Access denied");
    });
    it("Should update availableSupply parameter of the project in mapping struct", async function () {
      const { qapturState, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      //valid initial value
      expect((await qapturState.projects(project.id)).availableSupply).to.equal(
        project.availableSupply
      );
      // update value
      const newValue = ethers.BigNumber.from("75");
      await qapturState
        .connect(internal)
        .updateAvailableSupply(project.id, newValue);
      expect((await qapturState.projects(project.id)).availableSupply).to.equal(
        newValue
      );
    });
    it("Should emit event AvailableSupplyUpdated", async function () {
      const { qapturState, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      // update value
      const newValue = ethers.BigNumber.from("75");
      await expect(
        qapturState
          .connect(internal)
          .updateAvailableSupply(project.id, newValue)
      )
        .to.emit(qapturState, "AvailableSupplyUpdated")
        .withArgs(project.id, newValue);
    });
  });

  describe("updatePrice", function () {
    it("Should revert if not call by an internal contract", async function () {
      const { qapturState, owner, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      // update value
      const newValue = ethers.BigNumber.from("15");
      await expect(
        qapturState.connect(owner).updatePrice(project.id, newValue)
      ).to.be.revertedWith("Access denied");
    });
    it("Should update price parameter of the project in mapping struct", async function () {
      const { qapturState, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      //valid initial value
      expect((await qapturState.projects(project.id)).price).to.equal(
        project.price
      );
      // update value
      const newValue = ethers.BigNumber.from("15");
      await qapturState.connect(internal).updatePrice(project.id, newValue);
      expect((await qapturState.projects(project.id)).price).to.equal(newValue);
    });
    it("Should emit event PriceUpdated", async function () {
      const { qapturState, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      // update value
      const newValue = ethers.BigNumber.from("15");
      await expect(
        qapturState.connect(internal).updatePrice(project.id, newValue)
      )
        .to.emit(qapturState, "PriceUpdated")
        .withArgs(project.id, newValue);
    });
  });

  describe("getUrl", function () {
    it("Should return url parameter of the project mapping struct", async function () {
      const { qapturState, addr1, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      expect(await qapturState.connect(addr1).getUrl(project.id)).to.equal(
        project.url
      );
    });
  });

  describe("getAvailableSupply", function () {
    it("Should return url parameter of the project mapping struct", async function () {
      const { qapturState, addr1, internal, project, projectValues } =
        await loadFixture(deployQapturStateFixture);
      // add project
      await qapturState.connect(internal).addProjectData(...projectValues);
      expect(
        await qapturState.connect(addr1).getAvailableSupply(project.id)
      ).to.equal(project.availableSupply);
    });
  });
});
