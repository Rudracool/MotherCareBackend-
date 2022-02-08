/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Subscriptions.AddOn.Details.View"/>
// @module SubscriptionsAddOnDetailsView

import * as subscriptions_addon_details from 'subscriptions_addon_details.tpl';
import { Loggers } from '../../../Commons/Loggers/JavaScript/Loggers';
import { SubscriptionsModel } from './Subscriptions.Model';
import { Configuration } from '../../SCA/JavaScript/Configuration';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { AjaxRequestsKiller } from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';

import { SubscriptionsPricingView } from './Subscriptions.Pricing.View';

import { SubscriptionsStatusView } from './Subscriptions.Status.View';

import BackboneView = require('../../../Commons/BackboneExtras/JavaScript/Backbone.View');
import SummaryView = require('./Subscriptions.AddOn.Summary.View');
import resizeImage = require('../../../Commons/Utilities/JavaScript/Utilities.ResizeImage');
import QuantityAmount = require('./Subscriptions.AddOn.Quantity.Amount.View');
import Utils = require('../../../Commons/Utilities/JavaScript/Utils');
import GlobalViewsConfirmationView = require('../../../Commons/GlobalViews/JavaScript/GlobalViews.Confirmation.View');
import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');

const SubscriptionsAddOnDetailsView: any = BackboneView.extend({
    template: subscriptions_addon_details,

    title: Utils.translate('Add-On Details'),

    events: {
        'click [data-action="placeOrder"]': 'submit',
        'click [data-action="cancel"]': 'cancelAddOn'
    },

    initialize(options) {
        this.application = options.application;
        this.options = options;
        this.model = this.options.model;
        this.initializeModel(this.model);
        this.subscription = this.options.subscription;
    },

    // The model must be initialized in two cases:
    // with a model, when the view is rendered by navigation
    // without a model, when the view is initialized by the url
    initializeModel(line) {
        if (line) {
            if (
                this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText &&
                this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText !== 'Usage'
            ) {
                line.setRecurringAmount();
                line.on(
                    'change:recurringAmount_formatted change:quantity',
                    this.onChangeQuantityListener,
                    this
                );
            }
        }
    },

    onChangeQuantityListener(e) {
        this.render();
        this.showContinueButton =
            (this.model.get('initialQuantity') &&
                this.model.get('initialQuantity') !== this.model.get('quantity')) ||
            this.model.getStatusLabel() === 'NOT_INCLUDED';
    },

    beforeShowContent: function beforeShowContent() {
        if (!this.subscription || !this.model) {
            this.subscription = new SubscriptionsModel({
                internalid: this.options.routerArguments[0]
            });
            const loggersActionId = Loggers.getLogger().start('SUBSCRIPTIONS_ADDON_LOAD');
            const fetch = this.subscription
                .fetch({ killerId: AjaxRequestsKiller.getKillerId() })
                .done(() => {
                    this.model = this.subscription.findLineInUnifiedCollection(
                        parseInt(this.options.routerArguments[1], 10)
                    );
                    this.initializeModel(this.model);
                    Loggers.getLogger().end(loggersActionId);
                });

            return fetch;
        }
        return jQuery.Deferred().resolve();
    },

    childViews: {
        'Pricing.View': function() {
            if (!this.quantityPricingView) {
                const prices =
                    this.model.get('item').get('_priceDetails') &&
                    this.model.get('item').get('_priceDetails').priceschedule;
                if (prices && prices.length > 0) {
                    this.quantityPricingView = new SubscriptionsPricingView({
                        model: this.model,
                        fullMode: true,
                        title:
                            this.model.get('pricePlanTypeObj').pricePlanTypeText +
                            Utils.translate(' Pricing')
                    });
                }
            }
            return this.quantityPricingView;
        },
        'Status.View': function() {
            return new SubscriptionsStatusView({ status: this.model.getStatusLabel() });
        },
        'Quantity.Amount': function() {
            if (this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText !== 'Usage') {
                return new QuantityAmount({ model: this.model });
            }
        },
        'Summary.View': function() {
            return new SummaryView({
                model: this.model,
                isByUsage:
                    this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText === 'Usage'
            });
        }
    },

    cancelAddOn(e) {
        e.preventDefault();
        const deleteConfirmationView = new GlobalViewsConfirmationView({
            callBack: this._cancelAddon,
            callBackParameters: {
                context: this
            },
            title: Utils.translate('Cancel Line from subscription'),
            body: Utils.translate(
                'Please, confirm you want to cancel this item from your subscription'
            ),
            autohide: true
        });
        return this.application.getLayout().showInModal(deleteConfirmationView);
    },

    _cancelAddon(options) {
        const componentArea =
            Configuration.get('subscriptions.lineStatusChange') === 'Allow Suspending / Resuming'
                ? 'SUBSCRIPTIONS_ADDON_PAUSED'
                : 'SUBSCRIPTIONS_ADDON_CANCELED';

        const params = {
            lineType: options.context.model.get('chargeType')
        };

        const loggersActionId = Loggers.getLogger().start(componentArea);
        options.context.subscription
            .save({
                lineNumber: options.context.model.get('lineNumber'),
                action: 'delete'
            })
            .done(() => {
                Loggers.getLogger().end(loggersActionId);
                Backbone.history.navigate(
                    `subscription/${options.context.subscription.get('internalid')}`,
                    true
                );
            });
    },

    submit(e) {
        e.preventDefault();
        const updatedModel = new SubscriptionsModel();
        updatedModel.set('internalid', this.subscription.get('internalid'));
        updatedModel.set('quantity', this.model.get('quantity'));
        updatedModel.set('lineNumber', this.model.get('lineNumber'));

        const isOptionalAddOn = this.subscription.hasAddOnByLineNumber(
            updatedModel.get('lineNumber')
        );
        const qtyDifference = this.model.has('initialQuantity')
            ? this.model.get('quantity') - this.model.get('initialQuantity')
            : 0;

        const loggersActionId = Loggers.getLogger().start(
            qtyDifference !== 0 ? 'SUBSCRIPTIONS_ADDON_QTY_CHANGED' : 'SUBSCRIPTIONS_ADDON_ADDED'
        );

        updatedModel.save().done(() => {
            let params = {};
            if (qtyDifference !== 0) {
                params = {
                    lineType: this.model.get('chargeType'),
                    qtyChange: qtyDifference > 0 ? 'INCREASED' : 'DECREASED'
                };
            } else if (!isOptionalAddOn) {
                params = {
                    lineType: this.model.get('chargeType')
                };
            }
            Loggers.getLogger().end(loggersActionId, params);
            Backbone.history.navigate(`subscription/${this.subscription.get('internalid')}`, true);
        });
    },

    // @method getSelectedMenu @return {String}
    getSelectedMenu() {
        return 'subscriptions';
    },
    // @method getBreadcrumbPages
    getBreadcrumbPages() {
        return [
            {
                text: this.title,
                href: '/Subscriptions'
            },
            {
                text: this.subscription.get('name'),
                href: `subscription/${this.subscription.get('internalid')}`
            },
            {
                text: Utils.translate('Add-ons'),
                href: `subscription/${this.subscription.get('internalid')}/addons`
            },
            {
                text: Utils.translate(this.model.get('item').get('itemId')),
                href: `subscription/${this.subscription.get('internalid')}/addons/${this.model.get(
                    'internalId'
                )}`
            }
        ];
    },

    getContext() {
        const item = this.model.get('item');
        const name = item.get('storeDisplayName') || item.get('itemId') || '';

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

export = SubscriptionsAddOnDetailsView;
