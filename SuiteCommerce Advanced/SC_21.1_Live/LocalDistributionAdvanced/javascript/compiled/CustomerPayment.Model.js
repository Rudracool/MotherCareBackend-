/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CustomerPayment.Model", ["require", "exports", "Transaction.Model"], function (require, exports, TransactionModel) {
    "use strict";
    var CustomerPaymentModel = TransactionModel.extend({
        // @property {String} urlRoot
        urlRoot: 'services/CustomerPayment.Service.ss',
        cacheSupport: true
    });
    return CustomerPaymentModel;
});

//# sourceMappingURL=CustomerPayment.Model.js.map
