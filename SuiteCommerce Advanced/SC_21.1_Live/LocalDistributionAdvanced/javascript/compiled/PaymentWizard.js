/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard", ["require", "exports", "Profile.Model", "PaymentWizard.Router", "LivePayment.Model", "PaymentWizard.View", "PaymentWizard.Configuration"], function (require, exports, Profile_Model_1, PaymentWizardRouter, LivePaymentModel, PaymentWizardView, PaymentWizardConfiguration) {
    "use strict";
    // @class PaymentWizard @extends ApplicationModule
    var PaymentWizard = {
        mountToApp: function (application) {
            var paymentRouter = new PaymentWizardRouter(application, {
                profile: Profile_Model_1.ProfileModel.getInstance(),
                model: LivePaymentModel.getInstance(),
                steps: PaymentWizardConfiguration
            });
            PaymentWizardView.wizard = paymentRouter;
            return paymentRouter;
        }
    };
    return PaymentWizard;
});

//# sourceMappingURL=PaymentWizard.js.map
