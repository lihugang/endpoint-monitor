import { nativeHTTPHook } from './hooks/nativeHTTPServer';
import { logger } from './logger';
interface Config {
    logSystem?: {
        isOutputToConsole?: boolean;
        isOutputToFile?: boolean;
        logOutputFile?: string;
    };
    checkSystemMSec?: number;
    collection?: {
        outputPath?: string;
    };
    ban?: {
        ip?: Array<string | RegExp>;
        cookie?: Array<string | RegExp>;
        token?: Array<string | RegExp>;
    };
    rules?: {
        ban?: {
            ip?: Array<number>;
            cookie?: Array<number>;
            token?: Array<number>;
        };
    };
    warnings?: {
        cpu?: string;
        usingMemory?: string | number;
        freeMemory?: string | number;
        websiteQps?: number;
        endpointQps?: number;
        outputPath?: string;
    };
}
declare const getConfig: () => Config;
export { logger, nativeHTTPHook as http, getConfig, };
//# sourceMappingURL=index.d.ts.map