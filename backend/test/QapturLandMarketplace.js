const { expect } = require("chai");
const { provider } = require("@nomiclabs/hardhat-ethers");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("QapturLandMarketplace contract", function () {
  async function deployQapturLandMarketplaceFixture() {
    const [owner, addr1, addr2, qapturWallet] = await ethers.getSigners();
    const zeroAddr = ethers.constants.AddressZero;
    const decimals = 1e6;

    // USDCTest is needed for the tests
    Usdc = await ethers.getContractFactory("USDCTest");
    usdc = await Usdc.deploy();
    await usdc.deployed();

    // QapturState is needed for the constructor
    const QapturState = await ethers.getContractFactory("QapturState");
    const qapturState = await QapturState.deploy();
    await qapturState.deployed();

    // init QapturLandMarketplace
    const QapturLandMarketplace = await ethers.getContractFactory(
      "QapturLandMarketplace"
    );
    const marketplace = await QapturLandMarketplace.deploy(
      qapturState.address,
      usdc.address,
      qapturWallet.address
    );
    await marketplace.deployed();

    // needed fo the test
    const QapturProjectFactory = await ethers.getContractFactory(
      "QapturProjectFactory"
    );
    const factory = await QapturProjectFactory.deploy(
      qapturState.address,
      marketplace.address
    );
    await factory.deployed();

    // finalise state contract adresses
    await qapturState.setFactoryAddress(factory.address);
    await qapturState.setQlandMarketplaceAddress(marketplace.address);

    // need to create a project for the test
    const project = {
      id: 1,
      name: "A wonderful project",
      url: "https://ipfs.io/ipfs/BlaBlaBla",
      totalSupply: 100, // total supply
      price: 10 * decimals, // price
      tokenId: 0,
    };
    const projectValues = [
      "A wonderful project",
      "https://ipfs.io/ipfs/BlaBlaBla",
      100, // total supply
      10 * decimals, // price
    ];

    await factory.connect(owner).createNewProject(...projectValues);

    // get qland address and get contract
    const { qlandAddr } = await qapturState.projects(project.id);
    const qland = await ethers.getContractAt("QapturLand", qlandAddr);

    // Buy info (initial supply)
    const buy = {
      projectId: 1,
      nbTokens: 20,
    };

    // Sell info (marketplace)
    const sell = {
      projectId: 1,
      nbTokens: 10,
      nbTokensSup: 20,
      price: 15 * decimals,
    };

    return {
      QapturLandMarketplace,
      marketplace,
      qapturState,
      usdc,
      qland,
      project,
      buy,
      sell,
      zeroAddr,
      provider,
      owner,
      addr1,
      addr2,
      qapturWallet,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { marketplace, owner } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      expect(await marketplace.owner()).to.equal(owner.address);
    });
  });

  describe("buyFromInitialSupply", function () {
    it("Should revert if available supply is unsufficient", async function () {
      const { marketplace, addr1, project } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      await expect(
        marketplace.connect(addr1).buyFromInitialSupply(project.id, 120)
      ).to.be.revertedWith("Insufficient supply");
    });
    it("Should revert if usdc allowance is unsufficient", async function () {
      const { marketplace, addr1, project } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      await expect(
        marketplace.connect(addr1).buyFromInitialSupply(project.id, 100)
      ).to.be.revertedWith("Insufficient allowance");
    });
    it("Should update the available supply of the project", async function () {
      const { marketplace, qapturState, addr1, project, buy } =
        await loadFixture(deployQapturLandMarketplaceFixture);
      //initial supply value
      const initialAvailableSupply = (await qapturState.projects(project.id))
        .availableSupply;
      // allowance
      const totalPrice = buy.nbTokens * project.price;
      await usdc.connect(addr1).approve(marketplace.address, totalPrice);
      // mint
      await marketplace
        .connect(addr1)
        .buyFromInitialSupply(buy.projectId, buy.nbTokens);
      //check supply updated
      expect((await qapturState.projects(project.id)).availableSupply).to.equal(
        initialAvailableSupply - buy.nbTokens
      );
    });
    it("Should mint to the sender some qland vs usdc", async function () {
      const { marketplace, usdc, qland, addr1, qapturWallet, project, buy } =
        await loadFixture(deployQapturLandMarketplaceFixture);
      // initial balance usdc qaptur // buyer
      const initialUsdcQaptur = Number(
        await usdc.balanceOf(qapturWallet.address)
      );
      const initialUsdcBuyer = Number(await usdc.balanceOf(addr1.address));
      // initial balance qland
      const initialQland = await qland.balanceOf(
        addr1.address,
        project.tokenId
      );
      // allowance
      const totalPrice = buy.nbTokens * project.price;
      await usdc.connect(addr1).approve(marketplace.address, totalPrice);
      // mint
      await marketplace
        .connect(addr1)
        .buyFromInitialSupply(buy.projectId, buy.nbTokens);
      // final balance usdc  qaptur // buyer
      expect(await usdc.balanceOf(qapturWallet.address)).to.equal(
        initialUsdcQaptur + totalPrice
      );
      expect(await usdc.balanceOf(addr1.address)).to.equal(
        initialUsdcBuyer - totalPrice
      );
      // final balance qland
      expect(await qland.balanceOf(addr1.address, project.tokenId)).to.equal(
        initialQland + buy.nbTokens
      );
    });
    it("Should emit BoughtFromInitialSupply event", async function () {
      const { marketplace, project, buy, addr1 } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      // allowance
      const totalPrice = buy.nbTokens * project.price;
      await usdc.connect(addr1).approve(marketplace.address, totalPrice);
      // mint & event
      expect(
        await marketplace
          .connect(addr1)
          .buyFromInitialSupply(buy.projectId, buy.nbTokens)
      )
        .to.emit(marketplace, "BoughtFromInitialSupply")
        .withArgs(addr1.address, project.id, buy.nbTokens);
    });
  });

  describe("addItemToMarketplace", function () {
    it("Should revert if seller balance is unsufficient", async function () {
      const { marketplace, addr2, sell } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      // addr2 has no token
      await expect(
        marketplace
          .connect(addr2)
          .addItemToMarketplace(sell.projectId, sell.nbTokens, sell.price)
      ).to.be.revertedWith("Insufficient seller balance");
    });
    it("Should add an items on sale to the Marketplace", async function () {
      const { marketplace, project, buy, sell, addr1 } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      /** Context preparation */
      // allowance
      const totalPrice = buy.nbTokens * project.price;
      await usdc.connect(addr1).approve(marketplace.address, totalPrice);
      // mint
      await marketplace
        .connect(addr1)
        .buyFromInitialSupply(buy.projectId, buy.nbTokens);
      /** Test */
      // check empty on sale token
      expect(await marketplace.getProjectItemsOnSale(sell.projectId)).to.be
        .empty;
      // add to marketplace
      await marketplace
        .connect(addr1)
        .addItemToMarketplace(sell.projectId, sell.nbTokens, sell.price);
      // check after on sale token
      expect(
        await marketplace.getProjectItemsOnSale(sell.projectId)
      ).to.have.lengthOf(1);
      const onSaleToken = (
        await marketplace.getProjectItemsOnSale(sell.projectId)
      )[0];
      expect(onSaleToken.seller).to.equal(addr1.address);
      expect(onSaleToken.amount).to.equal(sell.nbTokens);
      expect(onSaleToken.price).to.equal(sell.price);
    });
  });

  describe("getProjectItemsOnSale", function () {
    it("Should return an empty array if no item on sale", async function () {
      const { marketplace, sell } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      expect(await marketplace.getProjectItemsOnSale(sell.projectId)).to.be
        .empty;
    });
    it("Should return items on sale for a projectId", async function () {
      const { marketplace, project, buy, sell, addr2 } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      /** Context preparation */
      // allowance
      const totalPrice = buy.nbTokens * project.price;
      await usdc.connect(addr2).approve(marketplace.address, totalPrice);
      // mint
      await marketplace
        .connect(addr2)
        .buyFromInitialSupply(buy.projectId, buy.nbTokens);
      // add to marketplace
      await marketplace
        .connect(addr2)
        .addItemToMarketplace(sell.projectId, sell.nbTokens, sell.price);
      // check after on sale token
      expect(
        await marketplace.getProjectItemsOnSale(sell.projectId)
      ).to.have.lengthOf(1);
      const onSaleToken = (
        await marketplace.getProjectItemsOnSale(sell.projectId)
      )[0];
      expect(onSaleToken.seller).to.equal(addr2.address);
      expect(onSaleToken.amount).to.equal(sell.nbTokens);
      expect(onSaleToken.price).to.equal(sell.price);
    });
  });

  /** Addition of an initial sell and one item is available on the market place
    for testing buy on marketplace function */
  async function buyOnMarketplaceFixture() {
    const {
      marketplace,
      qapturState,
      usdc,
      qland,
      project,
      buy,
      sell,
      zeroAddr,
      provider,
      owner,
      addr1,
      addr2,
      qapturWallet,
    } = await loadFixture(deployQapturLandMarketplaceFixture);

    /** Context preparation */
    // allowance
    const totalPrice = buy.nbTokens * project.price;
    await usdc.connect(addr1).approve(marketplace.address, totalPrice);
    // mint
    await marketplace
      .connect(addr1)
      .buyFromInitialSupply(buy.projectId, buy.nbTokens);
    // add to marketplace
    await marketplace
      .connect(addr1)
      .addItemToMarketplace(sell.projectId, sell.nbTokens, sell.price);

    return {
      marketplace,
      qapturState,
      usdc,
      qland,
      project,
      buy,
      sell,
      zeroAddr,
      provider,
      owner,
      addr1,
      addr2,
      qapturWallet,
    };
  }

  describe("buyFromMarketplace", function () {
    it("Should revert if seller balance is unsufficient", async function () {
      const { marketplace, sell, addr1, addr2 } = await loadFixture(
        deployQapturLandMarketplaceFixture
      );
      await expect(
        marketplace
          .connect(addr2)
          .buyFromMarketplace(
            addr1.address,
            sell.projectId,
            sell.nbTokens,
            sell.price
          )
      ).to.be.revertedWith("Insufficient seller balance");
    });
    it("Should revert if requested quantity is too high", async function () {
      const { marketplace, addr1, addr2, sell } = await loadFixture(
        buyOnMarketplaceFixture
      );
      await expect(
        marketplace
          .connect(addr2)
          .buyFromMarketplace(
            addr1.address,
            sell.projectId,
            sell.nbTokensSup,
            sell.price
          )
      ).to.be.revertedWith("Requested quantity not available");
    });
    it("Should revert if allowance is unsufficient", async function () {
      const { marketplace, addr1, addr2, sell } = await loadFixture(
        buyOnMarketplaceFixture
      );
      await expect(
        marketplace
          .connect(addr2)
          .buyFromMarketplace(
            addr1.address,
            sell.projectId,
            sell.nbTokens,
            sell.price
          )
      ).to.be.revertedWith("Insufficient allowance");
    });
    it("Should revert if approval is not granted", async function () {
      const { marketplace, usdc, addr1, addr2, sell } = await loadFixture(
        buyOnMarketplaceFixture
      );
      // allowance
      const totalPrice = sell.nbTokens * sell.price;
      await usdc.connect(addr2).approve(marketplace.address, totalPrice);
      // buy form marketplace
      await expect(
        marketplace
          .connect(addr2)
          .buyFromMarketplace(
            addr1.address,
            sell.projectId,
            sell.nbTokens,
            sell.price
          )
      ).to.be.revertedWith("Missing approval");
    });
    it("Should transfer qland vs usdc", async function () {
      const { marketplace, usdc, qland, addr1, addr2, project, sell } =
        await loadFixture(buyOnMarketplaceFixture);

      // check usdc balance before (seller/buyer)
      initialUsdcSeller = Number(await usdc.balanceOf(addr1.address));
      initialUsdcBuyer = Number(await usdc.balanceOf(addr2.address));

      // check qland balance before (seller/buyer)
      initialQlandSeller = Number(
        await qland.balanceOf(addr1.address, project.tokenId)
      );
      console.log("1b");
      initialQlandBuyer = Number(
        await qland.balanceOf(addr2.address, project.tokenId)
      );

      // allowance
      const totalPrice = sell.nbTokens * sell.price;
      await usdc.connect(addr2).approve(marketplace.address, totalPrice);
      // approval
      await qland.connect(addr1).setApprovalForAll(marketplace.address, true);
      // buy form marketplace
      await marketplace
        .connect(addr2)
        .buyFromMarketplace(
          addr1.address,
          sell.projectId,
          sell.nbTokens,
          sell.price
        );
      console.log(3);
      // check usdc balance after (seller/buyer)
      expect(await usdc.balanceOf(addr1.address)).to.equal(
        initialUsdcSeller + totalPrice
      );
      expect(await usdc.balanceOf(addr2.address)).to.equal(
        initialUsdcBuyer - totalPrice
      );
      // check qland balance after (seller/buyer)
      expect(await qland.balanceOf(addr1.address, project.tokenId)).to.equal(
        initialQlandSeller - sell.nbTokens
      );
      expect(await qland.balanceOf(addr2.address, project.tokenId)).to.equal(
        initialQlandBuyer + sell.nbTokens
      );
    });
    it("Should emit BoughtOnMarketplace event", async function () {
      const { marketplace, usdc, qland, addr1, addr2, sell } =
        await loadFixture(buyOnMarketplaceFixture);
      // allowance
      const totalPrice = sell.nbTokens * sell.price;
      await usdc.connect(addr2).approve(marketplace.address, totalPrice);
      // approval
      await qland.connect(addr1).setApprovalForAll(marketplace.address, true);
      // buy form marketplace
      expect(
        await marketplace
          .connect(addr2)
          .buyFromMarketplace(
            addr1.address,
            sell.projectId,
            sell.nbTokens,
            sell.price
          )
      )
        .to.emit(marketplace, "BoughtOnMarketplace")
        .withArgs(addr1.address, addr2.address, sell.projectId, sell.nbTokens);
    });
  });
});
