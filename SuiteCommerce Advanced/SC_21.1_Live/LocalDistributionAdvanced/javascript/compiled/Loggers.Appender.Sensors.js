/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("Loggers.Appender.Sensors", ["require", "exports", "underscore", "Logger.Appender.Sensor.DataContractVersion", "Loggers.Appender.Sensors.Bundle", "Loggers.Appender.Sensors.Shopper", "Loggers.Appender.Sensors.Device", "Loggers.Appender.Sensors.SiteData", "Loggers.Appender.Sensors.ErrorStatus", "Loggers.Appender.Sensors.Customer", "Loggers.Appender.Sensors.Cart"], function (require, exports, _, Logger_Appender_Sensor_DataContractVersion_1, Loggers_Appender_Sensors_Bundle_1, Loggers_Appender_Sensors_Shopper_1, Loggers_Appender_Sensors_Device_1, Loggers_Appender_Sensors_SiteData_1, Loggers_Appender_Sensors_ErrorStatus_1, Loggers_Appender_Sensors_Customer_1, Loggers_Appender_Sensors_Cart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoggersAppenderSensors = /** @class */ (function () {
        function LoggersAppenderSensors() {
            this.firstTime = true;
            this.paramsMap = {};
            this.enabled = !SC.isPageGenerator();
            // don't execute in Page Generator
            if (this.enabled) {
                this.NLRUM = window.NLRUM;
                if (this.NLRUM && this.NLRUM.addSCData) {
                    this.applicationStartTime = window.applicationStartTime;
                    this.NLRUM.setCommerceContext(this.NLRUM.commerceContext.SCA);
                    this.registerMap();
                }
                else {
                    this.enabled = false;
                    console.log('nlRUM.js failed to load');
                }
            }
        }
        LoggersAppenderSensors.prototype.registerMap = function () {
            this.paramsMap = {
                status: {
                    key: 'status',
                    values: {
                        success: this.NLRUM.status.completed,
                        fail: this.NLRUM.status.incomplete,
                        cancelled: this.NLRUM.status.cancelled
                    }
                }
            };
        };
        LoggersAppenderSensors.prototype.mapParams = function (params) {
            var _this = this;
            var mapped = {};
            _.mapObject(params, function (value, key) {
                if (_this.paramsMap[key]) {
                    mapped[_this.paramsMap[key].key] =
                        _this.paramsMap[key].values && _this.paramsMap[key].values[value]
                            ? _this.paramsMap[key].values[value]
                            : value;
                }
                else {
                    mapped[key] = value;
                }
            });
            return mapped;
        };
        LoggersAppenderSensors.prototype.ready = function () {
            return this.enabled;
        };
        LoggersAppenderSensors.prototype.info = function () { };
        LoggersAppenderSensors.prototype.error = function () { };
        LoggersAppenderSensors.prototype.startNavigation = function () {
            if (this.applicationStartTime) {
                var options = { action: 'Navigation' };
                if (this.firstTime) {
                    this.firstTime = false;
                    options.startTime = this.applicationStartTime;
                }
                else {
                    if (this.NLRUM.markIndirectStart) {
                        this.NLRUM.markIndirectStart();
                    }
                    options.startTime = Date.now();
                }
                return options;
            }
        };
        LoggersAppenderSensors.prototype.start = function (action, _options) {
            if (action === 'Navigation') {
                return this.startNavigation();
            }
            var actionId = this.NLRUM.actionStart(action);
            return { actionId: actionId };
        };
        LoggersAppenderSensors.prototype.endNavigation = function (options) {
            if (this.applicationStartTime) {
                var showContentTime = Date.now() - options.startTime;
                var data = __assign({}, Loggers_Appender_Sensors_Bundle_1.bundle(), Loggers_Appender_Sensors_Shopper_1.shopper(), Loggers_Appender_Sensors_Customer_1.customer(), Loggers_Appender_Sensors_Device_1.device(), Loggers_Appender_Sensors_SiteData_1.site(), Loggers_Appender_Sensors_ErrorStatus_1.errorStatus(), Logger_Appender_Sensor_DataContractVersion_1.dataContractVersion(), { showContentTime: showContentTime });
                if (options.itemId) {
                    data.itemId = options.itemId;
                }
                if (options.searchQuery) {
                    data.searchQuery = options.searchQuery;
                }
                if (options.searchResultCount !== undefined) {
                    data.searchResultCount = options.searchResultCount;
                }
                if (options.searchPageNumber !== undefined) {
                    data.searchPageNumber = options.searchPageNumber;
                }
                if (options.displayedInModal) {
                    data.displayedInModal = options.displayedInModal;
                }
                this.NLRUM.addSCData(data);
            }
        };
        LoggersAppenderSensors.prototype.extractOperationIds = function (options) {
            if (_.isString(options.operationIds)) {
                return [options.operationIds];
            }
            if (_.isArray(options.operationIds)) {
                return options.operationIds.slice(0);
            }
            return [];
        };
        LoggersAppenderSensors.prototype.end = function (dataStart, options) {
            if (dataStart.action === 'Navigation') {
                dataStart = _.extend(dataStart, options);
                this.endNavigation(dataStart);
            }
            else {
                var trackOptions = __assign({ actionId: dataStart.actionId, operationIds: this.extractOperationIds(options), status: options.status, cartLines: options.cartLines || Loggers_Appender_Sensors_Cart_1.cart() }, Loggers_Appender_Sensors_Shopper_1.shopper(), Loggers_Appender_Sensors_Bundle_1.bundle(), Loggers_Appender_Sensors_SiteData_1.site(), Loggers_Appender_Sensors_Customer_1.customer(), Loggers_Appender_Sensors_Device_1.device(), Logger_Appender_Sensor_DataContractVersion_1.dataContractVersion());
                if (options.itemId) {
                    trackOptions.itemId = options.itemId;
                }
                if (options.itemQuantity) {
                    trackOptions.itemQuantity = options.itemQuantity;
                }
                if (options.transactionId) {
                    trackOptions.transactionId = options.transactionId;
                }
                this.NLRUM.actionEnd(dataStart.actionId, this.mapParams(trackOptions));
            }
        };
        LoggersAppenderSensors.getInstance = function () {
            if (!LoggersAppenderSensors.instance) {
                LoggersAppenderSensors.instance = new LoggersAppenderSensors();
            }
            return LoggersAppenderSensors.instance;
        };
        return LoggersAppenderSensors;
    }());
    exports.LoggersAppenderSensors = LoggersAppenderSensors;
});

//# sourceMappingURL=Loggers.Appender.Sensors.js.map
