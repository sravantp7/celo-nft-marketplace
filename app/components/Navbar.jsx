import styles from "@/styles/Navbar.module.css";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar () {
    return (
        <div className={styles.navbar}>
            <Link href="/">Home</Link>
            <Link href="/create">Create Listing</Link>
            <ConnectButton />
        </div>
    );
}