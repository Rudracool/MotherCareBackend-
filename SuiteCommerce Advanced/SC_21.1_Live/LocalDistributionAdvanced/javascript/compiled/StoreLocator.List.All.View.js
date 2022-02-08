/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocator.List.All.View", ["require", "exports", "underscore", "store_locator_list_all.tpl", "Utils", "Configuration", "GlobalViews.Pagination.View", "AjaxRequestsKiller", "StoreLocator.List.All.Store.View", "StoreLocator.Collection", "ReferenceMap.Configuration", "Backbone.View", "Backbone.CollectionView"], function (require, exports, _, store_locator_list_all_tpl, Utils, Configuration_1, GlobalViews_Pagination_View_1, AjaxRequestsKiller_1, StoreLocatorListAllStore, StoreLocatorCollection, ReferenceConfiguration, BackboneView, BackboneCollectionView) {
    "use strict";
    var StoreLocatorListAllView = BackboneView.extend({
        template: store_locator_list_all_tpl,
        // @property {Object} attributes
        attributes: {
            id: 'StoreLocatorListAll',
            class: 'StoreLocatorListAll'
        },
        // @method initialize
        // @param {Object} options
        initialize: function initialize(options) {
            this.configuration = ReferenceConfiguration;
            this.routerArguments = options.routerArguments[0];
            this.collection = new StoreLocatorCollection();
            // @property {String} title
            this.title = this.configuration.title();
            this.collection.on('reset', this.render, this);
        },
        beforeShowContent: function beforeShowContent() {
            var options = this.routerArguments
                ? Utils.parseUrlOptions(this.routerArguments)
                : { page: 1 };
            options.page = options.page || 1;
            return this.collection.update({
                sort: 'namenohierarchy',
                // @property {String} page
                page: options.page,
                results_per_page: ReferenceConfiguration.showAllStoresRecordsPerPage(),
                // @property {Number} killerId
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId(),
                // @property {Boolean} reset
                reset: true,
                locationtype: Configuration_1.Configuration.get('storeLocator.defaultTypeLocations')
            });
        },
        // @property {Object} childViews
        childViews: {
            StoreLocatorListAllStoreView: function () {
                return new BackboneCollectionView({
                    collection: this.collection,
                    childView: StoreLocatorListAllStore
                });
            },
            'GlobalViews.Pagination': function () {
                return new GlobalViews_Pagination_View_1.GlobalViewsPaginationView(_.extend({
                    totalPages: Math.ceil(this.collection.totalRecordsFound /
                        this.configuration.showAllStoresRecordsPerPage()) || 0
                }));
            }
        },
        // @method getContext
        // @return StoreLocator.List.All.View.Context
        getContext: function getContext() {
            return {
                showList: !!this.collection.length
            };
        }
    });
    return StoreLocatorListAllView;
});

//# sourceMappingURL=StoreLocator.List.All.View.js.map
