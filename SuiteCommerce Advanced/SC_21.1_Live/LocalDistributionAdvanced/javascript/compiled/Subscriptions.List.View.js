/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.List.View", ["require", "exports", "underscore", "subscriptions_list.tpl", "Utils", "Loggers", "Subscriptions.Collection", "Configuration", "jQuery", "ListHeader.View", "Subscriptions.Status.View", "RecordViews.View", "GlobalViews.Pagination.View", "Profile.Model", "Backbone.View", "Backbone", "Backbone.CollectionView", "Handlebars"], function (require, exports, _, subscriptions_list_tpl, Utils, Loggers_1, Subscriptions_Collection_1, Configuration_1, jQuery, ListHeader_View_1, Subscriptions_Status_View_1, RecordViews_View_1, GlobalViews_Pagination_View_1, Profile_Model_1, BackboneView, Backbone, BackboneCollectionView, Handlebars) {
    "use strict";
    var SubscriptionsListView = BackboneView.extend({
        template: subscriptions_list_tpl,
        title: Utils.translate('My Subscriptions'),
        page_header: Utils.translate('My Subscriptions'),
        attributes: {
            id: 'Subscriptions',
            class: 'Subscriptions'
        },
        initialize: function (options) {
            this.application = options.application;
            this.collection = new Subscriptions_Collection_1.SubscriptionsCollection();
            this.collectionBillingAccounts = new Subscriptions_Collection_1.SubscriptionsCollection();
            this.profileModel = Profile_Model_1.ProfileModel.getInstance();
            this.isPhoneDevice = Utils.isPhoneDevice();
            this.listenCollection();
            this.collection.on('reset', this.showContent, this);
            var page = 1;
            if (options.routerArguments && options.routerArguments[0]) {
                var params = Utils.parseUrlOptions(options.routerArguments[0]);
                if (params.page) {
                    page = Number(params.page);
                }
            }
            this.options.page = page;
            this.listHeader = new ListHeader_View_1.ListHeaderView({
                view: this,
                application: this.application,
                collection: this.collection,
                hidePagination: true,
                hideFilterExpandable: this.isPhoneDevice
            });
        },
        beforeShowContent: function beforeShowContent() {
            var promise = jQuery.Deferred();
            var loggersActionId = Loggers_1.Loggers.getLogger().start('SUBSCRIPTIONS_LIST');
            this.collectionBillingAccounts
                .fetch({
                data: { billingAccounts: true },
                error: function (model, jqXhr) {
                    // this will stop the ErrorManagment module to process this error
                    // as we are taking care of it
                    jqXhr.preventDefault = true;
                }
            })
                .done(function () {
                Loggers_1.Loggers.getLogger().end(loggersActionId);
            })
                .always(function () {
                promise.resolve();
            });
            return promise;
        },
        // @method listenCollection
        listenCollection: function () {
            this.setLoading(true);
            this.collection.on({
                request: jQuery.proxy(this, 'setLoading', true),
                reset: jQuery.proxy(this, 'setLoading', false)
            });
            this.collection.on('reset', this.render, this);
        },
        // @method setLoading @param {Boolean} bool
        setLoading: function (bool) {
            this.isLoading = bool;
        },
        // @method getSelectedMenu @return {String}
        getSelectedMenu: function () {
            return 'subscriptions';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: '/Subscriptions'
            };
        },
        // @property {Array} filterOptions Array of default
        // filter options filters always apply on the original collection
        filterOptions: function () {
            var billing_accounts_filter = [
                {
                    value: 'all',
                    name: Utils.translate('Show All Billing Accounts')
                }
            ];
            (this.collectionBillingAccounts.billingAccounts || []).forEach(function (billing_account) {
                billing_accounts_filter.push({
                    value: billing_account.internalId,
                    name: billing_account.name
                });
            });
            return billing_accounts_filter;
        },
        childViews: {
            'ListHeader.View': function () {
                this.listHeader.filters = this.filterOptions();
                return this.listHeader;
            },
            'Records.Collection': function () {
                var _this = this;
                var records_collection = new Backbone.Collection(this.collection.map(function (subscription) {
                    var appendToTitle = '';
                    if (_this.isPhoneDevice) {
                        var statusInLowerCase = subscription.getStatusLabel('status').toLowerCase();
                        appendToTitle = "<span class=\"subscriptions-status status-" + statusInLowerCase + "\">" + statusInLowerCase + "</span>";
                    }
                    var model = new Backbone.Model({
                        touchpoint: 'customercenter',
                        title: new Handlebars.SafeString(Utils.translate('<span class="subscriptionid">$(0)</span>', subscription.get('name')) + appendToTitle),
                        detailsURL: subscription.getTypeUrl(),
                        columns: [
                            {
                                label: Utils.translate('Activation:'),
                                type: 'date',
                                name: 'datecreated',
                                value: subscription.get('startDate')
                            },
                            {
                                label: Utils.translate('Last Bill:'),
                                type: 'date',
                                name: 'lastbill',
                                value: !subscription.get('lastBillDate')
                                    ? '-'
                                    : subscription.get('lastBillDate')
                            },
                            {
                                label: Utils.translate('Next Bill:'),
                                type: 'date',
                                name: 'nextbill',
                                value: subscription.get('status') === 'ACTIVE' &&
                                    subscription.get('nextBillCycleDate')
                                    ? subscription.get('nextBillCycleDate')
                                    : '-'
                            },
                            {
                                label: Utils.translate('Renewal:'),
                                type: 'date',
                                name: 'renewal',
                                value: subscription.get('status') === 'ACTIVE' &&
                                    subscription.get('nextRenewalStartDate')
                                    ? subscription.get('nextRenewalStartDate')
                                    : '-'
                            }
                        ]
                    });
                    if (!_this.isPhoneDevice) {
                        var status_1 = {
                            type: 'status',
                            name: 'status',
                            compositeKey: 'SubscriptionsStatusView',
                            composite: new Subscriptions_Status_View_1.SubscriptionsStatusView({
                                status: subscription.getStatusLabel('status')
                            })
                        };
                        model.get('columns').push(status_1);
                    }
                    model.id = subscription.get('internalId');
                    return model;
                }));
                return new BackboneCollectionView({
                    childView: RecordViews_View_1.RecordViewsView,
                    collection: records_collection,
                    viewsPerRow: 1
                });
            },
            'GlobalViews.Pagination': function () {
                return new GlobalViews_Pagination_View_1.GlobalViewsPaginationView(_.extend({
                    totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                }, Configuration_1.Configuration.defaultPaginationSettings));
            }
        },
        // @method getContext @return {Subscriptions.List.View.Context}
        getContext: function () {
            // @class Subscriptions.List.View.Context
            return {
                isPhoneDevice: this.isPhoneDevice,
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Boolean} showNoTermMessage
                hasTerms: !!this.profileModel.get('paymentterms'),
                // @property {Boolean} isThereAnyResult
                isThereAnyResult: !!this.collection.length,
                // @property {Boolean} isLoading
                isLoading: this.isLoading,
                // @property {Boolean} showPagination
                showPagination: !!(this.collection.totalRecordsFound &&
                    this.collection.recordsPerPage &&
                    this.collection.length > 0),
                // @property {Boolean} showCurrentPage
                showCurrentPage: this.options.showCurrentPage,
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD'
            };
        }
    });
    return SubscriptionsListView;
});

//# sourceMappingURL=Subscriptions.List.View.js.map
