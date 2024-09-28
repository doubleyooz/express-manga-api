'use client';
import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Button from '@/common/Button';
import { BiCog, BiComment, BiDroplet, BiUser } from 'react-icons/bi';
import TextField from '@/common/TextField';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Link from 'next/link';
import SearchField from '@/common/SearchField';
import Card from '@/common/Card';

export interface HeaderProps {}

const CardHeader: React.FC = () => {
    return (
        <div className="flex w-full mt-4 h-64">
            <Button
                prependIcon={<BiUser color={'#bbb'} />}
                size="flex"
                column
                handleClick={() => {
                    console.log('User');
                }}
                text="User"
            />
        </div>
    );
};

const CardContent: React.FC = () => {
    return (
        <div className="flex flex-col items-center px-2 gap-2 rounded-xl">
            <div className="flex items-center px-2 gap-2 rounded-xl">
                <Button
                    size="large"
                    prependIcon={<BiCog />}
                    handleClick={() => {
                        console.log('Settings');
                    }}
                    text="Settings"
                />
                <Button
                    size="large"
                    prependIcon={<BiDroplet />}
                    handleClick={() => {
                        console.log('Theme');
                    }}
                    text="Theme"
                />
            </div>
            <Button
                size="large"
                handleClick={() => {
                    console.log('Interface Language');
                }}
                text="Interface Language"
            />
            <Button
                size="large"
                handleClick={() => {
                    console.log('Chapters Language');
                }}
                text="Chapters Language"
            />
            <Button
                size="large"
                handleClick={() => {
                    console.log('Content Filter');
                }}
                text="Content Filter"
            />
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({}) => {
    const [showUserCard, setShowUserCard] = useState(false);

    return (
        <div className="flex w-full justify-between items-center bg-gray-800 gap-2 px-4 py-2">
            <Link href={'/'}>Manga</Link>
            <div className="flex relative gap-2">
                <SearchField name="search" />
                <Button
                    icon={<BiUser color={'#ddd'} />}
                    size="large"
                    outlined
                    handleClick={() => {
                        setShowUserCard(!showUserCard);
                    }}
                    hoverBrightness
                />
                {showUserCard && (
                    <div className="absolute top-16">
                        <Card
                            mainAction={() => {
                                console.log('Sign in');
                            }}
                            secondaryAction={() => {
                                console.log('Register');
                            }}
                            mainActionText="Sign In"
                            secondaryActionText="Register"
                            header={<CardHeader />}
                            content={<CardContent />}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
