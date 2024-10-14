"use client";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { Poll } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Polls = () => {
    const [pollData, setPollData] = useState<Poll[]>([]);
    const [loadedData, setLoadedData] = useState(false);
    const router = useRouter();
    async function getData() {
        const response = await axios.get(`${BACKEND_URL}/polls`, {
            headers: {
                authorization: localStorage.getItem("token"),
            },
        });
        setPollData(response.data.tasks);
    }

    useEffect(() => {
        getData();
        setLoadedData(true);
    }, []);

    return (
        <div className="m-5">
            <div className="p-4 font-mono text-xl flex items-center justify-center">
                All Polls
            </div>
            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Sample Size</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pollData.map((poll) => (
                        <TableRow key={poll.id}>
                            <TableCell className="font-medium">
                                {poll.id}
                            </TableCell>
                            <TableCell>{poll.title}</TableCell>
                            <TableCell>{poll.sampleSize}</TableCell>
                            <TableCell>{poll.submissionCount}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => {
                                        router.push(`/task/${poll.id}`);
                                    }}
                                >
                                    Detailed Analysis
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Polls;
