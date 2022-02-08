/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("DepositApplication.Details.View", ["require", "exports", "deposit_application_details.tpl", "Utils", "Configuration", "RecordViews.View", "AjaxRequestsKiller", "DepositApplication.Model", "Backbone", "Backbone.CollectionView", "Backbone.View"], function (require, exports, deposit_application_details_tpl, Utils, Configuration_1, RecordViews_View_1, AjaxRequestsKiller_1, DepositApplicationModel, Backbone, BackboneCollectionView, BackboneView) {
    "use strict";
    // @class DepositApplication.Details.View @extend Backbone.View
    var DepositApplicationDetailsView = BackboneView.extend({
        template: deposit_application_details_tpl,
        title: Utils.translate('Deposit Application Details'),
        page_header: Utils.translate('Deposit Application Details'),
        attributes: {
            id: 'DepositApplicationDetail',
            class: 'DepositApplicationDetails'
        },
        initialize: function (options) {
            var internalid = options.routerArguments[0];
            this.model = new DepositApplicationModel({ internalid: internalid });
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
                    href: 'transactionhistory'
                },
                {
                    text: Utils.translate('Deposit Application #$(0)', this.model.get('tranid')),
                    path: "transactionhistory/depositapplication/" + this.model.get('internalid')
                }
            ];
        },
        childViews: {
            'Invoices.Collection': function () {
                var records_collection = new Backbone.Collection(this.model.get('invoices').map(function (invoice) {
                    var model = new Backbone.Model({
                        touchpoint: 'customercenter',
                        title: Utils.translate('Invoice #$(0)', invoice.get('refnum')),
                        detailsURL: "/invoices/" + invoice.get('internalid'),
                        id: invoice.get('internalid'),
                        internalid: invoice.get('internalid'),
                        columns: [
                            {
                                label: Utils.translate('Transaction Date:'),
                                type: 'date',
                                name: 'date',
                                value: invoice.get('applydate')
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
            }
        },
        // @method getContet @return DepositApplication.Details.View.Context
        getContext: function () {
            // @class DepositApplication.Details.View.Context
            return {
                // @property {String} tranId
                tranId: this.model.get('tranid'),
                // @property {String} totalFormatted
                totalFormatted: this.model.get('summary').total_formatted,
                // @property {String} tranDate
                tranDate: this.model.get('trandate'),
                // @property {Boolean} areElementsCollapsed
                areElementsCollapsed: Configuration_1.Configuration.get('sca.collapseElements', false),
                // @property {String} depositInternalId
                depositInternalId: this.model.get('deposit').internalid,
                // @property {String} depositName
                depositName: this.model.get('deposit').name,
                // @property {String} depositDate
                depositDate: this.model.get('depositdate'),
                // @property {Boolean} showInvoices
                showInvoices: !!(this.model.get('invoices') && this.model.get('invoices').length),
                // @property {Boolean} showMemo
                showMemo: !!this.model.get('memo'),
                // @property {String} memo
                memo: this.model.get('memo'),
                // @property {Boolean} showOpenedAccordion
                showOpenedAccordion: Utils.isTabletDevice() || Utils.isDesktopDevice()
            };
            // @class DepositApplication.Details.View
        }
    });
    return DepositApplicationDetailsView;
});

//# sourceMappingURL=DepositApplication.Details.View.js.map
