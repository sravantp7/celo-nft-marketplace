const { ethers } = require("hardhat");

async function addList() {
  const signer = await ethers.getSigner();

  const NFTMContract = await ethers.getContractAt(
    "NFTMarketplace",
    "0xE6bB4204B23af4453a8761Ff9e2a76ECbC11f369",
    signer
  );

  const NFTContract = await ethers.getContractAt(
    "CeloNFT",
    "0xc6f957EBC0ad23200B475C62Dc145CfC288632EE",
    signer
  );
  const tx1 = await NFTContract.setApprovalForAll(
    "0xE6bB4204B23af4453a8761Ff9e2a76ECbC11f369",
    true
  );

  await tx1.wait();

  const tx = await NFTMContract.createListing(
    "0xc6f957ebc0ad23200b475c62dc145cfc288632ee",
    1,
    ethers.utils.parseEther("0.01")
  );
  await tx.wait();
}

addList();
