"use client";

import React from "react";
interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

    return (
        <div className="flex h-full w-full">
            {children}
        </div>
    );
}

export default Layout;
