const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const nbNFTs = 10;

async function deployERC721ozFixture() {
  const Qland721oz = await ethers.getContractFactory("QapturLandERC721oz");
  const [owner, addr1, addr2] = await ethers.getSigners();

  const qland721oz = await Qland721oz.deploy();

  await qland721oz.deployed();

  // Fixtures can return anything you consider useful for your tests
  return { Qland721oz, qland721oz, owner, addr1, addr2 };
}

xdescribe("ERC721oz mint 10 units", async function () {
  it(`Should mint ${nbNFTs} tokens one by one with ERC721oz`, async function () {
    const { qland721oz, owner } = await loadFixture(deployERC721ozFixture);

    for (let index = 0; index < nbNFTs; index++) {
      // Mint nbNFTs tokens to owner address
      await qland721oz.safeMint(owner.address);
    }
    expect(await qland721oz.balanceOf(owner.address)).to.equal(nbNFTs);
  });
});

xdescribe("ERC721oz transfer 10 units", async function () {
  it(`Should transfer ${nbNFTs} tokens one by one with ERC721oz`, async function () {
    const { qland721oz, owner, addr1 } = await loadFixture(deployERC721ozFixture);
    // Mint nbNFTs tokens to owner address
    for (let index = 0; index < nbNFTs; index++) {
      // Mint nbNFTs tokens to owner address
      await qland721oz.safeMint(owner.address);
    }
    expect(await qland721oz.balanceOf(owner.address)).to.equal(nbNFTs);

    for (let index = 0; index < nbNFTs; index++) {
      //await qland721oz.safeTransferFrom(owner.address, addr1.address, index);
      await qland721oz["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, index);
      //contract["safeTransferFrom(address,address,uint256)"](addr1, addr2, 1);
    }
    expect(await qland721oz.balanceOf(addr1.address)).to.equal(nbNFTs);
  });
});
