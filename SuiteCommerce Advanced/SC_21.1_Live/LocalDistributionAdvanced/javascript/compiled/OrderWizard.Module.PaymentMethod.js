/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PaymentMethod", ["require", "exports", "Wizard.StepModule"], function (require, exports, Wizard_StepModule_1) {
    "use strict";
    var OrderWizardModulePaymentMethod = Wizard_StepModule_1.WizardStepModule.extend({
        submit: function () {
            // Gets the payment method for this object
            var payment_method = this.paymentMethod;
            return this.model.addPayment(payment_method);
        }
    });
    return OrderWizardModulePaymentMethod;
});

//# sourceMappingURL=OrderWizard.Module.PaymentMethod.js.map
