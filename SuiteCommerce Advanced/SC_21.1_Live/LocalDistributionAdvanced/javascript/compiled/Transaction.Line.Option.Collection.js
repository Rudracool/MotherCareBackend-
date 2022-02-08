/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Line.Option.Collection", ["require", "exports", "Transaction.Line.Option.Model", "ProductLine.Option.Collection"], function (require, exports, TransactionLineOptionModel, ProductLineOptionCollection) {
    "use strict";
    var TransactionLineOptionCollection = ProductLineOptionCollection.extend({
        // @property {Transaction.Line.Model} model
        model: TransactionLineOptionModel
    });
    return TransactionLineOptionCollection;
});

//# sourceMappingURL=Transaction.Line.Option.Collection.js.map
