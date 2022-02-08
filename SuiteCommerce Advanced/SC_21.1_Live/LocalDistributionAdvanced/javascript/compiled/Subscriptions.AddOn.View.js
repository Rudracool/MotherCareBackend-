/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.AddOn.View", ["require", "exports", "subscriptions_addon_item_cell.tpl", "Utils", "Subscriptions.Status.View", "Backbone", "Subscriptions.Pricing.View", "Backbone.View", "Utilities.ResizeImage"], function (require, exports, subscriptions_addon_item, Utils, Subscriptions_Status_View_1, Backbone, Subscriptions_Pricing_View_1, BackboneView, UtilitiesResizeImage) {
    "use strict";
    var SubscriptionsAddOnView = BackboneView.extend({
        template: subscriptions_addon_item,
        title: Utils.translate('My Subscriptions'),
        page_header: Utils.translate('My Subscriptions'),
        events: {
            'click [data-action="add"]': 'addLine'
        },
        initialize: function (options) {
            this.subscription = options.subscription;
        },
        addLine: function (e) {
            e.preventDefault();
            var subscription_id = this.subscription.get('internalid');
            var line_id = this.model.get('internalId');
            Backbone.history.navigate("subscription-addon-details/" + subscription_id + "/" + line_id, {
                trigger: true
            });
        },
        childViews: {
            'Pricing.View': function () {
                if (this.model.hasPriceIntervals()) {
                    return new Subscriptions_Pricing_View_1.SubscriptionsPricingView({ model: this.model });
                }
            },
            'Status.View': function () {
                return new Subscriptions_Status_View_1.SubscriptionsStatusView({ status: this.model.getStatusLabel() });
            }
        },
        getContext: function () {
            var item = this.model.get('item');
            return {
                image: UtilitiesResizeImage(item.get('imageUrl'), 'thumbnail'),
                title: item.get('storeDisplayName') || item.get('itemId') || '',
                item_id: item.get('itemId') || '',
                lineNumber: this.model.get('lineNumber'),
                price: this.model.getDefaultOfferStr(),
                briefDescription: Utils.parseRichText(this.model.get('item').get('storedetailedDescription'))
            };
        }
    });
    return SubscriptionsAddOnView;
});

//# sourceMappingURL=Subscriptions.AddOn.View.js.map
