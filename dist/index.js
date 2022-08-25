"use strict";
exports.__esModule = true;
exports.getConfig = exports.http = exports.logger = void 0;
var fs = require("fs");
var path = require("path");
var os = require("os");
var memoryInfoCollection = require("./getsysinfo/memory");
var printSysStatus = require("./printSysStatus");
var nativeHTTPServer_1 = require("./hooks/nativeHTTPServer");
exports.http = nativeHTTPServer_1.nativeHTTPHook;
var logger_1 = require("./logger");
exports.logger = logger_1.logger;
;
var globalConfig;
var findConfigPath = function (searchPath) {
    if (fs.existsSync(path.join(searchPath, 'monitorConfig.json')))
        return path.join(searchPath, 'monitorConfig.json');
    if (fs.existsSync(path.join(searchPath, 'monitor.config.js')))
        return path.join(searchPath, 'monitor.config.js');
    if (fs.existsSync(path.join(searchPath, 'monitor.config.json')))
        return path.join(searchPath, 'monitor.config.json');
    if (fs.existsSync(path.join(searchPath, 'monitorConfig.js')))
        return path.join(searchPath, 'monitor.config.js');
    if (fs.existsSync(path.join(searchPath, 'config', 'monitorConfig.json')))
        return path.join(searchPath, 'config', 'monitorConfig.json');
    if (fs.existsSync(path.join(searchPath, 'config', 'monitor.config.js')))
        return path.join(searchPath, 'config', 'monitor.config.js');
    if (fs.existsSync(path.join(searchPath, 'config', 'monitor.config.json')))
        return path.join(searchPath, 'config', 'monitor.config.json');
    if (fs.existsSync(path.join(searchPath, 'config', 'monitorConfig.js')))
        return path.join(searchPath, 'config', 'monitor.config.js');
    if (path.join(searchPath, '..') === searchPath) {
        return null;
    }
    ;
    return findConfigPath(path.join(searchPath, '..'));
};
var setup = function () {
    var _a, _b, _c, _d, _e;
    var defaultConfigPath = findConfigPath(process.cwd());
    if (defaultConfigPath === null)
        throw new Error('Could not find the configuration file.');
    try {
        if (defaultConfigPath.endsWith('.json'))
            globalConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
        else
            globalConfig = require(defaultConfigPath);
    }
    catch (e) {
        console.error(e);
        throw new Error('Could not parse the configuration file');
    }
    ;
    if (globalConfig.logSystem) {
        logger_1.logger.isOutputToConsole = (_a = globalConfig.logSystem.isOutputToConsole) !== null && _a !== void 0 ? _a : true;
        logger_1.logger.isOutputToFile = (_b = globalConfig.logSystem.isOutputToFile) !== null && _b !== void 0 ? _b : true;
        logger_1.logger.outputFilename = (_c = globalConfig.logSystem.logOutputFile) !== null && _c !== void 0 ? _c : 'logs/[Date].log';
    }
    ;
    if (globalConfig.collection) {
        (0, nativeHTTPServer_1.setOutputPath)((_d = globalConfig.collection.outputPath) !== null && _d !== void 0 ? _d : '[Date]-[Hour].collection.log');
        printSysStatus.setMonitorOutputPath((_e = globalConfig.collection.outputPath) !== null && _e !== void 0 ? _e : '[Date]-[Hour].collection.log');
    }
    ;
    if (globalConfig.checkSystemMSec) {
        printSysStatus.setMSecond(globalConfig.checkSystemMSec);
    }
    ;
    if (globalConfig.warnings) {
        printSysStatus.setWarnings(globalConfig.warnings);
        if (globalConfig.warnings.outputPath)
            printSysStatus.setWarningOutputPath(globalConfig.warnings.outputPath);
    }
    ;
    var infoCollectionLogger = new logger_1.logger('[Endpoint Monitor] Collection System Info');
    infoCollectionLogger.info('Operation System', os.type(), os.platform(), os.release());
    infoCollectionLogger.info('Computer up time', os.uptime(), 's');
    infoCollectionLogger.info('CPU info', 'Endianness=' + os.endianness(), 'Arch=' + os.arch());
    infoCollectionLogger.info('Total memory', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + 'GB', 'Free memory', (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + 'GB');
    infoCollectionLogger.info('Memory remain', (memoryInfoCollection.getFreeMemoryPercent() * 100).toFixed(2) + '%');
    infoCollectionLogger.info('Endpoint monitor version', require('../package.json').version);
};
var getConfig = function () {
    return globalConfig;
};
exports.getConfig = getConfig;
setup();
//# sourceMappingURL=index.js.map