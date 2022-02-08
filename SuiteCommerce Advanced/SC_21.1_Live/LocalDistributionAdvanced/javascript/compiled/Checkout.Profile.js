/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Checkout.Profile", ["require", "exports", "Checkout.Component", "Profile.Model"], function (require, exports, Checkout_Component_1, Profile_Model_1) {
    "use strict";
    // Profile.js
    // -----------------
    // Defines the Profile module (Collection, Views, Router)
    // As the profile is instanciated in the application (without definining a model)
    // the validation is configured here in the mountToApp
    var CheckoutProfile = {
        mountToApp: function (application) {
            var profile_model = Profile_Model_1.ProfileModel.getInstance();
            profile_model.set(SC.ENVIRONMENT.PROFILE);
            if (SC.ENVIRONMENT.ADDRESS) {
                profile_model.get('addresses').reset(SC.ENVIRONMENT.ADDRESS);
                delete SC.ENVIRONMENT.ADDRESS;
            }
            else {
                profile_model.get('addresses').reset([]);
            }
            if (SC.ENVIRONMENT.PAYMENTMETHOD) {
                profile_model.get('paymentmethods').reset(SC.ENVIRONMENT.PAYMENTMETHOD);
                delete SC.ENVIRONMENT.PAYMENTMETHOD;
            }
            else {
                profile_model.get('paymentmethods').reset([]);
            }
            return Checkout_Component_1.CheckoutComponent(application);
        }
    };
    return CheckoutProfile;
});

//# sourceMappingURL=Checkout.Profile.js.map
