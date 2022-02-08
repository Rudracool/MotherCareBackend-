/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory.Line.Collection", ["require", "exports", "Transaction.Line.Collection", "OrderHistory.Line.Model"], function (require, exports, TransactionLineCollection, OrderHistoryLineModel) {
    "use strict";
    var OrderHistoryLineCollection = TransactionLineCollection.extend({
        model: OrderHistoryLineModel
    });
    return OrderHistoryLineCollection;
});

//# sourceMappingURL=OrderHistory.Line.Collection.js.map
