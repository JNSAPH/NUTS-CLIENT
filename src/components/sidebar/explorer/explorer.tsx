"use client";

import { IcoBin, IcoPlusBorder } from '@/components/Icons';
import { ask } from '@tauri-apps/plugin-dialog';
import { setFileContent, setFilePath, setSelectedRequestIndex, setUnsavedChanges } from '@/redux/slices/projectFile';
import { RootState } from '@/redux/store';
import { createProjectFile, openProjectFile } from '@/services/fileManager';
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';

interface SidebarItemProps {
    name: string;
    index: number;
    active?: boolean;
}

function SidebarItem(params: SidebarItemProps) {
    const dispatch = useDispatch();
    const content = useSelector((state: RootState) => state.projectFile);

    // State to track edit mode and input value
    const [isEditing, setIsEditing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(params.name);

    async function removeRequest() {
        if (content.fileContent) {
            const answer = await ask('This action cannot be reverted. Are you sure?', {
                title: 'Delete Request',
                kind: 'warning',
            });

            if (!answer) return;

            dispatch(setFileContent({
                ...content.fileContent,
                requests: content.fileContent.requests.filter((_, index) => index !== params.index),
            }));
        }
    }

    async function cloneRequest() {
        if (content.fileContent) {
            dispatch(setFileContent({
                ...content.fileContent,
                requests: [
                    ...content.fileContent.requests,
                    content.fileContent.requests[params.index],
                ],
            }));
        }
    }

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const selectedRequest = useSelector((state: RootState) => state.projectFile.fileContent?.requests[state.projectFile.selectedRequestIndex]);

    const handleInputBlur = () => {
        setIsEditing(false);
        if (selectedRequest && content.fileContent) {
            if (inputValue.trim()) {
                dispatch(
                    setFileContent({
                        ...content.fileContent,
                        requests: content.fileContent.requests.map((request, index) => {
                            if (index === content.selectedRequestIndex) {
                                return {
                                    ...selectedRequest,
                                    name: inputValue,
                                };
                            }
                            return request;
                        }),
                    })
                );
            }

        } else {
            setInputValue(params.name); // Revert to original name if input is empty
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputBlur(); // Save changes on Enter key
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
            <div
                className={`flex items-center space-x-2 p-1 rounded-md hover:bg-clientColors-card-background transition-all justify-between cursor-pointer ${params.active ? "bg-clientColors-card-background" : ""}`}
                onClick={() => dispatch(setSelectedRequestIndex(params.index))}>
                {isEditing ? (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        autoFocus
                        className="bg-clientColors-card-background border text-sm border-clientColors-card-border w-full"
                    />
                ) : (
                    <p onDoubleClick={handleDoubleClick} className='text-sm'>{params.name}</p>
                )}
                {params.active ? (
                    <div className='flex space-x-2' onClick={removeRequest}>
                        
                    </div>
                ) : null}
            </div>
            </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuItem onClick={() => cloneRequest()}>
                        Clone Request
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => setIsEditing(true)}>
                        Rename Request
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem className='text-red-500 space-x-2 focus:bg-[#1e0a0a]' onClick={removeRequest}>
                        <p>Delete Request</p>
                    </ContextMenuItem>
                </ContextMenuContent>
        </ContextMenu>
    );
}


export default function ExplorerSideBar() {
    const content = useSelector((state: RootState) => state.projectFile);
    const settings = useSelector((state: RootState) => state.windowProperties.clientSettings);
    const [isEditingProjectName, setIsEditingProjectName] = React.useState(false);
    const [projectNameInput, setProjectNameInput] = React.useState(content.fileContent?.name || "");
    const dispatch = useDispatch();

    // Open a file
    async function openFile() {
        const result = await openProjectFile();

        if (result === "ERROR") {
            dispatch(setFileContent(null));
            dispatch(setFilePath(null));
        } else if (result !== "CANCELED") {
            const [filePath, fileContent] = result;
            dispatch(setFileContent(fileContent));
            dispatch(setFilePath(filePath));
            dispatch(setUnsavedChanges(false)); // Opening a file doesn't change the file content
        }
    }

    // Create a new file
    async function createNewFile() {
        const result = await createProjectFile();
        if (result !== "ERROR" && result !== "CANCELED") {
            const [filePath, fileContent] = result;
            dispatch(setFileContent(fileContent));
            dispatch(setFilePath(filePath));
        }
    }

    const handleDoubleClick = () => {
        setIsEditingProjectName(true);
    };

    const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectNameInput(e.target.value);
    };

    const handleProjectNameBlur = () => {
        setIsEditingProjectName(false);
        if (projectNameInput.trim() && projectNameInput !== content.fileContent?.name) {
            // Update the project name in the Redux store
            if (content.fileContent) {
                dispatch(
                    setFileContent({
                        ...content.fileContent,
                        name: projectNameInput || "",
                    })
                );
            }

        } else {
            setProjectNameInput(content.fileContent?.name || ""); // Revert to the original name
        }
    };

    const handleProjectNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleProjectNameBlur(); // Save changes on Enter key
        }
    };

    async function addNewRequest() {
        if (content.fileContent) {
            await dispatch(setFileContent({
                ...content.fileContent,
                requests: [
                    ...content.fileContent.requests,
                    {
                        name: "Untitled Request",
                        url: settings.defaultNATSURL,
                        data: "",
                        topic: "",
                        authentication: {
                            type: 'NONE'
                        }
                    },
                ],
            }));
            await dispatch(setSelectedRequestIndex(content.fileContent.requests.length));
        }
    }

    return (
        <div className="h-full w-full border-r-2 border-clientColors-windowBorder overflow-auto space-y-[2px] p-2">
            {content.filePath ? (
                <>
                    <div className="flex justify-between items-center">
                        {isEditingProjectName ? (
                            <input
                                type="text"
                                value={projectNameInput}
                                onChange={handleProjectNameChange}
                                onBlur={handleProjectNameBlur}
                                onKeyDown={handleProjectNameKeyDown}
                                autoFocus
                                className="bg-clientColors-card-background border border-clientColors-card-border w-full mr-2"
                            />
                        ) : (
                            <p
                                onDoubleClick={handleDoubleClick}
                                className="font-bold cursor-pointer"
                            >
                                {content.fileContent?.name}
                            </p>
                        )}
                        <div
                            className="transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            onClick={addNewRequest}
                        >
                            <IcoPlusBorder size={18} />
                        </div>
                    </div>
                    {content.fileContent?.requests.map((request, index) => (
                        <SidebarItem
                            key={index}
                            name={request.name}
                            index={index}
                            active={content.selectedRequestIndex == index}
                        />
                    ))}
                </>
            ) : (
                <div>
                    <pre className="text-red-500 text-center pt-2">No file selected</pre>
                    <button
                        onClick={openFile}
                        className="bg-clientColors-button-background hover:bg-clientColors-button-hover active:bg-clientColors-button-active text-white p-2 rounded-md w-full mt-2"
                    >
                        Open a file
                    </button>
                    <button
                        onClick={createNewFile}
                        className="bg-clientColors-button-background hover:bg-clientColors-button-hover active:bg-clientColors-button-active text-white p-2 rounded-md w-full mt-2"
                    >
                        Create new File
                    </button>
                </div>
            )}
        </div>
    );
}
