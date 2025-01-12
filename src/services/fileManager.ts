import { open as openFileDialog, save as saveFileDialog } from '@tauri-apps/plugin-dialog';
import { exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import Logger from '@/services/logging';
import { ProjectFile } from '@/types/ProjectFile';

enum Event {
    CANCELED = "CANCELED",
    ERROR = "ERROR",
}

export async function openProjectFile(): Promise<[string, ProjectFile] | Event> {
    // Get the file path
    const filePath = await openFileDialog({
        multiple: false,
        directory: false,
    });

    if (filePath === null) {
        return Event.CANCELED;
    } else {
        Logger.info("openFile", "File selected: ", filePath);
    }

    try {

        // Check if the file exists
        const fileExists = await exists(filePath);

        if (!fileExists) {
            Logger.error("openFile", "The selected file does not exist");
            return Event.ERROR;
        }

        // Check if file is in the correct format
        const projectFile = await getProjectFileContent(filePath);
        if (projectFile === null) {
            Logger.error("openFile", "The selected file is not in the correct format");
            return Event.ERROR;
        }

        return [filePath, projectFile];
    } catch (error) {
        Logger.error("openFile", "Error opening file: ", error);
        return Event.ERROR;
    }
}

export async function createProjectFile(): Promise<[string, ProjectFile] | Event> {
    const filePath = await saveFileDialog({
        filters: [
            {
                name: "JSON",
                extensions: ["json"],
            },
        ]
    })

    if (filePath === null) {
        Logger.warning("createFile", "No file was selected");
        return Event.CANCELED;
    }

    try {
        writeTextFile(filePath, JSON.stringify({
            name: "New Project",
            requests: [],
        }, null, 2));

        return [filePath, {
            name: "New Project",
            requests: [],
        } as ProjectFile
        ]
    } catch (error) {
        Logger.error("createFile", "Error creating file: ", error);
        return Event.ERROR;
    }
}

export async function getProjectFileContent(filePath: string): Promise<ProjectFile | null> {
    try {
        const fileContent = await readTextFile(filePath);
        const projectFile = checkFileFormat(fileContent);
        return projectFile;
    } catch (error) {
        Logger.error("getFileContent", "Error getting file content: ", error);
        return null;
    }
}

export async function saveProjectFile(content: ProjectFile, filePath: string) {
    try {
        if (!filePath) { return; }

        content.requests = content.requests.map((request) => {
            delete request.lastResponse;
            return request;
        });

        await writeTextFile(filePath, JSON.stringify(content, null, 2));
        await getProjectFileContent(filePath); // This is for testing purposes


    } catch (error) {
        Logger.error("saveFile", "Error saving file: ", error);
    }
}

function checkFileFormat(fileContent: string): ProjectFile | null {
    try {
        const projectFile: ProjectFile = JSON.parse(fileContent);

        const requests = projectFile.requests

        // Top Level
        if (
            !projectFile.name
        ) throw new Error("Top level properties are missing");

        requests.forEach((request) => {
            if (
                request.name === undefined ||
                request.url === undefined ||
                request.topic === undefined ||
                request.data === undefined
            ) throw new Error("Request properties are missing");
        }
        );

        return projectFile;
    } catch (error) {
        Logger.error("checkFileFormat", "Error checking file format: ", error);
        return null;
    }
}
