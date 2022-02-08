/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.CreditTransaction.Collection", ["require", "exports", "PaymentWizard.CreditTransaction.Model", "Backbone"], function (require, exports, Model, Backbone) {
    "use strict";
    // @class PaymentWizard.CreditTransaction.Collection @extend Backbone.Collection
    var PaymentWizardCreditTransactionCollection = Backbone.Collection.extend({
        model: Model
    });
    return PaymentWizardCreditTransactionCollection;
});

//# sourceMappingURL=PaymentWizard.CreditTransaction.Collection.js.map
