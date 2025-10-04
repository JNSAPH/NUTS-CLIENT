import { setFileContent, setFilePath, setUnsavedChanges } from '@/redux/slices/projectFile';
import { AppDispatch } from '@/redux/store';
import { createProjectFile, openProjectFile } from '@/services/fileManager';
import { getCurrentWindow } from '@tauri-apps/api/window';

/**
 * Close the window.
 */
export async function closeWindow() {
    await getCurrentWindow().close();
}

/**
 * Minimize the window.
 */ 
export async function minimizeWindow() {
    await getCurrentWindow().minimize();
}

/**
 * Maximize the window if it is not maximized, otherwise unmaximize it.
 */
export async function maximizeWindow() {
    if (await getCurrentWindow().isMaximized()) {
        await getCurrentWindow().unmaximize();
    } else {
        await getCurrentWindow().maximize();
    }
}

/** Handler Opening a project file from the welcome page */
export async function handleOpenProject(dispatch: AppDispatch) {
  const result = await openProjectFile();

  if (result === "ERROR") {
    // On Error, stay on welcome page
    return;
  }

  if (result !== "CANCELED") {
    const [filePath, fileContent] = result;
    dispatch(setFileContent(fileContent));
    dispatch(setFilePath(filePath));
    dispatch(setUnsavedChanges(false));
  }
}

export async function handleNewProject(dispatch: AppDispatch) {
  const result = await createProjectFile();

  if (result === 'ERROR' || result === 'CANCELED') return;

  const [filePath, fileContent] = result;
  dispatch(setFileContent(fileContent));
  dispatch(setFilePath(filePath));
  dispatch(setUnsavedChanges(false));
}

