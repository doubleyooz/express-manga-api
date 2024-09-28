'use client';
import type React from 'react';
import { Separator } from '@/components/ui/separator';
import TextField from '@/common/TextField';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Button from './Button';

export interface CardProps {
    mainActionText: string;
    secondaryActionText: string;
    mainAction: () => void;
    secondaryAction: () => void;
    header?: React.ReactNode;
    content?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
    mainActionText,
    secondaryActionText,
    mainAction,
    secondaryAction,
    content,
    header,
}) => {
    return (
        <div className="flex flex-col items-center p-2 gap-2 bg-gray-950 rounded-xl">
            {header && (
                <div className="flex flex-col items-center w-full px-2 gap-2 bg-gray-950 rounded-xl">
                    {header}
                    <Separator className="my-4" />
                </div>
            )}
            {content && (
                <div className="flex flex-col items-center w-full px-2 gap-2 bg-gray-950 rounded-xl ">
                    {content}
                    <Separator className="my-4" />
                </div>
            )}

            <div className="flex flex-col items-center p-2 gap-2 bg-gray-950 rounded-xl">
                <Button
                    size="large"
                    variant="primary"
                    outlined
                    handleClick={mainAction}
                    text={mainActionText}
                />
                <Button
                    size="large"
                    outlined
                    handleClick={secondaryAction}
                    text={secondaryActionText}
                />
            </div>
        </div>
    );
};

export default Card;
