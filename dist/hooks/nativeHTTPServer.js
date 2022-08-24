"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.setOutputPath = exports.nativeHTTPHook = void 0;
var http = require("http");
var logger_1 = require("../logger");
var cookieParser = require('cookie-parser');
var monitorCollectionLogger = new logger_1.logger('endpoint-monitor');
monitorCollectionLogger.isOutputToConsole = false;
monitorCollectionLogger.outputFilename = 'null';
var setOutputPath = function (path) {
    monitorCollectionLogger.outputFilename = path;
};
exports.setOutputPath = setOutputPath;
var hookObject = new Proxy(http, {
    get: function (httpNativeObject, name) {
        if (name === 'isProxy')
            return true;
        if (name === 'createServer') {
            return function (requestListener) {
                var sysInfoCollectionLogger = new logger_1.logger('[Endpoint Monitor] Collection System Info');
                sysInfoCollectionLogger.info('Server created');
                monitorCollectionLogger.info('---Starting monitor service---');
                return hookHTTPServerObject(http.createServer(function (_req, _res) {
                    var req = _req;
                    var res = _res;
                    cookieParser()(req, res, function () {
                        req.requestID = new Date().toISOString() + '.' + Math.random().toString(36).substring(2);
                        req.__endpoint_monitor_descriptor = req.cookies.__endpoint_monitor_descriptor || Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                        res.requestID = req.requestID;
                        req.ip = _req.socket.remoteAddress || _req.connection.remoteAddress || _req.headers['forwarded'] || _req.headers['x-real-ip'];
                        monitorCollectionLogger.info('Receive request ', {
                            ip: req.ip,
                            request_id: req.requestID,
                            client_id: req.__endpoint_monitor_descriptor,
                            authorization: req.headers['authorization'],
                            method: req.method,
                            url: _req.url,
                            http_header_size: _req.socket.bytesRead
                        });
                        if (!req.cookies['__endpoint_monitor_descriptor'])
                            res.setHeader('Set-Cookie', '__endpoint_monitor_descriptor=' + req.__endpoint_monitor_descriptor + '; httponly');
                        try {
                            requestListener(hookHTTPRequest(req, req.__endpoint_monitor_descriptor, req.requestID), hookHTTPResponse(res, req.__endpoint_monitor_descriptor, req.requestID));
                        }
                        catch (e) {
                            if (!_res.headersSent)
                                res.writeHead(500);
                            if (!_res.writable) {
                                res.write(http.STATUS_CODES[500]);
                                res.end();
                            }
                            ;
                            monitorCollectionLogger.info('Response request ', {
                                status: 'error',
                                err: 'CODE_SYNC_ERROR',
                                source_err: e,
                                requestID: req.requestID
                            });
                        }
                        ;
                    });
                }));
            };
        }
        ;
        return httpNativeObject[name];
    }
});
exports.nativeHTTPHook = hookObject;
var hookHTTPServerObject = function (raw) { return new Proxy(raw, {
    get: function (httpNativeObject, name) {
        if (name === 'isProxy')
            return true;
        if (name === 'listen') {
            raw.on('close', function () {
                var sysInfoCollectionLogger = new logger_1.logger('[Endpoint Monitor] Collection System Info');
                sysInfoCollectionLogger.info('Server closed');
                monitorCollectionLogger.info('---Ending monitor service---');
            });
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var openPort = args[0];
                var listenHostname = (typeof args[1] === 'string') ? args[1] : '0.0.0.0';
                var sysInfoCollectionLogger = new logger_1.logger('[Endpoint Monitor] Collection System Info');
                sysInfoCollectionLogger.info('Server opened at ' + listenHostname + ':' + openPort);
                return raw.listen.apply(raw, __spreadArray([], __read(args), false));
            };
        }
        ;
        return httpNativeObject[name];
    }
}); };
var hookHTTPRequest = function (raw, clientID, requestID) { return new Proxy(raw, {
    get: function (httpNativeObject, name) {
        if (name === 'isProxy')
            return true;
        if (name === 'socket')
            return hookSocket(raw.socket, clientID, requestID);
        if (name === 'clientID')
            return clientID;
        if (name === 'requestID')
            return requestID;
        return httpNativeObject[name];
    }
}); };
var hookHTTPResponse = function (_raw, clientID, requestID) {
    var raw = _raw;
    raw.isProxy = false;
    raw.clientID = clientID;
    raw.requestID = requestID;
    var native_end_func = _raw.end;
    raw.end = function () {
        var _a, _b;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        monitorCollectionLogger.info('Response request ', {
            status: 'ok',
            requestID: requestID,
            statusCode: _raw.statusCode,
            size: ((_a = _raw.socket) === null || _a === void 0 ? void 0 : _a.writableLength) || ((_b = _raw.socket) === null || _b === void 0 ? void 0 : _b.bytesWritten)
        });
        return native_end_func.bind.apply(native_end_func, __spreadArray([_raw], __read(args), false))();
    };
    return raw;
};
var hookSocket = function (raw, clientID, requestID) { return new Proxy(raw, {
    get: function (httpNativeObject, name) {
        if (name === 'isProxy')
            return true;
        if (name === 'clientID')
            return clientID;
        if (name === 'requestID')
            return requestID;
        if (name === 'destroy')
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                monitorCollectionLogger.info('Response request ', {
                    status: 'error',
                    err: 'SOCKET_DESTROYED',
                    requestID: requestID
                });
                return raw.destroy.apply(raw, __spreadArray([], __read(args), false));
            };
        return httpNativeObject[name];
    }
}); };
//# sourceMappingURL=nativeHTTPServer.js.map