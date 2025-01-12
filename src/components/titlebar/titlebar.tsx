"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import WinLikeIcons from "./manageIcons/winlike";
import { openProjectFile } from "@/services/fileManager";
import { setFileContent, setFilePath } from "@/redux/slices/projectFile";

interface ItemProps {
    onClick: () => void;
    text: string;
}

function Item(props: ItemProps) {
    return (
        <div className="bg-clientColors-button-background hover:bg-clientColors-button-hover active:bg-clientColors-button-active text-sm px-2 rounded-md cursor-pointer" onClick={props.onClick}>
            {props.text}
        </div>
    )
}


export default function TitleBar() {
    const title = useSelector((state: RootState) => state.windowProperties.title);
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


    return (
        <div data-tauri-drag-region className="w-full h-8">
            <div data-tauri-drag-region className="grid grid-cols-3 gap-4">
                <div data-tauri-drag-region className="flex items-center px-1 gap-1">
                    <Item onClick={openFile} text="Open File" />
                </div>
                <div data-tauri-drag-region className="flex items-center justify-center">
                    {title}
                </div>
                <div data-tauri-drag-region className="text-end flex items-center justify-end">
                    <WinLikeIcons />
                </div>
            </div>
        </div>
    );
}