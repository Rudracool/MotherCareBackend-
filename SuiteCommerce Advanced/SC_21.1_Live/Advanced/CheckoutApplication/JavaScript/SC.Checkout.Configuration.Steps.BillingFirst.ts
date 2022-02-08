/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Checkout.Configuration.Steps.BillingFirst"/>

// @class SCA.Checkout.Configuration.Steps.BillingFirst
// The configuration steps so the Checkout wizard shows the Billing First Flow experience

import * as _ from 'underscore';

import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { CheckoutStepGroup } from './CheckoutStepsFactory';

import OrderWizardModuleMultiShipToEnableLink = require('../../OrderWizard.Module.MultiShipTo.EnableLink/JavaScript/OrderWizard.Module.MultiShipTo.EnableLink');
import OrderWizardModuleCartSummary = require('../../OrderWizard.Module.CartSummary/JavaScript/OrderWizard.Module.CartSummary');
import OrderWizardModuleAddressShipping = require('../../OrderWizard.Module.Address/JavaScript/OrderWizard.Module.Address.Shipping');
import OrderWizardModulePaymentMethodGiftCertificates = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.PaymentMethod.GiftCertificates');
import OrderWizardModulePaymentMethodSelector = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.PaymentMethod.Selector');
import OrderWizardModulePaymentMethodPurchaseNumber = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.PaymentMethod.PurchaseNumber');
import OrderWizardModuleAddressBilling = require('../../OrderWizard.Module.Address/JavaScript/OrderWizard.Module.Address.Billing');
import OrderWizardModuleRegisterEmail = require('../../OrderWizard.Module.Register/JavaScript/OrderWizard.Module.RegisterEmail');
import OrderWizardModuleShowPayments = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.ShowPayments');
import OrderWizardModuleSubmitButton = require('../../OrderWizard.Module.SubmitButton/JavaScript/OrderWizard.Module.SubmitButton');
import OrderWizardModuleTermsAndConditions = require('../../OrderWizard.Module.TermsAndConditions/JavaScript/OrderWizard.Module.TermsAndConditions');
import OrderWizardModuleConfirmation = require('../../OrderWizard.Module.Confirmation/JavaScript/OrderWizard.Module.Confirmation');
import OrderWizardModuleRegisterGuest = require('../../OrderWizard.Module.Register/JavaScript/OrderWizard.Module.RegisterGuest');
import OrderWizardModulePromocodeForm = require('../../OrderWizard.Module.PromocodeForm/JavaScript/OrderWizard.Module.PromocodeForm');
import OrderWizardModulePromocodeNotification = require('../../OrderWizard.Module.PromocodeNotifications/JavaScript/OrderWizard.Module.PromocodeNotifications');

import OrderWizardModuleMultiShipToSelectAddressesShipping = require('../../OrderWizard.Module.Address/JavaScript/OrderWizard.Module.MultiShipTo.Select.Addresses.Shipping');
import OrderWizardModuleMultiShipToPackageCreation = require('../../OrderWizard.Module.Package/JavaScript/OrderWizard.Module.MultiShipTo.Package.Creation');
import OrderWizardModuleMultiShipToPackageList = require('../../OrderWizard.Module.Package/JavaScript/OrderWizard.Module.MultiShipTo.Package.List');
import OrderWizardModuleNonShippableItems = require('../../OrderWizard.Module.NonShippableItems/JavaScript/OrderWizard.Module.NonShippableItems');
import OrderWizardModuleMultiShipToShipmethod = require('../../OrderWizard.Module.Shipmethod/JavaScript/OrderWizard.Module.MultiShipTo.Shipmethod');
import OrderWizardModuleShipmethod = require('../../OrderWizard.Module.Shipmethod/JavaScript/OrderWizard.Module.Shipmethod');
import OrderWizardModuleShowShipments = require('../../OrderWizard.Module.Shipmethod/JavaScript/OrderWizard.Module.ShowShipments');
import OrderWizardModuleCartItemsPickupInStore = require('../../OrderWizard.Module.CartItems/JavaScript/OrderWizard.Module.CartItems.PickupInStore');
import OrderWizardModuleCartItemsShip = require('../../OrderWizard.Module.CartItems/JavaScript/OrderWizard.Module.CartItems.Ship');
import OrderWizardModuleCartItemsPickupInStoreList = require('../../OrderWizard.Module.CartItems/JavaScript/OrderWizard.Module.CartItems.PickupInStore.List');
import HeaderView = require('../../Header/JavaScript/Header.View');

