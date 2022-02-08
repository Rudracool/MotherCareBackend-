/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Configuration.SCA", ["require", "exports", "Loggers.Appender.Sensors", "Loggers.Appender.ElasticLogger", "Loggers.Configuration"], function (require, exports, Loggers_Appender_Sensors_1, Loggers_Appender_ElasticLogger_1, Loggers_Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // const dummy = LoggersAppenderDummy.getInstance();
    var sensors = Loggers_Appender_Sensors_1.LoggersAppenderSensors.getInstance();
    var elasticlogger = Loggers_Appender_ElasticLogger_1.LoggersAppenderElasticLogger.getInstance();
    /**
     * Generates the ConfigurationProfiles for every logging backend
     */
    var actionsConfig = {
        Navigation: [{ profile: Loggers_Configuration_1.prod, appenders: [sensors] }, { profile: Loggers_Configuration_1.dev, appenders: [] }],
        'Place Order': [{ profile: Loggers_Configuration_1.prod, appenders: [sensors] }, { profile: Loggers_Configuration_1.dev, appenders: [] }],
        'Add to Cart': [{ profile: Loggers_Configuration_1.prod, appenders: [sensors] }, { profile: Loggers_Configuration_1.dev, appenders: [] }],
        'Save Credit Card': [{ profile: Loggers_Configuration_1.prod, appenders: [sensors] }, { profile: Loggers_Configuration_1.dev, appenders: [] }],
        'Save Address': [{ profile: Loggers_Configuration_1.prod, appenders: [sensors] }, { profile: Loggers_Configuration_1.dev, appenders: [] }],
        'Customer Registration': [
            { profile: Loggers_Configuration_1.prod, appenders: [sensors] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        'Remove from Cart': [{ profile: Loggers_Configuration_1.prod, appenders: [sensors] }, { profile: Loggers_Configuration_1.dev, appenders: [] }],
        'Request a Quote': [{ profile: Loggers_Configuration_1.prod, appenders: [sensors] }, { profile: Loggers_Configuration_1.dev, appenders: [] }],
        SUBSCRIPTIONS_LIST: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_DETAILS: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_PAUSED: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_RESUMED: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_CANCELED: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_ADDONS_LIST: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_ADDON_LOAD: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_ADDON_PAUSED: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_ADDON_CANCELED: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_ADDON_QTY_CHANGED: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ],
        SUBSCRIPTIONS_ADDON_ADDED: [
            { profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] },
            { profile: Loggers_Configuration_1.dev, appenders: [] }
        ]
    };
    exports.configuration = {
        root: {
            log: [{ profile: Loggers_Configuration_1.prod, appenders: [elasticlogger] }, { profile: Loggers_Configuration_1.dev, appenders: [] }],
            actions: actionsConfig,
            loggers: {}
        }
    };
});

//# sourceMappingURL=Loggers.Configuration.SCA.js.map
