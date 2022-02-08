/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Account.RegisterAsGuest.Model", ["require", "exports", "Utils", "Backbone"], function (require, exports, Utils, Backbone) {
    "use strict";
    // @class Account.RegisterAsGuest.Model
    // Register the User as Guest
    // @extend Backbone.Model
    var AccountRegisterAsGuestModelModel = Backbone.Model.extend({
        // @property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl('services/Account.RegisterAsGuest.Service.ss'),
        // @property {Object} validation. Backbone.Validation attribute used for validating the form before submit.
        validation: {
            firstname: {
                required: true,
                msg: Utils.translate('First Name is required')
            },
            // This code is commented temporarily, because of the inconsistence between Checkout and My Account regarding the require data from profile information (Checkout can miss last name)
            lastname: {
                required: true,
                msg: Utils.translate('Last Name is required')
            },
            email: {
                required: true,
                pattern: 'email',
                msg: Utils.translate('Valid Email is required')
            }
        }
    });
    return AccountRegisterAsGuestModelModel;
});

//# sourceMappingURL=Account.RegisterAsGuest.Model.js.map
