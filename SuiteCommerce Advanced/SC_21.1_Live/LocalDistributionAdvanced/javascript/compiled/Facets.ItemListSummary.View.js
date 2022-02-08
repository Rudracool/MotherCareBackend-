/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.ItemListSummary.View", ["require", "exports", "facets_item_list_summary.tpl", "Backbone.View"], function (require, exports, facets_item_list_summary_tpl, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: facets_item_list_summary_tpl,
        // @method getContext @returns {Facets.ItemListSummary.View.Context}
        getContext: function () {
            var configuration = this.options.configuration;
            var range_end = configuration.currentPage * configuration.itemPerPage;
            var total = configuration.totalItems;
            // @class Facets.ItemListSummary.View.Context
            return {
                // @property {Number} rangeEnd
                rangeEnd: Math.min(range_end, total),
                // @property {Number} rangeStart
                rangeStart: range_end - configuration.itemsPerPage + 1,
                // @property {total} rangeStart
                total: total
            };
        }
    });
});

//# sourceMappingURL=Facets.ItemListSummary.View.js.map
