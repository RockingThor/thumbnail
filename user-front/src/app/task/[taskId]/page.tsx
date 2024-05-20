"use client";
import { BACKEND_URL } from "@/lib/config";
import { TaskData } from "@/lib/types";
import { getToken } from "@/recoil/selector";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface TaskIdPageProps {
    params: {
        taskId: string;
    };
}

async function getTaskDetails(id: string, token: string) {
    const response = await axios.get(`${BACKEND_URL}/task?taskId=${id}`, {
        headers: {
            authorization: localStorage.getItem("token"),
        },
    });
    console.log(response.data);

    return response.data;
}

const Page = ({ params }: TaskIdPageProps) => {
    const token = useRecoilValue(getToken);
    const [result, setResult] = useState<
        Record<
            string,
            {
                count: number;
                option: {
                    imageUrl: string;
                };
            }
        >
    >({});
    const [title, setTitle] = useState("");

    useEffect(() => {
        getTaskDetails(params.taskId, token).then((data) => {
            setResult(data.result);
            setTitle(data.taskDetails.title);
        });
    }, []);

    return (
        <div className="flex items-center justify-center mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="  flex">
                        {" "}
                        {Object.keys(result || {}).map((d) => (
                            <div
                                className="p-2"
                                key={d}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Total Vote: {result[d].count}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Image
                                            src={result[d].option?.imageUrl}
                                            alt={"image"}
                                            height={400}
                                            width={400}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
