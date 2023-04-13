import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/Navbar";
import Listing from "@/components/Listing";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SUBGRAPH_URL } from "../constant";
import { useAccount } from "wagmi";
import { createClient, fetchExchange} from "urql";


export default function Home() {
  const [listings, setListings] = useState();
  const [loading, setLoading] = useState(false);

  const { isConnected } = useAccount();

  // Function to fetch listings from the subgraph
  async function fetchListings() {
    setLoading(true);
    // The GraphQL query to run
    const listingsQuery = `
      query ListingsQuery {
        listingEntities {
          id
          nftAddress
          tokenId
          price
          seller
          buyer
        }
      }
    `;

    // Create a urql client
    const urqlClient = createClient({
      url: SUBGRAPH_URL,
      exchanges: [fetchExchange]
    });

    // Send the query to the subgraph GraphQL API, and get the response
    const response = await urqlClient.query(listingsQuery).toPromise();
    const listingEntities = response.data.listingEntities;

    // Filter out active listings i.e. ones which haven't been sold yet
    const activeListings = listingEntities.filter((l) => l.buyer === null);

    // Update state variables
    setListings(activeListings);
    setLoading(false);
  }

  useEffect(() => {
    // Fetch listings on page load once wallet connection exists
    if (isConnected) {
      fetchListings();
    }
  }, []);

  return (
    <>
      <Head>
        <title>NFT Market Place</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      {loading && isConnected && <span>Loading...</span>}

      <div className={styles.container}>
        {!loading &&
          listings &&
          listings.map((listing) => {
            return (
              <Link
                key={listing.id}
                href={`/${listing.nftAddress}/${listing.tokenId}`}
              >
                  <Listing
                    nftAddress={listing.nftAddress}
                    tokenId={listing.tokenId}
                    price={listing.price}
                    seller={listing.seller}
                  />
              </Link>
            );
          })}
      </div>

      {!loading && listings && listings.length === 0 && (
        <span>No listings found</span>
      )}
    </>
  );
}
