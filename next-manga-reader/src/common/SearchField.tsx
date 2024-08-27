"use client";
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Button from "@/common/Button";
import { BiComment, BiUser } from "react-icons/bi";
import TextField from "@/common/TextField";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Link from "next/link";

export interface SearchFieldProps {
    name: string;
}

const SearchField: React.FC<SearchFieldProps> = ({ name }) => {
    return (
        <div className="flex items-center px-2 gap-2 bg-gray-950 rounded-xl">
            <TextField name={name} icon={<FaMagnifyingGlass color={"#fff"} />} placeholder="Search" textColor="text-gray-200" noBorder />

        </div>
    );
};

export default SearchField;
