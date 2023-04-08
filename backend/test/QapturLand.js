const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("QapturLand contract", function () {
  async function deployQapturLandFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const zeroAddr = ethers.constants.AddressZero;

    QapturLand = await ethers.getContractFactory("QapturLand");
    const qland = await QapturLand.deploy();
    await qland.deployed();

    const tokenId = ethers.BigNumber.from("0");
    const amount = ethers.BigNumber.from("100");
    const data = [];

    return {
      QapturLand,
      qland,
      zeroAddr,
      owner,
      addr1,
      addr2,
      tokenId,
      amount,
      data,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { qland, owner } = await loadFixture(deployQapturLandFixture);
      expect(await qland.owner()).to.equal(owner.address);
    });
  });

  describe("mint", function () {
    it("Should revert if not called by the owner", async function () {
      const { qland, addr1, tokenId, amount, data } = await loadFixture(
        deployQapturLandFixture
      );
      await expect(
        qland.connect(addr1).mint(addr1.address, tokenId, amount, data)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should mint some token to 'to' address", async function () {
      const { qland, owner, addr1, tokenId, amount, data } = await loadFixture(
        deployQapturLandFixture
      );
      const initialBalance = await qland.balanceOf(addr1.address, tokenId);
      await qland.connect(owner).mint(addr1.address, tokenId, amount, data);
      expect(await qland.balanceOf(addr1.address, tokenId)).to.equal(
        initialBalance + amount
      );
    });
  });
});
