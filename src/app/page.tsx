"use client";

import { useEffect, useState } from "react";
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { redirect } from 'next/navigation'
import Logger from "@/services/logging";
import { isUpdateAvailable } from "@/services/updateCheck";
import { useDispatch, useSelector } from "react-redux";
import { setClientSettings, setSelectedTab, setUpdateInfo } from "@/redux/slices/windowProperties";
import { RootState } from "@/redux/store";

const window = getCurrentWindow();

export default function Home() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function startClient() {
      Logger.info("Starting client...");

      // Setup Window
      await window.setTitle("Loading Nuts...");
      await window.setSize(new LogicalSize(300, 400));
      await window.setResizable(false);
      await window.center();

      // Check for updates
      const update = await isUpdateAvailable();
      if (update) {
        Logger.info(`Update available: ${update.old_version} -> ${update.tag_name}`);
        Logger.info(`Release: ${update.name}`);
        dispatch(setUpdateInfo(update));
      } else {
        dispatch(setUpdateInfo(null));
      }

      // Wait for 500 ms
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset some Stuff
      await window.setResizable(true);
      await window.setSize(new LogicalSize(1000, 600));
      await window.center();
      await setIsLoading(false);

      // Redirect to explorer
      dispatch(setSelectedTab("explorer"));
      redirect("/client/explorer");
    }

    startClient();
  }, [])

  if (isLoading) {
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
}
