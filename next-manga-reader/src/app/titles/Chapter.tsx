'use client';
import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Button from '@/common/Button';
import { BiComment, BiUser } from 'react-icons/bi';
import Link from 'next/link';
import { TITLES } from '@/common/constants/titles';
import { BsClock, BsEye } from 'react-icons/bs';

export interface ChapterUpdateProps {
    volume?: number;
    chapterNumber: number;
    scanName: string;
    date: string;
}

const ChapterItem: React.FC<ChapterUpdateProps> = ({
    chapterNumber,
    date,
    scanName,
    volume,
}) => {
    return (
        <div className="flex w-full gap-2 min-w-64 max-w-[50rem] px-1 bg-gray-500">
            <div className="flex flex-col w-full">
                <Link href={`/chapters/${chapterNumber}`}>
                    {volume && `Vol. ${volume}`} Ch. {chapterNumber}
                </Link>

                <div className="flex gap-1 items-center">
                    <BiUser />
                    <span>{scanName}</span>
                </div>
            </div>
            <div className="flex gap-4">
                <div>
                    <div className="flex w-min justify-center items-center">
                        <Button
                            icon={<BsClock />}
                            size="x-small"
                            handleClick={() => {
                                console.log('click');
                            }}
                        />
                        <span className="text-xs w-max">{date}</span>
                    </div>
                    <div className="flex w-min justify-center items-center">
                        <Button
                            icon={<BiUser />}
                            size="x-small"
                            handleClick={() => {
                                console.log('click');
                            }}
                        />
                        <span className="text-xs w-min">{scanName}</span>
                    </div>
                </div>
                <div>
                    <div className="flex w-min justify-center items-center">
                        <Button
                            icon={<BsEye />}
                            size="x-small"
                            handleClick={() => {
                                console.log('click');
                            }}
                        />
                        <span className="text-xs w-max">N/A</span>
                    </div>

                    <Button
                        prependIcon={<BiComment />}
                        size="x-small"
                        handleClick={() => {
                            console.log('click');
                        }}
                        text={'6'}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChapterItem;
