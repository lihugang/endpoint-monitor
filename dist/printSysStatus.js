"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.setWarnings = exports.setWarningOutputPath = exports.setMonitorOutputPath = exports.setMSecond = void 0;
var cpuInfoCollection = require("./getsysinfo/cpu");
var memoryInfoCollection = require("./getsysinfo/memory");
var logger_1 = require("./logger");
var monitorCollectionLogger = new logger_1.logger('endpoint-monitor');
monitorCollectionLogger.isOutputToConsole = false;
monitorCollectionLogger.outputFilename = 'null';
var warningLogger = new logger_1.logger('[Endpoint Monitor] Warning system');
warningLogger.outputFilename = '[Date]-[Hour]-warnings.log';
var setMonitorOutputPath = function (path) {
    monitorCollectionLogger.outputFilename = path;
};
exports.setMonitorOutputPath = setMonitorOutputPath;
var setWarningOutputPath = function (path) {
    warningLogger.outputFilename = path;
};
exports.setWarningOutputPath = setWarningOutputPath;
var setWarnings = function (_warnings) {
    warnings = _warnings;
};
exports.setWarnings = setWarnings;
var print_per_ms = 25, warnings = null;
var isSave = true;
var getPercent = function (value) {
    if (/[0-9]+%$/.test(value)) {
        var percent = parseFloat(value);
        if (percent < 0 || percent > 100)
            throw new RangeError("Invalid percent value: ".concat(value));
        return percent;
    }
    else
        throw new Error('Invalid percent value: ' + value);
};
var setMSecond = function (value) { return print_per_ms = value; };
exports.setMSecond = setMSecond;
var printSysInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cpuUsagePercent, memoryUsagePercent, memoryUsage, freeMemory, freeMemoryPercent, isWarning, percent, percent, limit, percent, limit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                setTimeout(printSysInfo, print_per_ms);
                return [4, cpuInfoCollection.getCpuUsagePercent(print_per_ms)];
            case 1:
                cpuUsagePercent = _a.sent();
                memoryUsagePercent = memoryInfoCollection.getMemoryUsagePercent() * 100;
                memoryUsage = memoryInfoCollection.getMemoryUsage();
                freeMemory = memoryInfoCollection.getFreeMemory();
                freeMemoryPercent = memoryInfoCollection.getFreeMemoryPercent() * 100;
                isWarning = false;
                if (warnings) {
                    if (warnings.cpu) {
                        if (typeof warnings.cpu === 'string') {
                            percent = getPercent(warnings.cpu);
                            if (cpuUsagePercent > percent * 1.5)
                                warningLogger.fatal('CPU overloading', cpuUsagePercent.toFixed(2) + '%');
                            else if (cpuUsagePercent > percent * 1.2)
                                warningLogger.error('CPU overloading', cpuUsagePercent.toFixed(2) + '%');
                            else if (cpuUsagePercent > percent)
                                warningLogger.warn('CPU overloading', cpuUsagePercent.toFixed(2) + '%');
                            if (cpuUsagePercent > percent)
                                isWarning = true;
                        }
                        else
                            throw new TypeError('Invalid warnings.cpu, it must be a string.');
                    }
                    ;
                    if (warnings.usingMemory) {
                        if (typeof warnings.usingMemory === 'string') {
                            percent = getPercent(warnings.usingMemory);
                            if (memoryUsagePercent > percent * 1.5)
                                warningLogger.fatal('Memory overloading', memoryUsagePercent.toFixed(2) + '%');
                            else if (memoryUsagePercent > percent * 1.2)
                                warningLogger.error('Memory overloading', memoryUsagePercent.toFixed(2) + '%');
                            else if (memoryUsagePercent > percent)
                                warningLogger.warn('Memory overloading', memoryUsagePercent.toFixed(2) + '%');
                            if (memoryUsagePercent > percent)
                                isWarning = true;
                        }
                        else if (typeof warnings.usingMemory === 'number') {
                            limit = warnings.usingMemory;
                            if (memoryUsage > limit * 1.5)
                                warningLogger.fatal('Memory overloading', (memoryUsage > 1024 * 1024 * 1024) ? ((memoryUsage / 1024 / 1024 / 1024).toFixed(2) + 'GB') : ((memoryUsage > 1024 * 1024) ? ((memoryUsage / 1024 / 1024).toFixed(2) + 'MB') : ((memoryUsage > 1024) ? ((memoryUsage / 1024).toFixed(2) + 'KB') : (memoryUsage + 'B'))));
                            else if (memoryUsage > limit * 1.2)
                                warningLogger.error('Memory overloading', (memoryUsage > 1024 * 1024 * 1024) ? ((memoryUsage / 1024 / 1024 / 1024).toFixed(2) + 'GB') : ((memoryUsage > 1024 * 1024) ? ((memoryUsage / 1024 / 1024).toFixed(2) + 'MB') : ((memoryUsage > 1024) ? ((memoryUsage / 1024).toFixed(2) + 'KB') : (memoryUsage + 'B'))));
                            else if (memoryUsage > limit)
                                warningLogger.error('Memory overloading', (memoryUsage > 1024 * 1024 * 1024) ? ((memoryUsage / 1024 / 1024 / 1024).toFixed(2) + 'GB') : ((memoryUsage > 1024 * 1024) ? ((memoryUsage / 1024 / 1024).toFixed(2) + 'MB') : ((memoryUsage > 1024) ? ((memoryUsage / 1024).toFixed(2) + 'KB') : (memoryUsage + 'B'))));
                            if (memoryUsage > limit)
                                isWarning = true;
                        }
                        ;
                    }
                    ;
                    if (warnings.freeMemory) {
                        if (typeof warnings.freeMemory === 'string') {
                            percent = getPercent(warnings.freeMemory);
                            if (freeMemoryPercent < percent / 1.5)
                                warningLogger.fatal('Free Memory lacking', freeMemoryPercent.toFixed(2) + '%');
                            else if (freeMemoryPercent < percent / 1.2)
                                warningLogger.error('Free Memory lacking', freeMemoryPercent.toFixed(2) + '%');
                            else if (freeMemoryPercent < percent)
                                warningLogger.warn('Free memory lacking', freeMemoryPercent.toFixed(2) + '%');
                            if (freeMemoryPercent < percent)
                                isWarning = true;
                        }
                        else if (typeof warnings.freeMemory === 'number') {
                            limit = warnings.freeMemory;
                            if (freeMemory < limit / 1.5)
                                warningLogger.fatal('Free memory lacking', (freeMemory > 1024 * 1024 * 1024) ? ((freeMemory / 1024 / 1024 / 1024).toFixed(2) + 'GB') : ((freeMemory > 1024 * 1024) ? ((freeMemory / 1024 / 1024).toFixed(2) + 'MB') : ((freeMemory > 1024) ? ((freeMemory / 1024).toFixed(2) + 'KB') : (freeMemory + 'B'))));
                            else if (freeMemory < limit * 1.2)
                                warningLogger.error('Free memory lacking', (freeMemory > 1024 * 1024 * 1024) ? ((freeMemory / 1024 / 1024 / 1024).toFixed(2) + 'GB') : ((freeMemory > 1024 * 1024) ? ((freeMemory / 1024 / 1024).toFixed(2) + 'MB') : ((freeMemory > 1024) ? ((freeMemory / 1024).toFixed(2) + 'KB') : (freeMemory + 'B'))));
                            else if (freeMemory < limit)
                                warningLogger.error('Free memory lacking', (freeMemory > 1024 * 1024 * 1024) ? ((freeMemory / 1024 / 1024 / 1024).toFixed(2) + 'GB') : ((freeMemory > 1024 * 1024) ? ((freeMemory / 1024 / 1024).toFixed(2) + 'MB') : ((freeMemory > 1024) ? ((freeMemory / 1024).toFixed(2) + 'KB') : (freeMemory + 'B'))));
                            if (freeMemory < limit)
                                isWarning = true;
                        }
                        ;
                    }
                    ;
                    if (isSave) {
                        monitorCollectionLogger.isOutputToFile = true;
                        if (!isWarning) {
                            isSave = false;
                            setTimeout(function () { return isSave = true; }, print_per_ms * 8);
                        }
                        ;
                    }
                    else
                        monitorCollectionLogger.isOutputToFile = false;
                    if (!isWarning)
                        monitorCollectionLogger.info('systemInfo', {
                            cpuUsagePercent: cpuUsagePercent,
                            memoryUsagePercent: memoryUsagePercent,
                            freeMemoryPercent: freeMemoryPercent,
                            memoryUsage: memoryUsage,
                            freeMemory: freeMemory,
                            delay: print_per_ms
                        });
                    else
                        monitorCollectionLogger.warn('systemInfo', {
                            cpuUsagePercent: cpuUsagePercent,
                            memoryUsagePercent: memoryUsagePercent,
                            freeMemoryPercent: freeMemoryPercent,
                            memoryUsage: memoryUsage,
                            freeMemory: freeMemory,
                            delay: print_per_ms
                        });
                }
                ;
                return [2];
        }
    });
}); };
printSysInfo();
//# sourceMappingURL=printSysStatus.js.map