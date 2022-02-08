/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Deposit.Model", ["require", "exports", "Transaction.Model", "Invoice.Collection"], function (require, exports, TransactionModel, InvoiceCollection) {
    "use strict";
    // @class Deposit.Model @extend Transaction.Model
    var DepositModel = TransactionModel.extend({
        urlRoot: 'services/Deposit.Service.ss',
        // @property {Boolean} cacheSupport enable or disable the support for cache (Backbone.CachedModel)
        cacheSupport: true,
        initialize: function initialize(attributes) {
            TransactionModel.prototype.initialize.apply(this, arguments);
            this.on('change:invoices', function (model, invoices) {
                model.set('invoices', new InvoiceCollection(invoices), { silent: true });
            });
            this.trigger('change:invoices', this, (attributes && attributes.invoices) || []);
        }
    });
    return DepositModel;
});

//# sourceMappingURL=Deposit.Model.js.map
