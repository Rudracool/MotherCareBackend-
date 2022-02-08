/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory.Payments.View", ["require", "exports", "Utils", "order_history_payments.tpl", "GlobalViews.FormatPaymentMethod.View", "Backbone", "Backbone.View"], function (require, exports, Utils, order_history_payments, GlobalViewsFormatPaymentMethodView, Backbone, BackboneView) {
    "use strict";
    // @class OrderHistory.Payments.View @extend Backbone.View
    var OrderHistoryPaymentsView = BackboneView.extend({
        // @property {Function} template
        template: order_history_payments,
        initialize: function (options) {
            this.application = options.application;
            this.index = options.index;
            this.is_basic = options.is_basic;
            this.recordtype = options.recordtype;
        },
        childViews: {
            FormatPaymentMethod: function () {
                if (this.model.get('paymentmethod')) {
                    return new GlobalViewsFormatPaymentMethodView({
                        model: new Backbone.Model(this.model.get('paymentmethod'))
                    });
                }
            }
        },
        // @method formatData @return TransactionModel
        formatData: function () {
            var is_invoice = this.recordtype === 'CustInvc' || this.recordtype === 'invoice';
            var hide_link = '';
            var link = '';
            var recordtype = this.model.get('recordtype');
            switch (recordtype) {
                case 'cashsale':
                    hide_link = this.is_basic && is_invoice;
                    link = is_invoice
                        ? this.is_basic
                            ? undefined
                            : 'invoices/' + this.model.get('internalid')
                        : (link = this.is_basic
                            ? undefined
                            : '/receiptshistory/view/' + this.model.get('internalid'));
                    this.model.set('dataType', is_invoice && !this.is_basic ? 'invoice' : 'receipt');
                    this.model.set('paymentLabel', is_invoice ? Utils.translate('Invoice') : Utils.translate('Receipt'));
                    break;
                case 'customerpayment':
                    hide_link = this.is_basic;
                    link = this.is_basic
                        ? undefined
                        : '/transactionhistory/' + recordtype + '/' + this.model.get('internalid');
                    this.model.set('paymentLabel', Utils.translate('Payment'));
                    break;
            }
            this.model.get('appliedtoforeignamount_formatted')
                ? false
                : this.model.set('appliedtoforeignamount_formatted', this.model.get('amount_formatted'));
            this.model.set('showLink', !hide_link);
            this.model.set('link', link);
            return this.model;
        },
        // @method getContext @return OrderHistory.Payments.View
        getContext: function () {
            // @class OrderHistory.Payments.View.Context
            return {
                model: this.formatData(),
                isPair: this.index === 0 || this.index % 2 === 0,
                firstChild: this.index === 0
            };
        }
    });
    return OrderHistoryPaymentsView;
});

//# sourceMappingURL=OrderHistory.Payments.View.js.map
