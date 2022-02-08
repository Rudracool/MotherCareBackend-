/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.AddOn.Details.View", ["require", "exports", "subscriptions_addon_details.tpl", "Loggers", "Subscriptions.Model", "Configuration", "jQuery", "AjaxRequestsKiller", "Subscriptions.Pricing.View", "Subscriptions.Status.View", "Backbone.View", "Subscriptions.AddOn.Summary.View", "Utilities.ResizeImage", "Subscriptions.AddOn.Quantity.Amount.View", "Utils", "GlobalViews.Confirmation.View", "Backbone"], function (require, exports, subscriptions_addon_details, Loggers_1, Subscriptions_Model_1, Configuration_1, jQuery, AjaxRequestsKiller_1, Subscriptions_Pricing_View_1, Subscriptions_Status_View_1, BackboneView, SummaryView, resizeImage, QuantityAmount, Utils, GlobalViewsConfirmationView, Backbone) {
    "use strict";
    var SubscriptionsAddOnDetailsView = BackboneView.extend({
        template: subscriptions_addon_details,
        title: Utils.translate('Add-On Details'),
        events: {
            'click [data-action="placeOrder"]': 'submit',
            'click [data-action="cancel"]': 'cancelAddOn'
        },
        initialize: function (options) {
            this.application = options.application;
            this.options = options;
            this.model = this.options.model;
            this.initializeModel(this.model);
            this.subscription = this.options.subscription;
        },
        // The model must be initialized in two cases:
        // with a model, when the view is rendered by navigation
        // without a model, when the view is initialized by the url
        initializeModel: function (line) {
            if (line) {
                if (this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText &&
                    this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText !== 'Usage') {
                    line.setRecurringAmount();
                    line.on('change:recurringAmount_formatted change:quantity', this.onChangeQuantityListener, this);
                }
            }
        },
        onChangeQuantityListener: function (e) {
            this.render();
            this.showContinueButton =
                (this.model.get('initialQuantity') &&
                    this.model.get('initialQuantity') !== this.model.get('quantity')) ||
                    this.model.getStatusLabel() === 'NOT_INCLUDED';
        },
        beforeShowContent: function beforeShowContent() {
            var _this = this;
            if (!this.subscription || !this.model) {
                this.subscription = new Subscriptions_Model_1.SubscriptionsModel({
                    internalid: this.options.routerArguments[0]
                });
                var loggersActionId_1 = Loggers_1.Loggers.getLogger().start('SUBSCRIPTIONS_ADDON_LOAD');
                var fetch_1 = this.subscription
                    .fetch({ killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId() })
                    .done(function () {
                    _this.model = _this.subscription.findLineInUnifiedCollection(parseInt(_this.options.routerArguments[1], 10));
                    _this.initializeModel(_this.model);
                    Loggers_1.Loggers.getLogger().end(loggersActionId_1);
                });
                return fetch_1;
            }
            return jQuery.Deferred().resolve();
        },
        childViews: {
            'Pricing.View': function () {
                if (!this.quantityPricingView) {
                    var prices = this.model.get('item').get('_priceDetails') &&
                        this.model.get('item').get('_priceDetails').priceschedule;
                    if (prices && prices.length > 0) {
                        this.quantityPricingView = new Subscriptions_Pricing_View_1.SubscriptionsPricingView({
                            model: this.model,
                            fullMode: true,
                            title: this.model.get('pricePlanTypeObj').pricePlanTypeText +
                                Utils.translate(' Pricing')
                        });
                    }
                }
                return this.quantityPricingView;
            },
            'Status.View': function () {
                return new Subscriptions_Status_View_1.SubscriptionsStatusView({ status: this.model.getStatusLabel() });
            },
            'Quantity.Amount': function () {
                if (this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText !== 'Usage') {
                    return new QuantityAmount({ model: this.model });
                }
            },
            'Summary.View': function () {
                return new SummaryView({
                    model: this.model,
                    isByUsage: this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText === 'Usage'
                });
            }
        },
        cancelAddOn: function (e) {
            e.preventDefault();
            var deleteConfirmationView = new GlobalViewsConfirmationView({
                callBack: this._cancelAddon,
                callBackParameters: {
                    context: this
                },
                title: Utils.translate('Cancel Line from subscription'),
                body: Utils.translate('Please, confirm you want to cancel this item from your subscription'),
                autohide: true
            });
            return this.application.getLayout().showInModal(deleteConfirmationView);
        },
        _cancelAddon: function (options) {
            var componentArea = Configuration_1.Configuration.get('subscriptions.lineStatusChange') === 'Allow Suspending / Resuming'
                ? 'SUBSCRIPTIONS_ADDON_PAUSED'
                : 'SUBSCRIPTIONS_ADDON_CANCELED';
            var params = {
                lineType: options.context.model.get('chargeType')
            };
            var loggersActionId = Loggers_1.Loggers.getLogger().start(componentArea);
            options.context.subscription
                .save({
                lineNumber: options.context.model.get('lineNumber'),
                action: 'delete'
            })
                .done(function () {
                Loggers_1.Loggers.getLogger().end(loggersActionId);
                Backbone.history.navigate("subscription/" + options.context.subscription.get('internalid'), true);
            });
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
            var loggersActionId = Loggers_1.Loggers.getLogger().start(qtyDifference !== 0 ? 'SUBSCRIPTIONS_ADDON_QTY_CHANGED' : 'SUBSCRIPTIONS_ADDON_ADDED');
            updatedModel.save().done(function () {
                var params = {};
                if (qtyDifference !== 0) {
                    params = {
                        lineType: _this.model.get('chargeType'),
                        qtyChange: qtyDifference > 0 ? 'INCREASED' : 'DECREASED'
                    };
                }
                else if (!isOptionalAddOn) {
                    params = {
                        lineType: _this.model.get('chargeType')
                    };
                }
                Loggers_1.Loggers.getLogger().end(loggersActionId, params);
                Backbone.history.navigate("subscription/" + _this.subscription.get('internalid'), true);
            });
        },
        // @method getSelectedMenu @return {String}
        getSelectedMenu: function () {
            return 'subscriptions';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return [
                {
                    text: this.title,
                    href: '/Subscriptions'
                },
                {
                    text: this.subscription.get('name'),
                    href: "subscription/" + this.subscription.get('internalid')
                },
                {
                    text: Utils.translate('Add-ons'),
                    href: "subscription/" + this.subscription.get('internalid') + "/addons"
                },
                {
                    text: Utils.translate(this.model.get('item').get('itemId')),
                    href: "subscription/" + this.subscription.get('internalid') + "/addons/" + this.model.get('internalId')
                }
            ];
        },
        getContext: function () {
            var item = this.model.get('item');
            var name = item.get('storeDisplayName') || item.get('itemId') || '';
            // @class Overview.Banner.View.Context
            return {
                // @property {String} internalId
                internalId: this.model.get('internalId'),
                // @property {String} subscriptionPlanId
                subscriptionPlanId: this.model.get('subscriptionplan'),
                // @property {String} imageUrl
                imageUrl: resizeImage(item.get('imageUrl'), 'main'),
                // @property {String} displayName
                displayName: name,
                // @property {bool} hasDescription
                hasDescription: !!item.get('storedetailedDescription'),
                // @property {String} description
                description: item.get('storedetailedDescription'),
                // @property {String} itemPrice
                itemPrice: this.model.getDefaultOfferStr(),
                // @property {number} quantity
                quantity: this.model.get('quantity'),
                // @property {bool} setMinusDisabled
                setMinusDisabled: this.setMinusDisabled,
                // @property {bool} showInfoMessage
                showInfoMessage: this.model.get('isProrated') === true,
                // @property {bool} showContinueButton
                showContinueButton: !this.model.isReadOnly(),
                // @property {bool} showCancelButton
                showCancelButton: this.model.get('canBeSuspended'),
                // @property {bool} isAddingLine
                isAddingLine: this.model.get('status') === 'NOT_INCLUDED',
                // @property {bool} hasPriceIntervals
                hasPriceIntervals: this.model.hasPriceIntervals()
            };
        }
    });
    return SubscriptionsAddOnDetailsView;
});

//# sourceMappingURL=Subscriptions.AddOn.Details.View.js.map
