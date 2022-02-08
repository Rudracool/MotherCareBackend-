/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Subscriptions.Line.View"/>
// @Typescript-full

import * as subscriptions_line_tpl from 'subscriptions_line.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';

import * as Backbone from '../../../Commons/Core/JavaScript/backbone/BackboneExtras';

import { View } from '../../../Commons/Core/JavaScript/View';

import { SubscriptionsStatusView } from './Subscriptions.Status.View';

import { SubscriptionsModel } from './Subscriptions.Model';

import { SubscriptionsLineModel } from './Subscriptions.Line.Model';

import { SubscriptionsPricingView } from './Subscriptions.Pricing.View';

interface SubscriptionLineViewContext {
    isProcessing: boolean,
    name: string;
    quantity: boolean;
    startDate: string;
    subscriptionLineNumber: string;
    type: number;
    isChargeTypeUsage: boolean;
    isLineTypeOptional: boolean;
    isPhoneDevice: boolean;
    hasPriceIntervals: boolean;
}

interface SubscriptionLineViewOptions {
    subscription: SubscriptionsModel;
    model: SubscriptionsLineModel;
}

export class SubscriptionLineView extends View<SubscriptionLineViewContext> {
    public events = {
        'click [data-action="change"]': 'goToPDP'
    };

    protected template = subscriptions_line_tpl;

    private readonly options: SubscriptionLineViewOptions;

    private readonly subscription: SubscriptionsModel;

    private readonly model: SubscriptionsLineModel;

    public constructor(options: SubscriptionLineViewOptions) {
        super();
        this.options = options;
        this.subscription = options.subscription;
        this.model = options.model;
    }

    public goToPDP(): void {
        const subscription_id = this.subscription.get('internalid');
        const line_id = this.model.get('internalId');
        Backbone.history.navigate(`subscription-addon-details/${subscription_id}/${line_id}`, {
            trigger: true
        });
    }

    protected childViews = {
        'Pricing.View': (): SubscriptionsPricingView => {
            return new SubscriptionsPricingView({ model: this.model });
        },
        StatusView: (): SubscriptionsStatusView => {
            return new SubscriptionsStatusView({ status: this.model.getStatusLabel() });
        }
    };

    public getContext(): SubscriptionLineViewContext {
        const item = this.model.get('item');
        const name = item.get('storeDisplayName') || item.get('itemId') || '';
        const quantity = this.model.get('quantity') || Utils.translate('N/A');
        const start_date = this.model.get('startDate');
        const charge_type =
            this.model.get('subscriptionLineTypeObj') &&
            this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText;

        return {
            // @property {Boolean} isPhoneDevice
            isPhoneDevice: Utils.isPhoneDevice(),
            // @property {Boolean} isProcessing
            isProcessing: this.model.getStatusLabel() === 'PROCESSING',
            // @propery {String} name
            name: name,
            // @property {Boolean} quantity
            quantity: quantity,
            // @property {Boolean} start_date
            startDate: start_date,
            // @property {String} subscriptionLineNumber
            subscriptionLineNumber: this.model.get('lineNumber'),
            // @property {number} type
            type: charge_type,
            // @property {Boolean} isChargeTypeUsage
            isChargeTypeUsage: charge_type === 'Usage',
            // @property {Boolean} isLineTypeOptional
            isLineTypeOptional: this.model.get('catalogType') === 'OPTIONAL',
            // @property {Boolean} hasPriceIntervals
            hasPriceIntervals: this.model.hasPriceIntervals()
        };
    }
}
