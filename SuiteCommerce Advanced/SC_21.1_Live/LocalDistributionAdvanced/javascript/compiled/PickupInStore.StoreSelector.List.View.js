/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PickupInStore.StoreSelector.List.View", ["require", "exports", "underscore", "pickup_in_store_store_selector_list.tpl", "Utils", "GlobalViews.Message.View", "PickupInStore.StoreSelector.List.Row.View", "PickupInStore.StoreSelector.ItemDetail.View", "Backbone.View", "Backbone.CollectionView"], function (require, exports, _, pickup_in_store_store_selector_list_tpl, Utils, GlobalViews_Message_View_1, PickupInStoreStoreSelectorListRowView, PickupInStoreStoreSelectorItemDetailView, BackboneView, BackboneCollectionView) {
    "use strict";
    var PickupInStoreStoreSelectorListView = BackboneView.extend({
        // @property {Function} template
        template: pickup_in_store_store_selector_list_tpl,
        // @property {Object} events
        events: {
            'click [data-action="refine-search"]': 'refineSearch'
        },
        // @method initialize
        // @param {PickupInStore.StoreSelector.List.View.InitializeParameters} options
        initialize: function initialize(options) {
            this.store_collection = options.store_collection;
            this.model = options.model;
            this.application = options.application;
            this.source = options.source;
            this.reference_map = options.reference_map;
            this.store_collection.on('reset', this.render, this);
        },
        // @property {ChildViews} childViews
        childViews: {
            'StoresList.Rows': function () {
                return new BackboneCollectionView({
                    collection: this.stores,
                    viewsPerRow: 1,
                    childView: PickupInStoreStoreSelectorListRowView,
                    childViewOptions: {
                        product: this.model,
                        application: this.application,
                        source: this.source
                    }
                });
            },
            GlobalMessageStoresStockUnavailable: function () {
                return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: Utils.translate("We're sorry, it looks like the stores nearby that offer pickup are out of stock today."),
                    type: 'warning',
                    closable: false
                });
            },
            GlobalMessageStoresUnavailable: function () {
                return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: Utils.translate("We're sorry, it looks like there are no stores nearby that offer pickup."),
                    type: 'warning',
                    closable: false
                });
            },
            'Line.Item.Information': function () {
                if (this.source && this.source === 'cart') {
                    return new PickupInStoreStoreSelectorItemDetailView({
                        model: this.model,
                        application: this.application
                    });
                }
            }
        },
        // @method refineSearch
        refineSearch: function refineSearch(e) {
            e.preventDefault();
            this.reference_map.myposition = null;
            this.store_collection.reset();
        },
        // @method render
        render: function render() {
            var self = this;
            this.item = this.model.getItem();
            this.stock_information_per_location = this.item.get('_quantityavailableforstorepickup_detail');
            this.stores = _.compact(_.map(this.stock_information_per_location, function (location) {
                var store_information = self.store_collection.get(location.internalid);
                return store_information && store_information.set(location);
            }));
            // sort stores by stock and distance
            this.stores.sort(function (store, other_store) {
                if (store.get('qtyavailableforstorepickup') === 0 &&
                    other_store.get('qtyavailableforstorepickup') > 0) {
                    return 1;
                }
                if (store.get('qtyavailableforstorepickup') > 0 &&
                    other_store.get('qtyavailableforstorepickup') === 0) {
                    return -1;
                }
                return store.get('distance') - other_store.get('distance');
            });
            this.stock_pickup = false;
            _.each(this.stores, function (stores) {
                if (stores.get('qtyavailableforstorepickup') > 0) {
                    self.stock_pickup = true;
                }
            });
            if (this.stores.length || this.store_collection.length) {
                this._render();
            }
            else {
                this.$el.empty();
            }
        },
        // @method getContext @return {PickupInStore.StoreSelector.List.View.Context}
        getContext: function getContext() {
            return {
                // @property {Object} stores
                stores: this.stores,
                // @property {Object} storesLenth
                storesLength: this.stores.length,
                // @property {Boolean} isOneStore
                isOneStore: this.stores.length === 1,
                // @property {Boolean} isEmptyStores
                isEmptyStores: this.stores.length === 0,
                // @property {Object} stockPickup
                stockPickup: this.stock_pickup,
                // @property {Object} model
                model: this.model,
                // @property {Number} maxHeight
                maxHeight: window.innerHeight / 2 - 60,
                // @property {Object} myPosition
                myPosition: this.reference_map.myposition && this.reference_map.myposition.address
                    ? this.reference_map.myposition.address
                    : ''
            };
        }
    });
    return PickupInStoreStoreSelectorListView;
});

//# sourceMappingURL=PickupInStore.StoreSelector.List.View.js.map
