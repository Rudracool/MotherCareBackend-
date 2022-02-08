/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("LoginRegister.Login.View", ["require", "exports", "underscore", "login_register_login.tpl", "Utils", "jQuery", "Configuration", "GlobalViews.Message.View", "Profile.Model", "Tracker", "Session", "Account.Login.Model", "LoginRegister.Utils", "LiveOrder.Model", "Backbone", "Backbone.View", "Backbone.FormView", "jQuery.serializeObject"], function (require, exports, _, login_tpl, Utils, jQuery, Configuration_1, GlobalViews_Message_View_1, Profile_Model_1, Tracker, Session, AccountLoginModel, LoginRegisterUtils, LiveOrderModel, Backbone, BackboneView, BackboneFormView) {
    "use strict";
    // @class LoginRegister.Login.View Implements the login experience UI @extend BackboneView
    var LoginRegisterLoginView = BackboneView.extend({
        template: login_tpl,
        attributes: {
            id: 'login'
        },
        title: Utils.translate('Log in'),
        events: {
            'submit form': 'submitForm',
            'click [data-action="register-now"]': 'skipLoginCloseModal',
            'click [data-action="forgot-password"]': 'forgotPasswordHandler'
        },
        bindings: {
            '[name="email"]': 'email',
            '[name="password"]': 'password'
        },
        initialize: function (options) {
            this.application = options.application;
            this.parentView = options.parentView;
            this.model = new AccountLoginModel();
            this.timedout =
                options.timedout || Utils.getParameterByName(window.location.href, 'timeout') === 'T';
            // on save we redirect the user out of the login page as we know there hasn't been an error
            this.model.on('save', _.bind(this.redirect, this));
            BackboneFormView.add(this);
        },
        transformResponseText: function (response) {
            response.responseText = _.unescape(response.responseText);
        },
        submitForm: function (e, model, props) {
            e.preventDefault();
            var self = this;
            var data = jQuery(e.target).closest('form').serializeObject();
            return this.cancelableTrigger('before:LoginRegister.login', data).then(function () {
                self.saveForm(e, model, props);
            });
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
        // @method forgotPasswordHandler handles the 'forgot-password' redirection
        forgotPasswordHandler: function () {
            LoginRegisterUtils.skipLoginCloseModal();
            Backbone.history.navigate('#forgot-password', { trigger: true });
        },
        childViews: {
            GlobalMessageSessionTimeout: function () {
                return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: Utils.translate('Your session has timed out. Please log in again.'),
                    type: 'error',
                    closable: false
                });
            }
        },
        // @method skipLoginCloseModal
        skipLoginCloseModal: LoginRegisterUtils.skipLoginCloseModal,
        render: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var checkoutApp = this.application.getConfig().checkoutApp;
            BackboneView.prototype.render.apply(this, args);
            if (this.$containerModal && checkoutApp.skipLogin) {
                this.$('[data-action="forgot-password"]').attr('data-toggle', 'show-in-modal');
            }
        },
        // @method trackEvent tracks the 'sing-in' event using the global Tracker
        // instance @param {Function} callback
        trackEvent: function (callback) {
            Tracker.getInstance().trackLogin({
                category: 'Checkout - User Interaction',
                action: 'Login',
                callback: callback
            });
        },
        // @method redirect Redirects the user after successful login taking into account redirect parameters (origin and origin_hash).
        // @param {Object} response The HTTP response data object, response of the login service.
        redirect: function (context, response) {
            var url_options = Utils.parseUrlOptions(window.location.search);
            var touchpoints = response.touchpoints;
            var isPasswordReset = url_options.passwdret;
            var self = this;
            // Track Login Event
            this.trackEvent(function () {
                if (!isPasswordReset &&
                    (url_options.is === 'checkout' || url_options.origin === 'checkout')) {
                    self.refreshApplication(response);
                }
                else {
                    // if we know from which touchpoint the user is coming from
                    if (url_options.origin && touchpoints[url_options.origin]) {
                        // we save the URL to that touchpoint
                        var url = touchpoints[url_options.origin];
                        // if there is an specific hash
                        if (url_options.origin_hash) {
                            // we add it to the URL as a fragment
                            url = Utils.addParamsToUrl(url, { fragment: url_options.origin_hash });
                        }
                        window.location.href = url;
                    }
                    else {
                        // We've got to disable passwordProtectedSite feature if customer registration is disabled.
                        if (Configuration_1.Configuration.getRegistrationType() !== 'disabled' &&
                            SC.ENVIRONMENT.siteSettings.siteloginrequired === 'T') {
                            window.location.href = touchpoints.home;
                        }
                        else {
                            // otherwise we need to take it to the customer center
                            window.location.href = touchpoints.customercenter;
                        }
                    }
                }
            });
        },
        // @method refreshApplication login and checkout are unified in the same ssp so after user logs in we want to refresh the UI without having to refresh the entire
        // Remember that the new user can be associated to other language/currency so we must refresh all the application.
        // The easy and safer way would be refreshing the page.
        // @param {LoginRegister.LoginResponseData} the JSON object containing the login service response data
        refreshApplication: function (response) {
            var current_language = Session.get('language.locale');
            var application = this.application;
            // @class LoginRegister.LoginResponseData
            // @property language {locale:String} language
            if (response.language &&
                response.language.locale &&
                current_language !== response.language.locale) {
                window.location.href = response.touchpoints.checkout;
            }
            else {
                var profile_model = Profile_Model_1.ProfileModel.getInstance();
                // @property {String} user serialized JSON user information
                response.user && profile_model.set(response.user);
                // @property {String} cart serialized JSON cart information
                response.cart && LiveOrderModel.getInstance().set(response.cart);
                // @property {String} address serialized JSON addresses information
                response.address && profile_model.get('addresses').reset(response.address);
                // @property {String} credit-card serialized JSON creditcards information
                response.paymentmethod &&
                    profile_model.get('paymentmethods').reset(response.paymentmethod);
                // @property {core:String} currency
                response.currency &&
                    response.currency.code &&
                    Session.set('currency', response.currency);
                // @property {Object} touchpoints
                if (response.touchpoints) {
                    application.setConfig('siteSettings.touchpoints', response.touchpoints);
                }
                application.setConfig('currentTouchpoint', 'checkout');
                Backbone.history.navigate('', { trigger: true });
            }
            // @class LoginRegister.Login.View
        },
        // @method getContext @return {LoginRegister.Login.View.Context}
        getContext: function () {
            var url_options = Utils.parseUrlOptions(window.location.search);
            var checkoutApp = this.application.getConfig().checkoutApp;
            // @class LoginRegister.Login.View.Context
            return {
                // @property {Boolean} isRedirect
                isRedirect: !!(url_options.is !== 'checkout' && url_options.origin !== 'checkout'),
                // @property {Boolean} hasAutoFocus
                hasAutoFocus: url_options.is !== 'register' && Utils.isDesktopDevice(),
                // @property {Boolean} isUserSessionTimedOut
                isUserSessionTimedOut: url_options.timedout === 'T' || this.timedout,
                // @property {Boolean} isSkipLogin
                isSkipLogin: !!(this.$containerModal && checkoutApp.skipLogin)
            };
        }
        // @class LoginRegister.Login.View
    });
    return LoginRegisterLoginView;
});

//# sourceMappingURL=LoginRegister.Login.View.js.map
