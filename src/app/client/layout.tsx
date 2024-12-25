import SideBar from "@/components/sidebar/sidebar";
import TitleBar from "@/components/titlebar/titlebar";
import { getCurrentWindow } from "@tauri-apps/api/window";
import React, { useEffect } from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="bg-clientColors-windowBackground h-screen w-screen p-[0px]">
            <div className="bg-clientColors-windowBackground w-full h-full rounded-md flex flex-col">
                <TitleBar/>
                <div className="flex w-full h-full">
                    <SideBar />
                    <div className="w-full border-l-2 border-t-2 border-clientColors-windowBorder">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
