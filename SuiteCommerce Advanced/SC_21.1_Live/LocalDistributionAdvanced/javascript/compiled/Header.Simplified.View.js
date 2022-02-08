/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Header.Simplified.View", ["require", "exports", "header_simplified.tpl", "Header.Logo.View", "Backbone.View"], function (require, exports, header_simplified_tpl, HeaderLogoView, BackboneView) {
    "use strict";
    return BackboneView.extend({
        // @property {Function} template
        template: header_simplified_tpl,
        // @property {Object} childViews
        childViews: {
            'Header.Logo': function () {
                return new HeaderLogoView(this.options);
            }
        }
    });
});

//# sourceMappingURL=Header.Simplified.View.js.map
