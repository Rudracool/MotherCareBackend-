/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.BaseComponent.Plugin.PostRender", ["require", "exports", "underscore", "SC.BaseComponent.ChildViewsComponent"], function (require, exports, _, SC_BaseComponent_ChildViewsComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function scBaseComponentPluginPostRender(tmplStr, view) {
        var cctGenerators = SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getViewsToRerender(view);
        var childViews = {};
        _.each(cctGenerators, function (childViewInstance, containerName) {
            if (!childViews[containerName]) {
                childViews[containerName] = {};
            }
            _.each(childViewInstance, function (childViewGeneratorFunction, viewName) {
                if (!childViews[containerName][viewName]) {
                    childViews[containerName][viewName] = childViewGeneratorFunction(view);
                }
            });
        });
        view.addChildViewInstances(childViews, false);
        return tmplStr;
    }
    exports.scBaseComponentPluginPostRender = scBaseComponentPluginPostRender;
});

//# sourceMappingURL=SC.BaseComponent.Plugin.PostRender.js.map
