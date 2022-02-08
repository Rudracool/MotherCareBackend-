/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.AddOn.Summary.View", ["require", "exports", "subscriptions_addon_summary.tpl", "Utils", "underscore", "bignumber", "Backbone.View"], function (require, exports, subscription_addon_summary, Utils, _, BigNumber, BackboneView) {
    "use strict";
    var SubscriptionsAddOnSummaryView = BackboneView.extend({
        template: subscription_addon_summary,
        initialize: function (options) {
            var _this = this;
            this.model = options.model;
            this.model.on('change:quantity', function () {
                _this.render();
            });
            this.model.on('change:recurringAmount_formatted', function () {
                _this.render();
            });
        },
        getInitialPrice: function () {
            var precision = SC.CONFIGURATION.siteSettings.shopperCurrency.precision;
            var recurringAmount = new BigNumber(this.model.get('recurringAmount'));
            var discount = new BigNumber(100)
                .minus(new BigNumber(this.model.get('discount')))
                .dividedBy(100)
                .toFixed(precision);
            var initialPrice = new BigNumber(recurringAmount.dividedBy(discount).toFixed(precision));
            var discounted = initialPrice.minus(recurringAmount).toFixed(precision);
            return {
                initialPrice: initialPrice,
                discounted: discounted
            };
        },
        // @method getContext @returns {Overview.Banner.View.Context}
        getContext: function () {
            var hasItemPrice = !!this.model.get('recurringAmount');
            var hasDiscount = !!this.model.get('discount');
            // @class Overview.Banner.View.Context
            return {
                itemQuantity: this.model.get('quantity'),
                hasItemPrice: hasItemPrice,
                itemPrice: hasDiscount
                    ? Utils.formatCurrency(this.getInitialPrice().initialPrice)
                    : this.model.get('recurringAmount_formatted'),
                itemPriceTotal: this.model.get('recurringAmount_formatted'),
                hasDiscount: hasDiscount,
                discountedValue: !_.isNaN(this.getInitialPrice().discounted)
                    ? "-" + Utils.formatCurrency(this.getInitialPrice().discounted)
                    : this.model.get('discount'),
                discount: this.model.get('discount') + "%",
                showSummaryContainer: hasItemPrice || hasDiscount
            };
        }
    });
    return SubscriptionsAddOnSummaryView;
});

//# sourceMappingURL=Subscriptions.AddOn.Summary.View.js.map
