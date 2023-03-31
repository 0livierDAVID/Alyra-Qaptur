const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const nbNFTs = 10;

async function deployERC1155ozFixture() {
  const Qland1155oz = await ethers.getContractFactory("QapturLandERC1155oz");
  const [owner, addr1, addr2] = await ethers.getSigners();

  const qland1155oz = await Qland1155oz.deploy();

  await qland1155oz.deployed();

  // Fixtures can return anything you consider useful for your tests
  return { Qland1155oz, qland1155oz, owner, addr1, addr2 };
}

xdescribe("ERC1155oz mint 10 units", async function () {
  it(`Should mint ${nbNFTs} tokens in batch with ERC1155oz`, async function () {
    const { qland1155oz, owner } = await loadFixture(deployERC1155ozFixture);

    for (let index = 0; index < nbNFTs; index++) {
      // Mint nbNFTs tokens to owner address
      await qland1155oz.mint(owner.address, 0, nbNFTs);
    }
    expect(await qland1155oz.balanceOf(owner.address, 0)).to.equal(nbNFTs * nbNFTs);
  });
});

xdescribe("ERC1155oz transfer 10 units", async function () {
  it(`Should transfer ${nbNFTs} tokens in batch with ERC1155oz`, async function () {
    const { qland1155oz, owner, addr1 } = await loadFixture(deployERC1155ozFixture);
    // Mint nbNFTs tokens to owner address
    for (let index = 0; index < nbNFTs; index++) {
      // Mint nbNFTs tokens to owner address
      await qland1155oz.mint(owner.address, 0, nbNFTs);
    }
    expect(await qland1155oz.balanceOf(owner.address, 0)).to.equal(nbNFTs * nbNFTs);

    for (let index = 0; index < nbNFTs; index++) {
      await qland1155oz.safeTransferFrom(owner.address, addr1.address, 0, nbNFTs, 0x00);
    }

    expect(await qland1155oz.balanceOf(addr1.address, 0)).to.equal(nbNFTs * nbNFTs);
  });
});
