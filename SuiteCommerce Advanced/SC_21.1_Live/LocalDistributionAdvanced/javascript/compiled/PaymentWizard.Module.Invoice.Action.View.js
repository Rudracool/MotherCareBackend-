/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Module.Invoice.Action.View", ["require", "exports", "payment_wizard_invoice_action.tpl", "Backbone.View"], function (require, exports, payment_wizard_invoice_action_tpl, BackboneView) {
    "use strict";
    // @class PaymentWizard.Module.Invoice.Action.View @extend BackboneView
    var PaymentWizardModuleInvoiceActionView = BackboneView.extend({
        template: payment_wizard_invoice_action_tpl,
        // @method getContext @return {PaymentWizard.Module.Invoice.Action.View.Context}
        getContext: function () {
            // @class PaymentWizard.Module.Invoice.Action.View.Context
            return {
                // @property {Boolean} isPayfull
                isPayfull: !!this.model.get('isPayFull'),
                // @property {Boolean} showAction
                showAction: !!this.model.get('check')
            };
        }
    });
    return PaymentWizardModuleInvoiceActionView;
});

//# sourceMappingURL=PaymentWizard.Module.Invoice.Action.View.js.map
