/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Cart.Component"/>

import * as _ from 'underscore';
import * as jQuery from '../../Core/JavaScript/jQuery';

import * as ICartComponent from './ICart.Component';
import * as LiveOrderModel from '../../LiveOrder/JavaScript/LiveOrder.Model';
import * as LiveOrderLineModel from '../../LiveOrder/JavaScript/LiveOrder.Line.Model';
import * as TransactionPaymentmethodModel from '../../Transaction/JavaScript/Transaction.Paymentmethod.Model';
import * as Backbone from '../../Utilities/JavaScript/backbone.custom';
import * as Utils from '../../Utilities/JavaScript/Utils';

const live_order_model = LiveOrderModel.getInstance();

export = function CartComponentGenerator(application) {
    // @class Cart.Component This is the concrete front-end Cart implementation of SuiteCommerce Advanced / SuiteCommerce Standard.
    // See @?class ICart.Component
    // @extends ICart.Component
    // @public @extlayer
    const api_methods = {
        application: application,

        // @method _isViewFromComponent Indicate if the passed-in the View is a PDP of the current component
        // @private
        // @param {Backbone.View} view Any view of the system
        // @return {Boolean} True in case the passed in View is a PDP of the current Component, false otherwise
        _isViewFromComponent: function _isViewFromComponent(view) {
            view = view || this.viewToBeRendered || this.application.getLayout().getCurrentView();

            const view_identifier = this._getViewIdentifier(view);
            const view_prototype_id = view && this._getViewIdentifier(view.prototype);

            return (
                view &&
                (view_identifier === this.CART_VIEW ||
                    view_identifier === this.CART_MINI_VIEW ||
                    view_prototype_id === this.CART_VIEW ||
                    view_prototype_id === this.CART_MINI_VIEW)
            );
        },

        _getComponentIdentifiers: function _getComponentIdentifiers(): string[] {
            return [this.CART_VIEW, this.CART_MINI_VIEW];
        },

        DEFAULT_VIEW: 'Cart.Detailed.View',

        CART_VIEW: 'Cart.Detailed.View',

        CART_MINI_VIEW: 'Header.MiniCart.View',

        estimateShipping: function estimateShipping(data) {
            try {
                if (!data || !data.address || !_.isObject(data.address)) {
                    return this._reportError(
                        'INVALID_PARAM',
                        'Invalid parameter "address". It must be a valid string'
                    );
                }

                const self = this;

                return live_order_model
                    .cancelableTrigger('before:LiveOrder.estimateShipping', data.address)
                    .then(function() {
                        const { address } = data;
                        const address_internalid = address.zip + '-' + address.country + '-null';

                        live_order_model.get('addresses').push({
                            internalid: address_internalid,
                            zip: address.zip,
                            country: address.country
                        });

                        live_order_model.set('shipaddress', address_internalid);

                        return live_order_model
                            .save()
                            .pipe(function(result) {
                                live_order_model.cancelableTrigger(
                                    'after:LiveOrder.estimateShipping',
                                    result
                                );
                                return self._normalizeEstimateAfter(result);
                            })
                            .fail(function(error) {
                                return error;
                            });
                    });
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        clearEstimateShipping: function clearEstimateShipping() {
            try {
                const self = this;

                return live_order_model
                    .cancelableTrigger('before:LiveOrder.clearEstimateShipping')
                    .then(function() {
                        return live_order_model
                            .save({
                                shipmethod: null,
                                shipaddress: null
                            })
                            .pipe(function(result) {
                                live_order_model.cancelableTrigger(
                                    'after:LiveOrder.clearEstimateShipping',
                                    result
                                );
                                return self._normalizeEstimateAfter(result);
                            })
                            .fail(function(error) {
                                return error;
                            });
                    });
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        getShipMethods: function getShipMethods() {
            try {
                const shipmethods = live_order_model.get('shipmethods').toJSON();

                return jQuery.Deferred().resolve(_.map(shipmethods, this._normalizeShipMethod));
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        setShipMethod: function setShipMethod(data) {
            const deferred = jQuery.Deferred();
            try {
                if (!Utils.isCheckoutDomain()) {
                    this._reportError(
                        'UNSECURE_SESSION',
                        'Unsecure session: Must be under a secure domain or logged in'
                    );
                }

                if (!data || !_.isObject(data.ship_method) || !data.ship_method.internalid) {
                    this._reportError(
                        'INVALID_PARAM',
                        'Invalid parameter "ship_method". It must be a valid object'
                    );
                }

                if (live_order_model.get('ismultishipto')) {
                    this._reportError(
                        'INVALID_METHOD',
                        'Method cannot be used because Multiple Ship To is enabled in the NetSuite account.'
                    );
                }

                const ship_method = this._findShipMethod(data.ship_method.internalid);
                live_order_model
                    .setShipMethod(ship_method.internalid)
                    .then(result => {
                        deferred.resolve(this._normalizeShipMethod(result));
                    })
                    .fail(deferred.reject);
            } catch (error) {
                deferred.reject(error);
            }
            return deferred;
        },

        getShipMethod: function getShipMethod() {
            try {
                const shipmethod_id = live_order_model.get('shipmethod');
                const shipmethods = live_order_model.get('shipmethods').toJSON();

                const shipmethod = _.find(shipmethods, function(shipmethod: any) {
                    return (
                        shipmethod &&
                        shipmethod.internalid &&
                        shipmethod.internalid === shipmethod_id
                    );
                });

                return jQuery.Deferred().resolve(this._normalizeShipMethod(shipmethod));
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        _setAddress: function _setAddress(data) {
            const self = this;
            const deferred = jQuery.Deferred();

            this.serialize = this.serialize || jQuery.Deferred().resolve();

            this.serialize = this.serialize.pipe(function() {
                const my_promise = jQuery.Deferred();

                try {
                    if (!Utils.isCheckoutDomain()) {
                        self._reportError(
                            'UNSECURE_SESSION',
                            'Unsecure session: Must be under a secure domain or logged in'
                        );
                    }

                    if (!_.isObject(data) || !_.isString(data.address_type)) {
                        self._reportError(
                            'INVALID_PARAM',
                            'Invalid parameter "address_type". It must be a valid string'
                        );
                    }

                    if (data.address_id && !_.isString(data.address_id)) {
                        self._reportError(
                            'INVALID_PARAM',
                            'Invalid parameter "address_id". It must be either a valid string or null'
                        );
                    }

                    live_order_model
                        .setAddress(data.address_type, data.address_id, null, true)
                        .done(deferred.resolve)
                        .fail(deferred.reject)
                        .always(my_promise.resolve);
                } catch (error) {
                    deferred.reject(error);
                    my_promise.resolve();
                }

                return my_promise;
            });

            return deferred;
        },

        setShipAddress: function setShipAddress(data) {
            data.address_type = 'shipaddress';
            return this._setAddress(data);
        },

        setBillAddress: function setBillAddress(data) {
            data.address_type = 'billaddress';
            return this._setAddress(data);
        },

        getShipAddress: function getShipAddress() {
            try {
                const shipaddress = live_order_model.get('shipaddress');
                const addresses = live_order_model.get('addresses').toJSON();

                const address = _.find(addresses, function(address: any) {
                    return address && address.internalid && address.internalid === shipaddress;
                });

                return jQuery.Deferred().resolve(this._normalizeAddress(address));
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        getBillAddress: function getBillAddress() {
            try {
                const billaddress = live_order_model.get('billaddress');
                const addresses = live_order_model.get('addresses').toJSON();

                const address = _.find(addresses, function(address: any) {
                    return address && address.internalid && address.internalid === billaddress;
                });

                return jQuery.Deferred().resolve(this._normalizeAddress(address));
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        addLine: function addLine(data) {
            try {
                this._validateLine(data);

                const self = this;
                const deferred = jQuery.Deferred();

                this.serialize = this.serialize || jQuery.Deferred().resolve();

                this.serialize = this.serialize.pipe(function() {
                    const my_promise = jQuery.Deferred();

                    try {
                        const line = self._createInnerLine(data.line);

                        live_order_model
                            .addLine(line)
                            .done(function(result) {
                                deferred.resolve(result.latest_addition);
                            })
                            .fail(function(error) {
                                deferred.reject(error);
                            })
                            .always(my_promise.resolve);
                    } catch (error) {
                        deferred.reject(error);
                        my_promise.resolve();
                    }

                    return my_promise;
                });

                return deferred;
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        addLines: function addLines(data) {
            try {
                this._validateLines(data);

                const self = this;
                const deferred = jQuery.Deferred();

                this.serialize = this.serialize || jQuery.Deferred().resolve();

                this.serialize = this.serialize.pipe(function() {
                    const my_promise = jQuery.Deferred();

                    try {
                        const lines = _.map(data.lines, self._createInnerLine);
                        const old_lines_ids = _.pluck(
                            live_order_model.get('lines').toJSON(),
                            'internalid'
                        );

                        live_order_model
                            .addLines(lines)
                            .done(function(result) {
                                const current_lines_ids = _.pluck(result.lines, 'internalid');

                                result = _.difference(current_lines_ids, old_lines_ids);
                                result = _.isEmpty(result) ? current_lines_ids : result;

                                deferred.resolve(result);
                            })
                            .fail(function(error) {
                                deferred.reject(error);
                            })
                            .always(my_promise.resolve);
                    } catch (error) {
                        deferred.reject(error);
                        my_promise.resolve();
                    }

                    return my_promise;
                });

                return deferred;
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        getLines: function getLines() {
            const deferred = jQuery.Deferred();

            try {
                const lines = this._normalizeLines(live_order_model.get('lines') || []);

                return deferred.resolve(lines);
            } catch (error) {
                return deferred.reject(error);
            }
        },

        getLatestAddition: function getLatestAddition() {
            const deferred = jQuery.Deferred();

            try {
                const latest_addition = live_order_model.getLatestAddition()
                    ? this._normalizeLine(live_order_model.getLatestAddition())
                    : null;

                return deferred.resolve(latest_addition);
            } catch (error) {
                return deferred.reject(error);
            }
        },

        removeLine: function removeLine(data) {
            try {
                this._validateLineId(data);

                const self = this;
                const deferred = jQuery.Deferred();

                this.serialize = this.serialize || jQuery.Deferred().resolve();

                this.serialize = this.serialize.pipe(function() {
                    const my_promise = jQuery.Deferred();

                    try {
                        const line = self._findLine(data.line_id);

                        live_order_model
                            .removeLine(line)
                            .done(function() {
                                deferred.resolve();
                            })
                            .fail(function(error) {
                                deferred.reject(error);
                            })
                            .always(my_promise.resolve);
                    } catch (error) {
                        deferred.reject(error);
                        my_promise.resolve();
                    }

                    return my_promise;
                });

                return deferred;
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        updateLine: function updateLine(data) {
            try {
                this._validateLine(data, true);

                const self = this;
                const deferred = jQuery.Deferred();

                this.serialize = this.serialize || jQuery.Deferred().resolve();

                this.serialize = this.serialize.pipe(function() {
                    const my_promise = jQuery.Deferred();

                    try {
                        const line = self._findLine(data.line.internalid);
                        // Merge line with data.line
                        self._mergeLine(line, data.line);

                        live_order_model
                            .updateLine(line)
                            .done(function() {
                                deferred.resolve(self._normalizeLine(line));
                            })
                            .fail(function(error) {
                                deferred.reject(error);
                            })
                            .always(my_promise.resolve);
                    } catch (error) {
                        deferred.reject(error);
                        my_promise.resolve();
                    }

                    return my_promise;
                });

                return deferred;
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        getSummary: function getSummary() {
            try {
                let summary = live_order_model.get('summary');
                summary = this._normalizeSummary(summary);

                return jQuery.Deferred().resolve(summary);
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        submit: function submit() {
            const self = this;
            const deferred = jQuery.Deferred();

            this.serialize = this.serialize || jQuery.Deferred().resolve();

            this.serialize = this.serialize.pipe(function() {
                const my_promise = jQuery.Deferred();

                try {
                    if (!Utils.isCheckoutDomain()) {
                        self._reportError(
                            'UNSECURE_SESSION',
                            'Unsecure session: Must be under a secure domain or logged in'
                        );
                    }

                    live_order_model
                        .submit()
                        .done(function(order) {
                            deferred.resolve(self._normalizeConfirmation(order.confirmation));
                        })
                        .fail(deferred.reject)
                        .always(my_promise.resolve);
                } catch (error) {
                    deferred.reject(error);
                    my_promise.resolve();
                }

                return my_promise;
            });

            return deferred;
        },

        addPayment: function addPayment(data) {
            const self = this;
            const deferred = jQuery.Deferred();

            this.serialize = this.serialize || jQuery.Deferred().resolve();

            this.serialize = this.serialize.pipe(function() {
                const my_promise = jQuery.Deferred();

                try {
                    if (!Utils.isCheckoutDomain()) {
                        self._reportError(
                            'UNSECURE_SESSION',
                            'Unsecure session: Must be under a secure domain or logged in'
                        );
                    }

                    if (!data || !_.isObject(data.payment_method)) {
                        self._reportError(
                            'INVALID_PARAM',
                            'Invalid parameter "payment_method". It must be a valid object'
                        );
                    }

                    const payment_method = self._createInnerPayment(data.payment_method);

                    live_order_model
                        .addPayment(payment_method, true)
                        .done(function(result) {
                            deferred.resolve(result);
                        })
                        .fail(deferred.reject)
                        .always(my_promise.resolve);
                } catch (error) {
                    deferred.reject(error);
                    my_promise.resolve();
                }

                return my_promise;
            });

            return deferred;
        },

        getPaymentMethods: function getPaymentMethods() {
            try {
                const self = this;
                const payment_methods = live_order_model.get('paymentmethods').toJSON();

                return jQuery.Deferred().resolve(
                    _.map(payment_methods, function(payment) {
                        return self._normalizePaymentMethod(payment).payment_method;
                    })
                );
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        addPromotion: function addPromotion(data) {
            try {
                if (!data || !_.isString(data.promocode)) {
                    this._reportError(
                        'INVALID_PARAM',
                        'Invalid parameter "promocode". It must be a valid string'
                    );
                }

                const self = this;

                return live_order_model.addPromotion(data.promocode).pipe(function(promocode) {
                    return { promotion: self._normalizePromocode(promocode) };
                });
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        removePromotion: function removePromotion(data) {
            try {
                if (!data || !_.isString(data.promocode_internalid)) {
                    this._reportError(
                        'INVALID_PARAM',
                        'Invalid parameter "promocode_internalid". It must be a valid string'
                    );
                }

                return live_order_model.removePromotion(data.promocode_internalid);
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        getPromotions: function getPromotions() {
            try {
                let promocodes = live_order_model.get('promocodes');
                promocodes = _.map(promocodes, this._normalizePromocode);

                return jQuery.Deferred().resolve(promocodes);
            } catch (error) {
                return jQuery.Deferred().reject(error);
            }
        },

        setPurchaseOrderNumber: function setPurchaseOrderNumber(purchase_number, save_order = false) {
            const deferred = jQuery.Deferred();
            try {
                if (!Utils.isCheckoutDomain()) {
                    this._reportError(
                        'UNSECURE_SESSION',
                        'Unsecure session: Must be under a secure domain or logged in'
                    );
                }

                if (!_.isString(purchase_number)) {
                    this._reportError(
                        'INVALID_PARAM',
                        'Invalid parameter "purchase number". It must be a valid string'
                    );
                }

                if (!_.isBoolean(save_order)) {
                    this._reportError(
                        'INVALID_PARAM',
                        'Invalid parameter "save order". It must be a valid boolean'
                    );
                }
                const isPurchaseNumberEnabled =
                    this.application.getConfig().siteSettings.checkout.showpofieldonpayment === 'T';
                if (!isPurchaseNumberEnabled) {
                    this._reportError(
                        'INVALID_CONFIGURATION',
                        'Method cannot be used because the purchase order number field is not displayed. Verify the website setup to show the field on the page.'
                    );
                }
                live_order_model
                    .setPurchaseOrderNumber(purchase_number)
                    .then(() => {
                        save_order === true
                            ? live_order_model.save().then(() => {
                                  deferred.resolve();
                              })
                            : deferred.resolve();
                    })
                    .fail(deferred.reject);
            } catch (error) {
                deferred.reject(error);
            }
            return deferred;
        },

        getPurchaseOrderNumber: function getPurchaseOrderNumber() {
            const deferred = jQuery.Deferred();
            try {
                if (!Utils.isCheckoutDomain()) {
                    this._reportError(
                        'UNSECURE_SESSION',
                        'Unsecure session: Must be under a secure domain or logged in'
                    );
                }
                const purchase_number = live_order_model.get('purchasenumber');
                deferred.resolve(purchase_number);
            } catch (error) {
                deferred.reject(error);
            }
            return deferred;
        },

        setTransactionBodyField: function setTransactionBodyField(data) {
            const deferred = jQuery.Deferred();
            try {
                this._validateTransactionBodyFieldParam(data);
                if (!Utils.isCheckoutDomain()) {
                    this._reportError(
                        'UNSECURE_SESSION',
                        'Unsecure session: Must be under a secure domain or logged in'
                    );
                }
                const transaction_fields_metadata = live_order_model.__customFieldsMetadata;
                const field = transaction_fields_metadata[data.fieldId];
                if (!field) {
                    this._reportError(
                        'INVALID_PARAM',
                        `Invalid parameter. ${
                            data.fieldId
                        } is not a valid custom transaction body field ID.`
                    );
                }
                return this.cancelableTrigger('beforeSetTransactionBodyField', data).then(() => {
                    const { types, value } = this._validateTransactionFieldValue(data, field);
                    this._setTransactionFieldValue(
                        { type: data.type, value: value, fieldId: data.fieldId },
                        field,
                        types
                    );
                    this.cancelableTrigger('afterSetTransactionBodyField', data);
                    return deferred.resolve();
                });
            } catch (error) {
                deferred.reject(error);
            }
            return deferred;
        },

        _validateTransactionBodyFieldParam: function _validateTransactionBodyFieldParam(data) {
            if (
                !_.isObject(data) ||
                !data.fieldId ||
                !_.isString(data.fieldId) ||
                !data.type ||
                !_.isString(data.type) ||
                (!data.value && !_.isBoolean(data.value))
            ) {
                this._reportError(
                    'INVALID_PARAM',
                    'Invalid parameter. It must be an object with these properties: fieldId, type, and value.'
                );
            }
        },

        _validateTransactionFieldValue: function _validateTransactionFieldValue(data, field) {
            const supported_fields = {
                boolean: {
                    types: ['checkbox'],
                    validate: _.isBoolean,
                    transform: value => (value ? 'T' : 'F')
                },
                string: {
                    types: [
                        'text',
                        'textarea',
                        'richtext',
                        'longtext',
                        'select',
                        'url',
                        'inlinehtml',
                        'phone',
                        'email',
                        'multiselect'
                    ],
                    validate: _.isString,
                    transform: value => (field.type === 'multiselect' ? value.split(',') : value)
                },
                number: {
                    types: ['currency', 'float', 'integer', 'percent'],
                    validate: _.isNumber,
                    transform: value => `${value}`
                },
                date: {
                    types: ['date'],
                    validate: _.isDate,
                    transform: value => {
                        const date_format = this.application.getConfig().siteSettings.dateformat;
                        return this._formatDate(value, date_format);
                    }
                }
            };
            if (!_.isObject(supported_fields[data.type])) {
                this._reportError(
                    'INVALID_FIELD_TYPE',
                    `Invalid type. It must be a valid field type: boolean, string, number, or date.`
                );
            }
            const { types, validate, transform } = supported_fields[data.type];
            if (!validate(data.value)) {
                this._reportError(
                    'INVALID_VALUE_TYPE',
                    `Invalid value for the ${data.fieldId} field. It must be a ${data.type}`
                );
            }
            return { types, value: transform(data.value) };
        },

        _setTransactionFieldValue: function _setTransactionFieldValue(
            data,
            field,
            supported_fields
        ) {
            const live_order_fields = live_order_model.get('options');
            if (!live_order_fields) {
                this._reportError(
                    'INVALID_TRANSACTIONS_FIELDS',
                    'Method cannot be used because no custom transaction body fields exist on the sales order.'
                );
            }
            if (supported_fields.indexOf(field.type) !== -1) {
                live_order_fields[data.fieldId] = data.value;
            } else {
                this._reportError(
                    'INVALID_FIELD',
                    `The type specified for ${
                        data.fieldId
                    } is not supported, or the custom transaction body field does not accept data of type ${
                        data.type
                    }.`
                );
            }
        },

        _formatDate: function _formateDate(date, date_format) {
            date_format = this._transformDateFormat(date_format);
            let month = `${date.getMonth() + 1}`;
            let day = `${date.getDate()}`;

            if (month.length === 1) {
                month = `0${month}`;
            }

            if (day.length === 1) {
                day = `0${day}`;
            }

            return date_format
                .replace('DD', day)
                .replace('YYYY', date.getFullYear())
                .replace('MMMM', date.toLocaleDateString(undefined, { month: 'long' }))
                .replace('MMM', date.toLocaleDateString(undefined, { month: 'short' }))
                .replace('MM', month);
        },

        _transformDateFormat: function _transformDateFormat(format) {
            return format
                .toUpperCase()
                .replace('FMMM', 'MM')
                .replace('MMFM', 'MM')
                .replace('FMDD', 'DD')
                .replace('DDFM', 'DD')
                .replace('MONTHFM', 'MMMM')
                .replace('FMMONTH', 'MMMM')
                .replace('MONTH', 'MMMM')
                .replace('MONFM', 'MMM')
                .replace('FMMON', 'MMM')
                .replace('MON', 'MMM');
        },

        _createInnerPayment: function _createInnerPayment(payment_method) {
            const inner_payment = new TransactionPaymentmethodModel(payment_method);

            return inner_payment;
        },

        _findLine: function _findLine(internal_id) {
            const line = live_order_model.get('lines').find(function(cart_line) {
                return cart_line.get('internalid') === internal_id;
            });

            !line && this._reportError('INVALID ID', 'Line ' + internal_id + ' not found');

            return line;
        },

        _mergeLine: function _mergeLine(inner_line, line) {
            const self = this;

            _.each(line, function(value, index: any) {
                if (index === 'extras') {
                    self._mergeLine(inner_line, value);
                } else if (_.contains(inner_line.keys(), index)) {
                    if (inner_line.get(index) instanceof Backbone.Model) {
                        self._mergeLine(inner_line.get(index), value);
                    } else if (inner_line.get(index) instanceof Backbone.Collection) {
                        inner_line.set(index, new Backbone.Collection(value));
                    } else {
                        inner_line.set(index, value);
                    }
                }
            });
        },

        _createInnerLine: function _createInnerLine(line) {
            return LiveOrderLineModel.createFromOuterLine(line);
        },

        _findShipMethod: function _findShipMethod(internal_id) {
            const ship_methods = live_order_model.get('shipmethods').toJSON();
            const ship_method_to_set = _.find(ship_methods, (ship_method: any) => {
                return ship_method.internalid && ship_method.internalid === internal_id;
            });

            if (!ship_method_to_set) {
                this._reportError('INVALID ID', `Ship Method ${internal_id} not found`);
            }
            return ship_method_to_set;
        }
    };

    // Wrap public methods to load the cart before its execution
    _.each(api_methods, function(api_method, name) {
        if (name.indexOf('_') !== 0 && _.isFunction(api_method)) {
            api_methods[name] = _.wrap(api_method, function(fn) {
                const self = this;
                const args = _.toArray(arguments).slice(1);

                return LiveOrderModel.loadCart().pipe(function() {
                    try {
                        return fn.apply(self, args);
                    } catch (error) {
                        return jQuery.Deferred().reject(error);
                    }
                });
            });
        }
    });

    // @class Cart.Component @extend ICart.Component
    const cart_component = ICartComponent.extend(api_methods);

    const innerToOuterMap = [
        // @class ICart.Component
        // @event beforeUpdateLine Cancelable event triggered before a cart's line is updated @public @extlayer
        {
            inner: 'before:LiveOrder.updateLine',
            outer: 'beforeUpdateLine',
            normalize: cart_component._normalizeUpdateLineBefore
        },
        // @event afterUpdateLine Triggered after a cart's line is updated @public @extlayer
        {
            inner: 'after:LiveOrder.updateLine',
            outer: 'afterUpdateLine',
            normalize: cart_component._normalizeUpdateLineAfter
        },
        // @event beforeRemoveLine Cancelable event triggered before a cart's line is removed @public @extlayer
        {
            inner: 'before:LiveOrder.removeLine',
            outer: 'beforeRemoveLine',
            normalize: cart_component._normalizeRemoveLineBefore
        },
        // @event afterRemoveLine Triggered after a cart's line is removed @public @extlayer
        {
            inner: 'after:LiveOrder.removeLine',
            outer: 'afterRemoveLine',
            normalize: cart_component._normalizeRemoveLineAfter
        },
        // @event beforeEstimateShipping Cancelable event triggered before doing an estimate shipping in the cart @public @extlayer
        {
            inner: 'before:LiveOrder.estimateShipping',
            outer: 'beforeEstimateShipping',
            normalize: cart_component._normalizeEstimateBefore
        },
        // @event afterEstimateShipping Triggered after an estimate shipping is done in the cart @public @extlayer
        {
            inner: 'after:LiveOrder.estimateShipping',
            outer: 'afterEstimateShipping',
            normalize: cart_component._normalizeEstimateAfter
        },
        // @event beforeClearEstimateShipping Cancelable event triggered before clearing an estimate shipping in the cart @public @extlayer
        {
            inner: 'before:LiveOrder.clearEstimateShipping',
            outer: 'beforeClearEstimateShipping',
            normalize: cart_component._normalizeClearEstimateShippingBefore
        },
        // @event afterClearEstimateShipping Triggered after an estimate shipping is cleared in the cart @public @extlayer
        {
            inner: 'after:LiveOrder.clearEstimateShipping',
            outer: 'afterClearEstimateShipping',
            normalize: cart_component._normalizeClearEstimateShippingAfter
        },
        // @event beforeAddPromotion Triggered before a promotion is added to the cart @public @extlayer
        {
            inner: 'before:LiveOrder.addPromotion',
            outer: 'beforeAddPromotion',
            normalize: cart_component._normalizePromocode
        },
        // @event afterAddPromotion Triggered after a promotion is added to the cart @public @extlayer
        {
            inner: 'after:LiveOrder.addPromotion',
            outer: 'afterAddPromotion',
            normalize: cart_component._normalizePromocode
        },
        // @event beforeRemovePromotion Triggered before a promocode is removed from the cart @public @extlayer
        {
            inner: 'before:LiveOrder.removePromotion',
            outer: 'beforeRemovePromotion',
            normalize: cart_component._normalizePromocode
        },
        // @event afterRemovePromotion Triggered after a promocode is removed from the cart @public @extlayer
        {
            inner: 'after:LiveOrder.removePromotion',
            outer: 'afterRemovePromotion',
            normalize: cart_component._normalizePromocode
        },
        // @event beforeAddPayment Triggered before a payment method is added to the order @public @extlayer
        {
            inner: 'before:LiveOrder.addPayment',
            outer: 'beforeAddPayment',
            normalize: cart_component._normalizePaymentMethod
        },
        // @event afterAddPayment Triggered after a payment method is added to the order @public @extlayer
        {
            inner: 'after:LiveOrder.addPayment',
            outer: 'afterAddPayment',
            normalize: cart_component._normalizePaymentMethod
        },
        // @event beforeSetShipMethod Triggered before a shipping method is set to the order @public @extlayer
        {
            inner: 'before:LiveOrder.setShipMethod',
            outer: 'beforeSetShipMethod',
            normalize: cart_component._normalizeShipMethodBefore
        },
        // @event afterSetShipMethod Triggered after a shipping method is set to the order @public @extlayer
        {
            inner: 'after:LiveOrder.setShipMethod',
            outer: 'afterSetShipMethod',
            normalize: cart_component._normalizeShipMethod
        },
        // @event beforeSetPurchaseOrderNumber Triggered before a purchase order number is set to the order @public @extlayer
        {
            inner: 'before:LiveOrder.setPurchaseOrderNumber',
            outer: 'beforeSetPurchaseOrderNumber',
            normalize: cart_component._normalizePurchaseOrderNumber
        },
        // @event afterSetPurchaseOrderNumber Triggered after a purchase order number is set to the order @public @extlayer
        {
            inner: 'after:LiveOrder.setPurchaseOrderNumber',
            outer: 'afterSetPurchaseOrderNumber',
            normalize: cart_component._normalizePurchaseOrderNumber
        },
        // @event beforeSubmit Triggered before the order is submited @public @extlayer
        { inner: 'before:LiveOrder.submit', outer: 'beforeSubmit', normalize: null },
        // @event afterSubmit Triggered after the order is submited @public @extlayer
        {
            inner: 'after:LiveOrder.submit',
            outer: 'afterSubmit',
            normalize: cart_component._normalizeConfirmation
        }
    ];

    cart_component._suscribeToInnerEvents(innerToOuterMap, live_order_model);

    live_order_model.cancelableOn('before:LiveOrder.setAddress', function(address) {
        const outer_events = {
            shipaddress: 'beforeSetShipAddress',
            billaddress: 'beforeSetBillAddress'
        };
        const outer_event = outer_events[address.type];

        if (!cart_component.hasListeners(outer_event)) {
            return jQuery.Deferred().resolve();
        }

        return cart_component.cancelableTrigger(outer_event, address.id);
    });

    live_order_model.cancelableOn('after:LiveOrder.setAddress', function(address) {
        const outer_events = {
            shipaddress: 'afterSetShipAddress',
            billaddress: 'afterSetBillAddress'
        };
        const outer_event = outer_events[address.type];

        if (!cart_component.hasListeners(outer_event)) {
            return jQuery.Deferred().resolve();
        }

        return cart_component.cancelableTrigger(outer_event, address.id);
    });

    live_order_model.cancelableOn('before:LiveOrder.addLines', function(lines) {
        if (!cart_component.hasListeners('beforeAddLine')) {
            return jQuery.Deferred().resolve();
        }

        const lines_deferred = _.map(lines, function(line) {
            const args = cart_component._normalizeAddLineBefore(line);
            // @event beforeAddLine Cancelable event triggered before adding a new cart's line @public @extlayer
            return cart_component.cancelableTrigger('beforeAddLine', args);
        });

        return jQuery.when.apply(jQuery, lines_deferred);
    });

    live_order_model.cancelableOn('after:LiveOrder.addLines', function(old_lines, current_lines) {
        if (!cart_component.hasListeners('afterAddLine')) {
            return jQuery.Deferred().resolve();
        }

        const old_lines_ids = cart_component._normalizeLines(old_lines);
        const current_lines_ids = cart_component._normalizeLines(current_lines);
        let new_lines = _.difference(current_lines_ids, old_lines_ids);

        new_lines = _.isEmpty(new_lines) ? current_lines_ids : new_lines;

        const lines_deferred = _.map(new_lines, function(line: any) {
            const args = cart_component._normalizeAddLineAfter(line.internalid, line);
            // @event afterAddLine Triggered after a new line is added in the cart @public @extlayer
            return cart_component.cancelableTrigger('afterAddLine', args);
        });

        return jQuery.when.apply(jQuery, lines_deferred);
    });

    // @class Cart.Component
    return cart_component;
};
