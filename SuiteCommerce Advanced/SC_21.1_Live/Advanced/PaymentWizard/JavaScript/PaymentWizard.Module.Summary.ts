/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentWizard.Module.Summary"/>

import * as payment_wizard_summary_module_tpl from 'payment_wizard_summary_module.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { Configuration } from '../../SCA/JavaScript/Configuration';
import { WizardStepModule } from '../../Wizard/JavaScript/Wizard.StepModule';

// @class PaymentWizard.Module.Summary @extend Wizard.Module
const PaymentWizardModuleSummary: any = WizardStepModule.extend({
    template: payment_wizard_summary_module_tpl,

    className: 'PaymentWizard.Module.Summary',

    initialize: function(options) {
        this.is_active = false;
        this.options = options;
        this.wizard = options.wizard;

        this.wizard.model.on('change', jQuery.proxy(this, 'render'));
    },

    isActive: function(): boolean {
        return this.is_active;
    },

    future: function() {
        this.is_active = false;
    },

    present: function() {
        this.is_active = true;
    },

    past: function() {
        this.is_active = false;
    },

    render: function() {
        this.continueButtonDisabled = '';
        if (this.options.submit) {
            this.continueButtonLabel = Utils.translate('Submit');
        } else {
            const selected_invoices = this.wizard.model.getSelectedInvoices();
            this.continueButtonLabel = Utils.translate('Continue');

            if (!selected_invoices.length) {
                this.continueButtonLabel = Utils.translate('0 Invoices');
                this.continueButtonDisabled = 'disabled="disabled"';
            }
        }

        this._render();

        if (this.isActive()) {
            this.trigger('change_enable_continue', !this.continueButtonDisabled);
            this.trigger('change_label_continue', this.continueButtonLabel);
        }
    },

    // @method getContext @return {PaymentWizard.Module.Summary.Context}
    getContext: function() {
        const { model } = this.wizard;
        const currency = model.getCurrency();

        if (currency) {
            this.currencySymbol = currency.symbol;
        }

        // @class PaymentWizard.Module.Summary.Context
        return {
            // @property {Number} selectedInvoicesLength
            selectedInvoicesLength: model.getSelectedInvoices().length,
            // @property {String} invoiceTotalFormatted
            invoiceTotalFormatted: model.get('invoices_total_with_discount_formatted'),
            // @property {String} paymentFormatted
            paymentFormatted: model.get('payment_total_with_discount_formatted'),
            // @property {String} depositTotalFormatted
            depositTotalFormatted: Utils.formatCurrency(
                model.get('deposits_total'),
                this.currencySymbol
            ),
            // @property {String} creditTotalFormatted
            creditTotalFormatted: Utils.formatCurrency(
                model.get('credits_total'),
                this.currencySymbol
            ),
            // @property {Boolean} showTotalLabel
            showTotalLabel: !!this.options.total_label,
            // @property {String} totalLabel
            totalLabel: this.options.total_label
                ? this.options.total_label
                : Utils.translate('Estimated payment'),
            // @property {Boolean} showEstimatedAsInvoiceTotal
            showEstimatedAsInvoiceTotal: this.options.show_estimated_as_invoices_total,
            // @property {Boolean} showCreditCardInformatioRequrieLabel
            showCreditCardInformatioRequrieLabel: !!(
                this.options.total_label &&
                model.get('payment') &&
                Configuration.get('siteSettings.checkout.requireccsecuritycode') === 'T'
            ),
            // @property {Boolean} showPaymentMethodRequireLabel
            showPaymentMethodRequireLabel: !!(this.options.total_label && !model.get('payment')),
            // @property {String} continueButtonDisabled
            continueButtonDisabled: this.continueButtonDisabled,
            // @property {String} continueButtonLabel
            continueButtonLabel: this.continueButtonLabel
        };
    }
});

export = PaymentWizardModuleSummary;
