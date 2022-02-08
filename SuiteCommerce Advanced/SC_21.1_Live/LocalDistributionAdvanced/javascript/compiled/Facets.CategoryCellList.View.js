/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.CategoryCellList.View", ["require", "exports", "Facets.CategoryCell.View", "Backbone.View", "Backbone.CollectionView"], function (require, exports, FacetsCategoryCellView, BackboneView, BackboneCollectionView) {
    "use strict";
    return BackboneView.extend({
        childViews: {
            'Facets.CategoryCells': function () {
                return new BackboneCollectionView({
                    childView: FacetsCategoryCellView,
                    collection: this.model.values.values
                });
            }
        },
        // @method getContext @return Facets.CategoryCellList.View.Context
        getContext: function () {
            // @class Facets.CategoryCellList.View.Context
            return {
                // @property {String} hasTwoOrMoreFacets
                hasTwoOrMoreFacets: this.options.hasTwoOrMoreFacets,
                // @property {String} name
                name: this.model.name,
                // @property {String} url
                url: this.model.url
            };
        }
    });
});

//# sourceMappingURL=Facets.CategoryCellList.View.js.map
