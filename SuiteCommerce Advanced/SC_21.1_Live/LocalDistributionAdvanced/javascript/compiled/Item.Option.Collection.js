/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Item.Option.Collection", ["require", "exports", "Item.Option.Model", "ProductLine.Option.Collection"], function (require, exports, ItemOptionModel, ProductLineOptionCollection) {
    "use strict";
    // @class Item.Option.Collection @extend ProductLine.Option.Collection
    var ItemOptionCollection = ProductLineOptionCollection.extend({
        // @property {Item.Option.Model} model
        model: ItemOptionModel
    });
    return ItemOptionCollection;
});

//# sourceMappingURL=Item.Option.Collection.js.map
