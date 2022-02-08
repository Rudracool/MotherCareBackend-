/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.Browse.CategoryHeading.View", ["require", "exports", "facets_browse_category_heading.tpl", "Categories.Utils", "Backbone.View"], function (require, exports, facetsBrowseCategoryHeadingTpl, Categories_Utils_1, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: facetsBrowseCategoryHeadingTpl,
        getContext: function () {
            var additionalFields = Categories_Utils_1.getAdditionalFields(this.model.attributes, 'categories.category.fields');
            return {
                // @property {String} name
                name: this.model.get('name'),
                // @property {String} banner
                banner: this.model.get('pagebannerurl'),
                // @property {String} description
                description: this.model.get('description'),
                // @property {String} pageheading
                pageheading: this.model.get('pageheading') || this.model.get('name'),
                // @property {Boolean} hasBanner
                hasBanner: !!this.model.get('pagebannerurl'),
                // @property {Object} additionalFields
                additionalFields: additionalFields,
                // @property {Boolean} showDescription
                showDescription: !!this.options.showDescription
            };
        }
    });
});

//# sourceMappingURL=Facets.Browse.CategoryHeading.View.js.map
