/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("LoginRegister.View", ["require", "exports", "underscore", "login_register.tpl", "notifications.tpl", "Utils", "jQuery", "Configuration", "Footer.Simplified.View", "GlobalViews.Message.View", "Profile.Model", "LoginRegister.Login.View", "LoginRegister.Register.View", "LoginRegister.CheckoutAsGuest.View", "Header.Simplified.View", "Tracker", "Backbone", "Backbone.View"], function (require, exports, _, login_register_tpl, notifications_tpl, Utils, jQuery, Configuration_1, Footer_Simplified_View_1, GlobalViews_Message_View_1, Profile_Model_1, LoginView, RegisterView, CheckoutAsGuestView, HeaderSimplifiedView, Tracker, Backbone, BackboneView) {
    "use strict";
    // @class LoginRegister.View This class shows both the Login
    // form and the Register at the same time. @extends BackboneView
    var LoginRegisterView = BackboneView.extend({
        template: login_register_tpl,
        enhancedEcommercePage: true,
        attributes: {
            id: 'LoginRegister.View',
            'data-root-component-id': 'LoginRegister.View'
        },
        title: Utils.translate('Log in | Register'),
        events: {
            // login error message could contain link to registration page
            'click .alert-error a': 'handleErrorLink'
        },
        beforeShowContent: function beforeShowContent() {
            var promise = jQuery.Deferred();
            var profileModel = Profile_Model_1.ProfileModel.getInstance();
            if (profileModel.get('isLoggedIn') === 'T' && profileModel.get('isGuest') === 'F') {
                Backbone.history.navigate('', { trigger: true });
                promise.reject();
            }
            else {
                promise.resolve();
            }
            return promise;
        },
        initialize: function (options) {
            var application = options.application;
            // To distinguish between when the login is called from the Register header link or the Proceed to Checkout link, we use the origin URL param (is_checking_out)
            // origin=checkout when the checkout link is clicked so we show the guest checkout button.
            var parameters = Utils.parseUrlOptions(location.search);
            var is_checking_out = (parameters && parameters.is === 'checkout') ||
                (parameters && parameters.origin === 'checkout') ||
                false;
            var profile_model = Profile_Model_1.ProfileModel.getInstance();
            this.child_view_options = {
                application: application,
                parentView: this,
                timedout: options.timedout
            };
            this.pageTitle = Utils.translate('Log in');
            this.enableLogin = Configuration_1.Configuration.getRegistrationType() !== 'disabled';
            this.enableRegister =
                Configuration_1.Configuration.getRegistrationType() === 'optional' ||
                    Configuration_1.Configuration.getRegistrationType() === 'required';
            // we only show the CheckoutAsGuest button in 'checkout' touchpoint. Never in login/register touchpoints.
            this.enableCheckoutAsGuest =
                is_checking_out &&
                    profile_model.get('isLoggedIn') === 'F' &&
                    (Configuration_1.Configuration.getRegistrationType() === 'optional' ||
                        Configuration_1.Configuration.getRegistrationType() === 'disabled');
            if (!notifications_tpl) {
                if (SC.ENVIRONMENT.email_verification_error) {
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
            }
            this.on('afterViewRender', this.trackStep, this);
        },
        trackStep: function () {
            Tracker.getInstance().trackPageviewForCheckoutStep(1);
        },
        // @method handleErrorLink workaround to native netsuite error links. In particular if error contains a link to the register touch-point we want to show the registration form without navigate.
        // @return {Void}
        handleErrorLink: function (e) {
            // if the link contains the register touch-point
            if (~e.target.href.indexOf(Configuration_1.Configuration.get('siteSettings.touchpoints.register'))) {
                e.preventDefault();
                this.showRegistrationForm();
                this.childViewInstances.Login.hideError();
            }
        },
        // @method disableButtons
        // @param {Boolean} state
        // @return {LoginRegsiter.View} Current instance of the view
        disableButtons: function (state) {
            this.getChildViewInstance('Login')
                .$('a, input, button')
                .prop('disabled', state);
            if (this.getChildViewInstance('CheckoutAsGuest')) {
                this.getChildViewInstance('CheckoutAsGuest')
                    .$('a, input, button')
                    .prop('disabled', state);
            }
            this.getChildViewInstance('Register')
                .$('a, input, button')
                .prop('disabled', state);
            return this;
        },
        // @method showRegistrationForm  make sure the registration form is in the front
        showRegistrationForm: function () {
            // show the form
            this.$('[data-view="Register"]').addClass('in');
            // hide the container of the link to show it
            this.$('[data-view="CheckoutAsGuest"]').removeClass('in');
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
        childViews: {
            Login: function () {
                return new LoginView(this.child_view_options);
            },
            CheckoutAsGuest: function () {
                return new CheckoutAsGuestView(_.extend({ hideRegister: !this.enableRegister }, this.child_view_options));
            },
            Register: function () {
                return new RegisterView(this.child_view_options);
            },
            Messages: function () {
                if (this.message) {
                    return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                        message: this.message.text,
                        type: this.message.type || 'error',
                        closable: true
                    });
                }
            }
        },
        // @method getContext
        // @return {LoginRegister.View.Context}
        getContext: function () {
            // @class LoginRegister.View.Context
            return {
                // @property {Boolean} showRegister
                showRegister: this.enableRegister,
                // @property {Boolean} showCheckoutAsGuest
                showCheckoutAsGuest: this.enableCheckoutAsGuest,
                // @property {Boolean} showLogin
                showLogin: this.enableLogin,
                // @property {Boolean} showRegisterOrGuest
                showRegisterOrGuest: this.enableRegister || this.enableCheckoutAsGuest
            };
        }
    });
    return LoginRegisterView;
});

//# sourceMappingURL=LoginRegister.View.js.map
