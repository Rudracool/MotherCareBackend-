/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Profile.Component", ["require", "exports", "Utils", "jQuery", "Profile.Model", "SC.BaseComponent"], function (require, exports, Utils, jQuery, Profile_Model_1, SC_BaseComponent_1) {
    "use strict";
    var parseValue = function (value) {
        switch (value) {
            case 'T':
                return true;
            case 'F':
                return false;
            default:
                return value;
        }
    };
    var filter = function (original, whitelist) {
        var normalized = {};
        for (var i = 0; i < whitelist.length; i++) {
            var item = whitelist[i];
            if (original instanceof Array) {
                normalized = [];
                for (var j = 0; j < original.length; j++) {
                    var obj = original[j];
                    normalized.push(filter(obj, whitelist));
                }
            }
            else if (original[item.att]) {
                if (item.rename) {
                    normalized[item.rename] = item.inner
                        ? filter(original[item.att], whitelist[i].inner)
                        : parseValue(original[item.att]);
                }
                else {
                    normalized[item.att.replace(new RegExp('_', 'g'), '').toLowerCase()] = item.inner
                        ? filter(original[item.att], whitelist[i].inner)
                        : parseValue(original[item.att]);
                }
            }
        }
        return normalized;
    };
    var normalize = function (original) {
        var whitelist = [
            { att: 'addressbook' },
            {
                att: 'addresses',
                inner: [
                    { att: 'addr1' },
                    { att: 'addr2' },
                    { att: 'addr3' },
                    { att: 'city' },
                    { att: 'company' },
                    { att: 'country' },
                    { att: 'defaultbilling' },
                    { att: 'defaultshipping' },
                    { att: 'fullname' },
                    { att: 'internalid' },
                    { att: 'isresidential' },
                    { att: 'isvalid' },
                    { att: 'phone' },
                    { att: 'state' },
                    { att: 'zip' }
                ]
            },
            { att: 'balance' },
            {
                att: 'campaignsubscriptions',
                inner: [{ att: 'internalid' }, { att: 'name' }, { att: 'description' }]
            },
            { att: 'companyname' },
            { att: 'creditholdoverride' },
            { att: 'creditlimit' },
            { att: 'customfields', inner: [{ att: 'name', rename: 'id' }, { att: 'value' }] },
            { att: 'email' },
            { att: 'emailsubscribe' },
            { att: 'firstname' },
            { att: 'internalid' },
            { att: 'isGuest' },
            { att: 'isLoggedIn' },
            { att: 'isRecognized' },
            { att: 'language' },
            { att: 'lastname' },
            { att: 'middlename' },
            { att: 'name' },
            {
                att: 'paymentterms',
                inner: [{ att: 'internalid' }, { att: 'name' }]
            },
            {
                att: 'phoneinfo',
                inner: [{ att: 'altphone' }, { att: 'fax' }, { att: 'phone' }]
            },
            { att: 'priceLevel' },
            { att: 'subsidiary' },
            { att: 'type' }
        ];
        if (original.campaignsubscriptions) {
            var subscribedTo = [];
            for (var i = 0; i < original.campaignsubscriptions.length; i++) {
                var campaign = original.campaignsubscriptions[i];
                if (campaign.subscribed) {
                    subscribedTo.push(campaign);
                }
            }
            original.campaignsubscriptions = subscribedTo;
        }
        return filter(original, whitelist);
    };
    var normalizeCreditCard = function (card) {
        return {
            // if payment instruments is enabled ccexpiredate is not available
            expirationDate: card.get('ccexpiredate') || card.get('cardexpirationdate'),
            // if payment instruments is enabled ccnumber is not available
            number: card.get('ccnumber') || card.get('cardlastfourdigits'),
            name: card.get('ccname'),
            images: card.get('paymentmethod').imagesrc,
            paymentMethodId: card.get('paymentmethod').internalid,
            paymentMethodName: card.get('paymentmethod').name,
            paymentMethodKey: card.get('paymentmethod').key
        };
    };
    var ProfileComponent = {
        mountToApp: function (container) {
            container.registerComponent(this.componentGenerator(container));
        },
        componentGenerator: function (container) {
            return SC_BaseComponent_1.SCBaseComponent.extend({
                componentName: 'UserProfile',
                application: container,
                getUserProfile: function () {
                    var promise = jQuery.Deferred();
                    Profile_Model_1.ProfileModel.getPromise().then(function () {
                        promise.resolve(normalize(Utils.deepCopy(Profile_Model_1.ProfileModel.getInstance())));
                    });
                    return promise;
                },
                getCreditCards: function () {
                    try {
                        if (!Utils.isCheckoutDomain()) {
                            this._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under a secure domain or logged in');
                        }
                        var paymentMethods = Profile_Model_1.ProfileModel.getInstance().get('paymentmethods');
                        var creditCards = paymentMethods
                            .filter(function (paymentMethod) { return paymentMethod.get('paymentmethod').creditcard === 'T'; })
                            .map(function (card) { return normalizeCreditCard(card); });
                        return jQuery.Deferred().resolve(Utils.deepCopy(creditCards));
                    }
                    catch (error) {
                        return jQuery.Deferred().reject(error);
                    }
                }
            });
        }
    };
    return ProfileComponent;
});

//# sourceMappingURL=Profile.Component.js.map
