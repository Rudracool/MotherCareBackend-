/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Paymentmethod.Model", ["require", "exports", "Backbone"], function (require, exports, Backbone) {
    "use strict";
    var TransactionPaymentmethodModel = Backbone.Model.extend({
        // @method getFormattedPaymentmethod Returns the current model's type
        // @return {String}
        getFormattedPaymentmethod: function () {
            return this.get('type');
        }
    });
    return TransactionPaymentmethodModel;
});

//# sourceMappingURL=Transaction.Paymentmethod.Model.js.map
