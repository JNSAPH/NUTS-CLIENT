"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import WinLikeIcons from "./manageIcons/winlike";
import { openProjectFile, saveProjectFile } from "@/services/fileManager";
import { setFileContent, setFilePath } from "@/redux/slices/projectFile";

interface ItemProps {
    onClick: () => void;
    disabled?: boolean;
    text: string;
}

function Item(props: ItemProps) {
    const enabled = "bg-clientColors-button-background hover:bg-clientColors-button-hover active:bg-clientColors-button-active text-sm px-2 rounded-md cursor-pointer";
    const disabled = "bg-clientColors-button-background text-sm px-2 rounded-md opacity-50 pointer-events-none";

    return (
        <div className={`${props.disabled ? disabled : enabled}`} onClick={props.onClick}>
            {props.text}
        </div>
    )
}


export default function TitleBar() {
    const state = useSelector((state: RootState) => state);
    const dispatch = useDispatch();

    async function openFile() {
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

    async function saveFile() {
        await saveProjectFile(
            state.projectFile.fileContent!,
            state.projectFile.filePath!
        );
    }


    return (
        <div data-tauri-drag-region className="w-full h-8  z-50">
            <div data-tauri-drag-region className="grid grid-cols-3 gap-4">
                <div data-tauri-drag-region className="flex items-center px-1 gap-1">
                    <Item onClick={openFile} text="Open File" />
                    <Item onClick={saveFile} text="Save File" disabled={!state.projectFile.unsavedChanges}/>
                </div>
                <div data-tauri-drag-region className="flex items-center justify-center">
                    {state.windowProperties.title}
                </div>
                <div data-tauri-drag-region className="text-end flex items-center justify-end">
                    <WinLikeIcons />
                </div>
            </div>
        </div>
    );
}