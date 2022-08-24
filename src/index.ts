import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as memoryInfoCollection from './getsysinfo/memory';
import * as printSysStatus from './printSysStatus';
import { nativeHTTPHook, setOutputPath as collectionOutputPath_native_hook } from './hooks/nativeHTTPServer';
import { logger } from './logger';

interface Config {
    logSystem?: {
        isOutputToConsole?: boolean;
        isOutputToFile?: boolean;
        logOutputFile?: string;
    },
    checkSystemMSec ?: number;
    collection?: {
        outputPath ?: string;
    }
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
        cpu?: string;
        usingMemory?: string | number;
        freeMemory?: string | number;
        websiteQps?: number;
        endpointQps?: number;
        outputPath?: string;
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
        if (defaultConfigPath.endsWith('.json')) globalConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
        else globalConfig = require(defaultConfigPath);
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

    //set collection config
    if (globalConfig.collection) {
        collectionOutputPath_native_hook(globalConfig.collection.outputPath ?? '[Date]-[Hour].collection.log');
        printSysStatus.setMonitorOutputPath(globalConfig.collection.outputPath ?? '[Date]-[Hour].collection.log');
    };

    //set monitor config
    if (globalConfig.checkSystemMSec) {
        printSysStatus.setMSecond(globalConfig.checkSystemMSec);
    };

    if (globalConfig.warnings) {
        printSysStatus.setWarnings(globalConfig.warnings);
        if (globalConfig.warnings.outputPath) printSysStatus.setWarningOutputPath(globalConfig.warnings.outputPath);
    };

    //collection info
    const infoCollectionLogger = new logger('[Endpoint Monitor] Collection System Info');
    infoCollectionLogger.info('Operation System', os.type(), os.platform(), os.release());
    infoCollectionLogger.info('Computer up time', os.uptime(), 's');
    infoCollectionLogger.info('CPU info', 'Endianness=' + os.endianness(), 'Arch=' + os.arch());
    infoCollectionLogger.info('Total memory', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + 'GB', 'Free memory', (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + 'GB');
    infoCollectionLogger.info('Memory remain', (memoryInfoCollection.getFreeMemoryPercent() * 100).toFixed(2) + '%');
    infoCollectionLogger.info('Endpoint monitor version', require('../package.json').version);
};

setup();

export {
    logger,
    nativeHTTPHook as http,
};