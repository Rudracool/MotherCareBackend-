/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.AddOn.Review.View", ["require", "exports", "subscriptions_addon_review.tpl", "Utils", "Subscriptions.Model", "Loggers", "Subscriptions.AddOn.Summary.View", "Backbone.View", "Backbone"], function (require, exports, subscriptions_addon_review, Utils, Subscriptions_Model_1, Loggers_1, SummaryView, BackboneView, Backbone) {
    "use strict";
    var SubscriptionsAddOnReviewView = BackboneView.extend({
        template: subscriptions_addon_review,
        events: {
            'click [data-action="submit"]': 'submit'
        },
        title: Utils.translate('Add Subscription Review'),
        page_header: Utils.translate('Add Subscription Review'),
        initialize: function (options) {
            this.subscription = options.subscription;
            this.model = options.model;
        },
        childViews: {
            'Summary.View': function () {
                return new SummaryView({
                    model: this.model
                });
            }
        },
        submit: function (e) {
            var _this = this;
            e.preventDefault();
            var updatedModel = new Subscriptions_Model_1.SubscriptionsModel();
            updatedModel.set('internalid', this.subscription.get('internalid'));
            updatedModel.set('quantity', this.model.get('quantity'));
            updatedModel.set('lineNumber', this.model.get('lineNumber'));
            var isOptionalAddOn = this.subscription.hasAddOnByLineNumber(updatedModel.get('lineNumber'));
            var qtyDifference = this.model.has('initialQuantity')
                ? this.model.get('quantity') - this.model.get('initialQuantity')
                : 0;
            updatedModel.save().done(function () {
                if (qtyDifference !== 0) {
                    Loggers_1.Loggers.getLogger().info({
                        componentArea: 'SUBSCRIPTIONS_QTY_CHANGED',
                        lineType: _this.model.get('chargeType'),
                        qtyChange: qtyDifference > 0 ? 'INCREASED' : 'DECREASED'
                    });
                }
                else if (!isOptionalAddOn) {
                    Loggers_1.Loggers.getLogger().info({
                        componentArea: 'SUBSCRIPTIONS_ADDON_ADDED',
                        lineType: _this.model.get('chargeType')
                    });
                }
                Backbone.history.navigate('subscription/' + _this.subscription.get('internalid'), true);
            });
        },
        // @method getSelectedMenu @return {String}
        getSelectedMenu: function () {
            return 'subscriptions';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: '/Subscriptions'
            };
        },
        getContext: function () {
            var item = this.model.get('item');
            return {
                itemName: item.get('itemId'),
                itemQuantity: this.model.get('quantity'),
                itemPrice: this.model.get('recurringAmount_formatted'),
                itemImage: item.get('imageUrl'),
                itemDescription: item.get('storedetailedDescription'),
                showInfoMessage: this.model.get('isProrated') === true
            };
        }
    });
    return SubscriptionsAddOnReviewView;
});

//# sourceMappingURL=Subscriptions.AddOn.Review.View.js.map
