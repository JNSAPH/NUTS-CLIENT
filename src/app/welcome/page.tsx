"use client";

import React, { useEffect } from "react";
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import Image from "next/image";
import { Button } from "@/components/ui/button";


export default function WelcomePage() {
  const window = getCurrentWindow();

  useEffect(() => {
    async function setupWindow() {
      await window.setTitle("Welcome to Nuts Client");
      await window.setSize(new LogicalSize(300, 440));
      await window.setResizable(true);
      await window.center();
    }

    setupWindow();
  }, []);

  return (
    <div data-tauri-drag-region className="bg-orbit-background h-full w-full flex items-center justify-center">
      <Image src="/logo_color.svg" alt="Nuts Client Logo" width={122} height={103} />
      <Button className="absolute bottom-10" onClick={() => {}} >Get Started</Button>
    </div>
  );
}