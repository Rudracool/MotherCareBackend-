/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Overview.Payment.View", ["require", "exports", "overview_payment.tpl", "PaymentMethod.Helper", "Backbone.View"], function (require, exports, overview_payment_tpl, PaymentMethodHelper, BackboneView) {
    "use strict";
    // home page view
    var OverviewPaymentView = BackboneView.extend({
        template: overview_payment_tpl,
        initialize: function () { },
        childViews: {
            'CreditCard.View': function () {
                var view = PaymentMethodHelper.getCreditCardView();
                return new view({
                    model: this.model,
                    hideSelector: true
                });
            }
        },
        // @method getContext @returns {Overview.Payment.View.Context}
        getContext: function () {
            // @class Overview.Payment.View.Context
            return {
                // @property {Boolean} hasDefaultCreditCard
                hasDefaultCreditCard: !!this.model,
                // @property {String} creditCardInternalid
                creditCardInternalid: this.model && this.model.get('internalid')
            };
        }
    });
    return OverviewPaymentView;
});

//# sourceMappingURL=Overview.Payment.View.js.map
