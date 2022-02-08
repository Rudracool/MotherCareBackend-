/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Notifications.Profile.View", ["require", "exports", "notifications_profile.tpl", "Utils", "GlobalViews.Message.View", "Profile.Model", "Session", "Backbone.View"], function (require, exports, notifications_profile_tpl, Utils, GlobalViews_Message_View_1, Profile_Model_1, Session, BackboneView) {
    "use strict";
    // @class Notifications.Profile.View @extends Backbone.View
    var NotificationsProfileView = BackboneView.extend({
        template: notifications_profile_tpl,
        initialize: function () { },
        render: function () {
            this.model = Profile_Model_1.ProfileModel.getInstance();
            if (Session.get('email_change_verification', false)) {
                this.message = {
                    text: SC.SESSION.email_change_verification === 'true'
                        ? Utils.translate('Your email has been changed successfully to <strong>') + this.model.get('email') + "</strong>"
                        : SC.SESSION.email_change_verification,
                    type: SC.SESSION.email_change_verification === 'true' ? 'success' : 'error'
                };
                delete SC.SESSION.email_change_verification;
            }
            else if (SC.ENVIRONMENT.email_verification_error) {
                this.message = {
                    text: Utils.translate('The validation process has failed. Please login into your account and click on the validation link again.'),
                    type: 'error'
                };
                delete SC.ENVIRONMENT.email_verification_error;
            }
            else if (SC.ENVIRONMENT.password_reset_invalid_error) {
                this.message = {
                    text: Utils.translate('Your reset password link is invalid. Request a new one using the Forgot Password link.'),
                    type: 'error'
                };
                delete SC.ENVIRONMENT.password_reset_invalid_error;
            }
            else if (SC.ENVIRONMENT.password_reset_expired_error) {
                this.message = {
                    text: Utils.translate('Your reset password link has expired. Request a new one using the Forgot Password link.'),
                    type: 'error'
                };
                delete SC.ENVIRONMENT.password_reset_expired_error;
            }
            else if (SC.ENVIRONMENT.reset_password_confirmation_email) {
                this.message = {
                    text: Utils.translate('Please check your email and get instructions on how to reset your password.'),
                    type: 'success'
                };
                delete SC.ENVIRONMENT.reset_password_confirmation_email;
            }
            else if (SC.ENVIRONMENT.updated_password_confirmation) {
                this.message = {
                    text: Utils.translate('Your password has been reset.'),
                    type: 'success'
                };
                delete SC.ENVIRONMENT.updated_password_confirmation;
            }
            this._render();
        },
        // @property {ChildViews} childViews
        childViews: {
            'ProfileChanges.Notifications': function () {
                if (this.message) {
                    return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                        message: this.message.text,
                        type: this.message.type,
                        closable: true
                    });
                }
            }
        },
        // @method getContext @return Notifications.Order.View.Context
        getContext: function () {
            // @class Notifications.Order.View.Context
            return {};
        }
    });
    return NotificationsProfileView;
});

//# sourceMappingURL=Notifications.Profile.View.js.map
