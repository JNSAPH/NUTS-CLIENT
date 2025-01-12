"use client";

import { IcoBin, IcoPlusBorder } from '@/components/Icons';
import { ask } from '@tauri-apps/plugin-dialog';
import { setFileContent, setFilePath, setSelectedRequestIndex } from '@/redux/slices/projectFile';
import { RootState } from '@/redux/store';
import { openProjectFile } from '@/services/fileManager';
import React from 'react';
import { useDispatch, useSelector } from "react-redux";

interface SidebarItemProps {
    name: string;
    index: number;
    active?: boolean;
}

function SidebarItem(params: SidebarItemProps) {
    const dispatch = useDispatch();
    const content = useSelector((state: RootState) => state.projectFile);

    async function removeRequest() {
        if (content.fileContent) {
            const answer = await ask('This action cannot be reverted. Are you sure?', {
                title: 'Delete Request',
                kind: 'warning',
            });

            // If the user cancels the operation, return
            if (!answer) return;

            dispatch(setFileContent({
                ...content.fileContent,
                requests: content.fileContent.requests.filter((_, index) => index !== params.index),
            }));
        }
    }

    return (
        <div className={`flex items-center space-x-2 p-1 rounded-md hover:bg-clientColors-card-background transition-all justify-between cursor-pointer ${params.active ? "bg-clientColors-card-background" : ""}`} onClick={() => dispatch(setSelectedRequestIndex(params.index))}>
            <p>{params.name}</p>
            {params.active ? (
                <div className='flex space-x-2' onClick={removeRequest} >
                    <IcoBin size={18} color='#D8323D'/>
                </div>
            ) : null}
        </div>
    );
}

export default function ExplorerSideBar() {
    const content = useSelector((state: RootState) => state.projectFile);
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

    async function addNewRequest() {
        if (content.fileContent) {
            await dispatch(setFileContent({
                ...content.fileContent,
                requests: [
                    ...content.fileContent.requests,
                    {
                        name: "New Request",
                        url: "",
                        data: "",
                        topic: "",
                    },
                ],
            }));
            await dispatch(setSelectedRequestIndex(content.fileContent.requests.length));
        }
    }

    return (
        <div className='h-full w-full border-r-2 border-clientColors-windowBorder overflow-auto space-y-[2px] p-2'>
            {content.filePath ? (
                <>
                    <div className='flex justify-between items-center'>
                        <p className='font-bold'>{content.fileContent?.name}</p>
                        <div className='transition-all hover:scale-105 active:scale-95 cursor-pointer' onClick={addNewRequest}>
                            <IcoPlusBorder size={18} />
                        </div>
                    </div>
                    {content.fileContent?.requests.map((request, index) => (
                        <SidebarItem key={index} name={request.name} index={index} active={content.selectedRequestIndex == index} />
                    ))}
                </>
            ) : (
                <div>
                    <pre className='text-red-500 text-center pt-2'>No file selected</pre>
                    <button onClick={openFile} className='bg-clientColors-button-background hover:bg-clientColors-button-hover active:bg-clientColors-button-active text-white p-2 rounded-md w-full mt-2'>Open a file</button>
                </div>
            )}
        </div>
    );
}
