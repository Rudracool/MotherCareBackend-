/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Console.Polyfill", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <amd-module name="Console.Polyfill"/>
    // Defines console for IE.
    // Used to prevent the application to stop working in IE
    // verify if there not console
    var windowCast = window;
    if (typeof window.console === 'undefined') {
        windowCast.console = {};
        var i = 0;
        // defining default function
        var noop = function () { };
        // defining methods names for console.
        var methods = [
            'assert',
            'error',
            'clear',
            'count',
            'debug',
            'dir',
            'dirxml',
            'exception',
            'group',
            'groupCollapsed',
            'groupEnd',
            'info',
            'log',
            'profile',
            'profileEnd',
            'table',
            'time',
            'timeEnd',
            'trace',
            'warn'
        ];
        // adding all methods
        for (; i < methods.length; i++) {
            windowCast.console[methods[i]] = noop;
        }
    }
    // adding memory object
    if (typeof windowCast.console.memory === 'undefined') {
        windowCast.console.memory = {};
    }
    var ConsolePolyfill = windowCast.console;
    return ConsolePolyfill;
});

//# sourceMappingURL=Console.Polyfill.js.map
