/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PaymentMethod.GiftCertificates.Record", ["require", "exports", "order_wizard_paymentmethod_giftcertificates_module_record.tpl", "GlobalViews.FormatPaymentMethod.View", "Backbone.View"], function (require, exports, order_wizard_paymentmethod_giftcertificates_module_record_tpl, GlobalViewsFormatPaymentMethodView, BackboneView) {
    "use strict";
    // @class OrderWizard.Module.PaymentMethod.GiftCertificates.Record @extends Backbone.View
    var OrderWizardModulePaymentMethodGiftCertificatesRecord = BackboneView.extend({
        template: order_wizard_paymentmethod_giftcertificates_module_record_tpl,
        // @property {Object} childViews
        childViews: {
            GiftCertificates: function () {
                return new GlobalViewsFormatPaymentMethodView({
                    model: this.model
                });
            }
        },
        // @method getContext @return OrderWizard.Module.PaymentMethod.GiftCertificates.Record.Context
        getContext: function () {
            // @class OrderWizard.Module.PaymentMethod.GiftCertificates.Record.Context
            return {
                // @property {Quote.Model} collection
                giftcertificate: this.model.get('giftcertificate')
            };
        }
    });
    return OrderWizardModulePaymentMethodGiftCertificatesRecord;
});

//# sourceMappingURL=OrderWizard.Module.PaymentMethod.GiftCertificates.Record.js.map
