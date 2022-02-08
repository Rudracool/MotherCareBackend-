/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard", ["require", "exports", "CheckoutStepsFactory", "Profile.Model", "OrderWizard.Router", "LiveOrder.Model", "OrderWizard.View"], function (require, exports, CheckoutStepsFactory_1, Profile_Model_1, OrderWizardRouter, LiveOrderModel, OrderWizardView) {
    "use strict";
    var OrderWizard = {
        mountToApp: function (application) {
            var checkoutSteps = CheckoutStepsFactory_1.CheckoutStepsFactory.getInstance().getCheckoutSteps();
            var order_wizard_router = new OrderWizardRouter(application, {
                model: LiveOrderModel.getInstance(),
                profile: Profile_Model_1.ProfileModel.getInstance(),
                steps: checkoutSteps
            });
            OrderWizardView.wizard = order_wizard_router;
            var checkout_component = application.getComponent('Checkout');
            checkout_component._setOrderWizardRouter(order_wizard_router);
        }
    };
    return OrderWizard;
});

//# sourceMappingURL=OrderWizard.js.map
