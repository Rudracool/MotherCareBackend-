/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuickOrder.EmptyCart.View", ["require", "exports", "quick_order_empty_cart.tpl", "Backbone.View"], function (require, exports, quick_order_empty_cart_tpl, BackboneView) {
    "use strict";
    // @class QuickOrder.EmptyCart.View @extend Backbone.View
    var QuickOrderEmptyCartView = BackboneView.extend({
        // @property {Function} template
        template: quick_order_empty_cart_tpl
    });
    return QuickOrderEmptyCartView;
});

//# sourceMappingURL=QuickOrder.EmptyCart.View.js.map
