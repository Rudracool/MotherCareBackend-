/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.ItemCell.View", ["require", "exports", "underscore", "Utils", "Configuration", "ProductLine.Stock.View", "Product.Model", "GlobalViews.StarRating.View", "Cart.QuickAddToCart.View", "ProductViews.Option.View", "ProductLine.StockDescription.View", "Backbone.View", "Backbone.CollectionView", "Cart.AddToCart.Button.View", "ProductDetails.AddToProductList.View"], function (require, exports, _, Utils, Configuration_1, ProductLineStockView, ProductModel, GlobalViewsStarRating, CartQuickAddToCartView, ProductViewsOptionView, ProductLineStockDescriptionView, BackboneView, BackboneCollectionView, CartAddToCartButtonView, ProductDetailsAddToProductListView) {
    "use strict";
    return BackboneView.extend({
        attributes: {},
        initialize: function (options) {
            if (options.template) {
                this.template = options.template;
            }
            var self = this;
            if (this.model.get("itemoptions_detail") && !_.isUndefined(this.model.get("itemoptions_detail").fields)) {
                self.hasMatrixoptions = true;
            }
            else {
                self.hasMatrixoptions = false;
            }
            if (!_.isUndefined(this.model.get("itemoptions_detail"))) {
                this.product = new ProductModel({
                    item: this.model,
                    quantity: this.model.get('_minimumQuantity', true)
                });
                _.each(this.model.get("itemoptions_detail").fields, function (custom) {
                    if (custom.ismandatory && !_.isUndefined(custom.values) && custom.values.length > 0 && !_.isUndefined(custom.values[0].internalid)) {
                        self.product.setOption(custom.internalid, custom.values[0].internalid);
                    }
                });
                self.model = self.product.get('item');
            }
        },
        events: {
            'click [data-action="changethumbnail"]': 'thumbnailchange'
        },
        thumbnailchange: function (e) {
            e.preventDefault();
            var itemimages = this.model.attributes.itemimages_detail;
            var color = $(e.currentTarget).attr('value');
            var colrs = itemimages[color];
            var link = _.findWhere(colrs, "url");
            var finalurl = link.hasOwnProperty('urls') ? link.urls[0].url : link[0].url;
            $(e.currentTarget).parentsUntil(".facets-item-cell-grid-details").parent().siblings().find(".facets-item-cell-grid-link-image").html("<img class=\"facets-item-cell-grid-image\" src=\"" + finalurl + "\" alt=\"{{thumbnail.altimagetext}}\" itemprop=\"image\"/>\n        ");
            $(e.currentTarget).parentsUntil(".item-relations-cell").parent().find(".item-relations-related-item-thumbnail").html("<img class=\"facets-item-cell-grid-image\" src=\"" + finalurl + "\" alt=\"{{thumbnail.altimagetext}}\" itemprop=\"image\"/>\n        ");
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
            'AddToCart': function () {
                var product = new ProductModel({
                    item: this.model,
                    quantity: this.model.get('_minimumQuantity', true),
                    mybutton: true // for button template customisation
                });
                try {
                    if (this.model.attributes.itemoptions_detail) {
                        this.itemwithoptions = true;
                    }
                }
                catch (error) {
                    console.log('error', error);
                }
                return new CartAddToCartButtonView({
                    model: product,
                    application: this.options.application,
                });
            },
            "WishList": function () {
                if (this.hasMatrixoptions == false) {
                    var product = new ProductModel({
                        item: this.model,
                        quantity: this.model.get('_minimumQuantity', true)
                    });
                    // console.log("addtoproductlist this.options ", this.options)
                    return new ProductDetailsAddToProductListView({
                        model: product,
                        application: this.options.application,
                    });
                }
                else if (this.hasMatrixoptions == true) {
                    console.log("product(item", this.product);
                    return new ProductDetailsAddToProductListView({
                        model: this.product,
                        application: this.options.application
                    });
                }
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
        getExtraChildrenOptions: function getExtraChildrenOptions() {
            // @class ProductDetails.QuickView.View.ExtraChildrenOptions
            return {
                // @property {Boolean} isModal
                isModal: true
            };
            // @class ProductDetails.QuickView.View
        },
        getContext: function () {
            //  console.log(this.model.get('itemoptions_detail'),"anil");
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
                track_productlist_category: this.model.get('track_productlist_category'),
                itemwithoptions: this.model.get('itemoptions_detail') || this.model.get('itemoptions_detail') == "undefined",
            };
        }
    });
});

//# sourceMappingURL=Facets.ItemCell.View.js.map
