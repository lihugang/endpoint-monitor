"use strict";
exports.__esModule = true;
exports.getFreeMemoryPercent = exports.getFreeMemory = exports.getMemoryUsagePercent = exports.getMemoryUsage = void 0;
var os = require('os');
var getMemoryUsage = function () {
    return addObjectAllValues(process.memoryUsage());
};
exports.getMemoryUsage = getMemoryUsage;
var getMemoryUsagePercent = function () {
    var totalMemory = os.totalmem();
    return getMemoryUsage() / totalMemory;
};
exports.getMemoryUsagePercent = getMemoryUsagePercent;
var getFreeMemory = function () {
    return os.freemem();
};
exports.getFreeMemory = getFreeMemory;
var getFreeMemoryPercent = function () {
    var freeMemory = getFreeMemory();
    var totalMemory = os.totalmem();
    return freeMemory / totalMemory;
};
exports.getFreeMemoryPercent = getFreeMemoryPercent;
var addObjectAllValues = function (obj) {
    var result = 0;
    var values = Object.values(obj);
    values.forEach(function (value) {
        if (typeof value === 'number')
            result += value;
    });
    return result;
};
//# sourceMappingURL=memory.js.map