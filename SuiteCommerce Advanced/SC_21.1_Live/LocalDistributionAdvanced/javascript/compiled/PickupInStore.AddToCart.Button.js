/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PickupInStore.AddToCart.Button", ["require", "exports", "Configuration", "PickupInStore.AddToCart.Button"], function (require, exports, Configuration_1, CartAddToCartButtonView) {
    "use strict";
    var PickupInStoreAddToCartButton = function () {
        if (Configuration_1.Configuration.get('siteSettings.isPickupInStoreEnabled')) {
            var original_add_to_cart_fn_1 = CartAddToCartButtonView.prototype.addToCart;
            CartAddToCartButtonView.prototype.addToCart = function () {
                if (!this.model.getItem().get('_isstorepickupallowed') &&
                    this.model.get('fulfillmentChoice') === 'pickup') {
                    this.model.set('fulfillmentChoice', 'ship');
                }
                return original_add_to_cart_fn_1.apply(this, arguments);
            };
        }
    };
    return PickupInStoreAddToCartButton;
});

//# sourceMappingURL=PickupInStore.AddToCart.Button.js.map
