/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Paymentmethod.Collection", ["require", "exports", "Transaction.Paymentmethod.Model", "Backbone"], function (require, exports, TransactionPaymentmethodModel, Backbone) {
    "use strict";
    var TransactionPaymentmethodCollection = Backbone.Collection.extend({
        // @property {Transaction.Paymentmethod.Model} model
        model: TransactionPaymentmethodModel
    });
    return TransactionPaymentmethodCollection;
});

//# sourceMappingURL=Transaction.Paymentmethod.Collection.js.map
