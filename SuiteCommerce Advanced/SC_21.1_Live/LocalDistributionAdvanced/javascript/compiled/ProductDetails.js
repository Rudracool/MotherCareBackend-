/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductDetails", ["require", "exports", "Utils", "Configuration", "ProductDetails.Component", "ProductDetails.Full.View", "ProductDetails.QuickView.View"], function (require, exports, Utils, Configuration_1, ProductDetails_Component_1, ProductDetailsFullView, ProductDetailsQuickView) {
    "use strict";
    // @class ProductDetails instantiate the router and publicly
    // expose the PDP Component @extends ApplicationModule
    var ProductDetails = {
        excludeFromMyAccount: true,
        // @method mountToApp
        // @return {ProductDetails.Component}
        mountToApp: function (application) {
            if (Configuration_1.Configuration.get('modulesConfig.ProductDetails.startRouter', false)) {
                var pageType = application.getComponent('PageType');
                pageType.registerPageType({
                    name: 'ProductDetails.Full.View',
                    routes: [':url', /^(.*?)$/, 'product/:id', 'product/:id?:options'],
                    view: ProductDetailsFullView,
                    defaultTemplate: {
                        name: 'product_details_full.tpl',
                        displayName: 'Product Details Full Default',
                        thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-PDP.png')
                    }
                });
                pageType.registerPageType({
                    name: 'ProductDetails.QuickView.View',
                    routes: [
                        ':url&showinmodal=T',
                        ':url?showinmodal=T',
                        /^(.*?)(\?|\&)showinmodal=T$/,
                        'product/:id?showinmodal=T',
                        'product/:id?:options&showinmodal=T'
                    ],
                    view: ProductDetailsQuickView,
                    defaultTemplate: {
                        name: 'product_details_quickview.tpl',
                        displayName: 'Product Details QuickView Default',
                        thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-PDP-quick-view.png')
                    }
                });
            }
            return ProductDetails_Component_1.ProductDetailsComponent(application);
        }
    };
    return ProductDetails;
});

//# sourceMappingURL=ProductDetails.js.map
