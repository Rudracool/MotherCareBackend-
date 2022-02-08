/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.Plugin.PageGeneratorImages", ["require", "exports", "underscore", "Backbone.View.PageGeneratorImages", "Backbone.View"], function (require, exports, _, Backbone_View_PageGeneratorImages_1, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BackboneViewPluginPageGeneratorImages = {
        mountToApp: function () {
            // wrap all images with noscript tag in the page generator output so they are not automatically loaded by the browser and compete with our core resources.
            if (_.result(SC, 'isPageGenerator')) {
                BackboneView.postCompile.install({
                    name: 'pageGeneratorWrapImagesNoscript',
                    priority: 30,
                    execute: Backbone_View_PageGeneratorImages_1.backboneViewPageGeneratorImages
                });
            }
        }
    };
});

//# sourceMappingURL=Backbone.View.Plugin.PageGeneratorImages.js.map
