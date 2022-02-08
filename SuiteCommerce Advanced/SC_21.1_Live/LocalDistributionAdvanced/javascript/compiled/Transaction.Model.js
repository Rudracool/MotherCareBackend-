/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Model", ["require", "exports", "underscore", "Backbone.CachedSync", "Transaction.Line.Collection", "Transaction.Shipmethod.Collection", "Transaction.Paymentmethod.Collection", "Address.Collection", "Backbone"], function (require, exports, _, BackboneCachedSync, TransactionLineCollection, TransactionShipmethodCollection, TransactionPaymentmethodCollection, Address_Collection_1, Backbone) {
    "use strict";
    var TranactionModel = Backbone.Model.extend({
        linesCollection: TransactionLineCollection,
        defaults: {
            addresses: null,
            shipmethods: null
        },
        cacheSupport: false,
        initialize: function (attributes) {
            _.extend(this, attributes);
            if (this.cacheSupport) {
                var self_1 = this;
                _.each(BackboneCachedSync, function (fn, name) {
                    self_1[name === 'cachedSync' ? 'sync' : name] = fn;
                });
            }
            this.on('change:lines', function (model, lines) {
                if (model.previous('lines') instanceof model.linesCollection) {
                    model.set('lines', model.previous('lines'), {
                        silent: true
                    });
                    model
                        .get('lines')
                        .reset(lines instanceof model.linesCollection ? lines.models : lines);
                }
                else {
                    model.set('lines', new model.linesCollection(lines), {
                        silent: true
                    });
                }
            });
            this.trigger('change:lines', this, (attributes && attributes.lines) || []);
            this.on('change:shipmethods', function (model, shipmethods) {
                if (model.previous('shipmethods') instanceof TransactionShipmethodCollection) {
                    model.set('shipmethods', model.previous('shipmethods'), {
                        silent: true
                    });
                    model
                        .get('shipmethods')
                        .reset(shipmethods instanceof TransactionShipmethodCollection
                        ? shipmethods.models
                        : shipmethods);
                }
                else {
                    model.set('shipmethods', new TransactionShipmethodCollection(shipmethods), {
                        silent: true
                    });
                }
            });
            this.trigger('change:shipmethods', this, (attributes && attributes.shipmethods) || []);
            this.on('change:paymentmethods', function (model, paymentmethods) {
                if (model.previous('paymentmethods') instanceof TransactionPaymentmethodCollection) {
                    model.set('paymentmethods', model.previous('paymentmethods'), {
                        silent: true
                    });
                    model
                        .get('paymentmethods')
                        .reset(paymentmethods instanceof TransactionPaymentmethodCollection
                        ? paymentmethods.models
                        : paymentmethods);
                }
                else {
                    model.set('paymentmethods', new TransactionPaymentmethodCollection(paymentmethods), {
                        silent: true
                    });
                }
            });
            this.trigger('change:paymentmethods', this, (attributes && attributes.paymentmethods) || []);
            this.on('change:addresses', function (model, addresses) {
                if (model.previous('addresses') instanceof Address_Collection_1.AddressCollection) {
                    model.set('addresses', model.previous('addresses'), {
                        silent: true
                    });
                    model
                        .get('addresses')
                        .reset(addresses instanceof Address_Collection_1.AddressCollection ? addresses.models : addresses);
                }
                else {
                    model.set('addresses', new Address_Collection_1.AddressCollection(addresses), {
                        silent: true
                    });
                }
            });
            this.trigger('change:addresses', this, (attributes && attributes.addresses) || []);
        },
        // @method _submit Internal method invoked when the user place/submit a transaction
        // @return {jQuery.Deferred}
        _submit: function () {
            // Force a POST
            this.set('internalid', null);
            var creditcard = this.get('paymentmethods').findWhere({
                type: 'creditcard'
            });
            var paypal = this.get('paymentmethods').findWhere({
                type: 'paypal'
            });
            if (creditcard && !creditcard.get('creditcard')) {
                this.get('paymentmethods').remove(creditcard);
            }
            if (paypal && !paypal.get('complete')) {
                this.get('paymentmethods').remove(paypal);
            }
            if (_.isFunction(this.shippingAddressIsRequired) && !this.shippingAddressIsRequired()) {
                this.unset('shipaddress', {
                    silent: true
                });
                this.set('sameAs', false, {
                    silent: true
                });
            }
            return this.save();
        },
        addPayment: function addPayment(payment_method) {
            // Gets the payment method collection
            var payment_methods = this.get('paymentmethods');
            // Removes the primary if any
            payment_methods.remove(payment_methods.where({ primary: true }));
            // Sets it as primary
            payment_method.set('primary', true);
            // Adds it to the collection
            payment_methods.add(payment_method);
        },
        setAddress: function setAddress(address_type, address_id, options) {
            this.set(address_type, address_id, options);
        }
    });
    return TranactionModel;
});

//# sourceMappingURL=Transaction.Model.js.map
