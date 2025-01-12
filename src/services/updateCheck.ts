import { isUpdateAvailableResponse, UpdateCheckResponse } from "@/types/UpdateStuff";
import Logger from "./logging";

const packageJSON = require("../../package.json");

export async function isUpdateAvailable(): Promise<false | isUpdateAvailableResponse> {
    const name = packageJSON.name;
    const author = packageJSON.author;
    const version = packageJSON.version;
    
    const response = await fetch(`https://api.github.com/repos/${author}/${name}/releases/latest`);
    const data: UpdateCheckResponse = await response.json();

    if (data.tag_name !== version) {
        return {
            old_version: version,
            tag_name: data.tag_name,
            name: data.name,
            html_url: data.html_url,
            published_at: data.published_at
        }
    }
    
    return false 
}

""