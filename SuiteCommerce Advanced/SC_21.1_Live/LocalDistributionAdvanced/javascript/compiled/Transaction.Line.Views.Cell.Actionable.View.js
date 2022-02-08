/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Line.Views.Cell.Actionable.View", ["require", "exports", "underscore", "transaction_line_views_cell_actionable.tpl", "Transaction.Line.Views.Price.View", "ProductLine.Stock.View", "ProductLine.Sku.View", "ProductLine.StockDescription.View", "Transaction.Line.Views.Tax", "Transaction.Line.Views.Options.Selected.View", "Backbone.View"], function (require, exports, _, transaction_line_views_cell_actionable_tpl, TransactionLineViewsPriceView, ProductLineStockView, ProductLineSkuView, ProductLineStockDescriptionView, TransactionLineViewsTax, TransactionLineViewsOptionsSelectedView, BackboneView) {
    "use strict";
    var TransactionLineViewsCellActionableView = BackboneView.extend({
        template: transaction_line_views_cell_actionable_tpl,
        // @method initialize
        // @param {Transaction.Line.Views.Cell.Actionable.Initialize.Options} options
        // @return {Void}
        initialize: function () { },
        childViews: {
            'Item.Price': function () {
                return new TransactionLineViewsPriceView({
                    model: this.model,
                    showComparePrice: this.options.showComparePrice,
                    ignorePriceVisibility: !!this.options.ignorePriceVisibility
                });
            },
            'Item.Sku': function () {
                return new ProductLineSkuView({
                    model: this.model
                });
            },
            'Item.Tax.Info': function () {
                if (this.options.showTaxDetails) {
                    return new TransactionLineViewsTax({
                        model: this.model
                    });
                }
            },
            'Item.SelectedOptions': function () {
                return new TransactionLineViewsOptionsSelectedView({
                    model: this.model
                });
            },
            'ItemViews.Stock.View': function () {
                return new ProductLineStockView({
                    model: this.model
                });
            },
            'Item.Summary.View': function () {
                return new this.options.SummaryView(_.extend({
                    model: this.model,
                    application: this.options.application
                }, this.options.summaryOptions || {}));
            },
            'Item.Actions.View': function () {
                return new this.options.ActionsView(_.extend({
                    model: this.model,
                    application: this.options.application
                }, this.options.actionsOptions || {}));
            },
            StockDescription: function () {
                return new ProductLineStockDescriptionView({
                    model: this.model
                });
            }
        },
        // @method getContext
        // @return {Transaction.Line.Views.Actionable.View.Context}
        getContext: function () {
            var item = this.model.get('item');
            var notNavigable = !this.options.navigable ||
                !item.get('_isPurchasable') ||
                item.get('_isPriceVisible') === false;
            // @class Transaction.Line.Views.Actionable.View.Context
            return {
                // @property {OrderLine.Model|Transaction.Line.Model} line
                line: this.model,
                // @property {OrderLine.Model|Transaction.Line.Model} model is an alias for line
                model: this.model,
                // @property {String} lineId
                lineId: this.model.get('internalid'),
                // @property {Item.Model} item
                item: item,
                // @property {String} itemId
                itemId: item.get('internalid'),
                // @property {String} linkAttributes
                linkAttributes: this.model.getFullLink({
                    quantity: null,
                    location: null,
                    fulfillmentChoice: null
                }),
                // @property {Boolean} isNavigable
                isNavigable: !notNavigable,
                // @property {Boolean} showCustomAlert
                showCustomAlert: !!item.get('_cartCustomAlert'),
                // @property {String} customAlertType
                customAlertType: item.get('_cartCustomAlertType') || 'info',
                // @property {Boolean} showActionsView
                showActionsView: !!this.options.ActionsView,
                // @property {Boolean} showSummaryView
                showSummaryView: !!this.options.SummaryView,
                // @property {Boolean} showAlert
                showAlert: !_.isUndefined(this.options.showAlert) ? !!this.options.showAlert : true,
                // @property {Boolean} showGeneralClass
                showGeneralClass: !!this.options.generalClass,
                // @property {String} generalClass
                generalClass: this.options.generalClass,
                // @property {ImageContainer} thumbnail
                thumbnail: this.model.getThumbnail(),
                // @property {Boolean} isFreeGift
                isFreeGift: this.model.get('free_gift') === true
            };
            // @class Transaction.Line.Views.Actionable.View
        }
    });
    return TransactionLineViewsCellActionableView;
});

//# sourceMappingURL=Transaction.Line.Views.Cell.Actionable.View.js.map
