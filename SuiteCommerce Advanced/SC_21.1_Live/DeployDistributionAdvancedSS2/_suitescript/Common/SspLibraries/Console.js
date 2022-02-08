/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/log", "./../../third_parties/underscore.js"], function (require, exports, Nlog) {
    "use strict";
    // Maximum length for details and title for nlapiLogExecution.
    // Actual maxTitleLength is 99, setting to 95 to use the remaining characters to make "pagination" possible.
    var maxDetailsLength = 3995;
    var maxTitleLength = 95;
    var noop = function (content, title) {
        if (title === void 0) { title = ''; }
    };
    var console = {
        log: noop,
        error: noop,
        info: noop,
        warn: noop,
        timeEntries: [],
        trace: function () {
            try {
                throw new Error();
            }
            catch (err) {
                var stack = err.stack
                    .replace(/^[^\(]+?[\n$]/gm, '')
                    .replace(/^\s+at\s+/gm, '')
                    .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                    .split('\n');
                console.log(stack);
            }
        },
        time: function (text) {
            if (typeof text === 'string') {
                console.timeEntries[text] = Date.now();
            }
        },
        timeEnd: function (text) {
            var result = NaN;
            if (typeof console.timeEntries[text] !== 'undefined') {
                result = Date.now() - console.timeEntries[text];
                console.log(text + ':', result + 'ms');
                delete console.timeEntries[text];
            }
            return result;
        }
    };
    /* Mostly to display the actual UNEXPECTED_ERROR */
    function basicClone(value) {
        var type = typeof value;
        if (type === 'function') {
            return 'function';
        }
        if (!value || type !== 'object') {
            return value;
        }
        var result = {};
        Object.keys(value).forEach(function (key) {
            var val = value[key];
            var value_type = typeof val;
            if (value_type === 'string' || value_type === 'number' || value_type === 'boolean') {
                result[key] = val;
            }
            else {
                result[key] = value_type;
            }
        });
        return result;
    }
    function stringify(value) {
        if (value && value.toJSON) {
            return value.toJSON();
        }
        return JSON.stringify(basicClone(value));
    }
    var levels = { log: 'debug', info: 'audit', error: 'emergency', warn: 'error' };
    _.each(levels, function (level, fn) {
        console[fn] = function (content, title) {
            if (title === void 0) { title = ''; }
            var details = typeof content === 'object' ? stringify(content) : content;
            if (details && details.length > maxDetailsLength) {
                details = details.match(new RegExp('.{1,' + maxDetailsLength + '}', 'g'));
            }
            else {
                details = [details];
            }
            _.each(details, function (detail, key, list) {
                var newTitle = list.length > 1
                    ? title.substring(0, maxTitleLength) + '(' + (key + 1) + ')'
                    : title;
                Nlog[level]({
                    title: newTitle,
                    details: detail
                });
            });
        };
    });
    return console;
});
