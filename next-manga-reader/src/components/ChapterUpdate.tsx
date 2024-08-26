'use client'
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Button from "./Button";
import { BiComment, BiUser } from "react-icons/bi";

export interface ChapterUpdateProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mangaTitle: string;
  volume?: string;
  coverUrl?: string;
  chapterNumber: number;
  chapterTitle?: string;
  scanName: string;
  date: string;
}

const ChapterUpdate: React.FC<ChapterUpdateProps> = ({
  chapterNumber,
  date,
  chapterTitle,
  mangaTitle,
  scanName,
  coverUrl,
  volume,
}) => {

  return (
    <div className="flex gap-2">
      {coverUrl && <Image className="rounded-lg" src={coverUrl || ""} width={56} height={80} alt={mangaTitle} />}
      <div className="flex flex-col">
        <span className="font-bold">{mangaTitle}</span>
        <span>
          {volume && `Vol. ${volume}`} Ch. {chapterNumber}
        </span>
        <div className="flex gap-1 items-center">
          <BiUser /><span>{scanName}</span>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <Button icon={<BiComment />} size="x-small" handleClick={() => { console.log('click') }} />
        <span className="text-xs text-gray-600">5 min</span>
      </div>

    </div>
  );
};

export default ChapterUpdate;
