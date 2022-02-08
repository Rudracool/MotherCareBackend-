/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.ElasticLogger", ["require", "exports", "Loggers.Appender.ElasticLogger.Tracker", "jQuery", "Utils", "underscore"], function (require, exports, Loggers_Appender_ElasticLogger_Tracker_1, jQuery, Utils, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoggersAppenderElasticLogger = /** @class */ (function () {
        function LoggersAppenderElasticLogger() {
            var _this = this;
            /**
             * Param used to override the start date
             */
            this.START_PARAM = this.paramBackdatingStart();
            /**
             * Param used to override the end date
             */
            this.END_PARAM = this.paramBackdatingEnd();
            /**
             * Param used to provide the component area
             */
            this.COMPONENT_AREA_PARAM = this.paramComponentArea();
            /**
             * Param used to provide the time total
             */
            this.TIME_TOTAL_PARAM = this.paramTimeTotal();
            /**
             * Collection of trackers in progress.
             */
            this.trackersInProgress = [];
            this.queueErrorTemp = [];
            this.queueInfoTemp = [];
            this.isWaiting = false;
            this.enabled = !SC.isPageGenerator();
            if (this.enabled) {
                setInterval(function () {
                    _this.sendQueues(true);
                }, 60000);
                window.addEventListener('beforeunload', function () {
                    _this.sendQueues(false);
                });
            }
        }
        LoggersAppenderElasticLogger.prototype.paramBackdatingStart = function () {
            return 'begin';
        };
        LoggersAppenderElasticLogger.prototype.paramBackdatingEnd = function () {
            return 'end';
        };
        LoggersAppenderElasticLogger.prototype.paramComponentArea = function () {
            return 'componentArea';
        };
        LoggersAppenderElasticLogger.prototype.paramTimeTotal = function () {
            return 'totalTime';
        };
        LoggersAppenderElasticLogger.prototype.clearQueues = function () {
            localStorage.setItem('queueError', JSON.stringify(this.queueErrorTemp));
            localStorage.setItem('queueInfo', JSON.stringify(this.queueInfoTemp));
            this.queueErrorTemp = [];
            this.queueInfoTemp = [];
            this.isWaiting = false;
        };
        LoggersAppenderElasticLogger.prototype.appendTemp = function () {
            if (this.queueErrorTemp.length > 0) {
                var stringQueueError = localStorage.getItem('queueError');
                var queueError = stringQueueError == null ? [] : JSON.parse(stringQueueError);
                localStorage.setItem('queueError', JSON.stringify(queueError.concat(this.queueErrorTemp)));
            }
            if (this.queueInfoTemp.length > 0) {
                var stringQueueInfo = localStorage.getItem('queueInfo');
                var queueInfo = stringQueueInfo == null ? [] : JSON.parse(stringQueueInfo);
                localStorage.setItem('queueInfo', JSON.stringify(queueInfo.concat(this.queueInfoTemp)));
            }
            this.isWaiting = false;
        };
        LoggersAppenderElasticLogger.prototype.sendQueues = function (isAsync) {
            var _this = this;
            var product = SC.ENVIRONMENT.BuildTimeInf.product;
            var URL = Utils.getAbsoluteUrl("services/ElasticLogger.ss?n=" + SC.ENVIRONMENT.siteSettings.siteid, true);
            var queueError = JSON.parse(localStorage.getItem('queueError'));
            var queueInfo = JSON.parse(localStorage.getItem('queueInfo'));
            if ((queueInfo && queueInfo.length > 0) || (queueError && queueError.length > 0)) {
                this.isWaiting = true;
                var data = {
                    type: product,
                    info: queueInfo,
                    error: queueError
                };
                if (navigator.sendBeacon) {
                    var status_1 = navigator.sendBeacon(URL, JSON.stringify(data));
                    if (status_1) {
                        this.clearQueues();
                    }
                    else {
                        this.appendTemp();
                    }
                }
                else {
                    jQuery
                        .ajax({
                        type: 'POST',
                        url: URL,
                        data: JSON.stringify(data),
                        contentType: 'text/plain; charset=UTF-8',
                        async: isAsync
                    })
                        .done(function () {
                        _this.clearQueues();
                    })
                        .fail(function () {
                        _this.appendTemp();
                    });
                }
            }
        };
        LoggersAppenderElasticLogger.prototype.ready = function () {
            return this.enabled;
        };
        LoggersAppenderElasticLogger.prototype.info = function (data) {
            data.suiteScriptAppVersion = SC.ENVIRONMENT.RELEASE_METADATA.version;
            data.message = 'clientSideLogDateTime: ' + new Date().toISOString();
            if (this.isWaiting) {
                this.queueInfoTemp.push(data);
            }
            else {
                var queueInfo = JSON.parse(localStorage.getItem('queueInfo')) || [];
                queueInfo.push(data);
                localStorage.setItem('queueInfo', JSON.stringify(queueInfo));
            }
        };
        LoggersAppenderElasticLogger.prototype.error = function (data) {
            data.suiteScriptAppVersion = SC.ENVIRONMENT.RELEASE_METADATA.version;
            data.message = 'clientSideLogDateTime: ' + new Date().toISOString();
            if (this.isWaiting) {
                this.queueErrorTemp.push(data);
            }
            else {
                var queueError = JSON.parse(localStorage.getItem('queueError')) || [];
                queueError.push(data);
                localStorage.setItem('queueError', JSON.stringify(queueError));
            }
        };
        LoggersAppenderElasticLogger.prototype.start = function (_action) {
            // Generate a new tracker for the action
            var tracker = new Loggers_Appender_ElasticLogger_Tracker_1.Tracker(_action);
            this.trackersInProgress.push(tracker);
            // Return the object expected by the facade
            return {
                actionId: tracker.getId()
            };
        };
        LoggersAppenderElasticLogger.prototype.end = function (_startOptions, _options) {
            var _a;
            // Find the tracker in progress and remove it from the collection
            var tracker = _.find(this.trackersInProgress, function (item) {
                return item.getId() === _startOptions.actionId;
            });
            this.trackersInProgress = _.without(this.trackersInProgress, tracker);
            // Override the start time if provided
            if (!_.isUndefined(_options[this.START_PARAM])) {
                tracker.setBegin(_options[this.START_PARAM]);
            }
            // End the tracking
            if (_.isUndefined(_options[this.END_PARAM])) {
                tracker.endTracking();
            }
            else {
                // Override the end date if provided
                tracker.endTracking(_options[this.END_PARAM]);
            }
            // Generate data object including user provided parameters
            var data = _.extend((_a = {},
                _a[this.COMPONENT_AREA_PARAM] = tracker.getActionName(),
                _a[this.TIME_TOTAL_PARAM] = tracker.getTotalTime(),
                _a), _options);
            // Post to ES as info log
            this.info(data);
        };
        LoggersAppenderElasticLogger.getInstance = function () {
            if (!LoggersAppenderElasticLogger.instance) {
                LoggersAppenderElasticLogger.instance = new LoggersAppenderElasticLogger();
            }
            return LoggersAppenderElasticLogger.instance;
        };
        return LoggersAppenderElasticLogger;
    }());
    exports.LoggersAppenderElasticLogger = LoggersAppenderElasticLogger;
});

//# sourceMappingURL=Loggers.Appender.ElasticLogger.js.map
