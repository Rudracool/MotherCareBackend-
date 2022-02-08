/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PickupInStore", ["require", "exports", "Configuration", "Location", "ProductDetails.Full.View", "Cart.Lines.View", "Cart.Lines.Free.View", "Facets.ItemCell.View", "PickupInStore.FulfillmentOptions.View", "ProductLine.Common.Url", "ProductLine.Stock.View", "PickupInStore.View", "js.cookie"], function (require, exports, Configuration_1, Location, ProductDetailsFullView, CartLinesView, CartLinesFreeView, FacetsItemCellView, PickupInStoreFulfillmentOptionsView, ProductLineCommonUrl, ProductLineStockView, PickupInStoreView, Cookies) {
    "use strict";
    var PickUpInStore = 
    // @class ProductDetailToQuote @extend ApplicationModule
    {
        // @method mountToApp
        // @param {ApplicationSkeleton} application
        // @return {Void}
        mountToApp: function mountToApp(application) {
            if (!Configuration_1.Configuration.get('siteSettings.isPickupInStoreEnabled')) {
                return;
            }
            ProductLineCommonUrl.attributesReflectedInURL.push('location');
            ProductLineCommonUrl.attributesReflectedInURL.push('fulfillmentChoice');
            // Set the extra children of the ProductDetailsFullView
            // We show the pickup in store view only if the item is purchasable.
            // If it is not, we show the Out of Stock message.
            ProductDetailsFullView.addChildViews({
                'Product.Stock.Info': function wrapperFunction(options) {
                    return function () {
                        if (options.model.getItem().get('ispurchasable')) {
                            return new PickupInStoreView({
                                model: options.model,
                                application: application
                            });
                        }
                        return new ProductLineStockView({
                            model: options.model
                        });
                    };
                }
            });
            // Set the extra children of the CartLinesView
            CartLinesView.addChildViews({
                'Product.Stock.Info': function wrapperFunction(options) {
                    return function () {
                        return new PickupInStoreView({
                            model: options.model,
                            application: application,
                            source: 'cart'
                        });
                    };
                }
            });
            // Set the extra children of the CartLinesView
            CartLinesFreeView.addChildViews({
                'Product.Stock.Info': function wrapperFunction(options) {
                    return function () {
                        return new PickupInStoreView({
                            model: options.model,
                            application: application,
                            source: 'cart'
                        });
                    };
                }
            });
            // Set the extra children of the FacetsItemCellView
            FacetsItemCellView.addChildViews({
                'ItemViews.Stock': function wrapperFunction(options) {
                    return function () {
                        if (options.model.get('ispurchasable') &&
                            options.model.get('_isfulfillable')) {
                            return new PickupInStoreFulfillmentOptionsView({
                                model: options.model,
                                application: application
                            });
                        }
                        return new ProductLineStockView({
                            model: options.model
                        });
                    };
                }
            });
            application.getLayout().on('beforeAppendView', function (view) {
                if (view instanceof ProductDetailsFullView) {
                    var location_id_1 = view.model.get('location').get('internalid') || Cookies.get('myStore');
                    if (location_id_1) {
                        Location.fetchLocations(location_id_1).done(function () {
                            view.model.set('location', Location.get(location_id_1));
                        });
                    }
                }
            });
        }
    };
    return PickUpInStore;
});

//# sourceMappingURL=PickupInStore.js.map
