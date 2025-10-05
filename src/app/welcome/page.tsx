"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { getVersion } from "@tauri-apps/api/app";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { handleNewProject, handleOpenProject } from "@/components/titlebar/utils";

export default function WelcomePage() {
  const win = useMemo(() => getCurrentWindow(), []);
  const dispatch = useDispatch();
  const router = useRouter();

  const [version, setVersion] = useState<string | null>(null);
  const [busy, setBusy] = useState<"new" | "open" | null>(null);

  useEffect(() => {
    (async () => {
      // Window setup
      await win.setTitle("Welcome to Orbit");
      await win.setSize(new LogicalSize(430, 500));
      await win.setResizable(false);
      await win.center();

      // Get app version from Tauri
      try {
        const v = await getVersion();
        setVersion(v);
      } catch {
        setVersion("unknown");
      }
    })();

    // Keyboard shortcuts: Ctrl/Cmd+N and Ctrl/Cmd+O, Esc to exit
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        void onNewProject();
      } else if (mod && (e.key === "o" || e.key === "O")) {
        e.preventDefault();
        void onOpenProject();
      } else if (e.key === "Escape") {
        e.preventDefault();
        void win.close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function goToExplorer() {
    await win.setResizable(true);
    await win.setSize(new LogicalSize(1000, 600));
    router.push("/client/explorer");
  }

  async function onNewProject() {
    try {
      setBusy("new");
      let success = await handleNewProject(dispatch);
      if (success) await goToExplorer();
    } finally {
      setBusy(null);
    }
  }

  async function onOpenProject() {
    try {
      setBusy("open");
      let success = await handleOpenProject(dispatch);
      if (success) await goToExplorer();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="h-screen w-screen" data-tauri-drag-region>
      <div className="flex h-full w-full flex-col items-center justify-center" data-tauri-drag-region>
        <div className="w-full rounded-2xl  p-6 shadow-sm absolute h-full flex flex-col justify-between">
          <div className="flex flex-col items-center text-center space-y-4 mt-10">
            <Image
              src="/logo_color.svg"
              alt="Orbit Client Logo"
              width={96}
              height={96}
              className="select-none pointer-events-none"
              priority
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome to Orbit</h1>
              <p className="text-sm text-muted-foreground">
                Create a new project or open an existing one to get started.
              </p>
            </div>

            {version && (
              <span
                aria-label={`Version ${version}`}
                className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                v{version}
              </span>
            )}

            <div className="mt-2 w-full space-y-2">
              <Button
                className="w-full"
                onClick={onNewProject}
                disabled={busy !== null}
              >
                {busy === "new" ? "Creating…" : "New Project"}
                <kbd className="ml-2 hidden rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                  ⌘/CTRL + N
                </kbd>
              </Button>

              <Button
                className="w-full"
                variant="secondary"
                onClick={onOpenProject}
                disabled={busy !== null}
              >
                {busy === "open" ? "Opening…" : "Open Existing Project"}
                <kbd className="ml-2 hidden rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                  ⌘/CTRL + O
                </kbd>
              </Button>

              <Button
                className="w-full"
                variant="ghost"
                onClick={async () => {
                  await win.close();
                }}
              >
                Exit
                <kbd className="ml-2 hidden rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                  Esc
                </kbd>
              </Button>
            </div>
          </div>

          <div className="bottom-6 flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">© {new Date().getFullYear()} oOVOLabs</span>
            <span className="truncate">
              Built with ❤️ by aph@oOVOLabs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
