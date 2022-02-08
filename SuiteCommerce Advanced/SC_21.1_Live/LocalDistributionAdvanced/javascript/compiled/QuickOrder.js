/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuickOrder", ["require", "exports", "QuickOrder.View", "QuickOrder.EmptyCart.View", "Cart.Detailed.View"], function (require, exports, QuickOrderView, QuickOrderEmptyCartView, CartDetailedView) {
    "use strict";
    // @class QuickOrder @extend ApplicationModule
    var QuickOrder = {
        excludeFromMyAccount: true,
        // @method mountToApp
        // @param {ApplicationSkeleton} application
        // @return {Void}
        mountToApp: function () {
            // Show Quick Order in Cart
            CartDetailedView.addChildViews &&
                CartDetailedView.addChildViews({
                    'Quick.Order': function wrapperFunction(options) {
                        options = options || {};
                        options.urlOptions = this.urlOptions || options.urlOptions || {};
                        return function () {
                            return new QuickOrderView({
                                openQuickOrder: options.urlOptions.openQuickOrder === 'true'
                            });
                        };
                    }
                });
            // Show Quick Order Empty Cart Message in Cart
            CartDetailedView.addChildViews &&
                CartDetailedView.addChildViews({
                    'Quick.Order.EmptyCart': function wrapperFunction() {
                        return function () {
                            return new QuickOrderEmptyCartView({});
                        };
                    }
                });
        }
    };
    return QuickOrder;
});

//# sourceMappingURL=QuickOrder.js.map
