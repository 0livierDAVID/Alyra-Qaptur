const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("QapturCo2 contract", function () {
  async function deployQapturCo2Fixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const zeroAddr = ethers.constants.AddressZero;

    QapturCo2 = await ethers.getContractFactory("QapturCo2");
    const qco2 = await QapturCo2.deploy();
    await qco2.deployed();

    const tokenId = ethers.BigNumber.from("0");
    const amount = ethers.BigNumber.from("100");
    const data = [];

    return {
      QapturCo2,
      qco2,
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
      const { qco2, owner } = await loadFixture(deployQapturCo2Fixture);
      expect(await qco2.owner()).to.equal(owner.address);
    });
  });

  describe("mint", function () {
    it("Should revert if not called by the owner", async function () {
      const { qco2, addr1, tokenId, amount, data } = await loadFixture(
        deployQapturCo2Fixture
      );
      await expect(
        qco2.connect(addr1).mint(addr1.address, tokenId, amount, data)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should mint some token to 'to' address", async function () {
      const { qco2, owner, addr1, tokenId, amount, data } = await loadFixture(
        deployQapturCo2Fixture
      );
      const initialBalance = await qco2.balanceOf(addr1.address, tokenId);
      await qco2.connect(owner).mint(addr1.address, tokenId, amount, data);
      expect(await qco2.balanceOf(addr1.address, tokenId)).to.equal(
        initialBalance + amount
      );
    });
  });
});
