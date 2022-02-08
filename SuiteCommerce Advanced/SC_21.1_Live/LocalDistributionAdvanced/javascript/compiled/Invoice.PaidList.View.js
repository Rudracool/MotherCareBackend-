/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Invoice.PaidList.View", ["require", "exports", "underscore", "invoice_paid_list.tpl", "Utils", "jQuery", "Configuration", "ListHeader.View", "RecordViews.View", "GlobalViews.Pagination.View", "AjaxRequestsKiller", "Profile.Model", "Transaction.List.View", "Invoice.Collection", "Backbone.CollectionView", "Handlebars", "Backbone", "Backbone.CompositeView"], function (require, exports, _, invoice_paid_list_tpl, Utils, jQuery, Configuration_1, ListHeader_View_1, RecordViews_View_1, GlobalViews_Pagination_View_1, AjaxRequestsKiller_1, Profile_Model_1, TransactionListView, InvoiceCollection, BackboneCollectionView, Handlebars, Backbone) {
    "use strict";
    // @class Invoice.PaidList.View @extends Backbone.View
    var InvoicePaidListView = TransactionListView.extend({
        // @property {Function} template
        template: invoice_paid_list_tpl,
        // @property {String} title
        title: Utils.translate('Invoices'),
        // @property {String} page_header
        page_header: Utils.translate('Invoices'),
        // @property {Object} attributes
        attributes: {
            id: 'PaidInvoicesHistory',
            class: 'PaidInvoices'
        },
        // @method initialize
        initialize: function (options) {
            var page = '1';
            if (options.routerArguments && options.routerArguments[0]) {
                var params = Utils.parseUrlOptions(options.routerArguments[0]);
                if (params.page) {
                    page = params.page.toString();
                }
            }
            this.options.page = page;
            this.collection = new InvoiceCollection();
            this.collection.on('sync', this.showContent, this);
            this.user = Profile_Model_1.ProfileModel.getInstance();
            var today = new Date();
            var isoDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
            this.rangeFilterOptions = {
                fromMin: '1800-01-02',
                fromMax: isoDate,
                toMin: '1800-01-02',
                toMax: isoDate
            };
            // manages sorting and filtering of the collection
            this.listHeader = new ListHeader_View_1.ListHeaderView({
                view: this,
                application: options.application,
                collection: this.collection,
                sorts: this.sortOptions,
                rangeFilter: 'date',
                rangeFilterLabel: Utils.translate('From'),
                hidePagination: true
            });
            this.collection.on('sync reset', jQuery.proxy(this, 'render'));
        },
        beforeShowContent: function beforeShowContent() {
            return this.collection.fetch({
                data: {
                    status: 'paid',
                    page: this.options.page
                },
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'invoices';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: '/paid-invoices'
            };
        },
        // @property {Array} sortOptions
        // Array of default sort options
        // sorts only apply on the current collection
        // which might be a filtered version of the original
        sortOptions: [
            {
                value: 'closedate',
                name: Utils.translate('By Close Date'),
                selected: true,
                sort: function () {
                    return this.sortBy(function (invoice) {
                        return [invoice.get('closedateInMilliseconds'), invoice.get('tranid')];
                    });
                }
            },
            {
                value: 'trandate',
                name: Utils.translate('By Invoice Date'),
                sort: function () {
                    return this.sortBy(function (invoice) {
                        return [invoice.get('tranDateInMilliseconds'), invoice.get('tranid')];
                    });
                }
            },
            {
                value: 'invoicenumber',
                name: Utils.translate('By Invoice Number'),
                sort: function () {
                    return this.sortBy(function (invoice) {
                        return parseInt(invoice
                            .get('tranid')
                            .split(/[^\(\)0-9]*/)
                            .join(''), 10);
                    });
                }
            },
            {
                value: 'amountdue',
                name: Utils.translate('By Amount'),
                sort: function () {
                    return this.sortBy(function (invoice) {
                        return invoice.get('amount');
                    });
                }
            }
        ],
        // @property {Object} childViews
        childViews: {
            ListHeader: function () {
                return this.listHeader;
            },
            'Invoice.Results': function () {
                return this._resultsView;
            },
            'GlobalViews.Pagination': function () {
                return new GlobalViews_Pagination_View_1.GlobalViewsPaginationView(_.extend({
                    totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                }, Configuration_1.Configuration.defaultPaginationSettings));
            }
        },
        _buildResultsView: function () {
            var self = this;
            var selectedColumns = [];
            if (!Configuration_1.Configuration.get().transactionListColumns.enableInvoice) {
                selectedColumns.push({ label: 'Date', type: 'date', name: 'date', id: 'trandate' });
                selectedColumns.push({
                    label: 'Close Date',
                    type: 'date',
                    name: 'close-date',
                    id: 'closedate'
                });
                selectedColumns.push({
                    label: 'Amount',
                    type: 'currency',
                    name: 'amount',
                    id: 'amount_formatted'
                });
            }
            else {
                selectedColumns = Configuration_1.Configuration.get().transactionListColumns.invoicePaid;
            }
            var records_collection = new Backbone.Collection(this.collection.map(function (invoice) {
                var model = new Backbone.Model({
                    touchpoint: 'customercenter',
                    title: new Handlebars.SafeString(Utils.translate('Invoice #<span class="tranid">$(0)</span>', invoice.get('tranid'))),
                    detailsURL: "invoices/" + invoice.get('internalid'),
                    id: invoice.get('internalid'),
                    internalid: invoice.get('internalid'),
                    columns: self._buildColumns(selectedColumns, invoice)
                });
                return model;
            }));
            return new BackboneCollectionView({
                childView: RecordViews_View_1.RecordViewsView,
                collection: records_collection,
                viewsPerRow: 1,
                childViewOptions: {
                    referrer: 'paid-invoices'
                }
            });
        },
        // @method getContext @returns Invoice.PaidList.View.Context
        getContext: function () {
            this._resultsView = this._buildResultsView();
            var columns = [];
            if (this._resultsView.collection.length > 0) {
                columns = this._resultsView.collection.at(0).get('columns');
            }
            // @class Invoice.PaidList.View.Context
            return {
                // @property {Invoice.Collection} invoices
                invoices: this.collection,
                // @property {Boolean} showInvoices
                showInvoices: !!this.collection.length,
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD',
                // @property {Array<{}>} columns
                columns: columns,
                // @property {Boolean} showPagination
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage)
            };
        }
    });
    return InvoicePaidListView;
});

//# sourceMappingURL=Invoice.PaidList.View.js.map
