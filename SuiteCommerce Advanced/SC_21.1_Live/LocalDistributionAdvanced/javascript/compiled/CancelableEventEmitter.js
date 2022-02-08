/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CancelableEventEmitter", ["require", "exports", "underscore", "jQuery", "Utils"], function (require, exports, _, jQuery, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DefaultCancelableEventEmitter = /** @class */ (function () {
        function DefaultCancelableEventEmitter() {
            this.listeners = {};
            this.disabledListeners = {};
        }
        DefaultCancelableEventEmitter.prototype.getEventListeners = function (eventName) {
            return this.listeners[eventName];
        };
        DefaultCancelableEventEmitter.prototype.on = function (eventName, callback) {
            if (!_.find(this.getEventListeners(eventName), function (listener) { return listener === callback; })) {
                this.listeners[eventName] = this.listeners[eventName] || [];
                this.listeners[eventName].push(callback);
            }
        };
        DefaultCancelableEventEmitter.prototype.off = function (eventName, callback) {
            if (this.listeners[eventName]) {
                var index = this.listeners[eventName].indexOf(callback);
                if (index >= 0) {
                    this.listeners[eventName].splice(index, 1);
                }
            }
        };
        DefaultCancelableEventEmitter.prototype.getSafeParameters = function (args) {
            return args !== undefined ? args : Utils_1.deepCopy(args);
        };
        DefaultCancelableEventEmitter.prototype.internalEmit = function (eventName, safe) {
            var _this = this;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var promises = _.map(this.getEventListeners(eventName), function (listener) {
                try {
                    var parameters = safe ? _.map(args, _this.getSafeParameters) : args;
                    return listener.apply(void 0, parameters);
                }
                catch (error) {
                    return jQuery.Deferred().reject(error);
                }
            });
            return jQuery.when.apply(jQuery, promises);
        };
        DefaultCancelableEventEmitter.prototype.emit = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.internalEmit.apply(this, [eventName, true].concat(args));
        };
        DefaultCancelableEventEmitter.prototype.emitUnsafe = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.internalEmit.apply(this, [eventName, false].concat(args));
        };
        DefaultCancelableEventEmitter.prototype.enable = function (eventName) {
            if (!_.isEmpty(this.disabledListeners[eventName])) {
                this.listeners[eventName] = _.union(this.listeners[eventName], this.disabledListeners[eventName]);
                this.disabledListeners[eventName] = [];
            }
        };
        DefaultCancelableEventEmitter.prototype.disable = function (eventName) {
            if (_.isEmpty(this.disabledListeners[eventName])) {
                this.disabledListeners[eventName] = this.listeners[eventName];
                this.listeners[eventName] = [];
            }
        };
        return DefaultCancelableEventEmitter;
    }());
    exports.DefaultCancelableEventEmitter = DefaultCancelableEventEmitter;
});

//# sourceMappingURL=CancelableEventEmitter.js.map
