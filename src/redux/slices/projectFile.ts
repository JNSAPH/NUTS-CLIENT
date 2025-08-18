import { saveProjectFile } from '@/services/fileManager';
import { AuthTypes } from '@/types/Auth';
import { ProjectFile } from '@/types/ProjectFile';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectFileState {
    filePath: string | null;
    fileContent: ProjectFile | null;

    selectedRequestIndex: number;

    unsavedChanges: boolean;
}

const initialState: ProjectFileState = {
    filePath: null,
    fileContent: null,
    selectedRequestIndex: -1,
    unsavedChanges: false,
};

const projectFileSlice = createSlice({
    name: 'projectFile',
    initialState,
    reducers: {
        setFilePath: (state, action: PayloadAction<string | null>) => {
            state.filePath = action.payload;
        },
        setFileContent: (state, action: PayloadAction<ProjectFile | null>) => {
            if (action.payload === null) {
                state.fileContent = null;
            } else {
                state.unsavedChanges = true;
                state.fileContent = action.payload;
            }
        },
        setSelectedRequestIndex: (state, action: PayloadAction<number>) => {
            state.selectedRequestIndex = action.payload;
        },
        setLastResponse: (state, action: PayloadAction<string>) => {
            if (state.fileContent) {
                state.fileContent.requests[state.selectedRequestIndex].lastResponse = action.payload;
            }
        },
        setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
            state.unsavedChanges = action.payload;
        },
        setNatsServerURL: (
            state,
            action: PayloadAction<string>
        ) => {
            if (state.fileContent) {
                const request = state.fileContent.requests[state.selectedRequestIndex];
                if (request) {
                    if (!request.authentication) {
                        request.authentication = { type: AuthTypes.NONE };
                    }
                    request.url = action.payload;
                    state.unsavedChanges = true;
                }
            }
        },
        setAuthenticationType: (
            state,
            action: PayloadAction<AuthTypes>
        ) => {
            if (state.fileContent) {
                const request = state.fileContent.requests[state.selectedRequestIndex];
                if (request) {
                    if (!request.authentication) {
                        request.authentication = { type: action.payload };
                    } else {
                        request.authentication.type = action.payload;
                    }
                    state.unsavedChanges = true;
                }
            }
        },
        // Auth methods
        setNATSToken: (
            state,
            action: PayloadAction<string>
        ) => {
            if (state.fileContent) {
                const request = state.fileContent.requests[state.selectedRequestIndex];
                if (request && request.authentication?.type === AuthTypes.TOKEN) {
                    request.authentication.token = action.payload;
                    state.unsavedChanges = true;
                }
            }
        },

        setUsernamePassword: (
            state,
            action: PayloadAction<{ username: string; password: string }>
        ) => { 
            if (state.fileContent) {
                const request = state.fileContent.requests[state.selectedRequestIndex];
                if (request && request.authentication?.type === AuthTypes.USERPASSWORD) {
                    request.authentication.usernamepassword = action.payload;
                    state.unsavedChanges = true;
                }
            }
        },

        setNKeys: (
            state,
            action: PayloadAction<{ jwt: string; seed: string }>
        ) => {
            if (state.fileContent) {
                const request = state.fileContent.requests[state.selectedRequestIndex];
                if (request && request.authentication?.type === AuthTypes.NKEYS) {
                    request.authentication.nkeys = action.payload;
                    state.unsavedChanges = true;
                }
            }    
        },
    }
});

export const { setFilePath, setFileContent, setSelectedRequestIndex, setLastResponse, setUnsavedChanges, setAuthenticationType, setNATSToken, setUsernamePassword, setNatsServerURL, setNKeys } = projectFileSlice.actions;
export default projectFileSlice.reducer;
