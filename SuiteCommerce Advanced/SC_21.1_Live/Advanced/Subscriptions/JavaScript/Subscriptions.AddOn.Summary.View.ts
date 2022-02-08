/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Subscriptions.AddOn.Summary.View"/>
import * as subscription_addon_summary from 'subscriptions_addon_summary.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as _ from 'underscore';

import BigNumber = require('../../../Commons/Utilities/JavaScript/BigNumber');

import BackboneView = require('../../../Commons/BackboneExtras/JavaScript/Backbone.View');

const SubscriptionsAddOnSummaryView: any = BackboneView.extend({
    template: subscription_addon_summary,

    initialize: function(options) {
        this.model = options.model;
        this.model.on('change:quantity', () => {
            this.render();
        });
        this.model.on('change:recurringAmount_formatted', () => {
            this.render();
        });
    },

    getInitialPrice: function(): object {
        const { precision } = SC.CONFIGURATION.siteSettings.shopperCurrency;
        const recurringAmount = new BigNumber(this.model.get('recurringAmount'));
        const discount = new BigNumber(100)
            .minus(new BigNumber(this.model.get('discount')))
            .dividedBy(100)
            .toFixed(precision);
        const initialPrice = new BigNumber(recurringAmount.dividedBy(discount).toFixed(precision));
        const discounted = initialPrice.minus(recurringAmount).toFixed(precision);

        return {
            initialPrice: initialPrice,
            discounted: discounted
        };
    },

    // @method getContext @returns {Overview.Banner.View.Context}
    getContext: function() {
        const hasItemPrice = !!this.model.get('recurringAmount');
        const hasDiscount = !!this.model.get('discount');

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
                ? `-${Utils.formatCurrency(this.getInitialPrice().discounted)}`
                : this.model.get('discount'),
            discount: `${this.model.get('discount')}%`,
            showSummaryContainer: hasItemPrice || hasDiscount
        };
    }
});

export = SubscriptionsAddOnSummaryView;
