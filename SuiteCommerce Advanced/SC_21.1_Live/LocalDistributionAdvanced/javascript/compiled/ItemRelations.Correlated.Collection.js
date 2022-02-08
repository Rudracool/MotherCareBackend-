/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ItemRelations.Correlated.Collection", ["require", "exports", "underscore", "Configuration", "Item.Collection"], function (require, exports, _, Configuration_1, ItemCollection) {
    "use strict";
    // @class ItemRelations.Correlated.Collection @extends Item.Collection
    var ItemRelationsCorrelatedCollection = ItemCollection.extend({
        initialize: function (options) {
            this.searchApiMasterOptions = Configuration_1.Configuration.searchApiMasterOptions.correlatedItems;
            this.itemsIds = _.isArray(options.itemsIds)
                ? _.sortBy(options.itemsIds, function (id) {
                    return id;
                })
                : [options.itemsIds];
        },
        // @method fetchItems @return {jQuery.Deferred}
        fetchItems: function () {
            return this.fetch({ data: { id: this.itemsIds.join(',') } });
        },
        // http://backbonejs.org/#Model-parse
        parse: function (response) {
            var original_items = _.compact(response.items) || [];
            var self = this;
            var items = {};
            _.each(_.pluck(original_items, 'correlateditems_detail'), function (correlated_items) {
                _.each(correlated_items, function (correlated_item) {
                    if (self &&
                        self.itemsIds &&
                        correlated_item &&
                        items &&
                        !_.contains(self.itemsIds, correlated_item.internalid) &&
                        !items[correlated_item.internalid]) {
                        items[correlated_item.internalid] = correlated_item;
                    }
                });
            });
            return _.toArray(items);
        }
    });
    return ItemRelationsCorrelatedCollection;
});

//# sourceMappingURL=ItemRelations.Correlated.Collection.js.map
