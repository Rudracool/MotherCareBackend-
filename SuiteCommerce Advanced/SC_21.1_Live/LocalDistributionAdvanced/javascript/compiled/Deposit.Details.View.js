/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Deposit.Details.View", ["require", "exports", "deposit_details.tpl", "Utils", "Configuration", "RecordViews.View", "AjaxRequestsKiller", "Deposit.Model", "Deposit.Details.DepositApplication.Link.View", "GlobalViews.FormatPaymentMethod.View", "Backbone", "Backbone.CollectionView", "Backbone.View"], function (require, exports, deposit_details_tpl, Utils, Configuration_1, RecordViews_View_1, AjaxRequestsKiller_1, DepositModel, DepositDetailsDepositApplicationLinkView, GlobalViewsFormatPaymentMethodView, Backbone, BackboneCollectionView, BackboneView) {
    "use strict";
    // @class Deposit.Details.View @extend Backbone.View
    var DepositDetailsView = BackboneView.extend({
        template: deposit_details_tpl,
        title: Utils.translate('Deposit Details'),
        page_header: Utils.translate('Deposit Details'),
        attributes: {
            id: 'DepositDetail',
            class: 'DepositDetails'
        },
        initialize: function (options) {
            var internalid = options.routerArguments[0];
            this.model = new DepositModel({ internalid: internalid });
            this.model.on('change', this.showContent, this);
        },
        beforeShowContent: function beforeShowContent() {
            return this.model.fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'transactionhistory';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return [
                {
                    text: Utils.translate('Transaction History'),
                    href: '/transactionhistory'
                },
                {
                    text: Utils.translate('Deposit #$(0)', this.model.get('tranid')),
                    path: "transactionhistory/customerdeposit/" + this.model.get('internalid')
                }
            ];
        },
        render: function () {
            this.payment_method =
                this.model.get('paymentmethods') &&
                    this.model.get('paymentmethods').findWhere({ primary: true });
            BackboneView.prototype.render.apply(this, arguments);
        },
        childViews: {
            'Invoices.Collection': function () {
                var records_collection = new Backbone.Collection(this.model.get('invoices').map(function (invoice) {
                    var model = new Backbone.Model({
                        touchpoint: 'customercenter',
                        title: Utils.translate('Invoice #$(0)', invoice.get('refnum')),
                        detailsURL: "/invoices/" + invoice.get('invoice_id'),
                        id: invoice.get('invoice_id') + "_" + invoice.get('line'),
                        internalid: invoice.get('invoice_id') + "_" + invoice.get('line'),
                        columns: [
                            {
                                label: Utils.translate('Invoice Date'),
                                type: 'date',
                                name: 'invoice-date',
                                value: invoice.get('invoicedate')
                            },
                            {
                                label: Utils.translate('Date Applied'),
                                type: 'date',
                                name: 'applied-date',
                                compositeKey: 'DepositDetailsDepositApplicationLinkView',
                                composite: new DepositDetailsDepositApplicationLinkView({
                                    model: new Backbone.Model({
                                        depositId: invoice.get('deposit_id'),
                                        depositDate: invoice.get('depositdate')
                                    })
                                })
                            },
                            {
                                label: Utils.translate('Amount:'),
                                type: 'currency',
                                name: 'amount',
                                value: invoice.get('amount_formatted')
                            }
                        ]
                    });
                    return model;
                }));
                return new BackboneCollectionView({
                    childView: RecordViews_View_1.RecordViewsView,
                    collection: records_collection,
                    viewsPerRow: 1
                });
            },
            PaymentMethod: function () {
                return new GlobalViewsFormatPaymentMethodView({ model: this.payment_method });
            }
        },
        // @method getContext @return Deposit.Details.View.Context
        getContext: function () {
            // @class Deposit.Details.View.Context
            return {
                // @property {String} tranId
                tranId: this.model.get('tranid'),
                // @property {String} paymentFormatted
                paymentFormatted: this.model.get('payment_formatted'),
                // @property {String} paidFormatted
                paidFormatted: this.model.get('paid_formatted'),
                // @property {String} remainingFormatted
                remainingFormatted: this.model.get('remaining_formatted'),
                // @property {String} tranDate
                tranDate: this.model.get('trandate'),
                // @property {String} status
                status: this.model.get('status').internalid,
                // @property {Boolean} areElementsCollapsed
                areElementsCollapsed: Configuration_1.Configuration.get('collapse_elements'),
                // @property {String} downloadPDFURL
                downloadPDFURL: Utils.getDownloadPdfUrl({
                    asset: 'deposit-details',
                    id: this.model.get('internalid')
                }),
                // @property {Boolean} showInvoices
                showInvoices: !!(this.model.get('invoices') && this.model.get('invoices').length),
                // @property {Boolean} showPaymentMethod
                showPaymentMethod: !!(this.payment_method && this.payment_method.get('type')),
                // @property {Boolean} showMemo
                showMemo: !!this.model.get('memo'),
                // @property {String} memo
                memo: this.model.get('memo'),
                // @property {Boolean} showOpenedAccordion
                showOpenedAccordion: Utils.isTabletDevice() || Utils.isDesktopDevice()
            };
        }
    });
    return DepositDetailsView;
});

//# sourceMappingURL=Deposit.Details.View.js.map
