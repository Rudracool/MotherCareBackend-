/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("LoginRegister.ResetPassword.View", ["require", "exports", "underscore", "login_register_reset_password.tpl", "Utils", "Configuration", "Account.ResetPassword.Model", "Backbone.FormView", "Header.Simplified.View", "Backbone", "Backbone.View"], function (require, exports, _, reset_password_tpl, Utils, Configuration_1, AccountResetPasswordModel, BackboneFormView, HeaderSimplifiedView, Backbone, BackboneView) {
    "use strict";
    // @class LoginRegister.ResetPassword.View implements
    // the reset-password experience UI @extend BackboneView
    var LoginRegisterResetPasswordView = BackboneView.extend({
        template: reset_password_tpl,
        attributes: {
            id: 'reset-password'
        },
        title: Utils.translate('Reset Password'),
        events: {
            'submit form': 'saveForm'
        },
        bindings: {
            '[name="password"]': 'password',
            '[name="confirm_password"]': 'confirm_password'
        },
        initialize: function () {
            this.model = new AccountResetPasswordModel();
            this.model.set('params', { cb: Utils.parseUrlOptions(location.search).cb });
            this.model.on('save', _.bind(this.showSuccess, this));
            BackboneFormView.add(this);
        },
        // @method showSuccess
        showSuccess: function () {
            SC.ENVIRONMENT.updated_password_confirmation = true;
            Backbone.history.navigate('login-register', { trigger: true });
        },
        getHeaderView: function () {
            // We've got to disable passwordProtectedSite feature if customer registration is disabled.
            if (Configuration_1.Configuration.getRegistrationType() !== 'disabled' &&
                SC.ENVIRONMENT.siteSettings.siteloginrequired === 'T') {
                return HeaderSimplifiedView;
            }
        }
    });
    return LoginRegisterResetPasswordView;
});

//# sourceMappingURL=LoginRegister.ResetPassword.View.js.map
