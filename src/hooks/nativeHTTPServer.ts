import * as http from 'http';
import { logger } from '../logger';
const cookieParser = require('cookie-parser');

const monitorCollectionLogger = new logger('endpoint-monitor');
monitorCollectionLogger.isOutputToConsole = false;
monitorCollectionLogger.outputFilename = 'null';

const setOutputPath = (path: string): void => {
    monitorCollectionLogger.outputFilename = path;
};

const hookObject = new Proxy(http, {
    get(httpNativeObject: any, name: string): any {
        if (name === 'isProxy') return true;
        if (name === 'createServer') {
            return (requestListener: Function): Object => {
                const sysInfoCollectionLogger = new logger('[Endpoint Monitor] Collection System Info');
                sysInfoCollectionLogger.info('Server created');
                monitorCollectionLogger.info('---Starting monitor service---');
                return hookHTTPServerObject(
                    http.createServer((_req, _res) => {
                        const req: any = _req;
                        const res: any = _res;
                        cookieParser()(req, res, () => {
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
                            if (!req.cookies['__endpoint_monitor_descriptor']) res.setHeader('Set-Cookie', '__endpoint_monitor_descriptor=' + req.__endpoint_monitor_descriptor + '; httponly');
                            //generate id for user

                            try {
                                requestListener(
                                    hookHTTPRequest(req, req.__endpoint_monitor_descriptor, req.requestID),
                                    hookHTTPResponse(res, req.__endpoint_monitor_descriptor, req.requestID),
                                );
                            } catch (e) {
                                if (!_res.headersSent)
                                    res.writeHead(500);
                                if (!_res.writable) {
                                    res.write(http.STATUS_CODES[500]);
                                    res.end();
                                };

                                monitorCollectionLogger.info('Response request ', {
                                    status: 'error',
                                    err: 'CODE_SYNC_ERROR',
                                    source_err: e,
                                    requestID: req.requestID
                                });

                            };
                        });

                    })
                );
            };
        };
        return httpNativeObject[name];
    },
});

const hookHTTPServerObject = (raw: http.Server) => new Proxy(raw, {
    get(httpNativeObject: any, name: string): any {
        if (name === 'isProxy') return true;
        if (name === 'listen') {

            raw.on('close', () => {
                const sysInfoCollectionLogger = new logger('[Endpoint Monitor] Collection System Info');
                sysInfoCollectionLogger.info('Server closed');
                monitorCollectionLogger.info('---Ending monitor service---');
            });

            return (...args: any): http.Server => {
                const openPort = args[0];
                const listenHostname = (typeof args[1] === 'string') ? args[1] : '0.0.0.0';
                const sysInfoCollectionLogger = new logger('[Endpoint Monitor] Collection System Info');
                sysInfoCollectionLogger.info('Server opened at ' + listenHostname + ':' + openPort);
                return raw.listen(...args);
            };
        };
        return httpNativeObject[name];
    },
});

const hookHTTPRequest = (raw: http.IncomingMessage, clientID: string, requestID: string) => new Proxy(raw, {
    get(httpNativeObject: any, name: string): any {
        if (name === 'isProxy') return true;
        if (name === 'socket') return hookSocket(raw.socket, clientID, requestID);
        if (name === 'clientID') return clientID;
        if (name === 'requestID') return requestID;
        return httpNativeObject[name];
    },
});

const hookHTTPResponse = (_raw: http.ServerResponse, clientID: string, requestID: string): Object => {
    //cannot create an object instead of raw
    const raw: any = _raw;
    raw.isProxy = false;
    raw.clientID = clientID;
    raw.requestID = requestID;
    const native_end_func = _raw.end;
    raw.end = (...args: any[]) => {
        monitorCollectionLogger.info('Response request ', {
            status: 'ok',
            requestID: requestID,
            statusCode: _raw.statusCode,
            size: _raw.socket?.writableLength || _raw.socket?.bytesWritten
        });
        return native_end_func.bind(_raw, ...args)();
    };
    return raw;
};

const hookSocket = (raw: any, clientID: string, requestID: string) => new Proxy(raw, {
    get(httpNativeObject: any, name: string): any {
        if (name === 'isProxy') return true;
        if (name === 'clientID') return clientID;
        if (name === 'requestID') return requestID;
        if (name === 'destroy') return (...args: any[]): any => {
            monitorCollectionLogger.info('Response request ', {
                status: 'error',
                err: 'SOCKET_DESTROYED',
                requestID: requestID
            });
            return raw.destroy(...args);
        };
        return httpNativeObject[name];
    },
});

export { hookObject as nativeHTTPHook, setOutputPath };