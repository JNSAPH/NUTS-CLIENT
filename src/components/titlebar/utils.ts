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
