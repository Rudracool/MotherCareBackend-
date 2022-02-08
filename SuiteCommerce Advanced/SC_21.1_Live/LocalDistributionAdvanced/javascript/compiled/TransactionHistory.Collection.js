/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("TransactionHistory.Collection", ["require", "exports", "TransactionHistory.Model", "Transaction.Collection", "Utils"], function (require, exports, Model, TransactionCollection, Utils) {
    "use strict";
    var TransactionHistoryCollection = TransactionCollection.extend({
        model: Model,
        // @property {Boolean} cacheSupport enable or disable the
        // support for cache (Backbone.CachedModel)
        cacheSupport: false,
        url: Utils.getAbsoluteUrl('services/TransactionHistory.ss', true)
    });
    return TransactionHistoryCollection;
});

//# sourceMappingURL=TransactionHistory.Collection.js.map
