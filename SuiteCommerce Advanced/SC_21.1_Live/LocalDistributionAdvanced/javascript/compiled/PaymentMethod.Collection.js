/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentMethod.Collection", ["require", "exports", "PaymentInstrument.CreditCard.Model", "Backbone"], function (require, exports, Model, Backbone) {
    "use strict";
    // @class PaymentMethod.Collection Credit cards collection @extends Backbone.Collection
    var PaymentMethodCollection = Backbone.Collection.extend({
        model: Model,
        url: 'services/PaymentMethod.Service.ss',
        comparator: function (model) {
            return model.get('isdefault') !== 'T'; // ? 0 : 1;
        },
        // @method getCollectionForRendering Get the payment methods collection including new payment method button for rendering
        getCollectionForRendering: function () {
            var cloned_collection;
            if (this && !!this.length) {
                cloned_collection = this.clone();
                var new_payment_method = this.first().clone();
                new_payment_method.set('internalid', '-1');
                cloned_collection.models.push(new_payment_method);
            }
            return cloned_collection;
        }
    });
    return PaymentMethodCollection;
});

//# sourceMappingURL=PaymentMethod.Collection.js.map
