import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/Create.module.css";
import { useSigner, erc721ABI } from 'wagmi';
import { ethers } from "ethers";
import MarketplaceABI from "@/abi/NFTMarketplace.json";
import {MARKETPLACE_ADDRESS} from "../constant.js";

export default function Create() {
    const [nftAddress, setNftAddress] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);

    const [showListingLink, setShowListingLink] = useState(false);

    // Get signer from wagmi
    const { data: signer } = useSigner();

    async function handleCreateListing() {
        setLoading(true);

        try {
            // Make sure the contract address is a valid address
            const isValidAddress = ethers.utils.isAddress(nftAddress);
            if (!isValidAddress) {
                throw new Error(`Invalid contract address`);
            }

            // Request approval over NFTs if requred, then create listing
            await requestApproval();
            await createListing();

            setShowListingLink(true);
        } catch (error) {
            setLoading(false);
            window.alert(error.message);
            console.log(error.message);
        }
        setLoading(false);
    }

    async function requestApproval() {
        const ERC721Contract = new ethers.Contract(nftAddress, erc721ABI, signer);
        const address = await signer.getAddress();
        const tokenOwner = await ERC721Contract.ownerOf(tokenId);

        if (tokenOwner !== address) {
            throw new Error(`You do not own this NFT`);
        }

        // Check if user already gave approval to the marketplace
        const isApproved = await ERC721Contract.isApprovedForAll(
            address,
            MARKETPLACE_ADDRESS
        );

            // If not approved
        if (!isApproved) {
            console.log("Requesting approval over NFTs...");
  
            // Send approval transaction to NFT contract
            const approvalTxn = await ERC721Contract.setApprovalForAll(
            MARKETPLACE_ADDRESS,
            true
            );
            await approvalTxn.wait();
        }
    }

    // Function to call `createListing` in the marketplace contract
    async function createListing() {
        // Initialize an instance of the marketplace contract
        const MarketplaceContract = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MarketplaceABI,
        signer
        );

        // Send the create listing transaction
        const createListingTxn = await MarketplaceContract.createListing(
        nftAddress,
        tokenId,
        ethers.utils.parseEther(price)
        );
        await createListingTxn.wait();
    }

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <input type="text" placeholder="NFT Address 0x..." value={nftAddress} onChange={e => setNftAddress(e.target.value)} />
                <input
                    type="text"
                    placeholder="Token ID"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Price (in CELO)"
                    value={price}
                    onChange={(e) => {
                        if (e.target.value === "") {
                        setPrice("0");
                        } else {
                        setPrice(e.target.value);
                        }
                    }}
                />
                {/* Button to create the listing */}
                <button onClick={handleCreateListing} disabled={loading}>
                    {loading ? "Loading..." : "Create"}
                </button>

                {/* Button to take user to the NFT details page after listing is created */}
                {showListingLink && (
                    <Link href={`/${nftAddress}/${tokenId}`}>
                        <button>View Listing</button>
                    </Link>
                )}
            </div>
        </div>
    );
}