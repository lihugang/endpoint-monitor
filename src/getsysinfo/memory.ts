const os = require('os');

const getMemoryUsage = (): number => {
    return addObjectAllValues(process.memoryUsage());
};

const getMemoryUsagePercent = (): number => {
    const totalMemory: number = os.totalmem();
    return getMemoryUsage() / totalMemory;
};

const getFreeMemory = (): number => {
    return os.freemem();
};

const getFreeMemoryPercent = (): number => {
    const freeMemory = getFreeMemory();
    const totalMemory: number = os.totalmem();
    return freeMemory / totalMemory;
};

const addObjectAllValues = (obj: Object): number => {
    let result: number = 0;
    const values: any[] = Object.values(obj);
    values.forEach((value) => {
        if (typeof value === 'number') result += value;
    });
    return result;
};

export { getMemoryUsage, getMemoryUsagePercent, getFreeMemory, getFreeMemoryPercent };