const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Winery", function () {
  this.timeout(50000);

  let myNFT;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const Winery = await ethers.getContractFactory("Winery");
    [owner, acc1, acc2] = await ethers.getSigners();
    // console.log(owner)

    myNFT = await Winery.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await myNFT.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function () {
    expect(await myNFT.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://example.com/1";
    const tokenId = 0
    const tx = await myNFT.connect(owner).mintWine(tokenURI, tokenId);
    await tx.wait();

    expect(await myNFT.balanceOf(acc1.address)).to.equal(0);
  });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";
    const tokenId1 = 1
    const tokenId2 = 2

    const tx1 = await myNFT.connect(owner).mintWine(tokenURI_1, tokenId1);
    await tx1.wait();
    const tx2 = await myNFT.connect(owner).mintWine(tokenURI_2, tokenId2);
    await tx2.wait();

    expect(await myNFT.tokenURI(1)).to.equal(tokenURI_1);
    expect(await myNFT.tokenURI(2)).to.equal(tokenURI_2);
  });
});