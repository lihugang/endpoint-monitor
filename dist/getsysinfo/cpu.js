"use strict";
exports.__esModule = true;
exports.getCpuUsagePercent = void 0;
var getCpuUsagePercent = function (waitTime, callback) {
    if (waitTime === void 0) { waitTime = 100; }
    var startCpuUsage = process.cpuUsage();
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var endCpuUsage = process.cpuUsage();
            var usingCpuUSeconds = addObjectAllValues(endCpuUsage) - addObjectAllValues(startCpuUsage);
            var usingCPUPercentage = usingCpuUSeconds / (waitTime * 1000);
            if (callback && callback instanceof Function)
                callback(usingCPUPercentage);
            return resolve(usingCPUPercentage);
        }, waitTime);
    });
};
exports.getCpuUsagePercent = getCpuUsagePercent;
var addObjectAllValues = function (obj) {
    var result = 0;
    var values = Object.values(obj);
    values.forEach(function (value) {
        if (typeof value === 'number')
            result += value;
    });
    return result;
};
//# sourceMappingURL=cpu.js.map