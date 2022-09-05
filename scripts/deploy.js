const hre = require("hardhat");

async function main() {
  const Winery = await hre.ethers.getContractFactory("Winery");
  const WineryNFT = await Winery.deploy();

  await WineryNFT.deployed();

  console.log("Winery deployed to:", WineryNFT.address);
  storeContractData(WineryNFT);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/Winery-address.json",
    JSON.stringify({ Winery: contract.address }, undefined, 2)
  );

  const MyNFTArtifact = artifacts.readArtifactSync("Winery");

  fs.writeFileSync(
    contractsDir + "/Winery.json",
    JSON.stringify(MyNFTArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });