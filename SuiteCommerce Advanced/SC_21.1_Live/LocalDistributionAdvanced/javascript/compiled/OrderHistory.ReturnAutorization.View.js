/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory.ReturnAutorization.View", ["require", "exports", "Utils", "order_history_return_authorization.tpl", "Transaction.Line.Views.Cell.Navigable.View", "Backbone.CollectionView", "Backbone.View"], function (require, exports, Utils, order_history_return_authorization_tpl, Transaction_Line_Views_Cell_Navigable_View_1, BackboneCollectionView, BackboneView) {
    "use strict";
    // @class OrderHistory.ReturnAutorization.View @extend Backbone.View
    var OrderHistoryReturnAutorizationView = BackboneView.extend({
        // @property {Function} template
        template: order_history_return_authorization_tpl,
        // @property {Object} childViews
        childViews: {
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.model.get('lines'),
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: this.options.navigable,
                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',
                        detail3Title: Utils.translate('Amount:'),
                        detail3: 'amount_formatted',
                        ignorePriceVisibility: true
                    }
                });
            }
        },
        // @method getContext @return OrderHistory.ReturnAutorization.View.Context
        getContext: function () {
            // @class OrderHistory.ReturnAutorization.View.Context
            return {
                // @property {Model} model
                model: this.model,
                // @property {Boolean} showLink
                showLink: !!this.model.get('tranid')
            };
        }
    });
    return OrderHistoryReturnAutorizationView;
});

//# sourceMappingURL=OrderHistory.ReturnAutorization.View.js.map
