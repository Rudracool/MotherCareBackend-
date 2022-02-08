/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GlobalViews.CurrencySelector.View", ["require", "exports", "underscore", "global_views_currency_selector.tpl", "Utils", "Configuration", "Profile.Model", "Backbone.View", "Session"], function (require, exports, _, global_views_currency_selector_tpl, Utils, Configuration_1, Profile_Model_1, BackboneView, Session) {
    "use strict";
    // @class GlobalViews.CurrencySelector.View @extends Backbone.View
    var GlobalViewsCurrencySelectorView = BackboneView.extend({
        template: global_views_currency_selector_tpl,
        events: {
            'change select[data-toggle="currency-selector"]': 'setCurrency',
            'click select[data-toggle="currency-selector"]': 'currencySelectorClick'
        },
        // @method initialize
        initialize: function () {
            var self = this;
            Profile_Model_1.ProfileModel.getPromise().done(function () {
                self.isCustomer = Profile_Model_1.ProfileModel.getInstance().get('customer');
                self.render();
            });
        },
        // @method currencySelectorClick @param {HTMLEvent} e
        currencySelectorClick: function (e) {
            e.stopPropagation();
        },
        // @method setCurrency @param {HTMLEvent} e
        setCurrency: function (e) {
            var currency_code = this.$(e.target).val();
            var selected_currency = _.find(SC.ENVIRONMENT.availableCurrencies, function (currency) {
                return currency.code === currency_code;
            });
            window.location.href = Utils.addParamsToUrl(Session.get("touchpoints." + Configuration_1.Configuration.get('currentTouchpoint')), { cur: selected_currency.code });
        },
        // @method getContext
        // @return {GlobalViews.CurrencySelector.View.Context}
        getContext: function () {
            var sessionCurrency = SC.getSessionInfo('currency');
            var currentCurrency = sessionCurrency || SC.ENVIRONMENT.currentCurrency;
            var available_currencies = _.map(SC.ENVIRONMENT.availableCurrencies, function (currency) {
                // @class GlobalViews.CurrencySelector.View.Context.Currency
                return {
                    // @property {String} code
                    code: currency.code,
                    // @property {String} internalId
                    internalId: currency.internalid,
                    // @property {String} isDefault
                    isDefault: currency.isdefault,
                    // @property {String} symbol
                    symbol: currency.symbol,
                    // @property {Boolean} symbolPlacement
                    symbolPlacement: currency.symbolplacement,
                    // @property {String} displayName
                    displayName: currency.title || currency.name,
                    // @property {Boolean} isSelected
                    isSelected: currentCurrency.code === currency.code
                };
            });
            // @class GlobalViews.CurrencySelector.View.Context
            return {
                // @property {Boolean} showCurrencySelector
                showCurrencySelector: !!(SC.ENVIRONMENT.availableCurrencies && SC.ENVIRONMENT.availableCurrencies.length > 1),
                // @property {Array<GlobalViews.CurrencySelector.View.Context.Currency>} availableCurrencies
                availableCurrencies: available_currencies || [],
                // @property {String} currentCurrencyCode
                currentCurrencyCode: SC.ENVIRONMENT.currentCurrency.code,
                // @property {String} currentCurrencySymbol
                currentCurrencySymbol: sessionCurrency.symbol,
                // @property {Boolean} isDisabled
                isDisabled: this.isCustomer
            };
        }
    });
    return GlobalViewsCurrencySelectorView;
});

//# sourceMappingURL=GlobalViews.CurrencySelector.View.js.map
