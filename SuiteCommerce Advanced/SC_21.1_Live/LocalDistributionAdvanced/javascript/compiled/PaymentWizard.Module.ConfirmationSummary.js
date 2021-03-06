/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Module.ConfirmationSummary", ["require", "exports", "underscore", "payment_wizard_confirmation_summary_module.tpl", "Utils", "Wizard.StepModule"], function (require, exports, _, payment_wizard_confirmation_summary_module_tpl, Utils, Wizard_StepModule_1) {
    "use strict";
    // @class PaymentWizard.Module.ConfirmationSummary @extend Wizard.Module
    var PaymentWizardModuleConfirmationSummary = Wizard_StepModule_1.WizardStepModule.extend({
        template: payment_wizard_confirmation_summary_module_tpl,
        className: 'PaymentWizard.Module.ConfirmationSummary',
        // @method getContext @return {PaymentWizard.Module.ConfirmationSummary.Context}
        getContext: function () {
            var is_confirmation_created = !!this.model.get('confirmation');
            var model = is_confirmation_created ? this.model.get('confirmation') : {};
            var selectedInvoicesLength = _.filter(model.invoices, function (obj) {
                return obj.apply === true;
            }).length;
            // @class PaymentWizard.Module.ConfirmationSummary.Context
            return {
                // @property {Number} selectedInvoicesLength
                selectedInvoicesLength: is_confirmation_created ? selectedInvoicesLength : 0,
                // @property {String} invoiceTotalFormatted
                invoiceTotalFormatted: model.invoices_total_with_discount_formatted,
                // @property {String} paymentFormatted
                paymentFormatted: model.payment_total_with_discount_formatted,
                // @property {String} depositTotalFormatted
                depositTotalFormatted: model.deposits_total_formatted,
                // @property {Boolean} hasDeposit
                hasDeposit: !!model.deposits_total,
                // @property {Boolean} hasCredit
                hasCredit: !!model.creditTotal,
                // @property {String} creditTotalFormatted
                creditTotalFormatted: model.credits_total_formatted,
                // @property {Boolean} showTotalLabel
                showTotalLabel: !!this.options.total_label,
                // @property {String} totalLabel
                totalLabel: this.options.total_label
                    ? this.options.total_label
                    : Utils.translate('Estimated payment')
            };
        }
    });
    return PaymentWizardModuleConfirmationSummary;
});

//# sourceMappingURL=PaymentWizard.Module.ConfirmationSummary.js.map
