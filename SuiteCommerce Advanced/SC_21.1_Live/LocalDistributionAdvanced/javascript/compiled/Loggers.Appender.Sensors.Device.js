/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Sensors.Device", ["require", "exports", "Utils"], function (require, exports, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function device() {
        return {
            device: Utils.getDeviceType()
        };
    }
    exports.device = device;
});

//# sourceMappingURL=Loggers.Appender.Sensors.Device.js.map
