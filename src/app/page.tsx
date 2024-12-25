"use client";

import { useEffect } from "react";
import { getCurrentWindow, LogicalSize, PhysicalSize } from '@tauri-apps/api/window';
import { redirect } from 'next/navigation'
import Logger from "@/services/logging";

const window = getCurrentWindow();

export default function Home() {
  useEffect(() => {
    async function startClient() {
      Logger.info("Starting client...");

      // Setup Window
      await window.setTitle("Loading Nuts...");
      await window.setSize(new LogicalSize(300, 400));
      await window.setResizable(false);
      await window.center();

      // Check for updates
      
      // Wait for 500 ms
      await new Promise((resolve) => setTimeout(resolve, 1500)); 

      // Reset some Stuff
      await window.setResizable(true);
      await window.setSize(new PhysicalSize(1000, 600));
      await window.center();

      // Redirect to explorer
      redirect("/client/explorer");
    }

    startClient();
  }, [])

  return (
    <div data-tauri-drag-region className="font-[family-name:var(--font-geist-sans)] h-full w-full flex flex-col space-y-8 items-center justify-center bg-clientColors-windowBackground border-2 border-clientColors-windowBorder rounded-lg">
      <span className="relative flex h-12 w-12">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clientColors-accentColor opacity-75"></span>
        <span className="relative inline-flex rounded-full h-full w-full bg-clientColors-accentColor"></span>
      </span>
      <p className="text-xl font-bold">Loading...</p>
    </div>
  );
}
