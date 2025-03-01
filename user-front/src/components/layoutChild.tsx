"use client";
import React, { useMemo } from "react";
import { RecoilRoot } from "recoil";
import AppBar from "./appbar";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

const LayoutChild = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/anza-xyz/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <RecoilRoot>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider
                    wallets={wallets}
                    autoConnect
                >
                    <WalletModalProvider>
                        <AppBar />
                        {children}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </RecoilRoot>
    );
};

export default LayoutChild;
