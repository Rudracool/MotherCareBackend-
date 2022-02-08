/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.Plugin.Bootstrap", ["require", "exports", "underscore", "Backbone.View.Bootstrap", "Backbone.View.render"], function (require, exports, _, Backbone_View_Bootstrap_1, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BackboneViewPluginBootstrap = {
        mountToApp: function () {
            if (!_.result(SC, 'isPageGenerator')) {
                BackboneView.postRender.install({
                    name: 'HTMLBootstrap',
                    priority: 10,
                    // Fix all HTML bootstrap tooltips
                    execute: Backbone_View_Bootstrap_1.backboneViewBootstrap
                });
            }
        }
    };
});

//# sourceMappingURL=Backbone.View.Plugin.Bootstrap.js.map
