/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers", ["require", "exports", "underscore", "Loggers.Configuration"], function (require, exports, _, Loggers_Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Loggers = /** @class */ (function () {
        function Loggers() {
            this.actions = {};
            this.actionsKey = 1;
            this.actionsName = {};
        }
        Loggers.prototype.getAppenders = function (profiles) {
            if (profiles === void 0) { profiles = []; }
            var configProfile = _.find(profiles, function (cp) {
                return cp.profile.name === Loggers.profile.name;
            });
            return (configProfile && configProfile.appenders) || [];
        };
        Loggers.prototype.log = function (method, logLevel, message) {
            if (logLevel <= Loggers.profile.logLevel) {
                var appenders = this.getAppenders(this.config.log);
                _.each(appenders, function (appender) {
                    if (appender.ready()) {
                        try {
                            appender[method](message);
                        }
                        catch (e) {
                            console.warn(e);
                        }
                    }
                });
            }
        };
        Loggers.prototype.info = function (data) {
            if (this.config) {
                this.log('info', Loggers_Configuration_1.LogLevels.INFO, data);
            }
        };
        Loggers.prototype.error = function (data) {
            if (this.config) {
                this.log('error', Loggers_Configuration_1.LogLevels.ERROR, data);
            }
        };
        Loggers.prototype.start = function (action, options) {
            if (options === void 0) { options = {}; }
            if (this.config) {
                var actionKey = this.actionsKey++;
                var appenders = this.getAppenders(this.config.actions[action]);
                var actionAppenders_1 = [];
                _.each(appenders, function (appender) {
                    if (appender.ready()) {
                        try {
                            actionAppenders_1.push({
                                appender: appender,
                                data: appender.start(action, options)
                            });
                        }
                        catch (e) {
                            console.warn(e);
                        }
                    }
                });
                this.actions[actionKey] = actionAppenders_1;
                this.actionsName[action] = actionKey;
                return actionKey;
            }
            return 0;
        };
        Loggers.prototype.end = function (actionKey, options) {
            if (options === void 0) { options = {}; }
            if (this.config) {
                var appenders = this.actions[actionKey];
                _.each(appenders, function (appenderContext) {
                    if (appenderContext.appender.ready()) {
                        try {
                            appenderContext.appender.end(appenderContext.data, options);
                        }
                        catch (e) {
                            console.warn(e);
                        }
                    }
                });
                delete this.actions[actionKey];
            }
        };
        Loggers.prototype.endLast = function (actionName, options) {
            if (this.config) {
                var actionKey = this.actionsName[actionName];
                this.end(actionKey, options);
                delete this.actionsName[actionName];
            }
        };
        Loggers.getLogger = function (name) {
            if (name === void 0) { name = 'root'; }
            if (Loggers.configurations[name]) {
                if (!Loggers.instances[name]) {
                    Loggers.instances[name] = new Loggers();
                    Loggers.instances[name].config = Loggers.configurations[name];
                }
                return Loggers.instances[name];
            }
            if (!this.errorMessageOnce[name]) {
                this.errorMessageOnce[name] = true;
                console.error('Configuration for Logger "' + name + '" not setted');
            }
            return new Loggers();
        };
        Loggers.setConfiguration = function (configurationLogger) {
            _.each(configurationLogger, function (config, name) {
                var childLoggers = config.loggers;
                delete config.loggers;
                if (!Loggers.configurations[name]) {
                    Loggers.configurations[name] = config;
                }
                else {
                    console.error('Configuration for Logger "' + name + '" already setted');
                }
                Loggers.getLogger(name);
                _.each(childLoggers, function (childConfigLoggers) {
                    childConfigLoggers.log = childConfigLoggers.log || config.log;
                    childConfigLoggers.actions = _.extend({}, config.actions, childConfigLoggers.actions);
                });
                Loggers.setConfiguration(childLoggers);
            });
        };
        Loggers.profile = SC.isDevelopment ? Loggers_Configuration_1.dev : Loggers_Configuration_1.prod;
        Loggers.configurations = {};
        Loggers.instances = {};
        Loggers.errorMessageOnce = {};
        return Loggers;
    }());
    exports.Loggers = Loggers;
});

//# sourceMappingURL=Loggers.js.map
