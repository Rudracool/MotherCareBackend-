/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Header.MiniCartSummary.View", ["require", "exports", "underscore", "Utils", "header_mini_cart_summary.tpl", "LiveOrder.Model", "Backbone.View"], function (require, exports, _, Utils, header_mini_cart_summary_tpl, LiveOrderModel, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: header_mini_cart_summary_tpl,
        initialize: function () {
            var self = this;
            this.itemsInCart = 0;
            this.showPluraLabel = true;
            this.isLoading = true;
            LiveOrderModel.loadCart().done(function () {
                var cart = LiveOrderModel.getInstance();
                self.itemsInCart = _.reduce(cart.get('lines').pluck('quantity'), function (memo, quantity) {
                    return memo + (parseFloat(quantity) || 1);
                }, 0);
                self.showPluraLabel = self.itemsInCart !== 1;
                self.isLoading = false;
                self.render();
                cart.on('change', function () {
                    self.render();
                });
            });
            this.on('afterViewRender', function () {
                self.isLoading && Utils.ellipsis('.header-mini-cart-summary-cart-ellipsis');
            });
        },
        // @method getContext @return {Header.MiniCart.View.Context}
        getContext: function () {
            // @class Header.MiniCartSummary.View.Context
            return {
                // @property {Number} itemsInCart
                itemsInCart: this.itemsInCart,
                // @property {Boolean} showPluraLabel
                showPluraLabel: this.showPluraLabel,
                // @property {Boolean} isLoading
                isLoading: this.isLoading
            };
        }
    });
});

//# sourceMappingURL=Header.MiniCartSummary.View.js.map
