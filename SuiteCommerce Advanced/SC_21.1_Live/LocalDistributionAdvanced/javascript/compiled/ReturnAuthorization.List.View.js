/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReturnAuthorization.List.View", ["require", "exports", "underscore", "return_authorization_list.tpl", "Utils", "jQuery", "Configuration", "ListHeader.View", "RecordViews.View", "GlobalViews.Pagination.View", "GlobalViews.ShowingCurrent.View", "GlobalViews.Message.View", "UrlHelper", "Transaction.List.View", "Backbone.CollectionView", "ReturnAuthorization.Collection", "Backbone"], function (require, exports, _, return_authorization_list_tpl, Utils, jQuery, Configuration_1, ListHeader_View_1, RecordViews_View_1, GlobalViews_Pagination_View_1, GlobalViews_ShowingCurrent_View_1, GlobalViews_Message_View_1, UrlHelper_1, TransactionListView, BackboneCollectionView, ReturnAuthorizationCollection, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReturnAuthorizationListView = TransactionListView.extend({
        template: return_authorization_list_tpl,
        className: 'ReturnAuthorizationList',
        title: Utils.translate('Returns'),
        page_header: Utils.translate('Returns'),
        attributes: {
            id: 'ReturnsHistory',
            class: 'ReturnAuthorizationList'
        },
        initialize: function (options) {
            var application = options.application;
            this.application = application;
            var parameters = Utils.parseUrlOptions(options.routerArguments[0]);
            this.collection = new ReturnAuthorizationCollection();
            this.page = parameters.page;
            this.listenCollection();
            var isoDate = Utils.dateToString(new Date());
            this.rangeFilterOptions = {
                fromMin: '1800-01-02',
                fromMax: isoDate,
                toMin: '1800-01-02',
                toMax: isoDate
            };
            // manages sorting and filtering of the collection
            this.list_header = new ListHeader_View_1.ListHeaderView({
                view: this,
                application: application,
                collection: this.collection,
                sorts: this.sortOptions,
                rangeFilter: 'date',
                rangeFilterLabel: Utils.translate('Requested from'),
                listHeaderId: 'returns',
                hidePagination: true,
                allowEmptyBoundaries: true
            });
            if (parameters.cancel) {
                this.message = Utils.translate('Good! Your request was successfully cancelled.');
                Backbone.history.navigate(UrlHelper_1.UrlHelper.removeUrlParameter(Backbone.history.fragment, 'cancel'), { replace: true });
            }
            this.collection.on('reset', this.showContent, this);
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'returns';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: Utils.translate('Returns'),
                href: '/returns'
            };
        },
        listenCollection: function () {
            this.setLoading(true);
            this.collection.on({
                request: jQuery.proxy(this, 'setLoading', true),
                reset: jQuery.proxy(this, 'setLoading', false)
            });
        },
        setLoading: function (value) {
            this.isLoading = value;
        },
        childViews: {
            'ListHeader.View': function () {
                return this.list_header;
            },
            'GlobalViews.Pagination': function () {
                return new GlobalViews_Pagination_View_1.GlobalViewsPaginationView(_.extend({
                    totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                }, Configuration_1.Configuration.defaultPaginationSettings));
            },
            'GlobalViews.ShowCurrentPage': function () {
                return new GlobalViews_ShowingCurrent_View_1.GlobalViewsShowingCurrentView({
                    items_per_page: this.collection.recordsPerPage,
                    total_items: this.collection.totalRecordsFound,
                    total_pages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                });
            },
            'Records.List': function () {
                return this._resultsView;
            },
            Message: function () {
                return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: this.message,
                    closable: true,
                    type: 'success'
                });
            }
        },
        _buildResultsView: function () {
            var self = this;
            var selectedColumns = [];
            if (!Configuration_1.Configuration.get().transactionListColumns.enableReturnAuthorization) {
                selectedColumns.push({
                    label: 'Date:',
                    type: 'date',
                    name: 'request-date',
                    id: 'trandate'
                });
                selectedColumns.push({ label: 'Items:', type: 'items', name: 'items', id: 'quantity' });
                selectedColumns.push({
                    label: 'Amount:',
                    type: 'currency',
                    name: 'amount',
                    id: 'amount_formatted'
                });
                selectedColumns.push({ label: 'Status', type: 'status', name: 'status', id: 'status' });
            }
            else {
                selectedColumns = Configuration_1.Configuration.get().transactionListColumns.returnAuthorization;
            }
            var records_collection = new Backbone.Collection(this.collection.map(function (return_authorization) {
                return new Backbone.Model({
                    touchpoint: 'customercenter',
                    title: return_authorization.get('tranid'),
                    detailsURL: "#returns/" + return_authorization.get('recordtype') + "/" + return_authorization.get('internalid'),
                    id: return_authorization.get('internalid'),
                    internalid: return_authorization.get('internalid'),
                    columns: self._buildColumns(selectedColumns, return_authorization)
                });
            }));
            return new BackboneCollectionView({
                collection: records_collection,
                viewsPerRow: 1,
                childView: RecordViews_View_1.RecordViewsView
            });
        },
        sortOptions: [
            {
                value: 'trandate,internalid',
                name: Utils.translate('Sort By Date'),
                selected: true
            },
            {
                value: 'tranid',
                name: Utils.translate('Sort By Number')
            }
        ],
        // @method getContext @return ReturnAuthorization.List.View.Context
        getContext: function () {
            this._resultsView = this._buildResultsView();
            var columns = [];
            if (this._resultsView.collection.length > 0) {
                columns = this._resultsView.collection.at(0).get('columns');
            }
            // @class ReturnAuthorization.List.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Boolean} showMessage
                showMessage: !!this.message,
                // @property {Boolean} isResultLengthGreaterThan0
                isResultLengthGreaterThan0: !!this.collection.length,
                // @property {Boolean} isLoading
                isLoading: this.isLoading,
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD',
                // @property {Boolean} showPagination
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                // @property {Array<{}>} columns
                columns: columns
            };
        }
    });
});

//# sourceMappingURL=ReturnAuthorization.List.View.js.map
