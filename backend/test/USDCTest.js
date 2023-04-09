const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("USDCTest contract", function () {
  async function deployUSDCTestFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const zeroAddr = ethers.constants.AddressZero;

    USDCTest = await ethers.getContractFactory("USDCTest");
    const usdc = await USDCTest.deploy();
    await usdc.deployed();

    const decimals = 6;

    return {
      USDCTest,
      usdc,
      owner,
      decimals,
    };
  }

  describe("decimals", function () {
    it("Should return decimals value", async function () {
      const { usdc, decimals } = await loadFixture(deployUSDCTestFixture);
      expect(await usdc.decimals()).to.be.equal(decimals);
    });
  });
});
