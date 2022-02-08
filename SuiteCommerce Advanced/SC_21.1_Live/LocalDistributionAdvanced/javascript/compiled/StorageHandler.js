/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StorageHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-module name="StorageHandler"/>
    exports.StorageHandler = {
        // @method setLocalStorage
        // Set/update a value for the "key" in local storage
        // @param {Object} value Value of the attribute "key" in local storage
        // @param {Object} key Attribute name of a key in local storage
        set: function (key, value) {
            value = value && JSON.stringify(value);
            localStorage.setItem(key, value);
        },
        // @method getFromLocalStorage
        // Get the value of key in local storage
        // @param {Object} key Attribute name of a key in local storage
        // @return {Object} Data retrieved form localstorage parsed in JSON format
        get: function (key) {
            var data = localStorage.getItem(key);
            return data && JSON.parse(data);
        },
        remove: function (key) {
            localStorage.removeItem(key);
        }
    };
});

//# sourceMappingURL=StorageHandler.js.map
