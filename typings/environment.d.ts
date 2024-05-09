declare class LOCALE_LOGGER {
    private static session_id;
    static info(...data: any[]): void;
    static warn(...data: any[]): void;
    static error(...data: any[]): void;
    static success(...data: any[]): void;
    static raw(color: (str: string) => string, ...data: any[]): void;
    static msg(color: (str: string) => string, message: string): string;
}

declare class LOCALE_MODULE {
    ROOT_DIRECTORY: string;
    private EXCLUDING_FOLDERS;
    private EXCLUDING_VALUES;
    update(entries: string[], actions: string): void;
    search(filepath: string, data: string[]): Promise<void>;
    traverse(directory?: string): Promise<void>;
}

export { LOCALE_LOGGER, LOCALE_MODULE };
