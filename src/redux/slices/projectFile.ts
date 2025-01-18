import { saveProjectFile } from '@/services/fileManager';
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
        }
    },
});

export const { setFilePath, setFileContent, setSelectedRequestIndex, setLastResponse, setUnsavedChanges } = projectFileSlice.actions;
export default projectFileSlice.reducer;
