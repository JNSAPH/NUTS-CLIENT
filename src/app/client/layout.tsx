import SideBar from "@/components/sidebar/sidebar";
import TitleBar from "@/components/titlebar/titlebar";
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

  return (
    <div className="bg-background h-full w-screen p-0 flex flex-col">
      <TitleBar />
      <div className="flex flex-1 w-full overflow-y-auto">
        <SideBar />
        <div className="w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};


export default Layout;
