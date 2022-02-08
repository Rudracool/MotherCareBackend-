/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Account.Register.Model", ["require", "exports", "Utils", "Backbone"], function (require, exports, Utils, Backbone) {
    "use strict";
    // @class Account.Register.Model
    // Sends user input data to the register service
    // validating fields before they are sent
    // [Backbone.validation](https://github.com/thedersen/backbone.validation)
    // @extend Backbone.Model
    var AccountRegisterModel = Backbone.Model.extend({
        // @property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl('services/Account.Register.Service.ss'),
        // @property {Object} validation. Backbone.Validation attribute used for validating the form before submit.
        validation: {
            firstname: {
                required: true,
                msg: Utils.translate('First Name is required')
            },
            lastname: {
                required: true,
                msg: Utils.translate('Last Name is required')
            },
            email: {
                required: true,
                pattern: 'email',
                msg: Utils.translate('Valid Email is required')
            },
            company: {
                required: SC.ENVIRONMENT.siteSettings.registration.companyfieldmandatory === 'T',
                msg: Utils.translate('Company Name is required')
            },
            password: {
                required: true,
                msg: Utils.translate('Please enter a valid password')
            },
            password2: [
                {
                    required: true,
                    msg: Utils.translate('Confirm password is required')
                },
                {
                    equalTo: 'password',
                    msg: Utils.translate('New Password and Confirm Password do not match')
                }
            ]
        }
    });
    return AccountRegisterModel;
});

//# sourceMappingURL=Account.Register.Model.js.map
