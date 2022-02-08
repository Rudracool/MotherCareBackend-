/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory.List.View", ["require", "exports", "underscore", "order_history_list.tpl", "Utils", "jQuery", "Configuration", "ListHeader.View", "GlobalViews.Pagination.View", "GlobalViews.ShowingCurrent.View", "OrderHistory.List.Tracking.Number.View", "Transaction.List.View", "OrderHistory.Collection", "RecordViews.Actionable.View", "Handlebars", "Backbone", "Backbone.CollectionView"], function (require, exports, _, order_history_list_tpl, Utils, jQuery, Configuration_1, ListHeader_View_1, GlobalViews_Pagination_View_1, GlobalViews_ShowingCurrent_View_1, OrderHistoryListTrackingNumberView, TransactionListView, OrderHistoryCollection, RecordViewsActionableView, Handlebars, Backbone, BackboneCollectionView) {
    "use strict";
    // @class OrderHistory.List.View view list of orders @extend Backbone.View
    var OrderHistoryListView = TransactionListView.extend({
        // @property {Function} template
        template: order_history_list_tpl,
        // @property {String} title
        title: Utils.translate('Purchase History'),
        // @property {String} className
        className: 'OrderListView',
        // @property {String} page_header
        page_header: Utils.translate('Purchase History'),
        // @property {Object} attributes
        attributes: {
            id: 'PurchaseHistory',
            class: 'OrderListView'
        },
        // @property {Object} events
        events: {
            'click [data-action="navigate"]': 'navigateToOrder'
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'purchases';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: '/purchases'
            };
        },
        // @method initialize
        initialize: function (options) {
            this.application = options.application;
            if (Backbone.history.fragment.indexOf('open-purchases') === 0) {
                this.collection = new OrderHistoryCollection([], {
                    filters: 'status:open'
                });
                this.activeTab = 'open';
            }
            else if (Backbone.history.fragment.indexOf('instore-purchases') === 0) {
                this.collection = new OrderHistoryCollection([], {
                    filters: 'origin:instore'
                });
                this.activeTab = 'instore';
            }
            else {
                this.collection = new OrderHistoryCollection();
                this.activeTab = 'all';
            }
            this.isSCISIntegrationEnabled = Configuration_1.Configuration.get('siteSettings.isSCISIntegrationEnabled', false);
            var isoDate = Utils.dateToString(new Date());
            this.rangeFilterOptions = {
                fromMin: '1800-01-02',
                fromMax: isoDate,
                toMin: '1800-01-02',
                toMax: isoDate
            };
            this.listenCollection();
            // Manages sorting and filtering of the collection
            this.listHeader = new ListHeader_View_1.ListHeaderView({
                view: this,
                application: this.application,
                collection: this.collection,
                sorts: this.sortOptions,
                rangeFilter: 'date',
                rangeFilterLabel: Utils.translate('From'),
                hidePagination: true,
                allowEmptyBoundaries: true
            });
            this.collection.on('reset', this.showContent, this);
        },
        // @method navigateToOrder
        navigateToOrder: function (e) {
            // ignore clicks on anchors and buttons
            if (Utils.isTargetActionable(e)) {
                return;
            }
            if (!jQuery(e.target).closest('[data-type="accordion"]').length) {
                var order_id = jQuery(e.target)
                    .closest('[data-id]')
                    .data('id');
                var recordtype = jQuery(e.target)
                    .closest('[data-record-type]')
                    .data('record-type');
                Backbone.history.navigate("#purchases/view/" + recordtype + "/" + order_id, {
                    trigger: true
                });
            }
        },
        // @method listenCollection
        listenCollection: function () {
            this.setLoading(true);
            this.collection.on({
                request: jQuery.proxy(this, 'setLoading', true),
                reset: jQuery.proxy(this, 'setLoading', false)
            });
        },
        // @method setLoading
        setLoading: function (value) {
            this.isLoading = value;
        },
        // @property {Array} sortOptions
        // Array of default sort options
        // sorts only apply on the current collection
        // which might be a filtered version of the original
        sortOptions: [
            {
                value: 'trandate,internalid',
                name: Utils.translate('Sort By Date'),
                selected: true
            },
            {
                value: 'tranid',
                name: Utils.translate('Sort By Number')
            },
            {
                value: 'amount',
                name: Utils.translate('Sort By Amount')
            }
        ],
        // @property {Object} childViews
        childViews: {
            ListHeader: function () {
                return this.listHeader;
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
            'Order.History.Results': function () {
                return this._resultsView;
            }
        },
        _buildResultsView: function () {
            var self = this;
            var selectedColumns = [];
            if (!Configuration_1.Configuration.get().transactionListColumns.enableOrderHistory) {
                selectedColumns.push({ label: 'Date', id: 'trandate', type: 'date' });
                selectedColumns.push({
                    label: 'Amount',
                    name: 'amount',
                    id: 'amount_formatted',
                    type: 'currency'
                });
                if (self.isSCISIntegrationEnabled) {
                    selectedColumns.push({ label: 'Origin', id: 'origin' });
                }
                else {
                    selectedColumns.push({ label: 'Status', id: 'status', type: 'status' });
                }
            }
            else {
                selectedColumns = Configuration_1.Configuration.get().transactionListColumns.orderHistory;
            }
            var records_collection = new Backbone.Collection(this.collection.map(function (order) {
                var model = new Backbone.Model({
                    title: new Handlebars.SafeString(Utils.translate('<span class="tranid">$(0)</span>', order.get('tranid'))),
                    touchpoint: 'customercenter',
                    detailsURL: "/purchases/view/" + order.get('recordtype') + "/" + order.get('internalid'),
                    recordType: order.get('recordtype'),
                    id: order.get('internalid'),
                    internalid: order.get('internalid'),
                    trackingNumbers: order.get('trackingnumbers'),
                    columns: self._buildColumns(selectedColumns, order)
                });
                return model;
            }));
            return new BackboneCollectionView({
                childView: RecordViewsActionableView,
                collection: records_collection,
                viewsPerRow: 1,
                childViewOptions: {
                    actionView: OrderHistoryListTrackingNumberView,
                    actionOptions: {
                        showContentOnEmpty: true,
                        contentClass: '',
                        collapseElements: true
                    }
                }
            });
        },
        // @method getContext @return OrderHistory.List.View.Context
        getContext: function () {
            this._resultsView = this._buildResultsView();
            var columns = [];
            if (this._resultsView.collection.length > 0) {
                columns = this._resultsView.collection.at(0).get('columns');
            }
            // @class OrderHistory.List.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Boolean} collectionLengthGreaterThan0
                collectionLengthGreaterThan0: this.collection.length > 0,
                // @property {Boolean} isLoading
                isLoading: this.isLoading,
                // @property {Boolean} showPagination
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD',
                // @property {Boolean} isSCISIntegrationEnabled
                isSCISIntegrationEnabled: this.isSCISIntegrationEnabled,
                // @property {Boolean} allIsActive
                allIsActive: this.activeTab === 'all',
                // @property {Boolean} openIsActive
                openIsActive: this.activeTab === 'open',
                // @property {Boolean} inStoreIsActive
                inStoreIsActive: this.activeTab === 'instore',
                // @property {Array<{}>} columns
                columns: columns
            };
        }
    });
    return OrderHistoryListView;
});

//# sourceMappingURL=OrderHistory.List.View.js.map
