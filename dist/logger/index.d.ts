declare class logger {
    env: string;
    isOutputToConsole: boolean;
    isOutputToFile: boolean;
    outputFilename: string;
    openFd: number;
    openFilename: string;
    filter: number;
    static isOutputToConsole: boolean;
    static isOutputToFile: boolean;
    static outputFilename: string;
    static TRACE: number;
    static DEBUG: number;
    static INFO: number;
    static WARN: number;
    static ERROR: number;
    static FATAL: number;
    static MARK: number;
    static OFF: number;
    private static colors_mapping;
    private static level_enum;
    constructor(env?: string);
    private print;
    private printToConsole;
    private printToFile;
    trace(...message: any[]): void;
    debug(...message: any[]): void;
    info(...message: any[]): void;
    warn(...message: any[]): void;
    error(...message: any[]): void;
    fatal(...message: any[]): void;
    mark(...message: any[]): void;
}
export { logger };
//# sourceMappingURL=index.d.ts.map