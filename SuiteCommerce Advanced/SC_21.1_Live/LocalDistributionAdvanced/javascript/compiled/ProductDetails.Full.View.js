/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("ProductDetails.Full.View", ["require", "exports", "underscore", "product_details_full.tpl", "jQuery", "Configuration", "Environment", "Profile.Model", "ProductDetails.Base.View", "ItemRelations.Related.View", "ItemRelations.Correlated.View", "ProductDetails.Information.View", "SocialSharing.Flyout.View", "ProductReviews.Center.View", "GlobalViews.StarRating.View"], function (require, exports, _, product_details_full_tpl, jQuery, Configuration_1, Environment_1, Profile_Model_1, ProductDetailsBaseView, ItemRelationsRelatedView, ItemRelationsCorrelatedView, ProductDetailsInformationView, SocialSharingFlyoutView, ProductReviewsCenterView, GlobalViewsStarRatingView) {
    "use strict";
    // @class ProductDetails.Full.View Handles the PDP and quick view @extend Backbone.View
    var ProductDetailsFullView = ProductDetailsBaseView.extend({
        // @property {Function} template
        template: product_details_full_tpl,
        // @property {Object} attributes List of HTML attributes applied by Backbone into the $el
        attributes: {
            id: 'ProductDetails.Full.View',
            class: 'view product-detail',
            'data-root-component-id': 'ProductDetails.Full.View'
        },
        bindings: _.extend({}, ProductDetailsBaseView.prototype.bindings, {}),
        // @method initialize Override default method to update the url on changes in the current
        // product
        // @param {ProductDetails.Full.View.Initialize.Options} options
        // @return {Void}
        initialize: function initialize() {
            ProductDetailsBaseView.prototype.initialize.apply(this, arguments);
            this.model.on('change', this.updateURL, this);
            // Tracker.getInstance().trackProductView(this.model);
        },
        childViews: _.extend({}, ProductDetailsBaseView.prototype.childViews, {
            'Correlated.Items': function () {
                return new ItemRelationsCorrelatedView({
                    itemsIds: this.model.get('item').get('internalid'),
                    application: this.application
                });
            },
            'Related.Items': function () {
                return new ItemRelationsRelatedView({
                    itemsIds: this.model.get('item').get('internalid'),
                    application: this.application
                });
            },
            'Product.Information': function () {
                return new ProductDetailsInformationView({
                    model: this.model
                });
            },
            'SocialSharing.Flyout': function () {
                return new SocialSharingFlyoutView({});
            }
        }),
        getChildViews: function () {
            var childViews = this.childViews;
            var SC = Environment_1.Environment.getSC();
            if (SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled) {
                childViews['ProductReviews.Center'] = function wrapperFunction(options) {
                    return function () {
                        return new ProductReviewsCenterView({
                            item: options.model.get('item'),
                            application: options.application
                        });
                    };
                };
                childViews['Global.StarRating'] = function wrapperFunction(options) {
                    return function () {
                        return new GlobalViewsStarRatingView({
                            model: options.model.get('item'),
                            showRatingCount: true,
                            showSchemaInfo: true
                        });
                    };
                };
            }
            return childViews;
        },
        // @method destroy Override default method to detach from change event of the current product
        // @return {Void}
        destroy: function destroy() {
            this.model.off('change');
            return this._destroy();
        },
        // @method Create JsonLd object with product basic info
        // @param {JSONObject} childJsonLd
        // @return {JQuery.Deferred<JsonldProduct>}
        getJsonLd: function getJsonLd(childJsonLd) {
            if (Configuration_1.Configuration.get('structureddatamarkup.type') !== 'JSON-LD') {
                return jQuery.Deferred().resolve(null);
            }
            var priceContainerObject = this.model.getPrice();
            var isPriceRange = priceContainerObject.min && priceContainerObject.max;
            var modelItem = this.model.get('item');
            var stockInfo = this.model.getStockInfo();
            var offers = {
                '@type': 'Offer',
                url: modelItem.get('_url'),
                availability: 'http://schema.org/OutOfStock'
            };
            // Get availability
            if (stockInfo.isPurchasable && !stockInfo.isInStock) {
                offers.availability =
                    Configuration_1.Configuration.get('structureddatamarkup.availabilityonbackorder') === 'PreOrder'
                        ? 'http://schema.org/PreOrder'
                        : 'http://schema.org/InStock';
            }
            else if (stockInfo.isInStock) {
                offers.availability = 'http://schema.org/InStock';
            }
            // Get price
            if (!Profile_Model_1.ProfileModel.getInstance().hidePrices()) {
                if (isPriceRange) {
                    offers.priceSpecification = {
                        '@type': 'PriceSpecification',
                        price: this.model.getPrice().price,
                        minPrice: priceContainerObject.min.price,
                        maxPrice: priceContainerObject.max.price
                    };
                }
                else {
                    offers.price = this.model.getPrice().price;
                }
                offers.priceCurrency =
                    SC.getSessionInfo('currency') && SC.getSessionInfo('currency').code
                        ? SC.getSessionInfo('currency').code
                        : Configuration_1.Configuration.get('siteSettings.shopperCurrency.code');
            }
            var storedetaileddescription = jQuery("<div>" + modelItem.attributes.storedetaileddescription + "</div>").text();
            var childJsonLdCopy = childJsonLd;
            delete childJsonLdCopy['@type'];
            var jsonld = __assign({ '@type': 'Product', name: this.page_header, image: this.model.getImages()[0].url.toString(), offers: offers, description: storedetaileddescription.length > 0 ? storedetaileddescription : undefined, sku: this.model.getSku() ? this.model.getSku() : undefined }, childJsonLdCopy);
            return jQuery.Deferred().resolve(jsonld);
        },
        // @method showOptionsPusher Override parent method to allow hide/show the option's pusher on
        // mobile depending on the configuration value: ItemOptions.maximumOptionValuesQuantityWithoutPusher
        // @return {Booelan}
        showOptionsPusher: function showOptionsPusher() {
            var options_values_length = _.reduce(this.model.getVisibleOptions().map(function (option) {
                if (_.isArray(option.get('values'))) {
                    var invalid_values = _.filter(option.get('values'), function (value) {
                        return !value.internalid;
                    });
                    return option.get('values').length - invalid_values.length;
                }
                return 0;
            }), function (memo, num) {
                return memo + num;
            }, 0);
            return (options_values_length >
                Configuration_1.Configuration.get('ItemOptions.maximumOptionValuesQuantityWithoutPusher', 1));
        },
        // @method getContext
        // @return {ProductDetails.Full.View.Context}
        getContext: function getContext() {
            // @class ProductDetails.Full.View.Context @extend ProductDetails.Base.View.Context
            return _.extend(ProductDetailsBaseView.prototype.getContext.apply(this, arguments), {});
            // @class ProductDetails.Full.View
        }
    });
    return ProductDetailsFullView;
});
// @class ProductDetails.Full.View.Initialize.Options
// @extend ProductDetails.Base.View.Initialize.Options

//# sourceMappingURL=ProductDetails.Full.View.js.map