const mstDeliveryOptions = {
    is_read_only: false,
    show_edit_address_url: false,
    hide_accordion: true,
    collapse_items: true
};
const showShipmentOptions = {
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
const cartSummaryOptions = {
    exclude_on_skip_step: true,
    allow_remove_promocode: true,
    container: '#wizard-step-content-right'
};
const cartItemsOptionsRight = {
    container: '#wizard-step-content-right',
    hideHeaders: true,
    showMobile: true,
    exclude_on_skip_step: true,
    showOpenedAccordion: Utils.isTabletDevice() || Utils.isDesktopDevice() || false
};
const cartItemsNonShippableOptionsRight = _.extend(
    {
        title: Utils.translate('Other Items'),
        show_mobile: true,
        show_table_header: false,
        show_edit_cart_button: true
    },

    cartItemsOptionsRight
);

const BillingFirst: CheckoutStepGroup[] = [
    {
        name: Utils.translate('Billing Address'),
        steps: [
            {
                name: Utils.translate('Enter Billing Address'),
                url: 'billing/address',
                isActive: function(): boolean {
                    return !this.wizard.isMultiShipTo();
                },
                modules: [
                    [OrderWizardModulePromocodeNotification, { exclude_on_skip_step: true }],
                    [
                        OrderWizardModuleSubmitButton,
                        { className: 'order-wizard-submitbutton-module-top' }
                    ],
                    [OrderWizardModuleMultiShipToEnableLink, { exclude_on_skip_step: true }],
                    OrderWizardModuleAddressBilling,
                    [OrderWizardModuleCartSummary, cartSummaryOptions],
                    [
                        OrderWizardModuleSubmitButton,
                        {
                            container: '#wizard-step-content-right',
                            showWrapper: true,
                            wrapperClass: 'order-wizard-submitbutton-container',
                            is_below_summary: true
                        }
                    ],
                    [OrderWizardModulePromocodeForm, cartItemsOptionsRight],
                    [
                        OrderWizardModuleCartItemsPickupInStore,
                        _.extend(
                            {
                                show_opened_accordion: false,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            },
                            cartItemsOptionsRight
                        )
                    ],
                    [
                        OrderWizardModuleCartItemsShip,
                        _.extend(
                            {
                                show_opened_accordion: false,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            },
                            cartItemsOptionsRight
                        )
                    ],
                    [OrderWizardModuleNonShippableItems, cartItemsNonShippableOptionsRight]
                ]
            }
        ]
    },
    {
        name: Utils.translate('Shipping Address'),
        steps: [
            {
                name: Utils.translate('Choose Shipping Address'),
                url: 'shipping/address',
                isActive: function(): boolean {
                    const isMultiShipTo = !this.wizard.isMultiShipTo();
                    return isMultiShipTo && this.wizard.model.getShippableLines().length;
                },
                modules: [
                    [OrderWizardModulePromocodeNotification, { exclude_on_skip_step: true }],
                    [
                        OrderWizardModuleSubmitButton,
                        { className: 'order-wizard-submitbutton-module-top' }
                    ],
                    OrderWizardModuleMultiShipToEnableLink,
                    [
                        OrderWizardModuleAddressShipping,
                        { enable_same_as: true, title: Utils.translate('Shipping Address') }
                    ],
                    [OrderWizardModuleShipmethod, mstDeliveryOptions],
                    [OrderWizardModuleCartSummary, cartSummaryOptions],
                    [
                        OrderWizardModuleSubmitButton,
                        {
                            container: '#wizard-step-content-right',
                            showWrapper: true,
                            wrapperClass: 'order-wizard-submitbutton-container',
                            is_below_summary: true
                        }
                    ],
                    [OrderWizardModulePromocodeForm, cartItemsOptionsRight],
                    [
                        OrderWizardModuleCartItemsShip,
                        _.extend(
                            {
                                show_opened_accordion: Utils.isDesktopDevice(),
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            },
                            cartItemsOptionsRight
                        )
                    ],
                    [
                        OrderWizardModuleCartItemsPickupInStore,
                        _.extend(
                            {
                                show_opened_accordion: false,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            },
                            cartItemsOptionsRight
                        )
                    ],
                    [OrderWizardModuleNonShippableItems, cartItemsNonShippableOptionsRight]
                ]
            },
            {
                name: Utils.translate('Enter Shipping Address'),
                url: 'shipping/selectAddress',
                isActive: function(): boolean {
                    return this.wizard.isMultiShipTo();
                },
                modules: [
                    [OrderWizardModuleMultiShipToEnableLink, { exclude_on_skip_step: true }],
                    [
                        OrderWizardModuleMultiShipToSelectAddressesShipping,
                        { edit_addresses_url: 'shipping/selectAddress' }
                    ],
                    [OrderWizardModuleCartSummary, cartSummaryOptions],
                    [OrderWizardModulePromocodeForm, cartItemsOptionsRight]
                ]
            }
        ]
    },
    {
        name: Utils.translate('Set shipments'),
        steps: [
            {
                name: Utils.translate('Set shipments'),
                isActive: function(): boolean {
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
                    [OrderWizardModuleCartSummary, cartSummaryOptions],
                    [OrderWizardModulePromocodeForm, cartItemsOptionsRight]
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
                isActive: function(): boolean {
                    return this.wizard.isMultiShipTo();
                },
                modules: [
                    [OrderWizardModuleMultiShipToShipmethod, mstDeliveryOptions],
                    [OrderWizardModuleNonShippableItems, mstDeliveryOptions],
                    [OrderWizardModuleCartSummary, cartSummaryOptions],
                    [OrderWizardModulePromocodeForm, cartItemsOptionsRight]
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
                bottomMessage: Utils.translate(
                    'You will have an opportunity to review your order on the next step.'
                ),
                modules: [
                    [OrderWizardModulePromocodeNotification, { exclude_on_skip_step: true }],
                    [
                        OrderWizardModuleSubmitButton,
                        { className: 'order-wizard-submitbutton-module-top' }
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
                            enable_same_as: function(): boolean {
                                return (
                                    !this.wizard.isMultiShipTo() &&
                                    this.wizard.model.shippingAddressIsRequired()
                                );
                            },
                            title: Utils.translate('Enter Billing Address'),
                            select_shipping_address_url: 'shipping/selectAddress'
                        }
                    ],
                    OrderWizardModuleRegisterEmail,
                    [OrderWizardModuleCartSummary, cartSummaryOptions],
                    [
                        OrderWizardModuleSubmitButton,
                        {
                            container: '#wizard-step-content-right',
                            showWrapper: true,
                            wrapperClass: 'order-wizard-submitbutton-container',
                            is_below_summary: true
                        }
                    ],
                    [OrderWizardModulePromocodeForm, cartItemsOptionsRight],
                    [
                        OrderWizardModuleCartItemsPickupInStore,
                        _.extend(
                            {
                                show_opened_accordion: false,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            },
                            cartItemsOptionsRight
                        )
                    ],
                    [
                        OrderWizardModuleCartItemsShip,
                        _.extend(
                            {
                                show_opened_accordion: false,
                                show_edit_cart_button: true,
                                show_headers: false,
                                show_mobile: true
                            },
                            cartItemsOptionsRight
                        )
                    ],
                    [OrderWizardModuleNonShippableItems, cartItemsNonShippableOptionsRight]
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
                continueButtonLabel: function(): string {
                    return this.wizard && this.wizard.isExternalCheckout()
                        ? Utils.translate('Continue to External Payment')
                        : Utils.translate('Place Order');
                },
                bottomMessage: function(): string {
                    return this.wizard && this.wizard.isExternalCheckout()
                        ? Utils.translate(
                            'You will be redirected to a secure site to confirm your payment.'
                        )
                        : '';
                },
                modules: [
                    [
                        OrderWizardModuleTermsAndConditions,
                        { className: 'order-wizard-termsandconditions-module-top' }
                    ],
                    [
                        OrderWizardModuleSubmitButton,
                        { className: 'order-wizard-submitbutton-module-top' }
                    ],
                    [OrderWizardModulePromocodeNotification, { exclude_on_skip_step: true }],
                    [
                        OrderWizardModuleCartItemsPickupInStoreList,
                        {
                            show_opened_accordion: true,
                            is_accordion_primary: true,
                            show_edit_cart_button: true,
                            show_headers: false,
                            show_mobile: true
                        }
                    ],

                    [OrderWizardModuleShowShipments, showShipmentOptions],
                    [OrderWizardModuleMultiShipToShipmethod, showShipmentOptions],

                    [
                        OrderWizardModuleNonShippableItems,
                        {
                            show_mobile: false,
                            show_table_header: true,
                            show_opened_accordion: true,
                            show_edit_cart_button: true
                        }
                    ],

                    [
                        OrderWizardModuleShowPayments,
                        { edit_url_billing: '/billing', edit_url_address: '/billing' }
                    ],
                    [
                        OrderWizardModuleTermsAndConditions,
                        { className: 'order-wizard-termsandconditions-module-default' }
                    ],
                    [
                        OrderWizardModuleCartSummary,
                        _.extend(_.clone(cartSummaryOptions), {
                            hideSummaryItems: true,
                            hide_continue_button: false,
                            hide_cart_terms: false
                        })
                    ],
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
                            wrapperClass: 'order-wizard-submitbutton-container'
                        }
                    ],
                    [OrderWizardModulePromocodeForm, cartItemsOptionsRight],
                    [
                        // Mobile Right Bottom
                        OrderWizardModuleTermsAndConditions,
                        {
                            className: 'order-wizard-termsandconditions-module-bottom',
                            container: '#wizard-step-content-right'
                        }
                    ]
                ],
                save: function(): Promise<void> {
                    if (SC.CONFIGURATION.isThreeDSecureEnabled) {
                        const promise = this.wizard.model.submit();

                        return this.wizard.start3DSecure(promise);
                    }

                    (<any>_.first(this.moduleInstances)).trigger(
                        'change_label_continue',
                        Utils.translate('Processing...')
                    );

                    const self = this;
                    const submit_operation = this.wizard.model.submit();

                    submit_operation.always(function(): void {
                        (<any>_.first(self.moduleInstances)).trigger('change_label_continue');
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
                            additional_confirmation_message: Utils.translate(
                                'You will receive an email with this confirmation in a few minutes.'
                            )
                        }
                    ],
                    [OrderWizardModuleRegisterGuest],
                    [
                        OrderWizardModuleCartSummary,
                        _.extend(_.clone(cartSummaryOptions), {
                            hideSummaryItems: true,
                            show_promocode_form: false,
                            allow_remove_promocode: false,
                            isConfirmation: true
                        })
                    ]
                ]
            }
        ]
    }
];

export { BillingFirst };
