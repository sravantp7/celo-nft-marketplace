const { ethers } = require("hardhat");

// CeloNFT Contract - 0xc6f957EBC0ad23200B475C62Dc145CfC288632EE
// NFT Market Place - 0xE6bB4204B23af4453a8761Ff9e2a76ECbC11f369

async function main() {
  // Deploying CeloNFT Contract.
  const CeloNFTFactory = await ethers.getContractFactory("CeloNFT");
  const CeloNFT = await CeloNFTFactory.deploy();
  await CeloNFT.deployed();
  console.log(`CeloNFT Contract deployed at : ${CeloNFT.address}`);

  // Deploying NFTMarketplace Contract.
  const NFTMarketplaceFactory = await ethers.getContractFactory(
    "NFTMarketplace"
  );
  const NFTMarketplace = await NFTMarketplaceFactory.deploy();
  await NFTMarketplace.deployed();
  console.log(
    `NFT Market Place contract deployed at : ${NFTMarketplace.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
