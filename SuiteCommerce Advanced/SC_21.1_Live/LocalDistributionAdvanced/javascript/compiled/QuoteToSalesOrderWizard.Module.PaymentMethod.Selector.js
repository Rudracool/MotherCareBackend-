/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuoteToSalesOrderWizard.Module.PaymentMethod.Selector", ["require", "exports", "Utils", "OrderWizard.Module.PaymentMethod.Selector"], function (require, exports, Utils, OrderWizardModulePaymentMethodSelector) {
    "use strict";
    return OrderWizardModulePaymentMethodSelector.extend({
        className: 'QuoteToSalesOrderWizard.Module.PaymentMethod.Selector',
        render: function () {
            if (this.wizard.hidePayment()) {
                this.$el.empty();
            }
            else {
                OrderWizardModulePaymentMethodSelector.prototype.render.apply(this, arguments);
            }
            if (this.selectedModule && !!~this.selectedModule.type.indexOf('external_checkout')) {
                this.trigger('change_label_continue', Utils.translate('Continue to External Payment'));
            }
            else {
                this.trigger('change_label_continue', Utils.translate('Submit'));
            }
        }
    });
});

//# sourceMappingURL=QuoteToSalesOrderWizard.Module.PaymentMethod.Selector.js.map
