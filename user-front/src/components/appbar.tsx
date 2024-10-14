"use client";
import React, { useEffect } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import {
    WalletDisconnectButton,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { useRecoilState } from "recoil";
import { tokenState } from "@/recoil/atom";
import { useRouter } from "next/navigation";

const AppBar = () => {
    const { publicKey, signMessage } = useWallet();
    const [tokenstate, setTokenState] = useRecoilState(tokenState);
    const router = useRouter();

    async function getTokenFromBackend() {
        //if (!publicKey) return;
        const message = new TextEncoder().encode(
            "Jaldi se Jaldi Permission dedo sirf jaldi se jaldi permission dedo sir"
        );
        const signature = await signMessage?.(message);
        const response = await axios.post(`${BACKEND_URL}/signin`, {
            signature,
            publicKey: publicKey?.toString(),
        });

        setTokenState(response.data.token);
        localStorage.setItem("token", response.data.token);
    }

    useEffect(() => {
        //if (publicKey) return;
        getTokenFromBackend();
    }, [publicKey]);

    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div
                    className="text-white text-2xl font-bold font-mono"
                    onClick={() => {
                        router.push("/");
                    }}
                >
                    OpenPolls
                </div>
                <div className="hidden md:flex space-x-4">
                    <div className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                        <WalletMultiButton />
                    </div>
                    <div className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                        <WalletDisconnectButton />
                    </div>
                </div>
                <div className="md:hidden">
                    <button className="text-white focus:outline-none">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AppBar;
