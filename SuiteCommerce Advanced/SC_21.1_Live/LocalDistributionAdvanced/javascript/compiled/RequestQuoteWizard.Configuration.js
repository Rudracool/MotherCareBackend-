/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RequestQuoteWizard.Configuration", ["require", "exports", "underscore", "Utils", "Configuration", "OrderWizard.Module.ShowShipments", "RequestQuoteWizard.Module.Header", "RequestQuoteWizard.Module.Message", "RequestQuoteWizard.Module.QuickAdd", "RequestQuoteWizard.Module.Comments", "RequestQuoteWizard.Module.Items", "RequestQuoteWizard.Module.Confirmation", "OrderWizard.Module.Title", "OrderWizard.Module.Address.Shipping"], function (require, exports, _, Utils, Configuration_1, OrderWizardModuleShowShipments, RequestQuoteWizardModuleHeader, RequestQuoteWizardModuleMessage, RequestQuoteWizardModuleQuickAdd, RequestQuoteWizardModuleComments, RequestQuoteWizardModuleItems, RequestQuoteWizardModuleConfirmation, OrderWizardModuleTitle, OrderWizardModuleAddressShipping) {
    "use strict";
    return {
        steps: [
            {
                name: '',
                steps: [
                    {
                        url: 'request-a-quote',
                        name: Utils.translate('Request a Quote'),
                        hideBackButton: true,
                        hideContinueButton: false,
                        bottomMessage: Configuration_1.Configuration.get('quote.requestAQuoteWizardBottomMessage'),
                        continueButtonLabel: Utils.translate('Submit Quote Request'),
                        modules: [
                            RequestQuoteWizardModuleHeader,
                            RequestQuoteWizardModuleMessage,
                            [
                                OrderWizardModuleTitle,
                                {
                                    title: Utils.translate('Add Items')
                                }
                            ],
                            RequestQuoteWizardModuleQuickAdd,
                            RequestQuoteWizardModuleItems,
                            [
                                OrderWizardModuleTitle,
                                {
                                    title: Utils.translate('Choose a Shipping Address')
                                }
                            ],
                            OrderWizardModuleAddressShipping,
                            [
                                OrderWizardModuleTitle,
                                {
                                    title: Utils.translate('Comments')
                                }
                            ],
                            RequestQuoteWizardModuleComments
                        ],
                        save: function () {
                            _.first(this.moduleInstances).trigger('change_label_continue', Utils.translate('Processing...'));
                            var self = this;
                            var submit_opreation = this.wizard.model.submit();
                            submit_opreation.always(function () {
                                _.first(self.moduleInstances).trigger('change_label_continue', Utils.translate('Submit Quote Request'));
                            });
                            return submit_opreation;
                        }
                    },
                    {
                        url: 'request-a-quote-confirmation',
                        name: Utils.translate('Request a Quote'),
                        hideBackButton: true,
                        hideContinueButton: true,
                        confirmationMessage: Utils.translate('A sales representative will contact you in <strong>XX business days</strong>.'),
                        modules: [
                            RequestQuoteWizardModuleConfirmation,
                            [
                                OrderWizardModuleShowShipments,
                                {
                                    hide_edit_cart_button: true,
                                    hide_edit_address_button: true,
                                    hideShippingMethod: true
                                }
                            ],
                            [
                                RequestQuoteWizardModuleComments,
                                {
                                    is_read_only: true,
                                    title: Utils.translate('Comments'),
                                    hide_title: false
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    };
});

//# sourceMappingURL=RequestQuoteWizard.Configuration.js.map
