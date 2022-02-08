/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Dummy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoggersAppenderDummy = /** @class */ (function () {
        function LoggersAppenderDummy() {
            console.log('LoggersAppenderDummy - Init');
        }
        LoggersAppenderDummy.prototype.ready = function () {
            return true;
        };
        LoggersAppenderDummy.prototype.info = function (data) {
            console.info('LoggersAppenderDummy - Info', data);
        };
        LoggersAppenderDummy.prototype.error = function (data) {
            console.error('LoggersAppenderDummy - Error', data);
        };
        LoggersAppenderDummy.prototype.start = function (action) {
            console.log('LoggersAppenderDummy - Start', 'start ' + action);
            return { start: Date.now(), action: action };
        };
        LoggersAppenderDummy.prototype.end = function (startOptions, _options) {
            var time = (Date.now() - startOptions.start) / 1000;
            console.log('LoggersAppenderDummy - End', 'end ' + startOptions.action + ': ' + time);
        };
        LoggersAppenderDummy.getInstance = function () {
            if (!LoggersAppenderDummy.instance) {
                LoggersAppenderDummy.instance = new LoggersAppenderDummy();
            }
            return LoggersAppenderDummy.instance;
        };
        return LoggersAppenderDummy;
    }());
    exports.LoggersAppenderDummy = LoggersAppenderDummy;
});

//# sourceMappingURL=Loggers.Appender.Dummy.js.map
