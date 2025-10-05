import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-orbit-night h-full w-full flex flex-col items-center justify-center" data-tauri-drag-region>
        {children}
        </div>
    )
};

export default Layout;