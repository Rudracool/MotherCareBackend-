/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Module.Confirmation", ["require", "exports", "payment_wizard_confirmation_module.tpl", "Utils", "Wizard.StepModule"], function (require, exports, payment_wizard_confirmation_module_tpl, Utils, Wizard_StepModule_1) {
    "use strict";
    // @class PaymentWizard.Module.Confirmation @extend Wizard.Module
    var PaymentWizardModuleConfirmation = Wizard_StepModule_1.WizardStepModule.extend({
        template: payment_wizard_confirmation_module_tpl,
        className: 'PaymentWizard.Module.Confirmation',
        future: function () {
            var model = this.wizard.model;
            if (model.get('confirmation')) {
                model.unset('confirmation', { silent: true });
            }
        },
        // @method getContext @return {PaymentWizard.Module.Confirmation.Context}
        getContext: function () {
            var confirmation = this.wizard.model.get('confirmation');
            var is_confirmation_created = !!(confirmation &&
                confirmation.internalid &&
                confirmation.internalid !== '0');
            // @class PaymentWizard.Module.Confirmation.Context
            return {
                // @property {String} tranId
                tranId: confirmation ? confirmation.tranid : '',
                // @property {Boolean} isConfirmationCreated
                isConfirmationCreated: is_confirmation_created,
                // @property {Boolean} showLinkConfirmation
                showLinkConfirmation: is_confirmation_created,
                // @property {String} confirmationId
                confirmationId: confirmation ? confirmation.internalid : '',
                // @property {Boolean} isInvoiceLengthGreaterThan0, Keeping to be backward compatible
                isInvoiceLengthGreaterThan0: !!this.wizard.model.get('invoices').length,
                // @property {String} dwonloadPDFURL
                dwonloadPDFURL: is_confirmation_created
                    ? Utils.getDownloadPdfUrl({
                        asset: 'customer-payment-details',
                        id: confirmation.internalid
                    })
                    : ''
            };
        }
    });
    return PaymentWizardModuleConfirmation;
});

//# sourceMappingURL=PaymentWizard.Module.Confirmation.js.map
