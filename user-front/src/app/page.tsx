"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const initFormSchema = z.object({
    description: z.string().min(2).max(50),
    numPhotos: z.string().min(1).max(1),
    sampleSize: z.string().min(1).max(6),
});

import { Button } from "@/components/ui/button";
import { UploadCloudIcon } from "lucide-react";
import UploadDialog from "@/components/uploadDialog";
import { useRecoilState } from "recoil";
import { formState, solanaAmountState } from "@/recoil/atom";
import { MyFormData } from "@/lib/types";
import { useState } from "react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import React, { FC, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export default function Home() {
    const form = useForm<z.infer<typeof initFormSchema>>({
        resolver: zodResolver(initFormSchema),
        defaultValues: {
            description: "",
            numPhotos: "0",
            sampleSize: "1000",
        },
    });
    const [formStateData, setFormStateData] = useRecoilState(formState);
    const [disabled, setDisabled] = useState(false);
    const [solanaAmount, setSolanaAmount] = useRecoilState(solanaAmountState);

    function onSubmit(values: z.infer<typeof initFormSchema>) {
        const formData: MyFormData = {
            description: values.description,
            numImages: Number(values.numPhotos),
            sampleSize: Number(values.sampleSize),
            images: [],
        };

        setFormStateData(formData);
        let lamports = (1 / 10000) * Number(values.sampleSize) * 1000000000;
        setSolanaAmount(lamports);
        setDisabled(true);
    }

    return (
        <main className="flex  flex-col items-center justify-between p-5">
            <div className="p-5 mb-10 text-bold font-mono">
                Current Rate: 10000 Impressions For Every Solana
            </div>
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Create a new project</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Select the most attractive thumbnail."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-row items-start justify-between">
                                <div className="mr-2">
                                    <FormField
                                        control={form.control}
                                        name="numPhotos"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Number of images as option.
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="eg:4"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="sampleSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Size of your sample data.
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="eg:10000"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={disabled}
                            >
                                Submit & upload images
                            </Button>
                            <Dialog>
                                <DialogTrigger>
                                    {disabled && (
                                        <div className="flex flex-row border rounded bg-black m-2">
                                            <p className="p-1 text-white">
                                                {"Upload Images"}{" "}
                                            </p>
                                            <UploadCloudIcon className="text-white" />
                                        </div>
                                    )}
                                </DialogTrigger>
                                <DialogContent>
                                    <UploadDialog />
                                </DialogContent>
                            </Dialog>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}
