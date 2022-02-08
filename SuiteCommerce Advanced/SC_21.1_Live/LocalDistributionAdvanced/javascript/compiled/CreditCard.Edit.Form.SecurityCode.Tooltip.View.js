/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CreditCard.Edit.Form.SecurityCode.Tooltip.View", ["require", "exports", "underscore", "creditcard_edit_form_securitycode_tooltip.tpl", "Utils", "Configuration", "Profile.Model", "Backbone.View"], function (require, exports, _, creditcard_edit_form_securitycode_tootltip, Utils, Configuration_1, Profile_Model_1, BackboneView) {
    "use strict";
    var CreditCardEditFormSecurityCodeTooltipView = BackboneView.extend({
        template: creditcard_edit_form_securitycode_tootltip,
        // @method getAvailableCreditcards
        getAvailableCreditcards: function () {
            // Creditcards
            var creditcards = [];
            var user_creditcards = Profile_Model_1.ProfileModel.getInstance().get('paymentmethods');
            user_creditcards.each(function (user_cc) {
                creditcards.push(user_cc.get('paymentmethod').name);
            });
            if (!creditcards.length) {
                var available_creditcards_1 = _.where(Configuration_1.Configuration.get('siteSettings.paymentmethods'), { creditcard: 'T', ispaypal: 'F' });
                _.each(available_creditcards_1, function (index, el) {
                    creditcards.push(available_creditcards_1[el].name);
                });
            }
            return _.unique(creditcards);
        },
        // @method getContext @return CreditCard.Edit.Form.SecurityCode.Tooltip.View.Context
        getContext: function () {
            var available_credit_cards = this.getAvailableCreditcards();
            // @class CreditCard.Edit.Form.SecurityCode.Tooltip.View.Context
            return {
                // @property {Boolean} isCreditCards
                isCreditCards: available_credit_cards.length > 0,
                // @property {Array<String>} availableCreditcards
                availableCreditcards: available_credit_cards,
                // @property {String} imageCvvAmericanCard
                imageCvvAmericanCardURL: Utils.getAbsoluteUrlOfNonManagedResources(Configuration_1.Configuration.get('creditCard.imageCvvAmericanCard')),
                // @property {String} imageCvvAllCards
                imageCvvAllCardsURL: Utils.getAbsoluteUrlOfNonManagedResources(Configuration_1.Configuration.get('creditCard.imageCvvAllCards')),
                // @property {Boolean} isVisaMasterOrDiscoverAvailable
                isVisaMasterOrDiscoverAvailable: _.indexOf(available_credit_cards, 'VISA') !== -1 ||
                    _.indexOf(available_credit_cards, 'Master Card') !== -1 ||
                    _.indexOf(available_credit_cards, 'Discover') !== -1,
                // @property {Boolean} isAmexAvailable
                isAmexAvailable: _.indexOf(available_credit_cards, 'American Express') !== -1
            };
        }
    });
    return CreditCardEditFormSecurityCodeTooltipView;
});

//# sourceMappingURL=CreditCard.Edit.Form.SecurityCode.Tooltip.View.js.map
