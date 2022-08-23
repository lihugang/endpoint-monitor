import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

interface Config {
    logSystem?: {
        isOutputToConsole?: boolean;
        isOutputToFile?: boolean;
        logOutputFile?: string;
    },
    ban?: {
        ip?: Array<string | RegExp>;
        cookie?: Array<string | RegExp>;
        token?: Array<string | RegExp>;
    },
    rules?: {
        ban?: {
            ip?: Array<number>;
            cookie?: Array<number>;
            token?: Array<number>;
        },
    },
    warnings?: {
        cpu?: string | number;
        usingMemory?: string | number;
        freeMemory?: string | number;
        websiteQts?: number;
        endpointQts?: number;
    }
};

var globalConfig: Config;

const findConfigPath = (searchPath: string): string | null => {
    if (fs.existsSync(path.join(searchPath, 'monitorConfig.json'))) return path.join(searchPath, 'monitorConfig.json');
    if (fs.existsSync(path.join(searchPath, 'monitor.config.js'))) return path.join(searchPath, 'monitor.config.js');
    if (fs.existsSync(path.join(searchPath, 'monitor.config.json'))) return path.join(searchPath, 'monitor.config.json');
    if (fs.existsSync(path.join(searchPath, 'monitorConfig.js'))) return path.join(searchPath, 'monitor.config.js');
    if (fs.existsSync(path.join(searchPath, 'config', 'monitorConfig.json'))) return path.join(searchPath, 'config', 'monitorConfig.json');
    if (fs.existsSync(path.join(searchPath, 'config', 'monitor.config.js'))) return path.join(searchPath, 'config', 'monitor.config.js');
    if (fs.existsSync(path.join(searchPath, 'config', 'monitor.config.json'))) return path.join(searchPath, 'config', 'monitor.config.json');
    if (fs.existsSync(path.join(searchPath, 'config', 'monitorConfig.js'))) return path.join(searchPath, 'config', 'monitor.config.js');

    if (path.join(searchPath, '..') === searchPath) {
        //the top of the disk
        return null;
    };
    return findConfigPath(path.join(searchPath, '..'));
};



const setup = () => {
    //find config path
    const defaultConfigPath: string | null = findConfigPath(process.cwd());
    if (defaultConfigPath === null) throw new Error('Could not find the configuration file.');

    try {
        globalConfig = require(defaultConfigPath);
    } catch (e) {
        console.error(e);
        throw new Error('Could not parse the configuration file');
    };


    //set logger config
    if (globalConfig.logSystem) {
        logger.isOutputToConsole = globalConfig.logSystem.isOutputToConsole ?? true;
        logger.isOutputToFile = globalConfig.logSystem.isOutputToFile ?? true;
        logger.outputFilename = globalConfig.logSystem.logOutputFile ?? 'logs/[Date].log';
    };
};

setup();

export { 
    logger,
};