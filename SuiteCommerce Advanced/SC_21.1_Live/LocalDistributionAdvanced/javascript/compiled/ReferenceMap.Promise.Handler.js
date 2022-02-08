/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReferenceMap.Promise.Handler", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <amd-module name="ReferenceMap.Promise.Handler"/>
    // @module StoreLocatorReferenceMapsImplementation
    var ReferenceMapPromiseHandler = /** @class */ (function () {
        function ReferenceMapPromiseHandler() {
            this.initialize = function () {
                this.promise = null;
            };
            this.setPromise = function (promise) {
                this.promise = promise;
            };
            this.getPromise = function () {
                return this.promise;
            };
            if (ReferenceMapPromiseHandler.instance !== null) {
                throw new Error('Cannot instantiate more than one ReferenceMapPromiseHandler, use ReferenceMapPromiseHandler.getInstance()');
            }
            this.initialize();
        }
        ReferenceMapPromiseHandler.instance = null;
        ReferenceMapPromiseHandler.getInstance = function () {
            if (ReferenceMapPromiseHandler.instance === null) {
                ReferenceMapPromiseHandler.instance = new ReferenceMapPromiseHandler();
            }
            return ReferenceMapPromiseHandler.instance;
        };
        return ReferenceMapPromiseHandler;
    }());
    return ReferenceMapPromiseHandler.getInstance();
});

//# sourceMappingURL=ReferenceMap.Promise.Handler.js.map
