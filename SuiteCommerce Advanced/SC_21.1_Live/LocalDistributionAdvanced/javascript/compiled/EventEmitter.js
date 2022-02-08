/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("EventEmitter", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DefaultEventEmitter = /** @class */ (function () {
        function DefaultEventEmitter() {
            this.listeners = {};
            this.onceListeners = {};
        }
        DefaultEventEmitter.prototype.getEventListeners = function (eventName) {
            return this.listeners[eventName];
        };
        DefaultEventEmitter.prototype.getEventOnceListeners = function (eventName) {
            return this.onceListeners[eventName];
        };
        DefaultEventEmitter.prototype.on = function (eventName, callback) {
            if (!_.find(this.getEventListeners(eventName), function (listener) { return listener === callback; })) {
                this.listeners[eventName] = this.listeners[eventName] || [];
                this.listeners[eventName].push(callback);
            }
        };
        DefaultEventEmitter.prototype.once = function (eventName, callback) {
            if (!_.find(this.getEventOnceListeners(eventName), function (listener) { return listener === callback; })) {
                this.onceListeners[eventName] = this.onceListeners[eventName] || [];
                this.onceListeners[eventName].push(callback);
            }
        };
        DefaultEventEmitter.prototype.off = function (eventName, callback) {
            if (this.listeners[eventName]) {
                var index = this.listeners[eventName].indexOf(callback);
                if (index >= 0) {
                    this.listeners[eventName].splice(index, 1);
                }
            }
        };
        DefaultEventEmitter.prototype.emit = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _.map(this.getEventListeners(eventName), function (listener) { return listener.apply(void 0, args); });
            var onceListeners = this.getEventOnceListeners(eventName);
            while (onceListeners && onceListeners.length) {
                var listener = onceListeners.pop();
                listener.apply(void 0, args);
            }
        };
        return DefaultEventEmitter;
    }());
    exports.DefaultEventEmitter = DefaultEventEmitter;
});

//# sourceMappingURL=EventEmitter.js.map
