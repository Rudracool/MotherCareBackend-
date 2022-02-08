/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Sensors.ErrorStatus", ["require", "exports", "ComponentContainer"], function (require, exports, ComponentContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function errorStatus() {
        var componentContainer = ComponentContainer_1.ComponentContainer.getInstance();
        var application = componentContainer.getComponent('Layout').application;
        var current_view = application.getLayout().getCurrentView();
        var errorData = current_view.isErrorView && (current_view.getPageDescription() || 'error');
        return { errorStatus: errorData };
    }
    exports.errorStatus = errorStatus;
});

//# sourceMappingURL=Loggers.Appender.Sensors.ErrorStatus.js.map
