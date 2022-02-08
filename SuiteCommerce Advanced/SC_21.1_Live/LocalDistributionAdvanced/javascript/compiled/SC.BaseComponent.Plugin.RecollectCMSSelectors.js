/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.BaseComponent.Plugin.RecollectCMSSelectors", ["require", "exports", "underscore", "SC.BaseComponent.ChildViewsComponent"], function (require, exports, _, SC_BaseComponent_ChildViewsComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function scBaseComponentPluginRecollectCMSSelectorsGenerator(tmplStr, view) {
        var regex = /<[^>]*(data-cms-area)=\"([^"\s]+)\"[^>]*>/g;
        var match = regex.exec(tmplStr);
        var selectorsOnUi = [];
        var selector;
        var isEqual = function (obj) {
            return _.isEqual(obj, selector);
        };
        SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.unregisterViewForPlaceholders(view);
        while (match !== null) {
            selector = {
                'data-cms-area': match[2]
            };
            if (!_.find(selectorsOnUi, isEqual)) {
                selectorsOnUi.push(selector);
            }
            else {
                console.warn("Repeated selector " + SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.selectorToString(selector) + " in template " + view.getTemplateName());
            }
            match = regex.exec(tmplStr);
        }
        if (selectorsOnUi.length > 0) {
            SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.registerViewForPlaceholder(selectorsOnUi, view);
        }
        return tmplStr;
    }
    exports.scBaseComponentPluginRecollectCMSSelectorsGenerator = scBaseComponentPluginRecollectCMSSelectorsGenerator;
});

//# sourceMappingURL=SC.BaseComponent.Plugin.RecollectCMSSelectors.js.map
