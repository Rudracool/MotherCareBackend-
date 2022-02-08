/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Environment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Environment = /** @class */ (function () {
        function Environment() {
        }
        Environment.getSC = function () {
            return SC;
        };
        Environment.getApplication = function () {
            return SC.Application;
        };
        return Environment;
    }());
    exports.Environment = Environment;
});

//# sourceMappingURL=Environment.js.map
