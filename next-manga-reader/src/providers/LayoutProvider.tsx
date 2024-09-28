'use client';

import { usePathname } from 'next/navigation';

import type React from 'react';
import { useEffect, useState } from 'react';

import Header from '@/app/header';

function LayoutProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = ['auth'].includes(pathname.split('/')[1]);

    const getNavbar = () => {
        if (isAuthRoute) return null;
        console.log(isAuthRoute);
        return <Header />;
    };

    return (
        <div className="min-h-screen w-full bg-secondary-50 flex flex-col justify-between">
            {getNavbar()}
            {children}
        </div>
    );
}

export default LayoutProvider;
