/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.ElasticLogger.Tracker", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-module name="Loggers.Appender.ElasticLogger.Tracker"/>
    /**
     * Represents a time span being logged.
     * Provides functionality for tracking manipulation.
     */
    var Tracker = /** @class */ (function () {
        /**
         * Tracker constructor
         * @param actionName Name of the action to be tracked
         */
        function Tracker(actionName) {
            this.actionName = actionName;
            this.actionId = Tracker.createGuid();
            this.begin = performance.timing.navigationStart + performance.now();
        }
        /**
         * Creates a version 4 uuid
         */
        Tracker.createGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                // eslint-disable-next-line no-bitwise
                var r = (Math.random() * 16) | 0;
                // eslint-disable-next-line no-bitwise
                var v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };
        /**
         * Id getter
         */
        Tracker.prototype.getId = function () {
            return this.actionId;
        };
        /**
         * Total time getter
         */
        Tracker.prototype.getTotalTime = function () {
            return this.totalTime;
        };
        /**
         * Action name getter
         */
        Tracker.prototype.getActionName = function () {
            return this.actionName;
        };
        /**
         * Overrides the start time for the tracker. Useful for backdating.
         * @param startTime Start time/date to be overriden.
         */
        Tracker.prototype.setBegin = function (startTime) {
            this.begin = startTime || performance.timing.navigationStart + performance.now();
            return this;
        };
        /**
         * Ends the tracking. If no endTime is provided, the present time will be used.
         * @param endTime End time/date to be overriden.
         */
        Tracker.prototype.endTracking = function (endTime) {
            var end = endTime || performance.timing.navigationStart + performance.now();
            var delay = end - this.begin;
            this.totalTime = Math.round(delay);
            return this;
        };
        return Tracker;
    }());
    exports.Tracker = Tracker;
});

//# sourceMappingURL=Loggers.Appender.ElasticLogger.Tracker.js.map
