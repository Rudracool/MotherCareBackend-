/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Account.RegisterAsGuest.ServiceController.js
// ----------------
// Service to enable the user to be registered as a guest.
define('Account.RegisterAsGuest.ServiceController', [
    'ServiceController',
    'Account.Model'
], function(ServiceController, AccountModel) {
    // @class Account.RegisterAsGuest.ServiceController Supports register as guest process
    // @extend ServiceController
    return ServiceController.extend({
        // @property {String} name Mandatory for all ssp-libraries model
        name: 'Account.RegisterAsGuest.ServiceController',

        // @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
        // The values in this object are the validation needed for the current service.
        // Can have values for all the request methods ('common' values) and specific for each one.
        options: {
            common: {
                registrationNotRequired: true
            }
        },
        // @method post The call to Account.RegisterAsGuest.Service.ss with http method 'post' is managed by this function
        // @return {Account.Model.Attributes}
        post: function() {
            return AccountModel.registerAsGuest(this.data);
        }
    });
});
