"use client";

import React, { useEffect } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { redirect } from "next/navigation";
import { handleNewProject, handleOpenProject } from "@/components/titlebar/utils";

export default function WelcomePage() {
  const window = getCurrentWindow();
  const dispatch = useDispatch();

  useEffect(() => {
    async function setupWindow() {
      await window.setTitle("Welcome to Orbit");
      await window.setSize(new LogicalSize(584, 440));
      await window.setResizable(true);
      await window.center();
    }

    setupWindow();
  }, []);


  async function redirectToExplorer() {
  await window.setResizable(true);
  await window.setSize(new LogicalSize(1000, 600));
  redirect('/client/explorer');
}


  return (
    <div>
      <div className="flex flex-col items-center space-y-10">
        <Image
          src="/logo_color.svg"
          alt="Orbit Client Logo"
          width={150}
          height={150}
          className="select-none pointer-events-none"
        />

        <div className="flex flex-col items-center space-y-3">
          <Button className="text-base rounded-md" onClick={async () => {
            await handleNewProject(dispatch)
            await redirectToExplorer()
          }}>
            New Project
          </Button>
          <Button className="text-base rounded-md" onClick={async () => {
            await handleOpenProject(dispatch)
            await redirectToExplorer()
          }}>
            Open existing Project
          </Button>
        </div>
      </div>
    </div>
  );
}
