export interface ClientSettings {
    hideUpdateNotifications: boolean;
    defaultNATSURL: string;
    showReduxDevTools: boolean;
    useMonacoEditor: boolean;
    monacoEditorLanguage?: monacoEditorLanguageType;
    defaultTimeout: number;
}

export type monacoEditorLanguageType = "json" | "yaml" | "text";
export const monacoEditorLanguages: monacoEditorLanguageType[] = ["json", "yaml", "text"];