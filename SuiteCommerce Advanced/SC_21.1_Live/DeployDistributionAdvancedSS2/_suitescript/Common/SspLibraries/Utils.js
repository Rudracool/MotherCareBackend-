/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "./../../third_parties/underscore.js"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *
     * @deprecated
     * Do not create/modify/use this file methods.
     * Use this kind of logic from an specific module such as Configuration, Format, etc.
     * Create a new module if the one that you need does not exist.
     */
    function sanitizeString(text) {
        // Remove any HTML code form the string
        // Could this be related to SC validation?
        return text
            ? text
                .replace(/<br>/g, '\n')
                .replace(/</g, '&lt;')
                .replace(/\>/g, '&gt;')
            : '';
    }
    exports.sanitizeString = sanitizeString;
    function deepExtend(target, source) {
        if (target === void 0) { target = {}; }
        if (source === void 0) { source = {}; }
        if (_.isArray(target) || !_.isObject(target)) {
            return source;
        }
        _.each(source, function (value, key) {
            if (key in target) {
                target[key] = deepExtend(target[key], value);
            }
            else {
                target[key] = value;
            }
        });
        return target;
    }
    exports.deepExtend = deepExtend;
    function getPathFromObject(object, path, default_value) {
        if (!path) {
            return object;
        }
        if (object) {
            var tokens = path.split('.');
            var prev = object;
            var n = 0;
            while (!_.isUndefined(prev) && n < tokens.length) {
                prev = prev[tokens[n++]];
            }
            if (!_.isUndefined(prev)) {
                return prev;
            }
        }
        return default_value;
    }
    exports.getPathFromObject = getPathFromObject;
    function setPathFromObject(object, path, value) {
        var tokens = path.split('.');
        var prev = object;
        for (var token_idx = 0; token_idx < tokens.length - 1; ++token_idx) {
            var current_token = tokens[token_idx];
            if (_.isUndefined(prev[current_token])) {
                prev[current_token] = {};
            }
            prev = prev[current_token];
        }
        prev[_.last(tokens)] = value;
    }
    exports.setPathFromObject = setPathFromObject;
});
