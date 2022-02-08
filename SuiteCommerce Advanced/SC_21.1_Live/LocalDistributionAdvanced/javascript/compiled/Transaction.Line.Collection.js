/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Line.Collection", ["require", "exports", "Transaction.Line.Model", "Backbone"], function (require, exports, TransactionLineModel, Backbone) {
    "use strict";
    var TransactionLineCollection = Backbone.Collection.extend({
        // @property {Transaction.Line.Model} model
        model: TransactionLineModel
    });
    return TransactionLineCollection;
});

//# sourceMappingURL=Transaction.Line.Collection.js.map
