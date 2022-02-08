/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("String.format", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function stringFormat(text) {
        var continuationText = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            continuationText[_i - 1] = arguments[_i];
        }
        return text.replace(/\$\((\d+)\)/g, function (match, number) {
            if (typeof continuationText[number] !== 'undefined') {
                return continuationText[number].toString();
            }
            return match.toString();
        });
    }
    exports.stringFormat = stringFormat;
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\$\((\d+)\)/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
});

//# sourceMappingURL=String.format.js.map
