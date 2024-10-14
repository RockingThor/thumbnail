"use client";

import { balanceState, tokenState } from "@/recoil/atom";
// import { retrieveLaunchParams } from "@tma.js/sdk";
import { useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export function Me() {
    // const { initData: data } = retrieveLaunchParams();
    // const user = data?.user;
    // const [telegramUsername, setTelegramUsername] = useRecoilState(
    //     telegramUserNameState
    // );
    const [token, setToken] = useRecoilState(tokenState);
    const [balance, setBalance] = useRecoilState(balanceState);
    const [loadedInitialState, setLoadedInitialState] = useState(false);

    async function getWorkerToken() {
        const response = await axios.post(`${BACKEND_URL}/signin`, {
            telegram: "oyerohit",
        });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
        }
    }

    async function getBalance() {
        if (localStorage.getItem("token")) {
            const response = await axios.get(`${BACKEND_URL}/balance`, {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            if (response.data.balance) setBalance(response.data.balance);
        }
    }

    useState(() => {
        if (loadedInitialState) return;
        // setTelegramUsername(user);
        getWorkerToken().then(() =>
            getBalance().then(() => {
                setLoadedInitialState(true);
            })
        );

        //@ts-ignore
    }, []);

    // if (!user) {
    //     return null;
    // }

    return (
        <div className="text-sm flex items-center justify-between">
            <div className="p-2">
                <code>Welcome back </code>
                <code className="font-mono font-bold">@{"oyerohit"}</code>
            </div>
            <div className="p-2">
                <p className="font-mono">
                    {`Balance: ${balance / 1000000000} SOL`}{" "}
                </p>
            </div>
        </div>
    );
}
