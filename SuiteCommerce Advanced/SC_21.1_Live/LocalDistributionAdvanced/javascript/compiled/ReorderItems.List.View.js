/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReorderItems.List.View", ["require", "exports", "underscore", "reorder_items_list.tpl", "Utils", "jQuery", "ReorderItems.Actions.Quantity.View", "Configuration", "ListHeader.View", "GlobalViews.Pagination.View", "GlobalViews.ShowingCurrent.View", "ReorderItemCustom.Model", "ReorderItems.Collection", "ReorderItems.Actions.AddToCart.View", "Tracker", "LiveOrder.Model", "Backbone.CollectionView", "Transaction.Line.Views.Cell.Actionable.View", "Handlebars", "Backbone.View"], function (require, exports, _, reorder_items_list_tpl, Utils, jQuery, ReorderItems_Actions_Quantity_View_1, Configuration_1, ListHeader_View_1, GlobalViews_Pagination_View_1, GlobalViews_ShowingCurrent_View_1, ReorderItemCustomModel, ReorderItemsCollection, ReorderItemsActionsAddToCartView, Tracker, LiveOrderModel, BackboneCollectionView, TransactionLineViewsCellActionableView, Handlebars, BackboneView) {
    "use strict";
    // @class ReorderItems.List.View @extends Backbone.View
    var ReorderItemsListView = BackboneView.extend({
        // @propery {Function} template
        template: reorder_items_list_tpl,
        // @propery {String} className
        className: 'OrderItemReorderListView',
        // @propery {String} title
        title: Utils.translate('Reorder Items'),
        // @propery {String} page_header
        page_header: Utils.translate('Reorder Items'),
        // @propery {Object} attributes
        attributes: {
            id: 'ReorderHistory',
            class: 'OrderItemReorderListView'
        },
        // @propery {Object} events
        events: {
            'click [data-action="add-to-cart"]': 'addToCart',
            'change [name="item_quantity"]': 'updateQuantity',
        },
        // @method initialize
        initialize: function (options) {
            this.customModel = new ReorderItemCustomModel(); //custom model
            this.application = options.application;
            this.collection = new ReorderItemsCollection();
            var routerOptions;
            if (options.routerArguments && options.routerArguments[0]) {
                routerOptions = Utils.parseUrlOptions(options.routerArguments[0]);
            }
            else {
                routerOptions = { page: 1 };
            }
            // this will always be false to be backward compatible with templates that are
            // displaying the current page when it should not be done
            this.options.showCurrentPage = false;
            if (routerOptions.order_id) {
                this.collection.order_id = routerOptions.order_id;
                this.order_id = routerOptions.order_id;
                this.order_number = routerOptions.order_number || 0;
            }
            var isoDate = Utils.dateToString(new Date());
            this.rangeFilterOptions = {
                fromMin: '',
                fromMax: isoDate,
                toMin: '',
                toMax: isoDate
            };
            this.listenCollection();
            // manges sorting and filtering of the collection
            this.listHeader = new ListHeader_View_1.ListHeaderView({
                view: this,
                application: options.application,
                collection: this.collection,
                filters: routerOptions.order_id ? null : this.filterOptions,
                rangeFilter: 'date',
                rangeFilterLabel: Utils.translate('From'),
                sorts: routerOptions.order_id ? this.sortOptionsSingleOrder : this.sortOptions,
                hidePagination: true,
                headerMarkup: routerOptions.order_id ? this.getOrderLink() : '',
                isVisible: true
            });
            if (this.order_id) {
                this.collection.set({
                    order_id: this.order_id
                });
            }
            this.collection.on('reset', this.render, this);
        },
        // @method updateQuantity
        updateQuantity: function (e) {
            var target = jQuery(e.currentTarget);
            var line_id = target.data('line-id');
            var line = this.collection.get(line_id);
            var item = line.get('item');
            var min_quantity = item.get('_minimumQuantity', true) || 1;
            var max_quantity = item.get('_maximumQuantity', true) || null;
            var new_value = parseInt(target.val(), 10);
            if (new_value < min_quantity) {
                target.val(min_quantity);
            }
            if (max_quantity && new_value > max_quantity) {
                target.val(max_quantity);
            }
            line.set('quantity', new_value);
        },
        // @method getOrderLink
        getOrderLink: function () {
            var order_link = jQuery('<a/>')
                .attr('href', "/ordershistory/view/" + this.order_id)
                .html(Utils.translate('Order Number: $(0)', this.order_id))
                .wrap('<div></div>')
                .parent();
            return new Handlebars.SafeString(order_link.html());
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
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'reorderitems';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            var crumbtrail = [
                {
                    text: this.title,
                    href: '/reorderItems'
                }
            ];
            if (this.order_id && this.order_number) {
                this.title = Utils.translate('Reorder Items from Order #$(0)', this.order_number);
                crumbtrail.push({
                    text: Utils.translate('Order #$(0)', this.order_number),
                    href: "/reorderItems/order/" + this.order_id
                });
            }
            return crumbtrail;
        },
        // @method trackEventReorder
        trackEventReorder: function (line) {
            line &&
                Tracker.getInstance().trackEvent({
                    category: 'My Account - User Interaction',
                    action: 'Reorder',
                    label: line.generateURL()
                });
        },
        // @method addToCart add to cart an item, the quantity is written by the user on
        // the input and the options are the same that the ordered item in the previous order
        addToCart: function (e) {
            e.preventDefault();
            var self = this;
            var line_id = this.$(e.target).data('line-id');
            var $form = this.$(e.target).closest('[data-type="order-item"]');
            var $quantity = $form.find('input[name=item_quantity]');
            var selected_line = this.collection.get(line_id);
            var $alert_placeholder = $form.find('[data-type=alert-placeholder]');
            var quantity = isNaN(parseInt($quantity.val(), 10)) ? 0 : parseInt($quantity.val(), 10);
            var layout = this.application.getLayout();
            if (quantity) {
                selected_line.set('quantity', quantity);
                // The 'fulfillmentChoice' for reorders must be setted to 'ship'
                if (selected_line.get('fulfillmentChoice')) {
                    selected_line.set('fulfillmentChoice', 'ship');
                }
                LiveOrderModel.getInstance()
                    .addLine(selected_line)
                    .done(function () {
                    self.trackEventReorder(selected_line);
                    $alert_placeholder.show().empty();
                    var message;
                    if (quantity > 1) {
                        message = Utils.translate('$(0) Items successfully added to <a href="#" data-touchpoint="viewcart">your cart</a><br/>', quantity);
                    }
                    else {
                        message = Utils.translate('Item successfully added to <a href="#" data-touchpoint="viewcart">your cart</a><br/>');
                    }
                    layout.showMessage($alert_placeholder, message, 'success', true);
                    setTimeout(function () {
                        $alert_placeholder.fadeOut(function () {
                            $alert_placeholder.empty();
                        });
                    }, 6000);
                })
                    .fail(function (jqXhr) {
                    jqXhr.preventDefault = true;
                    $alert_placeholder.show().empty();
                    layout.showXHRErrorMessage($alert_placeholder, jqXhr, true);
                });
            }
            else {
                var message = Utils.translate('The number of items must be positive.');
                $alert_placeholder.show().empty();
                layout.showMessage($alert_placeholder, message, 'error', true);
            }
        },
        // @method getStringDateFromDaysCount Returns a date
        // substracting the amound of days specified from now
        getStringDateFromDaysCount: function (days_back) {
            var now = new Date();
            return new Date(now.setDate(now.getDate() - days_back));
        },
        // @method {Array} sortOptionsSingleOrder
        sortOptionsSingleOrder: [
            {
                value: 'price',
                name: Utils.translate('By Price'),
                selected: true
            },
            {
                value: 'name',
                name: Utils.translate('By Name')
            }
        ],
        // @method {Array} sortOptions
        sortOptions: [
            {
                value: 'quantity',
                name: Utils.translate('By Frequently Purchased'),
                selected: true
            },
            {
                value: 'date',
                name: Utils.translate('By Most Recently Purchased')
            },
            {
                value: 'price',
                name: Utils.translate('By Price')
            },
            {
                value: 'name',
                name: Utils.translate('By Name')
            }
        ],
        // @method {Array} filterOptions
        filterOptions: [
            {
                value: function () {
                    return Utils.dateToString(this.getStringDateFromDaysCount(15)) + "T" + Utils.dateToString(new Date());
                },
                name: Utils.translate('Show last 15 days'),
                className: 'reorder-items-filter-last-15-days',
                selected: !SC.ENVIRONMENT.standalone
            },
            {
                value: function () {
                    return Utils.dateToString(this.getStringDateFromDaysCount(30)) + "T" + Utils.dateToString(new Date());
                },
                name: Utils.translate('Show last 30 days'),
                className: 'reorder-items-filter-last-30-days'
            },
            {
                value: function () {
                    return Utils.dateToString(this.getStringDateFromDaysCount(60)) + "T" + Utils.dateToString(new Date());
                },
                name: Utils.translate('Show last 60 days'),
                className: 'reorder-items-filter-last-60-days',
                selected: SC.ENVIRONMENT.standalone
            },
            {
                value: function () {
                    return Utils.dateToString(this.getStringDateFromDaysCount(90)) + "T" + Utils.dateToString(new Date());
                },
                name: Utils.translate('Show last 90 days'),
                className: 'reorder-items-filter-last-90-days'
            },
            {
                value: function () {
                    return Utils.dateToString(this.getStringDateFromDaysCount(180)) + "T" + Utils.dateToString(new Date());
                },
                name: Utils.translate('Show last 180 days'),
                className: 'reorder-items-filter-last-180-days'
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
            'Reorder.Items': function () {
                var view = new BackboneCollectionView({
                    collection: this.collection.filter(function (line) {
                        return (line.get('item') &&
                            line.get('item').get('_id') &&
                            line.get('item').get('ispricevisible') !== false);
                    }),
                    viewsPerRow: 1,
                    childView: TransactionLineViewsCellActionableView,
                    childViewOptions: {
                        application: this.application,
                        navigable: !SC.ENVIRONMENT.standalone,
                        SummaryView: ReorderItems_Actions_Quantity_View_1.ReorderItemsActionsQuantityView,
                        ActionsView: ReorderItemsActionsAddToCartView,
                        showComparePrice: true
                    }
                });
                this.collection.on('reset', function () {
                    view.render();
                });
                return view;
            }
        },
        // @method getContext: function()
        getContext: function () {
            // @class ReorderItems.List.View.Context
            return {
                // @propery {Boolean} isLoading
                isLoading: this.isLoading,
                // @propery {Boolean} showItems
                showItems: !!this.collection.totalRecordsFound,
                // @propery {Boolean} itemsNotFound
                itemsNotFound: !this.collection.totalRecordsFound && !this.isLoading,
                // @propery {String} pageHeader
                pageHeader: this.page_header,
                // @property {Boolean} showPagination
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                // @property {Boolean} showCurrentPage
                showCurrentPage: this.options.showCurrentPage,
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD'
            };
        }
    });
    return ReorderItemsListView;
});

//# sourceMappingURL=ReorderItems.List.View.js.map
