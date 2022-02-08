/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory.Line.Model", ["require", "exports", "Transaction.Line.Model", "Utils"], function (require, exports, TransactionLineModel) {
    "use strict";
    var OrderHistoryLineModel = TransactionLineModel.extend();
    return OrderHistoryLineModel;
});

//# sourceMappingURL=OrderHistory.Line.Model.js.map
