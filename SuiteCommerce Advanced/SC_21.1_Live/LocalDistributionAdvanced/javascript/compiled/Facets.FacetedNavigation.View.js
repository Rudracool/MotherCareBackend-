/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.FacetedNavigation.View", ["require", "exports", "underscore", "facets_faceted_navigation.tpl", "Configuration", "Profile.Model", "Facets.FacetedNavigationItem.View", "Backbone.View", "Backbone", "Backbone.CollectionView"], function (require, exports, _, facets_faceted_navigation_tpl, Configuration_1, Profile_Model_1, FacetsFacetedNavigationItemView, BackboneView, Backbone, BackboneCollectionView) {
    "use strict";
    return BackboneView.extend({
        template: facets_faceted_navigation_tpl,
        initialize: function (options) {
            this.categoryItemId = options.categoryItemId;
            this.clearAllFacetsLink = options.clearAllFacetsLink;
            this.hasCategories = options.hasCategories;
            this.hasItems = options.hasItems;
            this.hasFacets = options.hasFacets;
            this.hasCategoriesAndFacets = options.hasCategoriesAndFacets;
            this.appliedFacets = options.appliedFacets;
            this.hasFacetsOrAppliedFacets = options.hasFacetsOrAppliedFacets;
            this.keywords = options.keywords;
            this.totalProducts = options.totalProducts;
        },
        childViews: {
            'Facets.FacetedNavigationItems': function () {
                var translator = this.options.translator; // FacetsHelper.parseUrl(this.options.translatorUrl, this.options.translatorConfig, this.options.translator.categoryUrl)
                var ordered_facets = this.options.facets &&
                    this.options.facets.sort(function (a, b) {
                        // Default Priority is 0
                        return ((translator.getFacetConfig(b.url || b.id).priority || 0) -
                            (translator.getFacetConfig(a.url || a.id).priority || 0));
                    });
                // if prices aren't to be shown we take out price related facet
                var hidden_facet_names = Configuration_1.Configuration.get('loginToSeePrices.hiddenFacetNames', []);
                if (Profile_Model_1.ProfileModel.getInstance().hidePrices()) {
                    ordered_facets = _.reject(ordered_facets, function (item) {
                        return _.indexOf(hidden_facet_names, item.id) >= 0;
                    });
                }
                return new BackboneCollectionView({
                    childView: FacetsFacetedNavigationItemView,
                    viewsPerRow: 1,
                    collection: new Backbone.Collection(ordered_facets),
                    childViewOptions: {
                        translator: translator
                    }
                });
            }
        },
        // @method getContext
        // @returns {Facets.FacetedNavigation.View.Context}
        getContext: function () {
            // @class Facets.FacetedNavigation.View.Context
            return {
                // @property {Number} totalProducts
                totalProducts: this.totalProducts,
                // @property {Boolean} isTotalProductsOne
                isTotalProductsOne: this.totalProducts === 1,
                // @property {String} keywords
                keywords: this.keywords,
                // @property {String} categoryItemId
                categoryItemId: this.categoryItemId,
                // @property {String} clearAllFacetsLink
                clearAllFacetsLink: this.clearAllFacetsLink,
                // @property {Boolean} hasCategories
                hasCategories: this.hasCategories,
                // @property {Boolean} hasItems
                hasItems: this.hasItems,
                // @property {Boolean} hasFacets
                hasFacets: this.hasFacets,
                // @property {Boolean} hasCategoriesAndFacets
                hasCategoriesAndFacets: this.hasCategoriesAndFacets,
                // @property {Array} appliedFacets
                appliedFacets: this.appliedFacets,
                // @property {Boolean} hasAppliedFacets
                hasAppliedFacets: this.appliedFacets && this.appliedFacets.length > 0,
                // @property {Array} hasFacetsOrAppliedFacets
                hasFacetsOrAppliedFacets: this.hasFacetsOrAppliedFacets
            };
            // @class Facets.FacetedNavigation.View
        }
    });
});

//# sourceMappingURL=Facets.FacetedNavigation.View.js.map
