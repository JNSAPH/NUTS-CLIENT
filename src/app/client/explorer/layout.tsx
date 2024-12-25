"use client";

import ExplorerSideBar from "@/components/sidebar/explorer/explorer";
import React, { useMemo } from "react";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const saveId = "explorersidebar";

    const ExplorerSidebar = useMemo(() => ({
        getItem(name: string): string | null {
            return localStorage.getItem(name);
        },
        setItem(name: string, value: string) {
            localStorage.setItem(name, value);
        },
    }), []);

    return (
        <div className="h-full w-full">
            <ResizablePanelGroup 
                autoSaveId={saveId} 
                direction="horizontal" 
                storage={ExplorerSidebar}
                className="h-full">
                <ResizablePanel 
                    collapsible={true} 
                    collapsedSize={0} 
                    minSize={10} 
                    defaultSize={20} 
                    className="relative h-full">
                    <div className="absolute inset-0">
                        <ExplorerSideBar />
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel className="relative h-full">
                    <div className="absolute inset-0">
                        {children}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default Layout;