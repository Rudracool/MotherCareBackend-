/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Sensors.SiteData", ["require", "exports", "Environment", "ComponentContainer"], function (require, exports, Environment_1, ComponentContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function site() {
        var componentContainer = ComponentContainer_1.ComponentContainer.getInstance();
        var pageType = componentContainer.getComponent('PageType');
        var context = pageType.getContext();
        var data = {
            sitePage: context.page_type,
            siteFragment: context.path,
            sitePageDisplayName: context.page_type_display_name,
            siteUrl: Environment_1.Environment.getSC().ENVIRONMENT.shoppingDomain
        };
        return data;
    }
    exports.site = site;
});

//# sourceMappingURL=Loggers.Appender.Sensors.SiteData.js.map
