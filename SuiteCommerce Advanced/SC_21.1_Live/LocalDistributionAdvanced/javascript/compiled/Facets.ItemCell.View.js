/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.ItemCell.View", ["require", "exports", "underscore", "Utils", "Configuration", "ProductLine.Stock.View", "Product.Model", "GlobalViews.StarRating.View", "Cart.QuickAddToCart.View", "ProductViews.Option.View", "ProductLine.StockDescription.View", "Backbone.View", "Backbone.CollectionView"], function (require, exports, _, Utils, Configuration_1, ProductLineStockView, ProductModel, GlobalViewsStarRating, CartQuickAddToCartView, ProductViewsOptionView, ProductLineStockDescriptionView, BackboneView, BackboneCollectionView) {
    "use strict";
    return BackboneView.extend({
        attributes: {},
        initialize: function (options) {
            if (options.template) {
                this.template = options.template;
            }
        },
        contextData: {
            item: function () {
                return Utils.deepCopy(this.model);
            }
        },
        childViews: {
            'ItemViews.Stock': function () {
                return new ProductLineStockView({
                    model: this.model
                });
            },
            'GlobalViews.StarRating': function () {
                var view = new GlobalViewsStarRating({
                    model: this.model,
                    showRatingCount: false,
                    queryOptions: Utils.parseUrlOptions(location.href)
                });
                return this.options.showStarRating === false ? null : view;
            },
            'ItemDetails.Options': function () {
                var options_configuration = Configuration_1.Configuration.get('ItemOptions.optionsConfiguration', []);
                return new BackboneCollectionView({
                    collection: _.filter(this.model.get('options').sortBy('index'), function (option) {
                        var option_configuration = _.findWhere(options_configuration, {
                            cartOptionId: option.get('cartOptionId')
                        });
                        return option_configuration && option_configuration.showSelectorInList;
                    }),
                    childView: ProductViewsOptionView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        item: this.model,
                        templateName: 'facetCell',
                        showLink: true,
                        hideLabel: true,
                        showSmall: true
                    }
                });
            },
            'Cart.QuickAddToCart': function () {
                var product = new ProductModel({
                    item: this.model,
                    quantity: this.model.get('_minimumQuantity', true)
                });
                return new CartQuickAddToCartView({
                    model: product,
                    application: this.options.application
                });
            },
            StockDescription: function () {
                return new ProductLineStockDescriptionView({
                    model: this.model
                });
            }
        },
        getContext: function () {
            return {
                // @property {String} itemId
                itemId: this.model.get('_id'),
                // @property {String} name
                name: this.model.get('_name'),
                // @property {String} url
                url: this.model.get('_url'),
                // @property {String} sku
                sku: this.model.getSku(),
                // @property {Boolean} isEnvironmentBrowser
                isEnvironmentBrowser: SC.ENVIRONMENT.jsEnvironment === 'browser' && !SC.ENVIRONMENT.isTouchEnabled,
                // @property {ImageContainer} thumbnail
                thumbnail: this.model.getThumbnail(),
                // @property {Boolean} itemIsNavigable
                itemIsNavigable: !_.isUndefined(this.options.itemIsNavigable)
                    ? !!this.options.itemIsNavigable
                    : true,
                // @property {Boolean} showRating
                showRating: SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled,
                // @property {Number} rating
                rating: this.model.get('_rating'),
                // @property {String} track_productlist_list
                track_productlist_list: this.model.get('track_productlist_list'),
                // @property {String} track_productlist_position
                track_productlist_position: this.model.get('track_productlist_position'),
                // @property {String} track_productlist_category
                track_productlist_category: this.model.get('track_productlist_category')
            };
        }
    });
});

//# sourceMappingURL=Facets.ItemCell.View.js.map
