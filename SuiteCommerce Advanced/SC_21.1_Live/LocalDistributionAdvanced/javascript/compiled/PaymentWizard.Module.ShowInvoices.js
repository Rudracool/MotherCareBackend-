/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Module.ShowInvoices", ["require", "exports", "underscore", "payment_wizard_showinvoices_module.tpl", "Utils", "jQuery", "Wizard.StepModule", "Invoice.Collection"], function (require, exports, _, payment_wizard_showinvoices_module_tpl, Utils, jQuery, Wizard_StepModule_1, InvoiceCollection) {
    "use strict";
    // @class PaymentWizard.Module.ShowInvoices @extend Wizard.Module
    var PaymentWizardModuleShowInvoices = Wizard_StepModule_1.WizardStepModule.extend({
        template: payment_wizard_showinvoices_module_tpl,
        className: 'PaymentWizard.Module.ShowInvoices',
        initialize: function (options) {
            this.wizard = options.wizard;
            this.wizard.model.on('change:confirmation', jQuery.proxy(this, 'render'));
        },
        render: function () {
            if (this.wizard.model.get('confirmation')) {
                this.invoices = new InvoiceCollection(_.where(this.wizard.model.get('confirmation').invoices, { apply: true }));
            }
            else {
                this.invoices = this.wizard.model.getSelectedInvoices();
                this.wizard.model.calculeTotal();
            }
            this._render();
        },
        // @method getContext @return {PaymentWizard.Module.ShowInvoices.Context}
        getContext: function () {
            var self = this;
            if (this.wizard.model.get('currency_symbol')) {
                this.currencySymbol = this.wizard.model.get('currency_symbol');
            }
            else {
                var invoices = this.wizard.model.get('invoices');
                if (invoices.length) {
                    var currency = Utils.getCurrencyByName(invoices.first().get('currency'));
                    if (currency) {
                        this.currencySymbol = currency.symbol;
                    }
                }
            }
            var invoices_to_show = this.invoices.map(function (invoice) {
                var invoice_number = invoice.get('tranid') || invoice.get('refnum');
                // @class PaymentWizard.Module.ShowInvoices.Invoice.Record
                return {
                    // @property {String} title
                    title: invoice_number
                        ? Utils.translate('Invoice #$(0)', invoice_number)
                        : Utils.translate('Invoice'),
                    // @property {String} id
                    id: invoice.get('internalid'),
                    // @property {String} amountFormatted
                    amountFormatted: Utils.formatCurrency(invoice.get('amount'), self.currencySymbol)
                };
            });
            // @class PaymentWizard.Module.ShowInvoices.Context
            return {
                // @property {Number} invoicesLength
                invoicesLength: this.invoices.length,
                // @property {String} invoicesTotalFormatted
                invoicesTotalFormatted: this.wizard.model.get('confirmation')
                    ? Utils.formatCurrency(this.wizard.model.get('confirmation').invoices_total, self.currencySymbol)
                    : Utils.formatCurrency(this.wizard.model.get('invoices_total'), self.currencySymbol),
                // @property {Array<PaymentWizard.Module.ShowInvoices.Invoice.Record>} invoices
                invoices: invoices_to_show,
                // @property {Boolean} showOpenedAccordion
                showOpenedAccordion: Utils.isTabletDevice() || Utils.isDesktopDevice()
            };
        }
    });
    return PaymentWizardModuleShowInvoices;
});

//# sourceMappingURL=PaymentWizard.Module.ShowInvoices.js.map
