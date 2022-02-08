/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.ShowPayments", ["require", "exports", "underscore", "order_wizard_showpayments_module.tpl", "Wizard.StepModule", "Backbone.CollectionView", "Address.Details.View", "GlobalViews.FormatPaymentMethod.View"], function (require, exports, _, order_wizard_showpayments_module_tpl, Wizard_StepModule_1, BackboneCollectionView, Address_Details_View_1, GlobalViewsFormatPaymentMethodView) {
    "use strict";
    // @class OrderWizard.Module.ShowPayments @extends Wizard.Module
    var OrderWizardModuleShowPayments = Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: order_wizard_showpayments_module_tpl,
        // @property {String} className
        className: 'OrderWizard.Module.ShowPayments',
        // @method initialize
        initialize: function () {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            this.application = this.wizard.application;
            this.profile = this.wizard.options.profile;
            this.addressSource = this.profile.get('addresses');
        },
        // @method getPaymentmethods
        getPaymentmethods: function () {
            return _.reject(this.model.get('paymentmethods').models, function (paymentmethod) {
                return paymentmethod.get('type') === 'giftcertificate';
            });
        },
        // @method getGiftCertificates
        getGiftCertificates: function () {
            return this.model.get('paymentmethods').where({ type: 'giftcertificate' });
        },
        // @method past
        past: function () {
            this.model.off('change', this.totalChange, this);
            this.addressSource.off('change', this.render, this);
        },
        // @method present
        present: function () {
            this.model.off('change', this.totalChange, this);
            this.addressSource.off('change', this.render, this);
            this.model.on('change', this.totalChange, this);
            this.addressSource.on('change', this.render, this);
        },
        // @method future
        future: function () {
            this.model.off('change', this.totalChange, this);
            this.addressSource.off('change', this.render, this);
        },
        // @method totalChange
        totalChange: function () {
            var was = this.model.previous('summary').total;
            var was_confirmation = this.model.previous('confirmation');
            var is = this.model.get('summary') && this.model.get('summary').total;
            // Changed from or to 0
            if (((was === 0 && is !== 0) || (was !== 0 && is === 0)) && !was_confirmation) {
                this.render();
            }
        },
        // @property {Object} childViews
        childViews: {
            'Billing.Address': function () {
                return new Address_Details_View_1.AddressDetailsView({
                    model: this.addressSource.get(this.model.get('billaddress')),
                    hideActions: true,
                    hideDefaults: true,
                    manage: 'billaddress',
                    hideSelector: true
                });
            },
            'GiftCertificates.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.getGiftCertificates(),
                    viewsPerRow: 1,
                    childView: GlobalViewsFormatPaymentMethodView
                });
            },
            'PaymentMethods.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.getPaymentmethods(),
                    viewsPerRow: 1,
                    childView: GlobalViewsFormatPaymentMethodView
                });
            }
        },
        // @method showPayments Indicate if in the rendering process payment method must be shown or not
        // @return {Boolean}
        showPayments: function () {
            if (this.options.hidePayment) {
                return false;
            }
            return !!(this.getGiftCertificates().length ||
                this.getPaymentmethods().length ||
                !this.wizard.hidePayment());
        },
        // @method getContext
        // @returns {OrderWizard.Module.ShowPayments.Context}
        getContext: function () {
            var billing_address = this.addressSource.get(this.model.get('billaddress'));
            var giftcertificates = this.getGiftCertificates();
            var edit_url_billing = _.isFunction(this.options.edit_url_billing)
                ? this.options.edit_url_billing.apply(this)
                : this.options.edit_url_billing;
            // @class OrderWizard.Module.ShowPayments.Context
            return {
                // @property {Boolean} showBilling
                showBilling: !this.options.hideBilling,
                // @property {Boolean} showBillingAddress
                showBillingAddress: !!billing_address,
                // @property {Boolean} showEditBillingButton
                showEditBillingButton: !!(billing_address && edit_url_billing),
                // @property {String} editBillingUrl
                editBillingUrl: edit_url_billing,
                // @property {Boolean} showPayments
                showPayments: this.showPayments(),
                // @property {Boolean} showGuestEmail
                showGuestEmail: this.profile.get('isGuest') === 'T',
                // @property {String} guestEmail
                guestEmail: this.profile.get('email'),
                // @property {Boolean} showGiftcertificates
                showGiftcertificates: !!giftcertificates.length
            };
        }
    });
    return OrderWizardModuleShowPayments;
});

//# sourceMappingURL=OrderWizard.Module.ShowPayments.js.map
