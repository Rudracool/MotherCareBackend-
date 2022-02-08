/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.Plugin.DebugTemplateName", ["require", "exports", "underscore", "Backbone.View.DebugTemplateName", "Backbone.View.render"], function (require, exports, _, Backbone_View_DebugTemplateName_1, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BackboneViewPluginDebugTemplateName = {
        mountToApp: function () {
            if (!_.result(SC, 'isPageGenerator')) {
                BackboneView.postCompile.install({
                    name: 'debugTemplateName',
                    priority: 10,
                    execute: Backbone_View_DebugTemplateName_1.backboneViewDebugTemplateName
                });
            }
        }
    };
});

//# sourceMappingURL=Backbone.View.Plugin.DebugTemplateName.js.map
