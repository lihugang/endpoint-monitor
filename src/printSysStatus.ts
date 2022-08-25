import * as cpuInfoCollection from './getsysinfo/cpu';
import * as memoryInfoCollection from './getsysinfo/memory';
import { logger } from './logger';

const monitorCollectionLogger = new logger('endpoint-monitor');
monitorCollectionLogger.isOutputToConsole = false;
monitorCollectionLogger.outputFilename = 'null';

const warningLogger = new logger('[Endpoint Monitor] Warning system');
warningLogger.outputFilename = '[Date]-[Hour]-warnings.log';

const setMonitorOutputPath = (path: string): void => {
    monitorCollectionLogger.outputFilename = path;
};

const setWarningOutputPath = (path: string): void => {
    warningLogger.outputFilename = path;
};

const setWarnings = (_warnings: any): void => {
    warnings = _warnings;
};

let print_per_ms = 25, warnings: any = null;
let isSave = true;

const getPercent = (value: string): number => {
    if (/[0-9]+%$/.test(value)) {
        const percent = parseFloat(value);
        if (percent < 0 || percent > 100) throw new RangeError(`Invalid percent value: ${value}`);
        return percent;
    } else throw new Error('Invalid percent value: ' + value);
};

const setMSecond = (value: number) => print_per_ms = value;
const printSysInfo = async () => {
    setTimeout(printSysInfo, print_per_ms);
    const cpuUsagePercent = await cpuInfoCollection.getCpuUsagePercent(print_per_ms);
    const memoryUsagePercent = memoryInfoCollection.getMemoryUsagePercent() * 100;
    const memoryUsage = memoryInfoCollection.getMemoryUsage();
    const freeMemory = memoryInfoCollection.getFreeMemory();
    const freeMemoryPercent = memoryInfoCollection.getFreeMemoryPercent() * 100;

    let isWarning = false;

    if (warnings) {
        if (warnings.cpu) {
            if (typeof warnings.cpu === 'string') {
                //percent
                const percent = getPercent(warnings.cpu);
                if (cpuUsagePercent > percent * 1.5) warningLogger.fatal('CPU overloading', cpuUsagePercent.toFixed(2) + '%');
                else if (cpuUsagePercent > percent * 1.2) warningLogger.error('CPU overloading', cpuUsagePercent.toFixed(2) + '%');
                else if (cpuUsagePercent > percent) warningLogger.warn('CPU overloading', cpuUsagePercent.toFixed(2) + '%');

                if (cpuUsagePercent > percent) isWarning = true;
            } else throw new TypeError('Invalid warnings.cpu, it must be a string.')
        };
        if (warnings.usingMemory) {
            if (typeof warnings.usingMemory === 'string') {
                //percent
                const percent = getPercent(warnings.usingMemory);
                if (memoryUsagePercent > percent * 1.5) warningLogger.fatal('Memory overloading', memoryUsagePercent.toFixed(2) + '%');
                else if (memoryUsagePercent > percent * 1.2) warningLogger.error('Memory overloading', memoryUsagePercent.toFixed(2) + '%');
                else if (memoryUsagePercent > percent) warningLogger.warn('Memory overloading', memoryUsagePercent.toFixed(2) + '%');

                if (memoryUsagePercent > percent) isWarning = true;
            } else if (typeof warnings.usingMemory === 'number') {
                const limit = warnings.usingMemory;
                if (memoryUsage > limit * 1.5)
                    warningLogger.fatal('Memory overloading', (memoryUsage > 1024 * 1024 * 1024) ? ((memoryUsage / 1024 / 1024 / 1024).toFixed(2) + 'GB') : (
                        (memoryUsage > 1024 * 1024) ? ((memoryUsage / 1024 / 1024).toFixed(2) + 'MB') : (
                            (memoryUsage > 1024) ? ((memoryUsage / 1024).toFixed(2) + 'KB') : (memoryUsage + 'B')
                        )
                    ));

                else if (memoryUsage > limit * 1.2)
                    warningLogger.error('Memory overloading', (memoryUsage > 1024 * 1024 * 1024) ? ((memoryUsage / 1024 / 1024 / 1024).toFixed(2) + 'GB') : (
                        (memoryUsage > 1024 * 1024) ? ((memoryUsage / 1024 / 1024).toFixed(2) + 'MB') : (
                            (memoryUsage > 1024) ? ((memoryUsage / 1024).toFixed(2) + 'KB') : (memoryUsage + 'B')
                        )
                    ));

                else if (memoryUsage > limit)
                    warningLogger.error('Memory overloading', (memoryUsage > 1024 * 1024 * 1024) ? ((memoryUsage / 1024 / 1024 / 1024).toFixed(2) + 'GB') : (
                        (memoryUsage > 1024 * 1024) ? ((memoryUsage / 1024 / 1024).toFixed(2) + 'MB') : (
                            (memoryUsage > 1024) ? ((memoryUsage / 1024).toFixed(2) + 'KB') : (memoryUsage + 'B')
                        )
                    ));

                if (memoryUsage > limit) isWarning = true;
            };
        };
        if (warnings.freeMemory) {
            if (typeof warnings.freeMemory === 'string') {
                //percent
                const percent = getPercent(warnings.freeMemory);
                if (freeMemoryPercent < percent / 1.5) warningLogger.fatal('Free Memory lacking', freeMemoryPercent.toFixed(2) + '%');
                else if (freeMemoryPercent < percent / 1.2) warningLogger.error('Free Memory lacking', freeMemoryPercent.toFixed(2) + '%');
                else if (freeMemoryPercent < percent) warningLogger.warn('Free memory lacking', freeMemoryPercent.toFixed(2) + '%');

                if (freeMemoryPercent < percent) isWarning = true;
            } else if (typeof warnings.freeMemory === 'number') {
                const limit = warnings.freeMemory;
                if (freeMemory < limit / 1.5)
                    warningLogger.fatal('Free memory lacking', (freeMemory > 1024 * 1024 * 1024) ? ((freeMemory / 1024 / 1024 / 1024).toFixed(2) + 'GB') : (
                        (freeMemory > 1024 * 1024) ? ((freeMemory / 1024 / 1024).toFixed(2) + 'MB') : (
                            (freeMemory > 1024) ? ((freeMemory / 1024).toFixed(2) + 'KB') : (freeMemory + 'B')
                        )
                    ));

                else if (freeMemory < limit * 1.2)
                    warningLogger.error('Free memory lacking', (freeMemory > 1024 * 1024 * 1024) ? ((freeMemory / 1024 / 1024 / 1024).toFixed(2) + 'GB') : (
                        (freeMemory > 1024 * 1024) ? ((freeMemory / 1024 / 1024).toFixed(2) + 'MB') : (
                            (freeMemory > 1024) ? ((freeMemory / 1024).toFixed(2) + 'KB') : (freeMemory + 'B')
                        )
                    ));

                else if (freeMemory < limit)
                    warningLogger.error('Free memory lacking', (freeMemory > 1024 * 1024 * 1024) ? ((freeMemory / 1024 / 1024 / 1024).toFixed(2) + 'GB') : (
                        (freeMemory > 1024 * 1024) ? ((freeMemory / 1024 / 1024).toFixed(2) + 'MB') : (
                            (freeMemory > 1024) ? ((freeMemory / 1024).toFixed(2) + 'KB') : (freeMemory + 'B')
                        )
                    ));

                if (freeMemory < limit) isWarning = true;
            };
        };

    };

    if (isSave) {
        monitorCollectionLogger.isOutputToFile = true;
        if (!isWarning) {
            isSave = false;
            setTimeout(() => isSave = true, print_per_ms * 8); //8 clocks
        };

    } else monitorCollectionLogger.isOutputToFile = false;



    if (!isWarning)
        monitorCollectionLogger.info('systemInfo', {
            cpuUsagePercent,
            memoryUsagePercent,
            freeMemoryPercent,
            memoryUsage,
            freeMemory,
            delay: print_per_ms
        });
    else monitorCollectionLogger.warn('systemInfo', {
        cpuUsagePercent,
        memoryUsagePercent,
        freeMemoryPercent,
        memoryUsage,
        freeMemory,
        delay: print_per_ms
    });
};
printSysInfo();

export { setMSecond, setMonitorOutputPath, setWarningOutputPath, setWarnings };