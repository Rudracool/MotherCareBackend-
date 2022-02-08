/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.DebugTemplateName", ["require", "exports", "underscore", "Utils"], function (require, exports, _, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function backboneViewDebugTemplateName(tmpl_str, view) {
        if (!_.result(SC, 'isPageGenerator')) {
            var template_name = view.template.Name;
            var prefix = Utils.isPageGenerator()
                ? ''
                : '\n\n<!-- TEMPLATE STARTS: ' + template_name + '-->\n';
            var posfix = Utils.isPageGenerator()
                ? ''
                : '\n<!-- TEMPLATE ENDS: ' + template_name + ' -->\n';
            tmpl_str = prefix + tmpl_str + posfix;
            // Fixing backward compatibility of templates due to a security fix on JQuery 3.5.0: https://blog.jquery.com/2020/04/10/jquery-3-5-0-released/
            tmpl_str = tmpl_str.replace(/>[\s\n\t\r]*</g, '><');
        }
        return tmpl_str;
    }
    exports.backboneViewDebugTemplateName = backboneViewDebugTemplateName;
});

//# sourceMappingURL=Backbone.View.DebugTemplateName.js.map
