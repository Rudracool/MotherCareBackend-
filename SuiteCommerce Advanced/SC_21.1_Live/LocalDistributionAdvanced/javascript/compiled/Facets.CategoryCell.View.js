/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.CategoryCell.View", ["require", "exports", "facets_category_cell.tpl", "Categories.Utils", "Backbone.View"], function (require, exports, facets_category_cell_tpl, Categories_Utils_1, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: facets_category_cell_tpl,
        // @method getContext @return Facets.CategoryCell.View.Context
        getContext: function () {
            var additionalFields = Categories_Utils_1.getAdditionalFields(this.model.attributes, 'categories.subCategories.fields');
            return {
                // @property {String} label
                name: this.model.get('name'),
                // @property {String} name
                url: this.model.get('fullurl'),
                // @property {String} image
                image: this.model.get('thumbnailurl'),
                // @property {Boolean} hasImage
                hasImage: !!this.model.get('thumbnailurl'),
                // @property {Object} additionalFields
                additionalFields: additionalFields
            };
        }
    });
});

//# sourceMappingURL=Facets.CategoryCell.View.js.map
