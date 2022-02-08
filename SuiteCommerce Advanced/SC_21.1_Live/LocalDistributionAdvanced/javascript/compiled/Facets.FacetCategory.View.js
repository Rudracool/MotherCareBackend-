/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.FacetCategory.View", ["require", "exports", "underscore", "Facets.FacetCategoriesList.View", "Backbone.View", "Backbone.CollectionView"], function (require, exports, _, FacetsFacetCategoriesListView, BackboneView) {
    "use strict";
    return BackboneView.extend({
        initialize: function () {
            // We assume this.model is a facet
            this.value = this.options.urlMemo
                ? this.options.urlMemo + '/' + this.model.urlcomponent
                : this.model.urlcomponent;
        },
        // @method getContext @return Facets.FacetCategory.View.Context
        getContext: function () {
            var is_selected = this.options.selected === this.model;
            var subcategories = this.model.categories;
            // @class Facets.FacetCategory.View.Context
            return {
                // @property {Boolean} isActive
                isActive: is_selected ||
                    (this.options.selected && ~this.options.selected.indexOf(this.value + '/')),
                // @property {String} itemId
                itemId: this.model.itemId,
                // @property {String} listId
                url: this.model.url,
                // @property {Boolean} hasSubcategory
                hasSubcategory: subcategories && _.values(subcategories).length,
                // @property {Boolean} hasItems
                hasItems: this.model.count > 0,
                // @property {Number} itemCount
                itemCount: this.model.count
            };
            // @class Facets.FacetCategory.View
        },
        childViews: {
            'Facets.FacetCategoriesList': function () {
                var sub_list_id = _.uniqueId('facetSubList_');
                return new FacetsFacetCategoriesListView({
                    list: this.model.categories,
                    facet: this.options.facet,
                    translator: this.options.translator,
                    urlMemo: this.value,
                    listId: sub_list_id,
                    collapsed: !this.options.selected ||
                        this.value !== this.options.selected.substring(0, this.value.length),
                    selected: this.options.selected
                });
            }
        }
    });
});

//# sourceMappingURL=Facets.FacetCategory.View.js.map
