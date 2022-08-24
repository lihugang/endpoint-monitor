"use strict";
exports.__esModule = true;
exports.logger = void 0;
var fs = require("fs");
var path = require("path");
var chalk = require('chalk');
var beautify = require("json-beautify");
var logger = (function () {
    function logger(env) {
        if (env === void 0) { env = 'default'; }
        this.openFd = -1;
        this.openFilename = 'null';
        this.filter = logger.INFO;
        this.env = env;
        this.isOutputToConsole = logger.isOutputToConsole || true;
        this.isOutputToFile = logger.isOutputToFile || true;
        this.outputFilename = logger.outputFilename || 'logs/[Date].log';
        this.filter = logger.INFO;
    }
    ;
    logger.prototype.print = function (level, message) {
        if (level >= this.filter) {
            if (this.isOutputToConsole)
                this.printToConsole(level, message);
            if (this.isOutputToFile)
                this.printToFile(level, message);
            return 0;
        }
        ;
        return -1;
    };
    ;
    logger.prototype.printToConsole = function (level, message) {
        for (var i = 0, len = message.length; i < len; ++i) {
            var val = message[i];
            if (val instanceof Error)
                val = val.message + '\n' + val.stack;
            else if (val instanceof Function)
                val = '[Function ' + val.name + ']';
            else if (typeof val === 'object')
                val = beautify(val, null, 2, 50);
            else
                val = val.toString();
            message[i] = val;
        }
        ;
        var timeZone = -new Date().getTimezoneOffset() / 60;
        var currentTimeFormatString = '[' + new Date(new Date().getTime() + 1000 * 60 * 60 * timeZone).toISOString() + ']';
        var outputString = logger.colors_mapping[level](currentTimeFormatString, '[' + logger.level_enum[level] + ']', this.env + ' -') + ' ' + message.join(' ');
        if (level >= logger.ERROR)
            console.error(outputString);
        else if (level >= logger.WARN)
            console.warn(outputString);
        else
            console.log(outputString);
    };
    ;
    logger.prototype.printToFile = function (level, message) {
        for (var i = 0, len = message.length; i < len; ++i) {
            var val = message[i];
            if (val instanceof Error)
                val = val.message + '\n' + val.stack;
            else if (val instanceof Function)
                val = '[Function ' + val.name + ']';
            else if (typeof val === 'object')
                val = JSON.stringify(val);
            else
                val = val.toString();
            message[i] = val;
        }
        ;
        var outputFilename = this.outputFilename.replace('[Date]', new Date().toDateString().split(' ').slice(1).join('-')).replace('[Hour]', new Date().getHours().toString() + 'h').replace('[Minute]', new Date().getMinutes().toString() + 'm');
        if (this.openFd && this.openFd !== -1) {
            if (this.openFilename !== outputFilename) {
                fs.closeSync(this.openFd);
                this.openFd = fs.openSync(path.join(process.cwd(), outputFilename), 'a');
                this.openFilename = outputFilename;
            }
            ;
        }
        else {
            try {
                this.openFd = fs.openSync(path.join(process.cwd(), outputFilename), 'a');
                this.openFilename = outputFilename;
            }
            catch (e) {
                console.error('Failed to open log output file');
                throw new Error('Failed to open log output file');
            }
            ;
            this.openFilename = outputFilename;
        }
        ;
        var timeZone = -new Date().getTimezoneOffset() / 60;
        var currentTimeFormatString = '[' + new Date(new Date().getTime() + 1000 * 60 * 60 * timeZone).toISOString() + ']';
        var outputString = [
            currentTimeFormatString,
            '[' + logger.level_enum[level] + ']',
            this.env + ' -',
            message.join(' ')
        ].join(' ') + '\n';
        fs.write(this.openFd, outputString, function (err) {
            if (err)
                throw err;
        });
    };
    ;
    logger.prototype.trace = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.print(logger.TRACE, message);
    };
    ;
    logger.prototype.debug = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.print(logger.DEBUG, message);
    };
    ;
    logger.prototype.info = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.print(logger.INFO, message);
    };
    ;
    logger.prototype.warn = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.print(logger.WARN, message);
    };
    ;
    logger.prototype.error = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.print(logger.ERROR, message);
    };
    ;
    logger.prototype.fatal = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.print(logger.FATAL, message);
    };
    ;
    logger.prototype.mark = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.print(logger.MARK, message);
    };
    ;
    logger.TRACE = 1;
    logger.DEBUG = 2;
    logger.INFO = 3;
    logger.WARN = 4;
    logger.ERROR = 5;
    logger.FATAL = 6;
    logger.MARK = 7;
    logger.OFF = 8;
    logger.colors_mapping = [null,
        chalk.gray,
        chalk.cyan,
        chalk.green,
        chalk.yellow,
        chalk.red,
        chalk.magenta,
        chalk.gray,
        chalk.gray,
    ];
    logger.level_enum = [
        null,
        'TRACE',
        'CYAN',
        'INFO',
        'WARN',
        'ERROR',
        'FATAL',
        'MARK',
    ];
    return logger;
}());
exports.logger = logger;
;
//# sourceMappingURL=index.js.map