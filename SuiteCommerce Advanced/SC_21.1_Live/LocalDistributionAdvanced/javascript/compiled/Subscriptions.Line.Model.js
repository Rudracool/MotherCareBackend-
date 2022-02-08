/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.Line.Model", ["require", "exports", "underscore", "Utils", "jQuery", "Backbone"], function (require, exports, _, Utils, jQuery, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubscriptionsLineModel = Backbone.Model.extend({
        initialize: function () {
            var _this = this;
            var item = this.get('item');
            this.set('item', new Backbone.Model(item));
            if (this.hasPriceIntervals()) {
                this.setDefaultPrices();
                this.setPrices();
            }
            this.on('change:quantity', function () {
                if (_this.get('initialQuantity') !== _this.get('quantity')) {
                    _this.set('quantityChanged', true);
                }
                _this.setRecurringAmount();
            }, this);
        },
        hasPriceIntervals: function () {
            if (this.get('priceIntervals') &&
                this.get('priceIntervals').length &&
                this.get('priceIntervals')[0].pricePlan &&
                this.get('priceIntervals')[0].pricePlan &&
                this.get('priceIntervals')[0].pricePlan.priceTiers &&
                this.get('priceIntervals')[0].pricePlan.priceTiers.length) {
                return true;
            }
            return false;
        },
        setDefaultPrices: function () {
            var price_tiers = this.get('priceIntervals')[0].pricePlan.priceTiers;
            var default_price_tier = price_tiers[0];
            this.set('priceTiers', price_tiers);
            this.set('defaultPriceTier', default_price_tier);
            if (!!this.get('defaultPriceTier').minamount &&
                this.get('defaultPriceTier').minamount > this.get('defaultPriceTier').value) {
                this.set('defaultPriceValue', this.get('defaultPriceTier').minamount);
                this.hasMinimumPrice = true;
            }
            else
                this.set('defaultPriceValue', this.get('defaultPriceTier').value);
            if (price_tiers[price_tiers.length - 1].maxamount) {
                this.set('maxamount', price_tiers[price_tiers.length - 1].maxamount);
                this.hasMaximumPrice = true;
            }
        },
        getStatusLabel: function () {
            if (this.get('isProcessing') || this.get('status') === 'PENDING_ACTIVATION') {
                if (this.get('quantityChanged')) {
                    return 'Change quantity';
                }
                return 'PROCESSING';
            }
            return this.get('status');
        },
        setRecurringAmount: function () {
            if (this.hasPriceIntervals()) {
                var url = '/app/accounting/subscription/subscriptionrecurringamount.nl';
                var params = {
                    jrmethod: 'remoteObject.getRecurringAmount',
                    jrparams: '[' +
                        this.get('quantity') +
                        ', ' +
                        this.get('pricePlanId') +
                        ', ' +
                        this.get('discount') +
                        ', true]'
                };
                url = Utils.addParamsToUrl(url, params);
                var self_1 = this;
                jQuery.get(url).then(function (result) {
                    var amount = JSON.parse(result);
                    if (parseInt(self_1.get('recurringAmount'), 10) !== parseInt(amount.result, 10)) {
                        self_1.set('recurringAmount', parseInt(amount.result, 10));
                        self_1.set('recurringAmount_formatted', Utils.formatCurrency(amount.result), {
                            silent: false
                        });
                    }
                });
            }
        },
        isReadOnly: function () {
            return (this.get('status') !== 'NOT_INCLUDED' &&
                (this.get('subscriptionLineType') === 1 || this.get('subscriptionLineType') === 3));
        },
        setPrices: function () {
            var _this = this;
            var price_plan = this.get('priceIntervals')[0].pricePlan;
            this.set('pricePlanId', price_plan.pricePlanId);
            var price_schedule = _.map(this.get('priceTiers'), function (price_interval) {
                return {
                    minimumquantity: price_interval.fromVal,
                    price: price_interval.value,
                    price_formatted: Utils.formatCurrency(price_interval.valueFormatted),
                    showSingleValue: price_interval.showSingleValue,
                    frequency: _this.get('frequency'),
                    is_range: false
                };
            });
            var item = this.get('item');
            item.set('_priceDetails', { priceschedule: price_schedule });
        },
        getDefaultOfferStr: function () {
            if (this.hasPriceIntervals()) {
                var result = '';
                var resultObj = {};
                if (this.get('defaultPriceTier').pricingOption === '-101') {
                    resultObj.priceOption = 'RATE';
                }
                else if (this.get('defaultPriceTier').pricingOption === '-102') {
                    resultObj.priceOption = 'FIXED';
                }
                if (this.get('defaultPriceTier').pricingOption === '-102' &&
                    this.get('priceTiers').length > 1) {
                    resultObj.option = 'From';
                }
                else if (this.get('defaultPriceTier').pricingOption === '-101')
                    resultObj.option = 'Starting at';
                if (this.get('priceTiers') && this.get('priceTiers')[0].minamount) {
                    resultObj.minamount = this.get('priceTiers')[0].minamount;
                }
                var l = this.get('priceTiers').length - 1;
                if (this.get('priceTiers') && this.get('priceTiers')[l].maxamount) {
                    resultObj.maxamount = this.get('priceTiers')[l].maxamount;
                }
                resultObj.defaultPrice = this.get('defaultPriceTier').valueFormatted;
                resultObj.planType = this.get('pricePlanTypeObj').pricePlanTypeText;
                if (this.get('subscriptionLineTypeObj').subscriptionlinetypeText !== 'One Time') {
                    if (!this.hasMinimumPrice) {
                        resultObj.type = this.get('subscriptionLineTypeObj').subscriptionlinetypeText;
                    }
                    resultObj.frequency = this.get('frequencyObj').frequencyText;
                }
                else {
                    resultObj.isOneTime = true;
                    resultObj.frequency = this.get('priceIntervals')[0].startOffsetUnit;
                }
                return resultObj;
            }
        }
    });
});

//# sourceMappingURL=Subscriptions.Line.Model.js.map
