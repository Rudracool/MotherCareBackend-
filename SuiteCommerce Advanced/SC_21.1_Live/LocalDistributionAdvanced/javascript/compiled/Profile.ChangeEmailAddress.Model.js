/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Profile.ChangeEmailAddress.Model", ["require", "exports", "Utils", "Backbone"], function (require, exports, Utils, Backbone) {
    "use strict";
    // Profile.ChangeEmailAddress.Model.js
    // -----------------------
    // View Model for changing user's email
    // @class Profile.ChangeEmailAddress.Model @extends Backbone.Model
    var ProfileChangeEmailAddressModel = Backbone.Model.extend({
        urlRoot: 'services/Profile.Service.ss',
        validation: {
            current_password: { required: true, msg: Utils.translate('Current password is required') },
            confirm_email: [
                { required: true, msg: Utils.translate('Confirm Email is required') },
                {
                    equalTo: 'new_email',
                    msg: Utils.translate('New Email and Confirm New Email do not match')
                }
            ],
            new_email: { required: true, msg: Utils.translate('New Email is required') }
        }
    });
    return ProfileChangeEmailAddressModel;
});

//# sourceMappingURL=Profile.ChangeEmailAddress.Model.js.map
