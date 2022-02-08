/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Logger.Appender.Sensor.DataContractVersion", ["require", "exports", "Environment"], function (require, exports, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bundleVersionRegex = /^(\d{4})\.([1|2])\.([0-9]{1,2})(\.([0-9]{1,2}))?$/;
    function normilizeToTwoDigitsNumber(number) {
        return number.length === 1 ? "0" + number : number;
    }
    function dataContractVersion() {
        var bundleVersion = Environment_1.Environment.getSC().ENVIRONMENT.RELEASE_METADATA.version;
        var match = bundleVersion.match(bundleVersionRegex);
        if (match) {
            var dataContract = match[1] + match[2] + normilizeToTwoDigitsNumber(match[3]);
            if (match[5]) {
                dataContract += normilizeToTwoDigitsNumber(match[5]);
            }
            else {
                dataContract += '00';
            }
            return { dataContractVersion: parseInt(dataContract, 10) };
        }
        throw new Error("Bundle version must match with pattern: \n            [\\d{4}].[1 or 2].[number 0-99][optional .][optional number 0-99]");
    }
    exports.dataContractVersion = dataContractVersion;
});

//# sourceMappingURL=Logger.Appender.Sensor.DataContractVersion.js.map
