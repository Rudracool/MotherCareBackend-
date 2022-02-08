/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReturnAuthorization.Collection", ["require", "exports", "Utils", "ReturnAuthorization.Model", "Transaction.Collection"], function (require, exports, Utils, Model, TransactionCollection) {
    "use strict";
    // @class ReturnAuthorization.Collection @extend Transaction.Collection
    var ReturnAuthorizationCollection = TransactionCollection.extend({
        model: Model,
        // @property {Boolean} cacheSupport enable or disable the support for cache (Backbone.CachedModel)
        cacheSupport: true,
        url: Utils.getAbsoluteUrl('services/ReturnAuthorization.Service.ss')
    });
    return ReturnAuthorizationCollection;
});

//# sourceMappingURL=ReturnAuthorization.Collection.js.map
