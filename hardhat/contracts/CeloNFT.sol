// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CeloNFT is ERC721 {
    constructor() ERC721("CeloNFT", "cNFT") {
        // Minting 5 NFT to deployer address
        for (uint16 i = 0; i < 5; i++) {
            _mint(msg.sender, i);
        }
    }

    function tokenURI(
        uint256 /*tokenId*/
    ) public pure virtual override returns (string memory) {
        return "ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb";
    }
}
