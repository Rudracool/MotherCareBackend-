/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Module.Invoice", ["require", "exports", "payment_wizard_invoice_module.tpl", "Utils", "jQuery", "Wizard.StepModule", "ListHeader.View", "Invoice.Collection", "PaymentWizard.EditAmount.View", "Backbone.CollectionView", "RecordViews.SelectableActionable.View", "PaymentWizard.Module.Invoice.Subject.View", "PaymentWizard.Module.Invoice.Action.View", "Backbone"], function (require, exports, payment_wizard_invoice_module_tpl, Utils, jQuery, Wizard_StepModule_1, ListHeader_View_1, InvoiceCollection, PaymentWizardEditAmountView, BackboneCollectionView, RecordViewsSelectableActionableView, PaymentWizardModuleInvoiceSubjectView, PaymentWizardModuleInvoiceActionView, Backbone) {
    "use strict";
    // returns the amount of days based on milliseconds
    function getDays(milliseconds) {
        return milliseconds / 1000 / 60 / 60 / 24;
    }
    // @class PaymentWizard.Module.Invoice @extend Wizard.Module
    var PaymentWizardModuleInvoice = Wizard_StepModule_1.WizardStepModule.extend({
        template: payment_wizard_invoice_module_tpl,
        className: 'PaymentWizard.Module.Invoice',
        events: {
            'click [data-action="edit"]': 'editInvoice',
            'click [data-action="remove"]': 'removeInvoice'
        },
        initialize: function (options) {
            this.wizard = options.wizard;
            this.invoices = new InvoiceCollection();
            this.invoices.reset(this.wizard.model.get('invoices').models);
            // PaymentWizard.Module.Invoice.listHeader:
            // manges sorting and filtering of the collection
            this.listHeader = new ListHeader_View_1.ListHeaderView({
                view: this,
                application: options.wizard.application,
                collection: this.invoices,
                filters: this.filterOptions,
                sorts: this.sortOptions,
                selectable: false
            });
            this.addEventListeners();
        },
        addEventListeners: function () {
            var self = this;
            // Whenever the invoice collection changes, we re write
            // this.invoices.on('reset', jQuery.proxy(this, 'render'));
            this.invoices.on('reset', function () {
                self.render();
            });
            // this.wizard.model.on('change:invoices_total', jQuery.proxy(this, 'render'));
            this.wizard.model.on('change:invoices_total', function () {
                self.render();
            });
            this.wizard.model.on('change:invoices', function () {
                self.invoices.clearFilters();
                self.invoices.reset(self.wizard.model.get('invoices').models);
                self.invoices.original = self.invoices.clone();
            });
        },
        // the render is called whenever the invoice collection is resetd
        // to prevent multiple innecesary renders, we use this boolean flag
        // so the "real" render will only happen if the step is present
        present: function () {
            this.renderable = true;
            this.listHeader.updateCollection();
        },
        render: function () {
            if (this.renderable) {
                this._render();
            }
        },
        // Array of default sort options
        // sorts only apply on the current collection
        // which might be a filtered version of the original
        sortOptions: [
            {
                value: 'duedate',
                name: Utils.translate('By Due Date'),
                selected: true,
                sort: function () {
                    return this.models.sort(function (invoiceOne, invoiceTwo) {
                        var milli_inv_one = invoiceOne.get('dueinmilliseconds') || 0;
                        var milli_inv_two = invoiceTwo.get('dueinmilliseconds') || 0;
                        if (milli_inv_one !== milli_inv_two) {
                            return milli_inv_one < milli_inv_two ? -1 : 1;
                        }
                        return invoiceOne.get('tranid') < invoiceTwo.get('tranid') ? -1 : 1;
                    });
                }
            },
            {
                value: 'invoicenumber',
                name: Utils.translate('By Invoice Number'),
                sort: function () {
                    return this.sortBy(function (invoice) {
                        return invoice.get('tranid');
                    });
                }
            },
            {
                value: 'amountdue',
                name: Utils.translate('By Amount Due'),
                sort: function () {
                    return this.sortBy(function (invoice) {
                        return invoice.get('due') ? invoice.get('due') : invoice.get('amount');
                    });
                }
            }
        ],
        editInvoice: function (e) {
            var $target = jQuery(e.target);
            var invoice_id = $target.closest('[data-id]').attr('data-id');
            var invoice = this.invoices.get(invoice_id);
            e.preventDefault();
            e.stopPropagation();
            this.wizard.application.getLayout().showInModal(new PaymentWizardEditAmountView({
                application: this.wizard.applicationx,
                parentView: this,
                model: invoice,
                type: 'invoice'
            }), {
                application: this.wizard.application
            });
        },
        // remove invoice
        removeInvoice: function (e) {
            var $target = jQuery(e.target);
            var invoice_id = $target.closest('[data-id]').attr('data-id');
            var invoice = this.invoices.get(invoice_id);
            this.invoices.remove(invoice);
            this.wizard.model.unselectInvoice(invoice);
        },
        // whenever this module is in the past
        past: function () {
            var wizard = this.wizard;
            // if the payment model doesn't has any invoice selected
            if (!wizard.model.getSelectedInvoices().length && !wizard.model.get('confirmation')) {
                // that is just wrong, get back to the first step son
                wizard.navigate("/" + wizard.steps[wizard.stepsOrder[0]].stepGroup.url);
            }
        },
        childViews: {
            'ListHeader.View': function () {
                return this.listHeader;
            },
            'Invoices.Collection': function () {
                var invoices_to_show = this.invoices.where({ apply: true }).map(function (invoice) {
                    var invoice_number = invoice.get('tranid') || invoice.get('refnum');
                    var navigable = !!invoice_number;
                    return new Backbone.Model({
                        internalid: invoice.id,
                        check: invoice.get('apply'),
                        active: invoice.get('due') !== 0,
                        navigable: navigable,
                        url: "invoices/" + invoice.id,
                        title: navigable
                            ? Utils.translate('Invoice #$(0)', invoice_number)
                            : Utils.translate('Journal'),
                        actionType: 'invoice',
                        isPayFull: invoice.isPayFull(),
                        columns: [
                            {
                                label: Utils.translate('Due date:'),
                                type: 'date',
                                name: 'original-amount',
                                compositeKey: 'PaymentWizardModuleInvoiceSubjectView',
                                composite: new PaymentWizardModuleInvoiceSubjectView({
                                    model: new Backbone.Model({
                                        isoverdue: invoice.get('isOverdue'),
                                        duedate: invoice.get('duedate'),
                                        discountapplies: invoice.get('discountapplies'),
                                        isPayFull: invoice.isPayFull(),
                                        discount_formatted: invoice.get('discount_formatted'),
                                        discdate: invoice.get('discdate'),
                                        ispaid: invoice.get('due') === 0
                                    })
                                })
                            },
                            {
                                label: Utils.translate('Amount Due:'),
                                type: 'currency',
                                name: 'amount',
                                value: invoice.get('due')
                                    ? invoice.get('due_formatted')
                                    : invoice.get('amount_formatted')
                            }
                        ]
                    });
                });
                return new BackboneCollectionView({
                    collection: invoices_to_show,
                    childView: RecordViewsSelectableActionableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        actionView: PaymentWizardModuleInvoiceActionView,
                        checkboxIsHidden: true
                    }
                });
            }
        },
        // @method getContext @return {PaymentWizard.Module.Invoice.Context}
        getContext: function () {
            // @class PaymentWizard.Module.Invoice.Context
            return {
                // @property {Boolean} isInvoiceLengthGreaterThan0
                isInvoiceLengthGreaterThan0: !!this.invoices.where({ apply: true }).length
            };
        }
    });
    return PaymentWizardModuleInvoice;
});

//# sourceMappingURL=PaymentWizard.Module.Invoice.js.map
