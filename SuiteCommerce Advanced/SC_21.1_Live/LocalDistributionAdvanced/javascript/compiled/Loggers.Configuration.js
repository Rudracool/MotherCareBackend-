/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Configuration", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LogLevels;
    (function (LogLevels) {
        LogLevels[LogLevels["OFF"] = 0] = "OFF";
        LogLevels[LogLevels["FATAL"] = 100] = "FATAL";
        LogLevels[LogLevels["ERROR"] = 200] = "ERROR";
        LogLevels[LogLevels["WARN"] = 300] = "WARN";
        LogLevels[LogLevels["INFO"] = 400] = "INFO";
        LogLevels[LogLevels["DEBUG"] = 500] = "DEBUG";
        LogLevels[LogLevels["TRACE"] = 600] = "TRACE";
        LogLevels[LogLevels["ALL"] = Infinity] = "ALL";
    })(LogLevels = exports.LogLevels || (exports.LogLevels = {}));
    exports.prod = {
        name: 'Production',
        logLevel: LogLevels.INFO
    };
    exports.dev = {
        name: 'Development',
        logLevel: LogLevels.ALL
    };
});

//# sourceMappingURL=Loggers.Configuration.js.map
