/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Module.PaymentMethod.Creditcard", ["require", "exports", "underscore", "Utils", "jQuery", "OrderWizard.Module.PaymentMethod.Creditcard"], function (require, exports, _, Utils, jQuery, OrderWizardModulePaymentMethodCreditcard) {
    "use strict";
    // @class PaymentWizard.Module.PaymentMethod.Creditcard @extend OrderWizard.Module.PaymentMethod.Creditcard
    var PaymentWizardModulePaymentMethodCreditcard = OrderWizardModulePaymentMethodCreditcard.extend({
        itemsPerRow: Utils.isDesktopDevice() ? 3 : 2,
        showDefaults: true,
        className: 'PaymentWizard.Module.PaymentMethod.Creditcard',
        render: function () {
            if (this.wizard.hidePayment()) {
                this.$el.empty();
            }
            else {
                OrderWizardModulePaymentMethodCreditcard.prototype.render.apply(this, arguments);
            }
        },
        initialize: function (options) {
            OrderWizardModulePaymentMethodCreditcard.prototype.initialize.apply(this, arguments);
            this.wizard.model.on('change:payment', jQuery.proxy(this, 'changeTotal'));
            this.itemsPerRow = _.result(options, 'itemsPerRow') || this.itemsPerRow;
        },
        changeTotal: function () {
            var was = this.model.previous('payment');
            var was_confirmation = this.model.previous('confirmation');
            var is_confirmation = this.model.get('confirmation');
            var is = this.model.get('payment');
            // Changed from or to 0
            if (((was === 0 && is !== 0) || (was !== 0 && is === 0)) &&
                !was_confirmation &&
                !is_confirmation) {
                this.render();
            }
        }
    });
    return PaymentWizardModulePaymentMethodCreditcard;
});

//# sourceMappingURL=PaymentWizard.Module.PaymentMethod.Creditcard.js.map
