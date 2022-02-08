/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuoteToSalesOrderWizard.Configuration", ["require", "exports", "underscore", "Utils", "Configuration", "OrderWizard.Module.CartSummary", "OrderWizard.Module.ShowShipments", "OrderWizard.Module.ShowPayments", "OrderWizard.Module.TermsAndConditions", "OrderWizard.Module.SubmitButton", "OrderWizard.Module.PaymentMethod.Creditcard", "OrderWizard.Module.PaymentMethod.Invoice", "OrderWizard.Module.Address.Billing", "QuoteToSalesOrderWizard.Module.QuoteDetails", "QuoteToSalesOrderWizard.Module.Confirmation", "QuoteToSalesOrderWizard.Module.PaymentMethod.Selector", "Header.View"], function (require, exports, _, Utils, Configuration_1, OrderWizardModuleCartSummary, OrderWizardModuleShowShipments, OrderWizardModuleShowPayments, OrderWizardModuleTermsAndConditions, OrderWizardModuleSubmitButton, OrderWizardModulePaymentMethodCreditcard, OrderWizardModulePaymentMethodInvoice, OrderWizardModuleAddressBilling, QuoteToSalesOrderWizardModuleQuoteDetails, QuoteToSalesOrderWizardModuleConfirmation, QuoteToSalesOrderWizardModulePaymentMethodSelector, HeaderView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QuoteToSalesOrderWizardConfiguration = {
        steps: [
            {
                name: Utils.translate('REVIEW YOUR ORDER'),
                steps: [
                    {
                        url: 'quotetosalesorder-review',
                        name: Utils.translate('Review Your Oder'),
                        hideBackButton: true,
                        hideContinueButton: false,
                        continueButtonLabel: Utils.translate('Place Order'),
                        hideBreadcrumb: true,
                        showBottomMessage: true,
                        modules: [
                            QuoteToSalesOrderWizardModuleQuoteDetails,
                            [
                                OrderWizardModuleCartSummary,
                                {
                                    container: '#wizard-step-content-right',
                                    warningMessage: Utils.translate('Total may include handling costs not displayed in the summary breakdown')
                                }
                            ],
                            [
                                OrderWizardModuleTermsAndConditions,
                                {
                                    container: '#wizard-step-content-right',
                                    showWrapper: true,
                                    wrapperClass: 'order-wizard-termsandconditions-module-top-summary'
                                }
                            ],
                            [
                                OrderWizardModuleTermsAndConditions,
                                {
                                    container: '#wizard-step-content-right',
                                    showWrapper: true,
                                    wrapperClass: 'order-wizard-termsandconditions-module-bottom'
                                }
                            ],
                            [
                                OrderWizardModuleSubmitButton,
                                {
                                    container: '#wizard-step-content-right',
                                    showWrapper: true,
                                    wrapperClass: 'order-wizard-submitbutton-container'
                                }
                            ],
                            [
                                QuoteToSalesOrderWizardModulePaymentMethodSelector,
                                {
                                    record_type: 'salesorder',
                                    modules: [
                                        {
                                            classModule: OrderWizardModulePaymentMethodCreditcard,
                                            name: Utils.translate('Credit / Debit Card'),
                                            type: 'creditcard',
                                            options: {}
                                        },
                                        {
                                            classModule: OrderWizardModulePaymentMethodInvoice,
                                            name: Utils.translate('Invoice'),
                                            type: 'invoice',
                                            options: {}
                                        }
                                    ]
                                }
                            ],
                            [
                                OrderWizardModuleAddressBilling,
                                {
                                    title: Utils.translate('Billing Address')
                                }
                            ],
                            [
                                OrderWizardModuleShowShipments,
                                {
                                    hide_edit_cart_button: true,
                                    hide_edit_address_button: true
                                }
                            ],
                            [
                                OrderWizardModuleTermsAndConditions,
                                {
                                    showWrapper: true,
                                    wrapperClass: 'order-wizard-termsandconditions-module-default'
                                }
                            ]
                        ],
                        save: function () {
                            var first_module_instance = _.first(this.moduleInstances);
                            first_module_instance.trigger('change_label_continue', Utils.translate('Processing...'));
                            var orderSubmission = jQuery.Deferred();
                            this.wizard.model
                                .submit()
                                .done(function (salesOrder) {
                                if (salesOrder.confirmation &&
                                    salesOrder.confirmation.statuscode === 'redirect') {
                                    window.location.href = Utils.addParamsToUrl(salesOrder.confirmation.redirecturl, {
                                        touchpoint: Configuration_1.Configuration.get('currentTouchpoint')
                                    });
                                    orderSubmission.reject();
                                }
                                first_module_instance.trigger('change_label_continue', Utils.translate('Placed Order'));
                                orderSubmission.resolve();
                            })
                                .fail(function (error) {
                                first_module_instance.trigger('change_label_continue', Utils.translate('Submit'));
                                orderSubmission.reject(error);
                            });
                            return orderSubmission;
                        }
                    }
                ]
            },
            {
                steps: [
                    {
                        url: 'quotetosalesorder-confirmation',
                        hideContinueButton: true,
                        name: Utils.translate('Thank you'),
                        hideBackButton: true,
                        hideBreadcrumb: true,
                        headerView: HeaderView,
                        modules: [
                            [
                                OrderWizardModuleCartSummary,
                                {
                                    container: '#wizard-step-content-right',
                                    warningMessage: Utils.translate('Total may include handling costs not displayed in the summary breakdown')
                                }
                            ],
                            QuoteToSalesOrderWizardModuleConfirmation,
                            QuoteToSalesOrderWizardModuleQuoteDetails,
                            [OrderWizardModuleShowPayments],
                            [
                                OrderWizardModuleShowShipments,
                                {
                                    hide_edit_cart_button: true,
                                    hide_edit_address_button: true
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    };
});

//# sourceMappingURL=QuoteToSalesOrderWizard.Configuration.js.map
