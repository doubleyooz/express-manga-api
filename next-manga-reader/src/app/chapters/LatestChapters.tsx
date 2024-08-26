'use client'
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Button from "@/common/Button";
import { BiComment, BiUser } from "react-icons/bi";
import ChapterUpdate, { ChapterUpdateProps } from "./ChapterUpdate";

export interface LatestChaptersProps {
    chapters: ChapterUpdateProps[];
    title?: string;
}

const chunkArray = (array: any[], chunkSize: number) =>
    Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
        array.slice(i * chunkSize, (i + 1) * chunkSize)
    );


const LatestChapters: React.FC<LatestChaptersProps> = ({
    chapters,
    title = 'Latest Updates'
}) => {

    const chunkSize = 5;
    const chapterChunks = chunkArray(chapters, chunkSize);


    return (
        <div className="flex flex-col p-4 gap-2">
            <span className="font-bold text-2xl">{title}</span>
            <div className="flex gap-5">
                {
                    chapterChunks.map((chunk, chunkIndex) => (
                        <div key={chunkIndex} className="flex flex-col bg-gray-400 rounded-md p-3 gap-2">
                            {chunk.map((item, index) => (
                                <ChapterUpdate key={index} {...item} />
                            ))}
                        </div>
                    ))
                }
            </div>

        </div>
    );
};

export default LatestChapters;
