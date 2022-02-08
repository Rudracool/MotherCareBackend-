/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Checkout.Profile"/>

import { CheckoutComponent } from '../../../Advanced/OrderWizard/JavaScript/Checkout.Component';
import { ProfileModel } from './Profile.Model';

// Profile.js
// -----------------
// Defines the Profile module (Collection, Views, Router)
// As the profile is instanciated in the application (without definining a model)
// the validation is configured here in the mountToApp

const CheckoutProfile: any = {
    mountToApp: function(application) {
        const profile_model = ProfileModel.getInstance();

        profile_model.set(SC.ENVIRONMENT.PROFILE);

        if (SC.ENVIRONMENT.ADDRESS) {
            profile_model.get('addresses').reset(SC.ENVIRONMENT.ADDRESS);
            delete SC.ENVIRONMENT.ADDRESS;
        } else {
            profile_model.get('addresses').reset([]);
        }

        if (SC.ENVIRONMENT.PAYMENTMETHOD) {
            profile_model.get('paymentmethods').reset(SC.ENVIRONMENT.PAYMENTMETHOD);
            delete SC.ENVIRONMENT.PAYMENTMETHOD;
        } else {
            profile_model.get('paymentmethods').reset([]);
        }

        return CheckoutComponent(application);
    }
};

export = CheckoutProfile;
