/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.Empty.View", ["require", "exports", "facets_empty.tpl", "Backbone.View"], function (require, exports, facets_empty_tpl, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: facets_empty_tpl,
        // @method getContext @returns {Facets.Empty.View.Context}
        getContext: function () {
            // @class Facets.Empty.View.Context
            return {
                // @property {String} keywords
                keywords: this.options.keywords
            };
            // @classFacets.Empty.View.View
        }
    });
});

//# sourceMappingURL=Facets.Empty.View.js.map
