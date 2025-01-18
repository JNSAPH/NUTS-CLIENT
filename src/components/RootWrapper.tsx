"use client";

import React, { useEffect, useRef } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, persistor, RootState } from '@/redux/store';
import { ReactNode } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import Logger from '@/services/logging';
import { saveProjectFile } from '@/services/fileManager';
import { UnlistenFn } from '@tauri-apps/api/event';
import ReduxDevTool from './devtools/reduxTool';

function App({ children }: { children: ReactNode }) {
    const state = useSelector((state: RootState) => state);
    const unlistenRef = useRef<Promise<UnlistenFn> | null>(null);

    useEffect(() => {
        // Only set up the event listener once when the component mounts
        const setupCloseHandler = async () => {
            unlistenRef.current = getCurrentWindow().onCloseRequested(async (e) => {
                const currentState = store.getState();
                if (currentState.projectFile.unsavedChanges) {
                    // Unsaved changes detected. Prompt user to confirm exit
                    Logger.info("RootWrapper", "Unsaved changes detected. Prompting user to confirm exit.");
                    const answer = await confirm("You have unsaved changes. Do you want to save before exiting?");
                    if (answer) {
                        // Save changes and close window
                        Logger.info("RootWrapper", "User chose to save changes. Saving changes and closing window.");
                        let result = await saveProjectFile(
                            currentState.projectFile.fileContent!, 
                            currentState.projectFile.filePath!
                        );

                        if (result === "ERROR") {
                            // Error saving file. Abort window close
                            Logger.error("RootWrapper", "Error saving file. Aborting window close.");
                            e.preventDefault();
                        } else {
                            // File saved successfully. Close window
                            getCurrentWindow().close();
                        }

                        getCurrentWindow().close();
                    } else {
                        // Discard changes and close window
                        Logger.info("RootWrapper", "User chose to discard changes. Closing window.");
                    }
                }
            });
        };

        setupCloseHandler();

        // Cleanup function
        return () => {
            if (unlistenRef.current) {
                unlistenRef.current.then(unlisten => unlisten());
            }
        };
    }, []);

    return (
        <>
            <ReduxDevTool />
            {children}
        </>
    );
}

export default function RootWrapper({ children }: { children: ReactNode }) {
    return (
        <div className='select-none h-full w-full'>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App>
                        {children}
                    </App>
                </PersistGate>
            </Provider>
        </div>
    );
}