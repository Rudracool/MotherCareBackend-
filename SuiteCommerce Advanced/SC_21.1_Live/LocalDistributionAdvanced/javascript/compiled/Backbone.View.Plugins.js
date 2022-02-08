/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.Plugins", ["require", "exports", "Backbone.View.Plugin.ApplyPermissions", "Backbone.View.Plugin.Bootstrap", "Backbone.View.Plugin.DatePicker", "Backbone.View.Plugin.DebugTemplateName", "Backbone.View.Plugin.PageGeneratorImages"], function (require, exports, Backbone_View_Plugin_ApplyPermissions_1, Backbone_View_Plugin_Bootstrap_1, Backbone_View_Plugin_DatePicker_1, Backbone_View_Plugin_DebugTemplateName_1, Backbone_View_Plugin_PageGeneratorImages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
    @module BackboneExtras
    #Backbone.View.Plugins
    Define the default plugins to execute by Backbone.View.render method. These plugins hook into the Backobne.view
    render() life cycle and modify the view's output somehow, for example removing marked nodes that current user
    has not permission to see, installing bootstrap widgets after a view is rendered, etc.
    */
    var plugins = [
        Backbone_View_Plugin_ApplyPermissions_1.BackboneViewPluginApplyPermissions,
        Backbone_View_Plugin_Bootstrap_1.BackboneViewPluginBootstrap,
        Backbone_View_Plugin_DatePicker_1.BackboneViewPluginDatePicker,
        Backbone_View_Plugin_DebugTemplateName_1.BackboneViewPluginDebugTemplateName,
        Backbone_View_Plugin_PageGeneratorImages_1.BackboneViewPluginPageGeneratorImages
    ];
    function mountToApp() {
        for (var i = 0; i < plugins.length; ++i) {
            plugins[i].mountToApp.apply(this, arguments);
        }
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=Backbone.View.Plugins.js.map
