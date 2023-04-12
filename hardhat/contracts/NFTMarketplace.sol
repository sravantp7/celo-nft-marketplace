// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    struct Listing {
        uint256 price;
        address seller;
    }

    // Emit when a new listing happens
    event ListingCreated(
        address nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        address seller
    );

    // Contract Address -> (Token ID -> Listing Data)
    mapping(address => mapping(uint256 => Listing)) public listings;

    modifier validPrice(uint256 _price) {
        // There must be a price when listing NFT.
        require(_price > 0, "INVALID_PRICE");
        _;
    }

    modifier isNotListed(address nftAddress, uint256 tokenId) {
        // If there is a Listing for this NFT, Then as per contract the price will be greater than 0
        // so if price == 0 means, this NFT is not listed
        require(listings[nftAddress][tokenId].price == 0, "NFT_ALREADY_LISTED");
        _;
    }

    // Caller must be owner of the NFT token ID
    modifier isNFTOwner(address nftAddress, uint256 tokenId) {
        require(
            IERC721(nftAddress).ownerOf(tokenId) == msg.sender,
            "OWNER_ERROR"
        );
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        require(listings[nftAddress][tokenId].price > 0, "ERROR_NOT_LISTED");
        _;
    }

    // Allow users to List their NFTs
    function createListing(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        validPrice(price)
        isNotListed(nftAddress, tokenId)
        isNFTOwner(nftAddress, tokenId)
    {
        IERC721 nftContract = IERC721(nftAddress); // Creating to interact with NFT contract

        // Market should able to transfer this NFT(for this market address should approved in nft contract)
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) ||
                nftContract.getApproved(tokenId) == address(this),
            "NO_APPROVAL_ERROR"
        );

        // Add listing
        Listing memory newListing = Listing({price: price, seller: msg.sender});
        listings[nftAddress][tokenId] = newListing;

        emit ListingCreated(nftAddress, tokenId, price, msg.sender);
    }
}
