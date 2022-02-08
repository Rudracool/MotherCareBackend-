/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReturnAuthorization.Detail.View", ["require", "exports", "return_authorization_detail.tpl", "Utils", "jQuery", "Configuration", "RecordViews.View", "AjaxRequestsKiller", "ReturnAuthorization.Cancel.View", "Backbone.CollectionView", "ReturnAuthorization.Model", "Transaction.Line.Views.Cell.Navigable.View", "Backbone", "Backbone.View"], function (require, exports, return_authorization_detail_tpl, Utils, jQuery, Configuration_1, RecordViews_View_1, AjaxRequestsKiller_1, CancelView, BackboneCollectionView, ReturnAuthorizationModel, Transaction_Line_Views_Cell_Navigable_View_1, Backbone, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReturnAuthorizationDetailView = BackboneView.extend({
        template: return_authorization_detail_tpl,
        title: Utils.translate('Return Details'),
        events: {
            'click [data-action="cancel"]': 'cancel'
        },
        attributes: {
            id: 'ReturnsDetail',
            class: 'ReturnAuthorizationDetail'
        },
        initialize: function (options) {
            this.application = options.application;
            this.model = new ReturnAuthorizationModel();
            this.routerArguments = options.routerArguments;
        },
        beforeShowContent: function beforeShowContent() {
            return this.model.fetch({
                data: { internalid: this.routerArguments[1], recordtype: this.routerArguments[0] },
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'returns';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return [
                {
                    text: Utils.translate('Returns'),
                    href: '/returns'
                },
                {
                    text: Utils.translate('Return #$(0)', this.model.get('tranid')),
                    href: '/returns'
                }
            ];
        },
        getRecordProperties: function () {
            var created_from = this.model.get('createdfrom');
            var isBasic = this.application.getConfig().isBasic;
            var properties = {
                record_url: '',
                record_label: Utils.translate('Invoice')
            };
            // site builder basic does not support invoice link
            if (!created_from || (isBasic && created_from.type === 'CustInvc')) {
                return properties;
            }
            switch (created_from.type) {
                case 'SalesOrd':
                    properties.record_url = "/ordershistory/view/" + created_from.internalid;
                    properties.record_label = Utils.translate('Order');
                    break;
                case 'CashSale':
                    properties.record_url = "/receiptshistory/view/" + created_from.internalid;
                    properties.record_label = Utils.translate('Receipt');
                    break;
                default:
                    properties.record_url = "/invoices/" + created_from.internalid;
                    properties.record_label = Utils.translate('Invoice');
            }
            return properties;
        },
        cancel: function () {
            new CancelView({
                application: this.application,
                model: this.model
            }).showInModal('returns');
            this.model.once('sync', jQuery.proxy(this, 'redirect'));
        },
        redirect: function () {
            Backbone.history.navigate("returns?cancel=" + this.model.get('internalid'), {
                trigger: true
            });
        },
        // @method getItemsNumber
        getItemsNumber: function () {
            var items_quantity = 0;
            this.model.get('lines').each(function (models) {
                items_quantity += models.get('quantity');
            });
            return items_quantity;
        },
        childViews: {
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.model.get('lines'),
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: !this.application.isStandalone(),
                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',
                        detail2Title: Utils.translate('Reason:'),
                        detail2: 'reason',
                        detail3Title: Utils.translate('Amount:'),
                        detail3: 'total_formatted',
                        ignorePriceVisibility: true
                    }
                });
            },
            'Invoices.Collection': function () {
                var records_collection = this.model.get('applies').map(function (apply) {
                    var is_invoice = apply.get('recordtype') === 'invoice';
                    var title;
                    if (is_invoice) {
                        title = Utils.translate('Invoice #$(0)', apply.get('tranid'));
                    }
                    else {
                        title =
                            apply.get('recordtype') +
                                (apply.get('tranid') ? " #" + apply.get('tranid') : '');
                    }
                    return {
                        touchpoint: 'customercenter',
                        title: title,
                        detailsURL: is_invoice ? "/invoices/" + apply.get('internalid') : '',
                        tranid: apply.get('tranid'),
                        internalid: apply.get('internalid'),
                        columns: [
                            {
                                label: Utils.translate('Transaction Date'),
                                type: 'date',
                                name: 'date',
                                value: apply.get('applydate')
                            },
                            {
                                label: Utils.translate('Amount:'),
                                type: 'currency',
                                name: 'amount',
                                value: apply.get('amount_formatted')
                            }
                        ]
                    };
                });
                return new BackboneCollectionView({
                    childView: RecordViews_View_1.RecordViewsView,
                    collection: records_collection,
                    viewsPerRow: 1
                });
            }
        },
        // @method getDownloadPdfUrl @returns {String}
        getDownloadPdfUrl: function () {
            var pdfUrl = '';
            switch (this.model.get('recordtype')) {
                case 'creditmemo':
                    pdfUrl = Utils.getDownloadPdfUrl({
                        asset: 'credit-memo-details',
                        id: this.model.get('internalid')
                    });
                    break;
                case 'returnauthorization':
                    pdfUrl = Utils.getDownloadPdfUrl({
                        asset: 'return-details',
                        id: this.model.get('internalid')
                    });
                    break;
            }
            return pdfUrl;
        },
        // @method getContext @return ReturnAuthorization.Detail.View.Context
        getContext: function () {
            var lines_length = this.model.get('lines').length;
            var applies = this.model.get('applies');
            var items_quantity = this.getItemsNumber();
            // @class ReturnAuthorization.Detail.View.Context
            return {
                // @property {ReturnAuthorization.Model} model
                model: this.model,
                // @property {String} createdFromURL
                downloadPDFURL: this.getDownloadPdfUrl(),
                // @property {Boolean} isCancelable
                isCancelable: !!this.model.get('isCancelable'),
                // @property {Boolean} showCreatedFrom
                showCreatedFrom: !!(this.model.get('createdfrom') && this.model.get('createdfrom').internalid),
                // @property {Boolean} showCreatedFromLink
                showCreatedFromLink: !!this.model.get('createdfrom').tranid,
                // @property {Boolean} isElementCollapsed
                isElementCollapsed: !!Configuration_1.Configuration.get('sca.collapseElements'),
                // @property {Number} linesLength
                linesLength: lines_length,
                // @property {Boolean} showComment
                showComments: !!this.model.get('memo'),
                // @property {Boolean} showOpenedAccordion
                showOpenedAccordion: Utils.isTabletDevice() || Utils.isDesktopDevice(),
                // @property {Boolean} initiallyCollapsed
                initiallyCollapsed: Utils.isPhoneDevice() ? '' : 'in',
                // @property {Boolean} initiallyCollapsedArrow
                initiallyCollapsedArrow: Utils.isPhoneDevice() ? 'collapsed' : '',
                // @property {Boolean} linesLengthGreaterThan1
                linesLengthGreaterThan1: lines_length > 1,
                // @property {Number} itemsQuantityNumber
                itemsQuantityNumber: items_quantity,
                // @property {Boolean} linesitemsNumberGreaterThan1
                linesitemsNumberGreaterThan1: items_quantity > 1,
                // @property {Boolean} isCreditMemo
                showAppliesSection: this.model.get('recordtype') === 'creditmemo',
                // @property {Boolean} showDiscountTotal
                showDiscountTotal: !!this.model.get('summary').discounttotal,
                // @property {Boolean} showHandlingTotal
                showHandlingTotal: !!this.model.get('summary').handlingcost,
                // @property {Boolean} showShippingTotal
                showShippingTotal: !!this.model.get('summary').shippingcost,
                // @property {Boolean} showInvoicesDetails
                showInvoicesDetails: !!(applies && applies.length)
            };
        }
    });
});

//# sourceMappingURL=ReturnAuthorization.Detail.View.js.map
