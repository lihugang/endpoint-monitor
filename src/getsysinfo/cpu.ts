const getCpuUsagePercent = (waitTime: number = 100, callback?: Function): Promise<number> => {
    const startCpuUsage: NodeJS.CpuUsage = process.cpuUsage();
    return new Promise<number>((resolve: Function, reject: Function) => {
        setTimeout(() => {
            const endCpuUsage: NodeJS.CpuUsage = process.cpuUsage();
            const usingCpuUSeconds: number = addObjectAllValues(endCpuUsage) - addObjectAllValues(startCpuUsage);
            const usingCPUPercentage: number = usingCpuUSeconds / (waitTime * 1000);
            if (callback && callback instanceof Function) callback(usingCPUPercentage);
            return resolve(usingCPUPercentage);
        }, waitTime);
    });
};

const addObjectAllValues = (obj: Object): number => {
    let result: number = 0;
    const values: any[] = Object.values(obj);
    values.forEach((value) => {
        if (typeof value === 'number') result += value;
    });
    return result;
};

export { getCpuUsagePercent };