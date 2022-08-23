import * as fs from 'fs';
import * as path from 'path';
const chalk: any = require('chalk');
const beautify: any = require("json-beautify");

class logger {
    env: string;
    isOutputToConsole: boolean;
    isOutputToFile: boolean;
    outputFilename: string;
    openFd: number = -1;
    openFilename: string = 'null';
    filter: number = logger.INFO;

    static isOutputToConsole: boolean;
    static isOutputToFile: boolean;
    static outputFilename: string;

    static TRACE = 1;
    static DEBUG = 2;
    static INFO = 3;
    static WARN = 4;
    static ERROR = 5;
    static FATAL = 6;
    static MARK = 7;
    static OFF = 8;

    private static colors_mapping = [null,
        chalk.gray, //trace
        chalk.cyan, //debug
        chalk.green, //info
        chalk.yellow, //warn
        chalk.red, //error
        chalk.magenta, //fatal
        chalk.gray, //mark
        chalk.gray, //off
    ];

    private static level_enum = [
        null,
        'TRACE',
        'CYAN',
        'INFO',
        'WARN',
        'ERROR',
        'FATAL',
        'MARK',
    ];

    constructor(env: string = 'default') {
        this.env = env;
        this.isOutputToConsole = logger.isOutputToConsole || true;
        this.isOutputToFile = logger.isOutputToFile || true;
        this.outputFilename = logger.outputFilename || 'logs/[Date].log';
        this.filter = logger.INFO;
    };

    private print(level: number, message: any[]): number {
        if (level >= this.filter) {
            if (this.isOutputToConsole) this.printToConsole(level, message);
            if (this.isOutputToFile) this.printToFile(level, message);
            return 0;
        };
        return -1;
    };

    private printToConsole(level: number, message: any[]): void {
        for (let i = 0, len = message.length; i < len; ++i) {
            let val: any = message[i];
            if (val instanceof Error) val = val.message + '\n' + val.stack;
            else if (val instanceof Function) val = '[Function ' + val.name + ']';
            else if (typeof val === 'object') val = beautify(val, null, 2, 50);
            else val = val.toString();
            message[i] = val;
        };

        const timeZone = -new Date().getTimezoneOffset() / 60; //ex. timeZone = 8, UTC+8
        const currentTimeFormatString = '[' + new Date(new Date().getTime() + 1000 * 60 * 60 * timeZone).toISOString() + ']';
        const outputString: string = logger.colors_mapping[level](
            currentTimeFormatString,
            '[' + logger.level_enum[level] + ']',
            this.env + ' -',
        ) + ' ' + message.join(' ');
        if (level >= logger.ERROR)
            console.error(outputString);
        else if (level >= logger.WARN)
            console.warn(outputString);
        else console.log(outputString);
    };

    private printToFile(level: number, message: any[]): void {
        message.forEach(val => {
            if (val instanceof Error) val = val.message + '\n' + val.stack;
            else if (val instanceof Function) val = '[Function ' + val.name + ']';
            else if (typeof val === 'object') val = JSON.stringify(val);
            else val = val.toString();
        });

        const outputFilename = this.outputFilename.replace('[Date]', new Date().toDateString().split(' ').slice(1).join('-'));
        if (this.openFd && this.openFd !== -1) {
            if (this.openFilename !== outputFilename) {
                //new date
                fs.closeSync(this.openFd);
                this.openFd = fs.openSync(path.join(process.cwd(), outputFilename), 'a');
                this.openFilename = outputFilename;
            };
        } else {
            try {
                this.openFd = fs.openSync(path.join(process.cwd(), outputFilename), 'a');
                this.openFilename = outputFilename;
            } catch (e) {
                console.error('Failed to open log output file');
                throw new Error('Failed to open log output file');
            };
            this.openFilename = outputFilename;
        };

        const timeZone = -new Date().getTimezoneOffset() / 60; //ex. timeZone = 8, UTC+8
        const currentTimeFormatString = '[' + new Date(new Date().getTime() + 1000 * 60 * 60 * timeZone).toISOString() + ']';
        const outputString: string = [
            currentTimeFormatString,
            '[' + logger.level_enum[level] + ']',
            this.env + ' -',
            message.join(' ')
        ].join(' ') + '\n';

        fs.write(this.openFd, outputString, (err) => {
            if (err) throw err;
        });
    };

    trace(...message: any[]): void {
        this.print(logger.TRACE, message);
    };

    debug(...message: any[]): void {
        this.print(logger.DEBUG, message);
    };

    info(...message: any[]): void {
        this.print(logger.INFO, message);
    };

    warn(...message: any[]): void {
        this.print(logger.WARN, message);
    };

    error(...message: any[]): void {
        this.print(logger.ERROR, message);
    };

    fatal(...message: any[]): void {
        this.print(logger.FATAL, message);
    };

    mark(...message: any[]): void {
        this.print(logger.MARK, message);
    };
};

export { logger };