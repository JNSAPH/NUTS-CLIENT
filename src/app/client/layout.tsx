import SideBar from "@/components/sidebar/sidebar";
import TitleBar from "@/components/titlebar/titlebar";
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-clientColors-windowBackground h-full w-screen p-0 flex flex-col">
      {/* Title bar takes its natural height */}
      <TitleBar />

      {/* Main area fills remaining height */}
      <div className="flex flex-1 w-full overflow-y-auto">
        <SideBar />
        <div className="w-full border-l-2 border-t-2 border-clientColors-windowBorder overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};


export default Layout;
