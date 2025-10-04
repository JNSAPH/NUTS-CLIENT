"use client";

import { useEffect, useState } from "react";
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { redirect } from 'next/navigation'
import Logger from "@/services/logging";
import { isUpdateAvailable } from "@/services/updateCheck";
import { useDispatch } from "react-redux";
import { setSelectedTab, setUpdateInfo } from "@/redux/slices/windowProperties";

const LoadingMessages = [
  "Sending hamsters to power the app...",
  "Reticulating splines...",
  "Calculating the meaning of life...",
  "Generating witty dialog...",
  "Spinning up the flux capacitor...",
  "Commiting Tax Fraud...",
  "Debugging the debugger...",
  "Searching for the lost city of Atlantis...",
  "Charging the warp drive...",
  "You should try Satisfactory sometime...",
  "Dividing by zero...",
  "Herding cats...",
  "Aligning bits...",
  "Optimizing the optimizer...",
  "Feeding the server gremlins...",
  "Waiting for the code to compile...",
  "Counting to infinity...",
  "Polishing the user interface...",
]

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
      
      // Redirect to welcome section
      await setIsLoading(false);
      redirect("/welcome");
    }

    startClient();
  }, [])

  if (isLoading) {
    return (
      <div className="bg-orbit-background h-full w-full flex flex-col items-center justify-center" data-tauri-drag-region>
        <p>Yeah this is a loading screen</p>
        <br/>
        <p>{LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)]}</p>
      </div>
    );
  }
}
