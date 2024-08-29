"use client";
import type React from "react";
import Image from "next/image";

export interface TitleHeaderProps {
  title: string;
  authorsName: string;
  coverUrl?: string;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  coverUrl: possibleCoverUrl,
  authorsName,
}) => {
  const coverUrl = possibleCoverUrl || "https://picsum.photos/400/500";
  return (
    <div className="flex w-full bg-gradient-to-l from-transparent to-gray-800">
      {coverUrl && (
        <Image
          className="blur-sm brightness-125 -z-20"
          src={coverUrl || ""}
          alt={title}
          fill
        />
      )}
      <div className="flex w-full py-4 px-6 gap-4">
        {coverUrl && (
          <div className="flex relative grow h-80 min-w-20">
            <Image
              className="rounded-lg "
              src={coverUrl || ""}
              alt={title}
              fill
            />
          </div>
        )}
        <div className="flex flex-col py-2 grow items-start text-white gap-4">
          <span
            className="font-bold text-5xl leading-tight break-words"
            style={{ textShadow: "rgba(0, 0, 0, 0.3) 1px 2px 4px" }}
          >
            {title}
          </span>

          <span>{authorsName}</span>
        </div>
      </div>
    </div>
  );
};

export default TitleHeader;
