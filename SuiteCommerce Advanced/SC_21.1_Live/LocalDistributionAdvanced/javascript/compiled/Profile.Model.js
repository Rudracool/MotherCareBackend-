/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Profile.Model", ["require", "exports", "underscore", "Utils", "Configuration", "Address.Collection", "PaymentMethod.Collection", "Singleton", "Backbone", "bignumber", "jQuery"], function (require, exports, _, Utils, Configuration_1, Address_Collection_1, PaymentMethodCollection, Singleton, Backbone, BigNumber, jQuery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var classProperties = _.extend({
        // @method getPromise
        // @static
        // @return {jQuery.Deferred}
        getPromise: function () {
            var self = this;
            if (!SC.PROFILE_PROMISE) {
                SC.PROFILE_PROMISE = jQuery.Deferred();
                SC.PROFILE_PROMISE.then(function (profile) {
                    delete SC.ENVIRONMENT.PROFILE;
                    self.getInstance().set(profile);
                });
            }
            // if the user.env has already loaded, resolve the profile promise if not already resolved
            if (SC.ENVIRONMENT.PROFILE && SC.PROFILE_PROMISE.state() !== 'resolved') {
                SC.PROFILE_PROMISE.resolve(SC.ENVIRONMENT.PROFILE);
            }
            return SC.PROFILE_PROMISE;
        }
    }, Singleton);
    // @class Profile.Model @extend Backbone.Model
    exports.ProfileModel = Backbone.Model.extend({
        validation: {
            firstname: {
                required: true,
                msg: Utils.translate('First Name is required')
            },
            // This code is commented temporally, because of the inconsistence between Checkout and My Account regarding the require data from profile information (Checkout can miss last name)
            lastname: {
                required: true,
                msg: Utils.translate('Last Name is required')
            },
            email: {
                required: true,
                pattern: 'email',
                msg: Utils.translate('Valid Email is required')
            },
            phone: {
                required: true,
                fn: Utils.validatePhone
            },
            companyname: {
                required: function isCompanyRequired() {
                    return (Configuration_1.Configuration.get('siteSettings.registration.companyfieldmandatory', 'F') === 'T');
                },
                msg: Utils.translate('Company Name is required')
            },
            // if the user wants to change its email we need ask for confirmation and current password.
            // We leave this validation in this model, instead of creating a new one like UpdatePassword, because
            // the email is updated in the same window than the rest of the attributes
            confirm_email: function (confirm_email, attr, form) {
                if (String(form.email).trim() !== this.attributes.email &&
                    String(confirm_email).trim() !== String(form.email).trim()) {
                    return Utils.translate('Emails do not match');
                }
            },
            current_password: function (current_password, attr, form) {
                if (String(form.email).trim() !== this.attributes.email &&
                    (_.isNull(current_password) ||
                        _.isUndefined(current_password) ||
                        (_.isString(current_password) && String(current_password).trim() === ''))) {
                    return Utils.translate('Current password is required');
                }
            }
        },
        urlRoot: 'services/Profile.Service.ss',
        initialize: function initialize(attributes) {
            this.on('change:addresses', function () {
                this.get('addresses').on('change:defaultshipping change:defaultbilling add destroy reset', this.checkDefaultsAddresses, this);
            });
            this.on('change:balance', function (model) {
                if (_.isNumber(model.get('creditlimit')) && _.isNumber(model.get('balance'))) {
                    var balance_available = void 0;
                    if (typeof BigNumber !== 'undefined') {
                        balance_available = new BigNumber(model.get('creditlimit')).minus(model.get('balance'));
                    }
                    else {
                        balance_available = model.get('creditlimit') - model.get('balance');
                    }
                    model.set('balance_available', balance_available);
                    model.set('balance_available_formatted', Utils.formatCurrency(balance_available));
                }
            });
            this.set('addresses', (attributes && attributes.addresses) || new Address_Collection_1.AddressCollection());
            this.set('paymentmethods', (attributes && attributes.paymentmethods) || new PaymentMethodCollection());
            this.on('change:paymentmethods', function (model, paymentmethods) {
                model.set('paymentmethods', new PaymentMethodCollection(paymentmethods), {
                    silent: true
                });
                this.get('paymentmethods').on('change:ccdefault add destroy reset', this.checkDefaultsCreditCard, this);
            });
        },
        // @method checkDefaultsAddresses
        // @param {Profile.Model} model
        // @return {Void}
        checkDefaultsAddresses: function checkDefaultsAddresses(model) {
            var addresses = this.get('addresses');
            var Model = addresses.model;
            if (model instanceof Model) {
                // if the created/modified address is set as default for shipping we set every other one as not default
                if (model.get('defaultshipping') === 'T') {
                    _.each(addresses.where({ defaultshipping: 'T' }), function (address) {
                        if (model !== address) {
                            address.set({ defaultshipping: 'F' }, { silent: true });
                        }
                    });
                }
                // if the created/modified address is set as default for billing we set every other one as not default
                if (model.get('defaultbilling') === 'T') {
                    _.each(addresses.where({ defaultbilling: 'T' }), function (address) {
                        if (model !== address) {
                            address.set({ defaultbilling: 'F' }, { silent: true });
                        }
                    });
                }
            }
        },
        // @method checkDefaultsCreditCard
        // @param {Profile.Model} model
        // @return {Void}
        checkDefaultsCreditCard: function (model) {
            var creditcards = this.get('paymentmethods');
            var Model = creditcards.model;
            // if the created/modified card is set as default we set every other card as not default
            if (model.get('ccdefault') === 'T') {
                _.each(creditcards.where({ ccdefault: 'T' }), function (creditCard) {
                    if (creditCard && model !== creditCard) {
                        creditCard.set({ ccdefault: 'F' }, { silent: true });
                    }
                });
            }
            var default_creditcard = creditcards.find(function (model) {
                return model.get('ccdefault') === 'T';
            });
            // set the default card in the collection as the profile's default card
            this.set('defaultCreditCard', default_creditcard || new Model({ ccdefault: 'T' }));
        },
        // @method getSearchApiUrl
        // @return {String}
        getSearchApiUrl: function () {
            // We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
            if (Configuration_1.Configuration.getRegistrationType() !== 'disabled' &&
                (Configuration_1.Configuration.get('siteSettings.requireloginforpricing', 'F') === 'T' ||
                    Configuration_1.Configuration.get('siteSettings.siteloginrequired', 'F') === 'T') &&
                this.get('isLoggedIn') === 'T') {
                return Utils.getAbsoluteUrl('searchApi.ssp');
            }
            return '/api/items';
        },
        isAnnonymous: function () {
            return this.get('isLoggedIn') === 'F' && this.get('isRecognized') === 'F';
        },
        isLoggedIn: function () {
            return this.get('isLoggedIn') === 'T';
        },
        // @method isAvoidingDoubleRedirect
        // @return {Boolean}
        isAvoidingDoubleRedirect: function (force_avoid_redirect) {
            // We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
            return force_avoid_redirect
                ? false
                : Configuration_1.Configuration.getRegistrationType() !== 'disabled' &&
                    (Configuration_1.Configuration.get('siteSettings.requireloginforpricing', 'F') === 'T' ||
                        Configuration_1.Configuration.get('siteSettings.siteloginrequired', 'F') === 'T') &&
                    this.get('isLoggedIn') === 'T';
        },
        // @method hidePrices Determines -when LoginToSeePrices feature is enabled- if the prices should be hidden.
        // @return {Boolean}
        hidePrices: function () {
            // We've got to disable loginToSeePrices feature if customer registration is disabled.
            return (Configuration_1.Configuration.getRegistrationType() !== 'disabled' &&
                Configuration_1.Configuration.get('siteSettings.requireloginforpricing', 'F') === 'T' &&
                this.get('isLoggedIn') !== 'T');
        },
        set: function (key, val, options) {
            // If the addresses attribute is not an instance of AddressCollection, will be converted into one.
            // attributes both `"key", value` and `{key: value}` -style arguments.
            var attributes = {};
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            }
            else {
                attributes[key] = val;
            }
            if (attributes.addresses && !(attributes.addresses instanceof Address_Collection_1.AddressCollection)) {
                attributes.addresses = new Address_Collection_1.AddressCollection(attributes.addresses);
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    }, classProperties);
});

//# sourceMappingURL=Profile.Model.js.map
