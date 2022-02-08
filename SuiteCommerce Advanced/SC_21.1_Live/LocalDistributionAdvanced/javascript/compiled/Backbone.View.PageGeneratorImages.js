/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.PageGeneratorImages", ["require", "exports", "Environment"], function (require, exports, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function backboneViewPageGeneratorImages(tmpl_str) {
        var SC = Environment_1.Environment.getSC();
        if (SC.isPageGenerator()) {
            return tmpl_str.replace(/(<img\s+[^>]*>\s*<\/img>|<img\s+[^>]*\/>|(?:<img\s+[^>]*>)(?!\s*<\/img>))(?!\s*<\s*\/noscript\s*>)/gim, '<noscript>$1</noscript>');
        }
        return tmpl_str;
    }
    exports.backboneViewPageGeneratorImages = backboneViewPageGeneratorImages;
});

//# sourceMappingURL=Backbone.View.PageGeneratorImages.js.map
