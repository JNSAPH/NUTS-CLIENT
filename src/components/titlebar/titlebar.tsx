"use client";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import WinLikeIcons from "./manageIcons/winlike";
import { createProjectFile, openProjectFile, saveProjectFile } from "@/services/fileManager";
import { setFileContent, setFilePath } from "@/redux/slices/projectFile";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarItem,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";

export default function TitleBar() {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const unsavedChanges = state.projectFile.unsavedChanges;
  const filePath = state.projectFile.filePath;
  const fileContent = state.projectFile.fileContent;

  async function handleOpenFile() {
    const result = await openProjectFile();

    if (result === "ERROR") {
      dispatch(setFileContent(null));
      dispatch(setFilePath(null));
    } else if (result !== "CANCELED") {
      const [filePath, fileContent] = result;
      dispatch(setFileContent(fileContent));
      dispatch(setFilePath(filePath));
    }
  }

  async function handleSaveFile() {
    if (!fileContent || !filePath) return;
    await saveProjectFile(fileContent, filePath);
  }

  async function handleNewProject() {
    const result = await createProjectFile();
    if (result !== "ERROR" && result !== "CANCELED") {
      const [filePath, fileContent] = result;
      dispatch(setFileContent(fileContent));
      dispatch(setFilePath(filePath));
    }
  }

  // Keyboard shortcuts: Ctrl/Cmd+N, Ctrl/Cmd+O, Ctrl/Cmd+S
  const onGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (!isMeta) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        const editable =
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          (target as HTMLElement).isContentEditable;

        // Do not trigger shortcuts while typing in inputs or contentEditable elements
        if (editable) return;
      }

      const key = e.key.toLowerCase();

      if (key === "s") {
        // Save Project
        if (unsavedChanges && filePath) {
          e.preventDefault();
          handleSaveFile();
        } else {
          // Even if there is nothing to save, prevent default browser "Save Page"
          e.preventDefault();
        }
      } else if (key === "o") {
        // Open Project
        e.preventDefault();
        handleOpenFile();
      } else if (key === "n") {
        // New Project
        e.preventDefault();
        handleNewProject();
      }
    },
    [unsavedChanges, filePath, fileContent] // handlers capture latest state
  );

  useEffect(() => {
    window.addEventListener("keydown", onGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", onGlobalKeyDown);
    };
  }, [onGlobalKeyDown]);

  return (
    <div data-tauri-drag-region className="w-full z-50">
      <div data-tauri-drag-region className="grid grid-cols-3">
        <div data-tauri-drag-region className="flex items-center gap-1">
          <div className="h-full w-[50px] flex items-center justify-center">
            <Image
              src="/logo_color.svg"
              alt="Orbit Icon"
              width={28}
              height={28}
              className="select-none pointer-events-none"
            />
          </div>
          <Menubar className="outline-none border-none ">
            <MenubarMenu>
              <MenubarTrigger className="bg-none">{unsavedChanges ? "● " : ""}File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={handleNewProject}>
                  New Project
                  <MenubarShortcut>Ctrl+N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={handleOpenFile}>
                  Open Project
                  <MenubarShortcut>Ctrl+O</MenubarShortcut>
                </MenubarItem>
                <MenubarItem
                  onClick={handleSaveFile}
                  disabled={!unsavedChanges || !filePath}
                >
                  {unsavedChanges ? "● " : ""}
                  Save Project
                  <MenubarShortcut>Ctrl+S</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div
          data-tauri-drag-region
          className="flex items-center justify-center"
        >
          {state.windowProperties.title}
        </div>
        <div
          data-tauri-drag-region
          className="text-end flex items-center justify-end"
        >
          <WinLikeIcons />
        </div>
      </div>
    </div>
  );
}
