/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PaymentMethod.External", ["require", "exports", "underscore", "order_wizard_paymentmethod_external_module.tpl", "Utils", "Configuration", "OrderWizard.Module.PaymentMethod", "Transaction.Paymentmethod.Model"], function (require, exports, _, order_wizard_paymentmethod_external_module_tpl, Utils, Configuration_1, OrderWizardModulePaymentMethod, TransactionPaymentmethodModel) {
    "use strict";
    // @class OrderWizard.Module.PaymentMethod.External @extends OrderWizard.Module.PaymentMethod
    var OrderWizardModulePaymentMethodExternal = OrderWizardModulePaymentMethod.extend({
        template: order_wizard_paymentmethod_external_module_tpl,
        render: function render() {
            var options = this.options.model && this.options.model.get('options');
            if (options) {
                _.extend(this.options, options);
            }
            this.setPaymentMethod();
            this._render();
        },
        setPaymentMethod: function () {
            var n = Configuration_1.Configuration.get('siteSettings.id');
            var status_accept_value = Configuration_1.Configuration.get('siteSettings.externalCheckout.' +
                this.options.record_type.toUpperCase() +
                '.statusAcceptValue', 'ACCEPT');
            var status_reject_value = Configuration_1.Configuration.get('siteSettings.externalCheckout.' +
                this.options.record_type.toUpperCase() +
                '.statusRejectValue', 'REJECT');
            var status_parameter_name = Configuration_1.Configuration.get('siteSettings.externalCheckout.' +
                this.options.record_type.toUpperCase() +
                '.statusParameterName', 'status');
            var url = Utils.getAbsoluteUrl('external_payment.ssp');
            var current_touchpoint = Configuration_1.Configuration.get('currentTouchpoint');
            var thankyouurl_parameters = {
                n: n,
                externalPaymentDone: 'T',
                touchpoint: current_touchpoint,
                recordType: this.options.record_type || 'salesorder'
            };
            var errorurl_parameters = {
                n: n,
                externalPaymentDone: 'T',
                touchpoint: current_touchpoint,
                recordType: this.options.record_type || 'salesorder'
            };
            var returnurl_parameters = {
                n: n,
                externalPaymentDone: 'T',
                touchpoint: current_touchpoint,
                recordType: this.options.record_type || 'salesorder'
            };
            thankyouurl_parameters[status_parameter_name] = status_accept_value;
            errorurl_parameters[status_parameter_name] = status_reject_value;
            if (this.options.prevent_default) {
                var prevent_default_parameter_name = Configuration_1.Configuration.get('siteSettings.externalCheckout.' +
                    this.options.record_type.toUpperCase() +
                    '.preventDefaultParameterName', 'preventDefault');
                var prevent_default_value = Configuration_1.Configuration.get('siteSettings.externalCheckout.' +
                    this.options.record_type.toUpperCase() +
                    '.preventDefaultValue', 'T');
                thankyouurl_parameters[prevent_default_parameter_name] = prevent_default_value;
                errorurl_parameters[prevent_default_parameter_name] = prevent_default_value;
                returnurl_parameters[prevent_default_parameter_name] = prevent_default_value;
            }
            this.paymentMethod = new TransactionPaymentmethodModel({
                type: 'external_checkout_' + this.options.paymentmethod.key,
                isexternal: 'T',
                internalid: this.options.paymentmethod.internalid,
                merchantid: this.options.paymentmethod.merchantid,
                key: this.options.paymentmethod.key,
                thankyouurl: Utils.addParamsToUrl(url, thankyouurl_parameters),
                errorurl: Utils.addParamsToUrl(url, errorurl_parameters),
                returnurl: Utils.addParamsToUrl(url, returnurl_parameters) // SuiteScript
            });
        },
        submit: function submit() {
            this.setPaymentMethod();
            OrderWizardModulePaymentMethod.prototype.submit.apply(this);
        },
        getContext: function getContext() {
            return {
                // @property {String} imageUrl
                imageUrl: this.options.paymentmethod.imagesrc[0],
                // @property {String} name
                name: this.options.paymentmethod.name,
                // @property {String} description
                description: this.options.description ||
                    Utils.translate('You will be redirected to your external payment site after reviewing your order on next step. Once your order is placed, you will return to our site to see the confirmation of your purchase.'),
                // @property {String} type
                type: this.paymentMethod.get('type'),
                isSelected: this.paymentMethod.get('type') === this.options.selectedExternalId
            };
        }
    });
    return OrderWizardModulePaymentMethodExternal;
});

//# sourceMappingURL=OrderWizard.Module.PaymentMethod.External.js.map
