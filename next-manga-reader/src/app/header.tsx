'use client'
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Button from "@/common/Button";
import { BiComment, BiUser } from "react-icons/bi";
import TextField from "@/common/TextField";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Link from "next/link";
import SearchField from "@/common/SearchField";

export interface HeaderProps {

}

const Header: React.FC<HeaderProps> = ({

}) => {

    return (
        <div className="flex w-full justify-between items-center bg-gray-800 gap-2 px-4 py-2">
            <Link href={'/'}>Manga</Link>
            <div className="flex gap-2">
                <SearchField name="search" />
                <Button
                    icon={<BiUser color={"#fff"} />}
                    size="large"
                    outlined
                    handleClick={() => {
                        console.log("click");
                    }}
                />
            </div>
        </div>
    );
};

export default Header;
