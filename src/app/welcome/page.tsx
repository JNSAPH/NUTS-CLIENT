"use client";

import React, { useEffect } from "react";
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createProjectFile, openProjectFile } from '@/services/fileManager';
import { useDispatch } from "react-redux";
import { redirect } from 'next/navigation'
import {
  setFileContent,
  setFilePath,
  setSelectedRequestIndex,
  setUnsavedChanges,
} from '@/redux/slices/projectFile';


export default function WelcomePage() {
  const window = getCurrentWindow();
  const dispatch = useDispatch();

  useEffect(() => {
    async function setupWindow() {
      await window.setTitle("Welcome to Nuts Client");
      await window.setSize(new LogicalSize(300, 440));
      await window.setResizable(true);
      // await window.center();
    }

    setupWindow();
  }, []);

  async function handleNewProject() {
    const result = await createProjectFile();
      if (result !== "ERROR" && result !== "CANCELED") {
        const [filePath, fileContent] = result;
        dispatch(setFileContent(fileContent));
        dispatch(setFilePath(filePath));
        await redirectToExplorer();
      }
  }

  async function handleOpenProject() {
    const result =  await openProjectFile();
      if (result === "ERROR") {
        // On Error, stay on welcome page
      } else if (result !== "CANCELED") {
        // On Success, redirect to explorer with loaded file
        const [filePath, fileContent] = result;
        dispatch(setFileContent(fileContent));
        dispatch(setFilePath(filePath));
        dispatch(setUnsavedChanges(false));
        await redirectToExplorer();
      }
  }

  async function redirectToExplorer() {
    await window.setResizable(true);
    await window.setSize(new LogicalSize(1000, 600));
    await redirect("/client/explorer");
  }

 return (
    <div
      data-tauri-drag-region
      className="bg-orbit-background h-full w-full flex flex-col items-center justify-center"
    >
      {/* Logo */}
      <div className="flex flex-col items-center space-y-10">
        <Image
          src="/logo_color.svg"
          alt="Nuts Client Logo"
          width={150}
          height={150}
          className="select-none pointer-events-none"
        />

        {/* Buttons */}
        <div className="flex flex-col items-center space-y-3">
          <Button
            className="px-8 py-2 text-base rounded-md"
            onClick={handleNewProject}
          >
            New Project
          </Button>
          <Button
            className="px-12 py-2 text-base rounded-md"
            variant="default"
            onClick={handleOpenProject}
          >
            Open existing Project
          </Button>
        </div>
      </div>
    </div>
  )
}