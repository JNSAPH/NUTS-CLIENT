"use client";

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
    await saveProjectFile(
      state.projectFile.fileContent!,
      state.projectFile.filePath!
    );
  }

  async function handleNewProject() {
    const result = await createProjectFile();
    if (result !== "ERROR" && result !== "CANCELED") {
      const [filePath, fileContent] = result;
      dispatch(setFileContent(fileContent));
      dispatch(setFilePath(filePath));
    }
  }

  return (
    <div data-tauri-drag-region className="w-full z-50">
      <div data-tauri-drag-region className="grid grid-cols-3">
        <div data-tauri-drag-region className="flex items-center gap-1">
          <div className="h-full w-[50px] flex items-center justify-center">
            <Image
              src="/logo_color.svg"
              alt="NUTS Icon"
              width={28}
              height={28}
              className="select-none pointer-events-none"
            />
          </div>
          <Menubar className="outline-none border-none ">
            <MenubarMenu>
              <MenubarTrigger className="bg-none">File</MenubarTrigger>
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
                  disabled={!state.projectFile.unsavedChanges}
                >
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
