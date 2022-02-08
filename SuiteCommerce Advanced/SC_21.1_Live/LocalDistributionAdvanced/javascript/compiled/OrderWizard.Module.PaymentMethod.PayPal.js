/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PaymentMethod.PayPal", ["require", "exports", "underscore", "order_wizard_paymentmethod_paypal_module.tpl", "OrderWizard.Module.PaymentMethod", "Session", "Transaction.Paymentmethod.Model", "Backbone"], function (require, exports, _, order_wizard_paymentmethod_paypal_module_tpl, OrderWizardModulePaymentMethod, Session, TransactionPaymentmethodModel, Backbone) {
    "use strict";
    var OrderWizardModulePaymentMethodPayPal = OrderWizardModulePaymentMethod.extend({
        template: order_wizard_paymentmethod_paypal_module_tpl,
        isActive: function () {
            var siteSettings = this.wizard.application.getConfig().siteSettings || {};
            var paypal = _.findWhere(siteSettings.paymentmethods || [], { ispaypal: 'T' });
            return !!(paypal && paypal.internalid);
        },
        past: function () {
            if (this.isActive() &&
                !this.wizard.isPaypalComplete() &&
                !this.wizard.hidePayment() &&
                this.wizard.model.get('confirmation').isNew()) {
                var checkout_url = Session.get('touchpoints.checkout');
                var joint = ~checkout_url.indexOf('?') ? '&' : '?';
                var previous_step_url = this.wizard.getPreviousStepUrl();
                checkout_url += joint + 'paypal=T&next_step=' + previous_step_url;
                Backbone.history.navigate(previous_step_url, { trigger: false, replace: true });
                document.location.href = checkout_url;
                throw new Error('This is not an error. This is just to abort javascript');
            }
        },
        render: function () {
            if (this.isActive()) {
                this.paymentMethod = new TransactionPaymentmethodModel({ type: 'paypal' });
                this._render();
                if (this.wizard.isPaypalComplete()) {
                    this.paymentMethod.set('primary', null);
                    this.paymentMethod.set('complete', true);
                    var is_ready = this.options && this.options.backFromPaypalBehavior !== 'stay';
                    this.trigger('ready', is_ready);
                }
            }
        },
        getContext: function () {
            var checkoutApp = this.wizard.application.getConfig().checkoutApp || {};
            return {
                // @property {Boolean} isPaypalComplete
                isPaypalComplete: !!this.model.get('isPaypalComplete'),
                // @property {String} paypalImageUrl
                paypalImageUrl: checkoutApp.paypalLogo
            };
        }
    });
    return OrderWizardModulePaymentMethodPayPal;
});

//# sourceMappingURL=OrderWizard.Module.PaymentMethod.PayPal.js.map
