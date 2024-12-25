import { saveProjectFile } from '@/services/fileManager';
import { ProjectFile } from '@/types/ProjectFile';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectFileState {
    filePath: string | null;
    fileContent: ProjectFile | null;
    
    selectedRequestIndex: number;
}

const initialState: ProjectFileState = {
    filePath: null,
    fileContent: null,
    selectedRequestIndex: -1,
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
                state.fileContent = action.payload;
            } else {
                state.fileContent = action.payload;
                saveProjectFile(action.payload, state.filePath!);
            }
        },
        setSelectedRequestIndex: (state, action: PayloadAction<number>) => {
            state.selectedRequestIndex = action.payload;
        },
        setLastResponse: (state, action: PayloadAction<string>) => {
            if (state.fileContent) {
                state.fileContent.requests[state.selectedRequestIndex].lastResponse = action.payload;
            }
        }
    },
});

export const { setFilePath, setFileContent, setSelectedRequestIndex, setLastResponse } = projectFileSlice.actions;
export default projectFileSlice.reducer;
