"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { LoaderPinwheelIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    finalFormData,
    getImages,
    getNumOfImages,
    getToken,
} from "@/recoil/selector";
import axios from "axios";
import { BACKEND_URL, CLOUDFRONT_URL } from "@/lib/config";
import { formState, imagesState, solanaAmountState } from "@/recoil/atom";
import { MyFormData, ImagesData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const UploadDialog = () => {
    const [images, setImages] = useRecoilState(imagesState);
    const uploadedImages = useRecoilValue(getImages);
    const [disabled, setDisabled] = useState(false);
    const numImages = useRecoilValue(getNumOfImages);
    const [formStateData, setFormStateData] = useRecoilState(formState);
    const finalFormdata: MyFormData = useRecoilValue(finalFormData);
    const [signature, setSignature] = useState("");
    const router = useRouter();
    const solanaAmount = useRecoilValue(solanaAmountState);
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    async function onFileSelect(e: any) {
        setDisabled(true);
        try {
            const file = e.target.files[0];
            const response = await axios.get(`${BACKEND_URL}/presigned-url`, {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            const presignedUrl = response.data.preSignedURL;

            const formData = new FormData();
            formData.set("bucket", response.data.fields["bucket"]);
            formData.set(
                "X-Amz-Algorithm",
                response.data.fields["X-Amz-Algorithm"]
            );
            formData.set(
                "X-Amz-Credential",
                response.data.fields["X-Amz-Credential"]
            );
            formData.set(
                "X-Amz-Algorithm",
                response.data.fields["X-Amz-Algorithm"]
            );
            formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"]);
            formData.set("key", response.data.fields["key"]);
            formData.set("Policy", response.data.fields["Policy"]);
            formData.set(
                "X-Amz-Signature",
                response.data.fields["X-Amz-Signature"]
            );
            formData.set(
                "X-Amz-Algorithm",
                response.data.fields["X-Amz-Algorithm"]
            );
            formData.append("file", file);
            const awsResponse = await axios.post(presignedUrl, formData);
            if (awsResponse) {
                const imageUrl = `${CLOUDFRONT_URL}/${response.data.fields["key"]}`;
                let tempImages: ImagesData[] = [];
                uploadedImages.forEach((image) => {
                    tempImages.push(image);
                });
                tempImages.push({ imageUrl });
                setImages(tempImages);
            }
        } catch (err) {
            console.log(err);
        }
        setDisabled(false);
    }
    const handleUpload = async () => {
        console.log(finalFormdata);
        let imageOtions: ImagesData[] = [];
        uploadedImages.forEach((image) => {
            imageOtions.push({ imageUrl: image.imageUrl });
        });
        const taskResponse = await axios.post(
            `${BACKEND_URL}/task`,
            {
                options: imageOtions,
                title: formStateData.description,
                sampleSize: formStateData.sampleSize,
                signature,
            },
            {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            }
        );
        if (taskResponse) {
            router.push(`/task/${taskResponse.data.id}`);
        }
    };
    async function makePayment() {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey!,
                toPubkey: new PublicKey(
                    "5aoMSShfkCGsiUR2wKUAtpXHRUktKzNnPgdP3DD6NHAb"
                ),
                lamports: solanaAmount,
            })
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, {
            minContextSlot,
        });

        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature,
        });
        setSignature(signature);
    }

    return (
        <div className="p-2">
            <div className="flex flex-row">
                {uploadedImages.map((image) => (
                    <div
                        className="p-1 border m-1 rounded"
                        key={image.imageUrl}
                    >
                        <Image
                            src={image.imageUrl}
                            alt="image"
                            width={200}
                            height={200}
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-row">
                <div className="p-2">
                    <Button disabled={images.length === numImages || disabled}>
                        <UploadIcon />
                        {!disabled && (
                            <input
                                className="opacity-0 display:none w-20"
                                type="file"
                                onChange={onFileSelect}
                            />
                        )}
                        {disabled && <LoaderPinwheelIcon />}
                    </Button>
                </div>
                {images.length === numImages && (
                    <div className="flex items-center justify-between ">
                        <div className=" p-1">
                            <Button
                                onClick={handleUpload}
                                disabled={disabled}
                            >
                                Pay {solanaAmount / 1000000000} SOL
                            </Button>
                        </div>
                        {signature.length >= 1 && (
                            <div className=" p-1">
                                <Button
                                    onClick={handleUpload}
                                    disabled={disabled}
                                >
                                    Submit Images
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadDialog;
