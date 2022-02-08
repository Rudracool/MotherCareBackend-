/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "../../../Common/Website/Website", "../Configuration/Configuration", "../../../Common/Environment/Environment", "../../../third_parties/backbone.validation"], function (require, exports, Website_1, Configuration_1, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Address = /** @class */ (function () {
        function Address(data) {
            var _this = this;
            this.configuration = Configuration_1.Configuration.getInstance();
            this.countries = Environment_1.Environment.getInstance()
                .getCurrentWebsite()
                .getSiteSettings([Website_1.WebsiteSetting.shiptocountries]) || [];
            this.validation = {
                addressee: {
                    required: true,
                    msg: 'Full Name is required'
                },
                addr1: {
                    required: true,
                    msg: 'Address is required'
                },
                country: {
                    required: true,
                    msg: 'Country is required'
                },
                city: {
                    required: true,
                    msg: 'City is required'
                },
                zip: function (value, attr, computedState) {
                    var selected_country = computedState.country;
                    if ((!selected_country && !value) ||
                        (selected_country &&
                            _this.countries[selected_country] &&
                            _this.countries[selected_country].isziprequired === 'T' &&
                            !value)) {
                        return 'State is required';
                    }
                },
                phone: function (value) {
                    if (_this.configuration.get('addresses') &&
                        _this.configuration.get('addresses.isPhoneMandatory') &&
                        !value) {
                        return 'Phone Number is required';
                    }
                }
            };
            this.country = data.country;
            this.state = data.state;
            this.city = data.city;
            this.zip = data.zip;
            this.addr1 = data.addr1;
            this.addr2 = data.addr2;
            this.phone = data.phone;
            this.attention = data.attention;
            this.addressee = data.addressee;
            this.fullname = this.attention || this.addressee;
            this.company = this.attention && this.attention !== this.addressee ? this.addressee : null;
            this.valid = this.isValid();
            this.internalid =
                // this.country &&
                [
                    this.country,
                    this.state,
                    this.city,
                    this.zip,
                    this.addr1,
                    this.addr2,
                    this.fullname,
                    this.company
                ]
                    .join('-')
                    .replace(/\s/g, '-');
        }
        Address.prototype.getId = function () {
            return this.internalid;
        };
        Address.prototype.getAddressBook = function () {
            return {
                internalid: this.internalid,
                country: this.country,
                state: this.state,
                city: this.city,
                zip: this.zip,
                addr1: this.addr1,
                addr2: this.addr2,
                phone: this.phone,
                fullname: this.fullname,
                company: this.company,
                isvalid: this.valid ? 'T' : 'F'
            };
        };
        Address.prototype.isValid = function () {
            var validator = _.extend({
                validation: this.validation,
                attributes: {
                    internalid: this.internalid,
                    country: this.country,
                    state: this.state,
                    city: this.city,
                    zip: this.zip,
                    addr1: this.addr1,
                    addr2: this.addr2,
                    phone: this.phone,
                    attention: this.attention,
                    addressee: this.addressee
                }
            }, Backbone.Validation.mixin);
            validator.validate();
            return validator.isValid();
        };
        return Address;
    }());
    exports.Address = Address;
});
