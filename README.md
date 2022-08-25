# Endpoint Monitor
# 端点监控
### Version: 1.0.0
### 版本：1.0.0
### License: MIT License
### 协议：MIT
- - -
Dependencies: 依赖：  
- chalk: `^4.1.2` Colorful comments 彩色日志
- cookie-parser: `^1.4.6` Cookie Parser Cookie解析 (Used for marking clients, 用于标记客户端)
- json-beautify: `^1.1.1` JSON Beautify 美化JSON (Used for pretty printing json in console, 在控制台打印的JSON更美观)

- - -
How to install: 如何安装  
- `mkdir server && cd server`
- `npm i endpoint-monitor@1.0.0 --save`
- Configure `monitor.config.json` 配置`monitor.config.json`

There is a format of the configuration: 这里有一份配置的格式
```typescript
{
    logSystem?: {
        isOutputToConsole?: boolean; //default: true
        isOutputToFile?: boolean; //default: true
        logOutputFile?: string; //default: logs/[Date].log  placeholders: [Date] [Hour] [Minute]
    },
    checkSystemMSec ?: number; //check system status(cpu sec and memory usage) per ms, default: 25
    //save records to log default 200ms, 8 times of checkSystemMSec, if no warnings
    collection?: { //record requests and system status
        outputPath ?: string; //default: 'null'
    }
    ban?: { //[not realize currently]
        ip?: Array<string | RegExp>;
        cookie?: Array<string | RegExp>;
        token?: Array<string | RegExp>;
    },
    rules?: {
        //[not realize currently]
        ban?: {
            ip?: Array<number>;
            cookie?: Array<number>;
            token?: Array<number>;
        },
    },
    warnings?: {
        cpu?: string; // ex. 5%
        usingMemory?: string | number; // ex. 5% or 1048576 (Bytes)
        freeMemory?: string | number; // ex. 5% or 1048576 (Bytes)
        websiteQps?: number; //[not realize currently]
        endpointQps?: number; //[not realize currently]
        outputPath?: string; //default: warnings.log
    }
};
```
`?:` Means optional `?:`表示可选
- - - 
Methods: 方法：   
- `logger` Logger system 日志系统
> `logger` has an constructor  
> You can use `const log = new logger('name');` to create a new logger  
> There are several different levels in logger, sorted by lower  
> - TRACE
> - DEBUG
> - INFO
> - WARN
> - ERROR
> - FATAL
>
> Default output level is `INFO`, you can set level to `DEBUG` by `log.filter = logger.DEBUG`  
> examples:
```javascript
const monitor = require('endpoint-monitor');
const log = new monitor.logger('Test');
log.info('Endpoint Monitor');
//output: [2022-08-24T21:54:24.896Z] [INFO] Test - Endpoint Monitor
```
- - -
We hooked the HTTP Server, and added monitoring for requests and responses. 我们对HTTP服务器做了钩子，增加了对请求和响应的监控  
You can use `const http = monitor.http` instead of `const http = require('http');` 你可以使用`const http = monitor.http;` 来代替 `const http = require('http');`  
API is all the same. 应用程序接口是全部一样的。  

It only supports native http server so far. 目前仅支持的原生http服务器的支持  
It will add supports for `express` in the near future. 将来会增加对`express`框架的支持  