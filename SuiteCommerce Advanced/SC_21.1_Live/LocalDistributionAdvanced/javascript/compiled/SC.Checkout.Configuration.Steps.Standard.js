/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.Checkout.Configuration.Steps.Standard", ["require", "exports", "underscore", "Utils", "OrderWizard.Module.MultiShipTo.EnableLink", "OrderWizard.Module.CartSummary", "OrderWizard.Module.Address.Shipping", "OrderWizard.Module.PaymentMethod.GiftCertificates", "OrderWizard.Module.PaymentMethod.Selector", "OrderWizard.Module.PaymentMethod.PurchaseNumber", "OrderWizard.Module.Address.Billing", "OrderWizard.Module.RegisterEmail", "OrderWizard.Module.ShowPayments", "OrderWizard.Module.SubmitButton", "OrderWizard.Module.TermsAndConditions", "OrderWizard.Module.Confirmation", "OrderWizard.Module.RegisterGuest", "OrderWizard.Module.PromocodeForm", "OrderWizard.Module.PromocodeNotifications", "OrderWizard.Module.MultiShipTo.Select.Addresses.Shipping", "OrderWizard.Module.MultiShipTo.Package.Creation", "OrderWizard.Module.MultiShipTo.Package.List", "OrderWizard.Module.NonShippableItems", "OrderWizard.Module.MultiShipTo.Shipmethod", "OrderWizard.Module.Shipmethod", "OrderWizard.Module.ShowShipments", "OrderWizard.Module.CartItems.PickupInStore", "OrderWizard.Module.CartItems.Ship", "OrderWizard.Module.CartItems.PickupInStore.List", "Header.View", "OrderWizard.Module.CartItems"], function (require, exports, _, Utils, OrderWizardModuleMultiShipToEnableLink, OrderWizardModuleCartSummary, OrderWizardModuleAddressShipping, OrderWizardModulePaymentMethodGiftCertificates, OrderWizardModulePaymentMethodSelector, OrderWizardModulePaymentMethodPurchaseNumber, OrderWizardModuleAddressBilling, OrderWizardModuleRegisterEmail, OrderWizardModuleShowPayments, OrderWizardModuleSubmitButton, OrderWizardModuleTermsAndConditions, OrderWizardModuleConfirmation, OrderWizardModuleRegisterGuest, OrderWizardModulePromocodeForm, OrderWizardModulePromocodeNotification, OrderWizardModuleMultiShipToSelectAddressesShipping, OrderWizardModuleMultiShipToPackageCreation, OrderWizardModuleMultiShipToPackageList, OrderWizardModuleNonShippableItems, OrderWizardModuleMultiShipToShipmethod, OrderWizardModuleShipmethod, OrderWizardModuleShowShipments, OrderWizardModuleCartItemsPickupInStore, OrderWizardModuleCartItemsShip, OrderWizardModuleCartItemsPickupInStoreList, HeaderView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mst_delivery_options = {
        is_read_only: false,
        show_edit_address_url: false,
        hide_accordion: true,
        collapse_items: true
    };
    var show_shipment_options = {
        edit_url: '/shipping/address',
        show_edit_address_url: true,
        hide_title: true,
        edit_shipment_url: 'shipping/addressPackages',
        edit_shipment_address_url: 'shipping/selectAddress',
        is_read_only: false,
        show_combo: true,
        show_edit_button: true,
        hide_item_link: true
    };
    var cart_summary_options = {
        exclude_on_skip_step: true,
        allow_remove_promocode: true,
        container: '#wizard-step-content-right'
    };
    var cart_items_options_right = {
        container: '#wizard-step-content-right',
        hideHeaders: true,
        showMobile: true,
        exclude_on_skip_step: true,
        showOpenedAccordion: Utils.isTabletDevice() || Utils.isDesktopDevice() || false
    };
    var cart_items_non_shippable_options_right = _.extend({
        title: Utils.translate('Other Items'),
        show_mobile: true,
        show_table_header: false,
        show_edit_cart_button: true
    }, cart_items_options_right);
    var Standard = [
        {
            name: Utils.translate('Shipping Address'),
            steps: [
                {
                    name: Utils.translate('Choose Shipping Address'),
                    url: 'shipping/address',
                    isActive: function () {
                        return !this.wizard.isMultiShipTo();
                    },
                    modules: [
                        [OrderWizardModulePromocodeNotification, { exclude_on_skip_step: true }],
                        [
                            // Mobile Top
                            OrderWizardModuleSubmitButton,
                            {
                                className: 'order-wizard-submitbutton-module-top',
                                exclude_on_skip_step: true
                            }
                        ],
                        OrderWizardModuleMultiShipToEnableLink,
                        OrderWizardModuleAddressShipping,
                        [OrderWizardModuleShipmethod, mst_delivery_options],
                        [OrderWizardModuleCartSummary, cart_summary_options],
                        [
                            OrderWizardModuleSubmitButton,
                            {
                                container: '#wizard-step-content-right',
                                showWrapper: true,
                                wrapperClass: 'order-wizard-submitbutton-container',
                                exclude_on_skip_step: true,
                                is_below_summary: true
                            }
                        ],
                        [OrderWizardModulePromocodeForm, cart_items_options_right],
                        [
                            OrderWizardModuleCartItemsShip,
                            _.extend({
                                show_opened_accordion: Utils.isDesktopDevice(),
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            }, cart_items_options_right)
                        ],
                        [
                            OrderWizardModuleCartItemsPickupInStore,
                            _.extend({
                                show_opened_accordion: false,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            }, cart_items_options_right)
                        ],
                        [OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
                    ]
                },
                {
                    name: Utils.translate('Enter Shipping Address'),
                    url: 'shipping/selectAddress',
                    isActive: function () {
                        return this.wizard.isMultiShipTo();
                    },
                    modules: [
                        [OrderWizardModuleMultiShipToEnableLink, { exclude_on_skip_step: true }],
                        [
                            OrderWizardModuleMultiShipToSelectAddressesShipping,
                            { edit_addresses_url: 'shipping/selectAddress' }
                        ],
                        [OrderWizardModuleCartSummary, cart_summary_options],
                        [OrderWizardModulePromocodeForm, cart_items_options_right]
                    ]
                }
            ]
        },
        {
            name: Utils.translate('Set shipments'),
            steps: [
                {
                    name: Utils.translate('Set shipments'),
                    isActive: function () {
                        return this.wizard.isMultiShipTo();
                    },
                    url: 'shipping/addressPackages',
                    modules: [
                        [OrderWizardModuleMultiShipToEnableLink, { change_url: 'shipping/address' }],
                        [
                            OrderWizardModuleMultiShipToPackageCreation,
                            { edit_addresses_url: 'shipping/selectAddress' }
                        ],
                        OrderWizardModuleMultiShipToPackageList,
                        OrderWizardModuleNonShippableItems,
                        [OrderWizardModuleCartSummary, cart_summary_options],
                        [OrderWizardModulePromocodeForm, cart_items_options_right]
                    ]
                }
            ]
        },
        {
            name: Utils.translate('Delivery Method'),
            steps: [
                {
                    name: Utils.translate('Choose delivery method'),
                    url: 'shipping/packages',
                    isActive: function () {
                        return this.wizard.isMultiShipTo();
                    },
                    modules: [
                        [OrderWizardModuleMultiShipToShipmethod, mst_delivery_options],
                        [OrderWizardModuleNonShippableItems, mst_delivery_options],
                        [OrderWizardModuleCartSummary, cart_summary_options],
                        [OrderWizardModulePromocodeForm, cart_items_options_right]
                    ]
                }
            ]
        },
        {
            name: Utils.translate('Payment'),
            steps: [
                {
                    name: Utils.translate('Choose Payment Method'),
                    url: 'billing',
                    bottomMessage: Utils.translate('You will have an opportunity to review your order on the next step.'),
                    modules: [
                        [OrderWizardModulePromocodeNotification, { exclude_on_skip_step: true }],
                        [
                            // Mobile Top
                            OrderWizardModuleSubmitButton,
                            {
                                className: 'order-wizard-submitbutton-module-top',
                                exclude_on_skip_step: true
                            }
                        ],
                        [
                            OrderWizardModulePaymentMethodSelector,
                            { record_type: 'salesorder', prevent_default: true }
                        ],
                        OrderWizardModulePaymentMethodGiftCertificates,
                        OrderWizardModulePaymentMethodPurchaseNumber,
                        [
                            OrderWizardModuleAddressBilling,
                            {
                                enable_same_as: function () {
                                    return (!this.wizard.isMultiShipTo() &&
                                        this.wizard.model.shippingAddressIsRequired());
                                },
                                title: Utils.translate('Enter Billing Address'),
                                select_shipping_address_url: 'shipping/selectAddress'
                            }
                        ],
                        OrderWizardModuleRegisterEmail,
                        [OrderWizardModuleCartSummary, cart_summary_options],
                        [
                            OrderWizardModuleSubmitButton,
                            {
                                container: '#wizard-step-content-right',
                                showWrapper: true,
                                wrapperClass: 'order-wizard-submitbutton-container',
                                exclude_on_skip_step: true,
                                is_below_summary: true
                            }
                        ],
                        [OrderWizardModulePromocodeForm, cart_items_options_right],
                        [
                            OrderWizardModuleCartItemsPickupInStore,
                            _.extend({
                                show_opened_accordion: false,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            }, cart_items_options_right)
                        ],
                        [
                            OrderWizardModuleCartItemsShip,
                            _.extend({
                                show_opened_accordion: false,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            }, cart_items_options_right)
                        ],
                        [OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
                    ]
                }
            ]
        },
        {
            name: Utils.translate('Review'),
            steps: [
                {
                    name: Utils.translate('Review Your Order'),
                    url: 'review',
                    continueButtonLabel: function () {
                        return this.wizard && this.wizard.isExternalCheckout()
                            ? Utils.translate('Continue to External Payment')
                            : Utils.translate('Place Order');
                    },
                    bottomMessage: function () {
                        return this.wizard && this.wizard.isExternalCheckout()
                            ? Utils.translate('You will be redirected to a secure site to confirm your payment.')
                            : '';
                    },
                    modules: [
                        [
                            // Mobile Top
                            OrderWizardModuleTermsAndConditions,
                            {
                                className: 'order-wizard-termsandconditions-module-top'
                            }
                        ],
                        [
                            // Mobile Top
                            OrderWizardModuleSubmitButton,
                            {
                                className: 'order-wizard-submitbutton-module-top',
                                exclude_on_skip_step: true
                            }
                        ],
                        [OrderWizardModulePromocodeNotification, { exclude_on_skip_step: true }],
                        [
                            OrderWizardModuleCartItemsPickupInStoreList,
                            {
                                show_opened_accordion: Utils.isDesktopDevice(),
                                is_accordion_primary: true,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            }
                        ],
                        [
                            OrderWizardModuleShowShipments,
                            _.extend(_.clone(show_shipment_options), {
                            // edit_url: false
                            })
                        ],
                        [OrderWizardModuleMultiShipToShipmethod, show_shipment_options],
                        [
                            OrderWizardModuleNonShippableItems,
                            {
                                show_mobile: false,
                                show_table_header: true,
                                show_opened_accordion: Utils.isDesktopDevice(),
                                is_accordion_primary: true,
                                show_edit_cart_button: true
                            }
                        ],
                        [
                            OrderWizardModuleShowPayments,
                            { edit_url_billing: '/billing', edit_url_address: '/billing' }
                        ],
                        [
                            // Desktop Bottom
                            OrderWizardModuleTermsAndConditions,
                            {
                                className: 'order-wizard-termsandconditions-module-default'
                            }
                        ],
                        [OrderWizardModuleCartSummary, cart_summary_options],
                        [
                            // Desktop Right
                            OrderWizardModuleTermsAndConditions,
                            {
                                container: '#wizard-step-content-right',
                                className: 'order-wizard-termsandconditions-module-top-summary'
                            }
                        ],
                        [
                            OrderWizardModuleSubmitButton,
                            {
                                container: '#wizard-step-content-right',
                                showWrapper: true,
                                wrapperClass: 'order-wizard-submitbutton-container',
                                exclude_on_skip_step: true,
                                is_below_summary: true
                            }
                        ],
                        [OrderWizardModulePromocodeForm, cart_items_options_right],
                        [
                            // Mobile Right Bottom
                            OrderWizardModuleTermsAndConditions,
                            {
                                className: 'order-wizard-termsandconditions-module-bottom',
                                container: '#wizard-step-content-right'
                            }
                        ]
                    ],
                    save: function () {
                        var _this = this;
                        if (SC.CONFIGURATION.isThreeDSecureEnabled) {
                            var promise = this.wizard.model.submit();
                            return this.wizard.start3DSecure(promise);
                        }
                        _.first(this.moduleInstances).trigger('change_label_continue', Utils.translate('Processing...'));
                        var submit_operation = this.wizard.model.submit();
                        submit_operation.always(function () {
                            _.first(_this.moduleInstances).trigger('change_label_continue');
                        });
                        return submit_operation;
                    }
                },
                {
                    url: 'confirmation',
                    hideContinueButton: true,
                    hideBackButton: true,
                    hideBreadcrumb: true,
                    headerView: HeaderView,
                    modules: [
                        [
                            OrderWizardModuleConfirmation,
                            {
                                additional_confirmation_message: Utils.translate('You will receive an email with this confirmation in a few minutes.')
                            }
                        ],
                        [OrderWizardModuleRegisterGuest],
                        [
                            OrderWizardModuleCartSummary,
                            _.extend({
                                hideSummaryItems: true,
                                show_promocode_form: false,
                                allow_remove_promocode: false,
                                isConfirmation: true
                            }, cart_summary_options)
                        ]
                    ]
                }
            ]
        }
    ];
    exports.Standard = Standard;
});

//# sourceMappingURL=SC.Checkout.Configuration.Steps.Standard.js.map
