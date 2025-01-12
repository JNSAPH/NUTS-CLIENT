// not all properties, but the relevant ones
export interface UpdateCheckResponse {
    tag_name: string;
    name: string;
    html_url: string;
    published_at: string;
}

export interface isUpdateAvailableResponse extends UpdateCheckResponse {
    old_version: string;
}