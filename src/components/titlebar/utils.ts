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
export async function handleOpenProject(dispatch: AppDispatch): Promise<boolean> {
  // Try to open a project file
  const result = await openProjectFile();

  // If there was an error, stay on the welcome page
  if (result === "ERROR") return false;

  // If the user canceled, also stay on the welcome page
  if (result === "CANCELED") return false;

  // Otherwise, result contains [filePath, fileContent]
  const [filePath, fileContent] = result;
  dispatch(setFileContent(fileContent));
  dispatch(setFilePath(filePath));
  dispatch(setUnsavedChanges(false));
  return true;
}

export async function handleNewProject(dispatch: AppDispatch): Promise<boolean> {
  const result = await createProjectFile();

  if (result === 'ERROR' || result === 'CANCELED') return false;

  const [filePath, fileContent] = result;
  dispatch(setFileContent(fileContent));
  dispatch(setFilePath(filePath));
  dispatch(setUnsavedChanges(false));
  return true;
}

