const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const nbNFTs = 10;

async function deployERC721AFixture() {
  const Qland721A = await ethers.getContractFactory("QapturLandERC721A");
  const [owner, addr1, addr2] = await ethers.getSigners();

  const qland721A = await Qland721A.deploy();

  await qland721A.deployed();

  // Fixtures can return anything you consider useful for your tests
  return { Qland721A, qland721A, owner, addr1, addr2 };
}

xdescribe("ERC721A mint 10 units", async function () {
  it(`Should mint ${nbNFTs} tokens in batch with ERC721A`, async function () {
    const { qland721A, owner } = await loadFixture(deployERC721AFixture);

    for (let index = 0; index < nbNFTs; index++) {
      // Mint nbNFTs tokens to owner address
      await qland721A.mint(nbNFTs);
    }
    expect(await qland721A.balanceOf(owner.address)).to.equal(nbNFTs * nbNFTs);
  });
});

xdescribe("ERC721A transfer 10 units", async function () {
  it(`Should transfer ${nbNFTs} tokens one by one with ERC721A`, async function () {
    const { qland721A, owner, addr1 } = await loadFixture(deployERC721AFixture);
    // Mint nbNFTs tokens to owner address
    await qland721A.mint(nbNFTs);
    expect(await qland721A.balanceOf(owner.address)).to.equal(nbNFTs);

    for (let index = 0; index < nbNFTs; index++) {
      //await qland721A.safeTransferFrom(owner.address, addr1.address, index);
      await qland721A["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, index);
      //contract["safeTransferFrom(address,address,uint256)"](addr1, addr2, 1);
    }
    expect(await qland721A.balanceOf(addr1.address)).to.equal(nbNFTs);
  });
});
