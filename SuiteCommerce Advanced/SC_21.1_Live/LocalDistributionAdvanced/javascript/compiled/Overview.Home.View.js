/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Overview.Home.View", ["require", "exports", "underscore", "overview_home.tpl", "notifications.tpl", "Utils", "jQuery", "Configuration", "RecordViews.View", "GlobalViews.Message.View", "Profile.Model", "OrderHistory.Collection", "Overview.Banner.View", "Overview.Profile.View", "Overview.Payment.View", "Overview.Shipping.View", "Backbone.CollectionView", "OrderHistory.List.Tracking.Number.View", "Session", "Handlebars", "Backbone", "Backbone.View"], function (require, exports, _, overview_home_tpl, notifications_tpl, Utils, jQuery, Configuration_1, RecordViews_View_1, GlobalViews_Message_View_1, Profile_Model_1, OrderHistoryCollection, OverviewBannerView, OverviewProfileView, OverviewPaymentView, OverviewShippingView, BackboneCollectionView, OrderHistoryListTrackingNumberView, Session, Handlebars, Backbone, BackboneView) {
    "use strict";
    // home page view
    var OverviewHomeView = BackboneView.extend({
        template: overview_home_tpl,
        title: Utils.translate('Welcome!'),
        attributes: {
            id: 'MyAccountOverview',
            class: 'ProfileHomeView'
        },
        events: {},
        initialize: function (options) {
            this.isSCISIntegrationEnabled = Configuration_1.Configuration.get('siteSettings.isSCISIntegrationEnabled', false);
            this.model = options.model || Profile_Model_1.ProfileModel.getInstance();
            this.collection = options.collection || new OrderHistoryCollection();
            this.application = options.application;
            this.customerSupportURL = Configuration_1.Configuration.get('overview.customerSupportURL');
            this.model.on('change', this.showContent, this);
            this.addresses = this.model.get('addresses');
            this.paymentmethods = this.model.get('paymentmethods');
            this.addresses.on('reset destroy change add', this.showContent, this);
            this.paymentmethods.on('reset destroy change add', this.showContent, this);
            if (!notifications_tpl) {
                if (Session.get('email_change_verification', false)) {
                    this.email_change_verification = SC.SESSION.email_change_verification;
                    delete SC.SESSION.email_change_verification;
                }
            }
        },
        beforeShowContent: function beforeShowContent() {
            var promise = jQuery.Deferred();
            // get latest orders
            this.collection
                .fetch({
                data: {
                    page: 1,
                    order: 1,
                    sort: 'trandate,internalid',
                    results_per_page: Configuration_1.Configuration.get('overview.homeRecentOrdersQuantity', 3)
                },
                error: function (model, jqXhr) {
                    // this will stop the ErrorManagment module to process this error
                    // as we are taking care of it
                    jqXhr.preventDefault = true;
                }
            })
                .always(function () {
                promise.resolve();
            });
            return promise;
        },
        // @method getContext @return Overview.Home.View.Context
        getContext: function () {
            var isSCISIntegrationEnabled = Configuration_1.Configuration.get('siteSettings.isSCISIntegrationEnabled', false);
            // @class Overview.Home.View.Context
            return {
                // @property {Boolean} collectionLengthGreaterThan0
                collectionLengthGreaterThan0: this.collection.length > 0,
                // @property {Boolean} hasCustomerSupportURL
                hasCustomerSupportURL: !!this.customerSupportURL,
                // @property {String} customerSupportURL
                customerSupportURL: this.customerSupportURL,
                // @property {String} firstName
                firstName: this.model.get('firstname') || this.model.get('name') || '',
                // @property {Boolean} isSCISIntegrationEnabled
                isSCISIntegrationEnabled: this.isSCISIntegrationEnabled,
                // @property {Boolean} purchasesPermissions
                purchasesPermissions: isSCISIntegrationEnabled
                    ? 'transactions.tranFind.1,transactions.tranPurchases.1'
                    : 'transactions.tranFind.1,transactions.tranSalesOrd.1'
            };
        },
        childViews: {
            'Overview.Banner': function () {
                return new OverviewBannerView();
            },
            'Overview.Profile': function () {
                return new OverviewProfileView({ model: this.model });
            },
            'Overview.Payment': function () {
                return new OverviewPaymentView({ model: this.defaultPaymentMethod });
            },
            'Overview.Shipping': function () {
                return new OverviewShippingView({ model: this.defaultShippingAddress });
            },
            'Overview.Messages': function () {
                if (this.email_change_verification) {
                    return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                        message: this.email_change_verification === 'true'
                            ? Utils.translate('Your email has been changed successfully to <strong>') + this.model.get('email') + "</strong>"
                            : this.email_change_verification,
                        type: this.email_change_verification === 'true' ? 'success' : 'error',
                        closable: true
                    });
                }
            },
            'Order.History.Results': function () {
                var self = this;
                var records_collection = new Backbone.Collection(this.collection.map(function (order) {
                    var dynamic_column;
                    if (self.isSCISIntegrationEnabled) {
                        dynamic_column = {
                            label: Utils.translate('Origin:'),
                            type: 'origin',
                            name: 'origin',
                            value: _.findWhere(Configuration_1.Configuration.get('transactionRecordOriginMapping'), {
                                origin: order.get('origin')
                            }).name
                        };
                    }
                    else {
                        dynamic_column = {
                            label: Utils.translate('Status:'),
                            type: 'status',
                            name: 'status',
                            value: order.get('status').name
                        };
                    }
                    var columns = [
                        {
                            label: Utils.translate('Date:'),
                            type: 'date',
                            name: 'date',
                            value: order.get('trandate')
                        },
                        {
                            label: Utils.translate('Amount:'),
                            type: 'currency',
                            name: 'amount',
                            value: order.get('amount_formatted')
                        },
                        {
                            type: 'tracking-number',
                            name: 'trackingNumber',
                            compositeKey: 'OrderHistoryListTrackingNumberView',
                            composite: new OrderHistoryListTrackingNumberView({
                                model: new Backbone.Model({
                                    trackingNumbers: order.get('trackingnumbers')
                                }),
                                showContentOnEmpty: true,
                                contentClass: '',
                                collapseElements: true
                            })
                        }
                    ];
                    columns.splice(2, 0, dynamic_column);
                    var model = new Backbone.Model({
                        title: new Handlebars.SafeString(Utils.translate('<span class="tranid">$(0)</span>', order.get('tranid'))),
                        touchpoint: 'customercenter',
                        detailsURL: "/purchases/view/" + order.get('recordtype') + "/" + order.get('internalid'),
                        recordType: order.get('recordtype'),
                        id: order.get('internalid'),
                        internalid: order.get('internalid'),
                        trackingNumbers: order.get('trackingnumbers'),
                        columns: columns
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
        destroy: function () {
            this.addresses.off(null, null, this);
            this.paymentmethods.off(null, null, this);
            this.offEventsOfDefaults();
            this._destroy();
        },
        offEventsOfDefaults: function () {
            this.defaultPaymentMethod && this.defaultPaymentMethod.off(null, null, this);
            this.defaultShippingAddress && this.defaultShippingAddress.off(null, null, this);
        },
        getSelectedMenu: function () {
            return 'home';
        },
        getBreadcrumbPages: function () {
            return [];
        },
        showContent: function () {
            // off events of defaults
            this.offEventsOfDefaults();
            // set the defaults
            this.defaultShippingAddress = this.addresses.findWhere({ defaultshipping: 'T' });
            this.defaultPaymentMethod = this.paymentmethods.findWhere({ ccdefault: 'T' });
            // on events of defaults
            this.defaultShippingAddress &&
                this.defaultShippingAddress.on('change', this.showContent, this);
            this.defaultPaymentMethod && this.defaultPaymentMethod.on('change', this.showContent, this);
            this.title = this.model.get('firstname')
                ? Utils.translate('Welcome $(0)!', this.model.get('firstname'))
                : this.title;
            return this.application.getLayout().showContent(this);
        }
    });
    return OverviewHomeView;
});

//# sourceMappingURL=Overview.Home.View.js.map
