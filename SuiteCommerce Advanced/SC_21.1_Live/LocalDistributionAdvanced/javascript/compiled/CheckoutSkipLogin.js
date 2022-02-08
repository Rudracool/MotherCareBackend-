/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CheckoutSkipLogin", ["require", "exports", "underscore", "Utils", "jQuery", "Profile.Model", "Address.Model", "Account.RegisterAsGuest.Model", "LiveOrder.Model", "PaymentMethod.Model"], function (require, exports, _, Utils, jQuery, Profile_Model_1, Address_Model_1, AccountRegisterAsGuestModel, LiveOrderModel, PaymentMethodModel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var promise_guest = null;
    function mountToApp(application) {
        var checkoutApp = application.getConfig().checkoutApp;
        // do nothing if the mode is disabled
        if (!checkoutApp.skipLogin) {
            return;
        }
        // this function is called only if skip login mode is enabled
        var registerUserAsGuest = function registerUserAsGuest() {
            var promise = jQuery.Deferred();
            var profile_model = Profile_Model_1.ProfileModel.getInstance();
            if (profile_model.get('isGuest') === 'F' && profile_model.get('isLoggedIn') === 'F') {
                var checkout_step_1 = application.getLayout().currentView.currentStep;
                if (checkout_step_1) {
                    checkout_step_1.disableNavButtons();
                }
                new AccountRegisterAsGuestModel().save().done(function (data) {
                    var skip_login_dont_update_profile = profile_model.get('skipLoginDontUpdateProfile');
                    var current_view = application.getLayout().currentView;
                    if (skip_login_dont_update_profile && data.user) {
                        _.each(skip_login_dont_update_profile, function (attr) {
                            delete data.user[attr];
                        });
                    }
                    if (data.user) {
                        profile_model.set(data.user);
                    }
                    current_view.wizard.options.profile = profile_model;
                    if (data.touchpoints) {
                        application.setConfig('siteSettings.touchpoints', data.touchpoints);
                    }
                    promise.resolve();
                    if (checkout_step_1) {
                        checkout_step_1.enableNavButtons();
                    }
                    current_view.$('[data-action="skip-login-message"]').remove();
                });
            }
            else {
                promise.resolve();
            }
            return promise;
        };
        // add 'this.application' to models that doesn't have it.
        Address_Model_1.AddressModel.prototype.application = application;
        PaymentMethodModel.prototype.application = application;
        Profile_Model_1.ProfileModel.prototype.application = application;
        // wrap save() method to LiveOrderModel, AddressModel and CreditCardModel
        var wrapperCheckoutSkipLogin = function wrapperCheckoutSkipLogin(superFn) {
            var self = this;
            var super_arguments = Array.prototype.slice.apply(arguments, [1, arguments.length]);
            var promise = jQuery.Deferred();
            if (!promise_guest) {
                promise_guest = registerUserAsGuest();
            }
            var result;
            promise_guest.done(function () {
                result = superFn.apply(self, super_arguments);
                if (result) {
                    result
                        .done(function () {
                        promise.resolve.apply(result, arguments);
                    })
                        .fail(function () {
                        promise.reject.apply(result, arguments);
                    });
                }
                else {
                    // Notify future promises that a front end validation
                    // took place and no promise is returned
                    promise.frontEndValidationError = true;
                    promise.reject.apply(result, super_arguments);
                }
            });
            _(promise).extend({
                error: function () {
                    return this;
                },
                success: function () {
                    return this;
                },
                abort: function () {
                    promise_guest.done(function () {
                        if (result) {
                            result.abort();
                        }
                    });
                }
            });
            return promise;
        };
        // Site Builder cart is in Checkout :/ don't wrap if in shopping
        if (Utils.isInCheckout()) {
            LiveOrderModel.prototype.save = _.wrap(LiveOrderModel.prototype.save, wrapperCheckoutSkipLogin);
        }
        Address_Model_1.AddressModel.prototype.save = _.wrap(Address_Model_1.AddressModel.prototype.save, wrapperCheckoutSkipLogin);
        PaymentMethodModel.prototype.save = _.wrap(PaymentMethodModel.prototype.save, wrapperCheckoutSkipLogin);
        Profile_Model_1.ProfileModel.prototype.save = _.wrap(Profile_Model_1.ProfileModel.prototype.save, wrapperCheckoutSkipLogin);
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=CheckoutSkipLogin.js.map
