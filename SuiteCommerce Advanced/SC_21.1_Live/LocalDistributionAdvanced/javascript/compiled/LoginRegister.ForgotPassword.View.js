/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("LoginRegister.ForgotPassword.View", ["require", "exports", "underscore", "login_register_forgot_password.tpl", "Utils", "Configuration", "Footer.Simplified.View", "LoginRegister.Utils", "Account.ForgotPassword.Model", "Backbone.FormView", "Header.Simplified.View", "Backbone", "Backbone.View"], function (require, exports, _, forgot_password_tpl, Utils, Configuration_1, Footer_Simplified_View_1, LoginRegisterUtils, AccountForgotPasswordModel, BackboneFormView, HeaderSimplifiedView, Backbone, BackboneView) {
    "use strict";
    // @class LoginRegister.ForgotPassword.View Implements the forgot-password UI @extemd BackboneView
    var LoginRegisterForgotPasswordView = BackboneView.extend({
        template: forgot_password_tpl,
        attributes: {
            id: 'forgot-password'
        },
        title: Utils.translate('Reset Password'),
        events: {
            'submit form': 'saveForm',
            'click [data-action="sign-in-now"]': 'signInNowClick'
        },
        bindings: {
            '[name="email"]': 'email'
        },
        initialize: function () {
            // @property {Account.ForgotPassword.Model} model
            this.model = new AccountForgotPasswordModel();
            this.model.on('save', _.bind(this.showSuccess, this));
            BackboneFormView.add(this);
        },
        getHeaderView: function () {
            // We've got to disable passwordProtectedSite feature if customer registration is disabled.
            if (Configuration_1.Configuration.getRegistrationType() !== 'disabled' &&
                SC.ENVIRONMENT.siteSettings.siteloginrequired === 'T') {
                return HeaderSimplifiedView;
            }
        },
        getFooterView: function () {
            // We've got to disable passwordProtectedSite feature if customer registration is disabled.
            if (Configuration_1.Configuration.getRegistrationType() !== 'disabled' &&
                SC.ENVIRONMENT.siteSettings.siteloginrequired === 'T') {
                return Footer_Simplified_View_1.FooterSimplifiedView;
            }
        },
        render: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var checkoutApp = this.options.application.getConfig().checkoutApp;
            BackboneView.prototype.render.apply(this, args);
            if (this.$containerModal && checkoutApp.skipLogin) {
                this.$('header, h3').remove();
                this.$('[data-action="sign-in-now"]').attr({
                    'data-toggle': 'show-in-modal',
                    href: 'login'
                });
            }
        },
        // @method showSuccess
        showSuccess: function () {
            SC.ENVIRONMENT.reset_password_confirmation_email = true;
            Backbone.history.navigate('login-register', { trigger: true });
        },
        // @method signInNowClick
        signInNowClick: LoginRegisterUtils.skipLoginCloseModal,
        // @method saveForm override original saveForm method so
        // the skip-login modal is not closed, if any.
        saveForm: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var checkoutApp = this.options.application.getConfig().checkoutApp;
            // we don't want to close the modal, if any, on saveForm
            if (this.$containerModal && checkoutApp.skipLogin) {
                this.inModal = false;
            }
            return BackboneView.prototype.saveForm.apply(this, args).done(function () {
                this.inModal = true;
            });
        },
        // @method getcContext @return LoginRegister.ForgotPassword.View.Context
        getContext: function () {
            // @class LoginRegister.ForgotPassword.View.Context
            return {};
        }
    });
    return LoginRegisterForgotPasswordView;
});

//# sourceMappingURL=LoginRegister.ForgotPassword.View.js.map
