"use client";

import { useEffect, useState } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { useRouter } from "next/navigation";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import Logger from "@/services/logging";
import { isUpdateAvailable } from "@/services/updateCheck";
import { useDispatch, useSelector } from "react-redux";
import {
  setLastSeenVersion,
  setUpdateInfo,
} from "@/redux/slices/windowProperties";
import { RootState } from "@/redux/store";

const LoadingMessages = [
  "Sending hamsters to power the app...",
  "Reticulating splines...",
  "Calculating the meaning of life...",
  "Generating witty dialog...",
  "Spinning up the flux capacitor...",
  "Committing Tax Fraud...",
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
];

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const lastSeenVersion = useSelector(
    (state: RootState) => state.windowProperties.lastSeenVersion
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function startClient() {
      const tauriWindow = getCurrentWindow();
      Logger.info("Starting client...");

      // Setup window
      await tauriWindow.setTitle("Loading Orbit...");
      await tauriWindow.setSize(new LogicalSize(300, 400));
      await tauriWindow.setResizable(false);
      await tauriWindow.center();

      // Check for updates
      const update = await isUpdateAvailable();
      if (update) {
        Logger.info(`Update available: ${update.old_version} -> ${update.tag_name}`);
        Logger.info(`Release: ${update.name}`);
        dispatch(setUpdateInfo(update));
      } else {
        dispatch(setUpdateInfo(null));
      }

      // Compare versions BEFORE updating lastSeenVersion
      if (
        update &&
        lastSeenVersion !== "0.0.0" &&
        lastSeenVersion !== update.old_version
      ) {
        // User Updated the app
        Logger.info(`User has updated from version ${lastSeenVersion} to ${update.old_version}`);

        // Open Changelog page
        const w = new WebviewWindow("my-new-window", {
          url: "/changelog",
          width: 800,
          height: 600,
          title: "Orbit - Changelog",
        });

        // you can listen to creation or errors
        w.once("tauri://created", () => {
          Logger.info("changelog window created");
        });
        w.once("tauri://error", (e) => {
          Logger.error("error creating window:", e);
        });
      }

      // Update last seen version
      dispatch(setLastSeenVersion(update ? update.old_version : "0.0.0"));

      // Wait briefly
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Done loading
      setIsLoading(false);
      router.push("/welcome");
    }

    startClient();
  }, [dispatch, lastSeenVersion, router]);

  if (isLoading) {
    return (
      <div
        className="bg-orbit-night h-full w-full flex flex-col items-center justify-center"
        data-tauri-drag-region
      >
        <p>Yeah this is a loading screen</p>
        <br />
        <p>{LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)]}</p>
      </div>
    );
  }

  return null;
}
