/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RecentlyViewedItems.Collection", ["require", "exports", "underscore", "jQuery", "Configuration", "Item.Collection", "Tracker", "js.cookie", "Utils"], function (require, exports, _, jQuery, Configuration_1, ItemCollection, Tracker, Cookies) {
    "use strict";
    // @class RecentlyViewedItems.Collection @extends Item.Collection
    var RecentlyViewedItemsModel = ItemCollection.extend({
        // @method initialize
        initialize: function () {
            this.useCookie =
                Configuration_1.Configuration.recentlyViewedItems && Configuration_1.Configuration.recentlyViewedItems.useCookie;
            this.searchApiMasterOptions = Configuration_1.Configuration.searchApiMasterOptions.Facets;
            this.track_on = false;
            if (this.useCookie) {
                this.promise = this.loadItemsFromCookie();
            }
            else {
                this.promise = jQuery.Deferred().resolveWith(this);
            }
        },
        // @method addHistoryItem
        addHistoryItem: function (item) {
            if (this.useCookie) {
                var self_1 = this;
                this.promise.done(function () {
                    // If the item is already in the recently viewed, we remove it
                    self_1.remove(item);
                    // we add the item at the beginning of a collection
                    self_1.unshift(item);
                    if (self_1.useCookie) {
                        var current_items = Cookies.get('recentlyViewedIds');
                        var news_items = _.union(self_1.pluck('internalid'), current_items);
                        Cookies.set('recentlyViewedIds', news_items, { path: '/', expires: 365 });
                    }
                });
            }
        },
        // @method loadItemsFromCookie
        loadItemsFromCookie: function () {
            // create an array of ID items to get only the elements that are present in the cookie but are not present in memory
            var cookie_ids = Cookies.get('recentlyViewedIds') || [];
            if (typeof cookie_ids === 'string') {
                cookie_ids = [cookie_ids.replace(/[\[\]]+/g, '')];
            }
            else if (!_.isArray(cookie_ids)) {
                cookie_ids = [cookie_ids];
            }
            var items_ids = _.difference(cookie_ids, this.pluck('internalid')).join(',');
            if (items_ids) {
                return this.fetch({ data: { id: items_ids } }, { silent: true });
            }
            return jQuery.Deferred().resolveWith(this);
        },
        turnOnTracking: function () {
            this.track_on = true;
        },
        trackCollection: function () {
            var self = this;
            this.promise.done(function () {
                if (self.track_on) {
                    Tracker.getInstance().trackProductListEvent(self, 'Recently Viewed Items');
                    self.track_on = false;
                }
            });
        }
    });
    var RecentlyViewedItemsCollection = {
        getInstance: function () {
            this.instance = this.instance || new RecentlyViewedItemsModel();
            this.instance.trackCollection();
            return this.instance;
        }
    };
    return RecentlyViewedItemsCollection;
});

//# sourceMappingURL=RecentlyViewedItems.Collection.js.map
