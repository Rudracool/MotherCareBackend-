/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Line.Views.Cell.Actionable.Expanded.View", ["require", "exports", "underscore", "transaction_line_views_cell_actionable_expanded.tpl", "Transaction.Line.Views.Price.View", "ProductLine.Stock.View", "ProductLine.Sku.View", "ProductLine.StockDescription.View", "Transaction.Line.Views.Options.Selected.View", "Backbone.View"], function (require, exports, _, transaction_line_views_cell_actionable_expanded_tpl, TransactionLineViewsPriceView, ProductLineStockView, ProductLineSkuView, ProductLineStockDescriptionView, TransactionLineViewsOptionsSelectedView, BackboneView) {
    "use strict";
    var TransactionLineViewsCellActionableExpandedView = BackboneView.extend({
        template: transaction_line_views_cell_actionable_expanded_tpl,
        initialize: function (options) {
            this.options = options;
            this.application = options.application;
            this.model = options.model;
        },
        childViews: {
            'Item.Price': function () {
                return new TransactionLineViewsPriceView({
                    model: this.model
                });
            },
            'Item.SelectedOptions': function () {
                return new TransactionLineViewsOptionsSelectedView({
                    model: this.model
                });
            },
            'Item.Summary.View': function () {
                return new this.options.SummaryView(_.extend({
                    model: this.model,
                    application: this.application
                }, this.options.summaryOptions || {}));
            },
            'Item.Actions.View': function () {
                return new this.options.ActionsView(_.extend({
                    model: this.model,
                    application: this.application
                }, this.options.actionsOptions || {}));
            },
            'ItemViews.Stock.View': function () {
                return new ProductLineStockView({
                    model: this.model.get('item')
                });
            },
            'Item.Sku': function () {
                return new ProductLineSkuView({
                    model: this.model
                });
            },
            StockDescription: function () {
                return new ProductLineStockDescriptionView({
                    model: this.model.get('item')
                });
            }
        },
        // @method getContext
        // @return {Transaction.Line.Views.Cell.Actionable.Expanded.View.Context}
        getContext: function () {
            var item = this.model.get('item');
            // @class Transaction.Line.Views.Cell.Actionable.Expanded.View.Context
            return {
                // @property {Transaction.Line.Model} model
                model: this.model,
                // @property {String} lineId
                lineId: this.model.get('internalid'),
                // @property {Item.Model} item
                item: item,
                // @property {String} itemId
                itemId: item.get('internalid'),
                // @property {String} linkAttributes
                linkAttributes: this.model.getFullLink(),
                // @property {ImageContainer} thumbnail
                thumbnail: this.model.getThumbnail(),
                // @property {Boolean} isNavigable
                isNavigable: !!this.options.navigable && !!item.get('_isPurchasable'),
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
                generalClass: this.options.generalClass
            };
        }
    });
    return TransactionLineViewsCellActionableExpandedView;
});

//# sourceMappingURL=Transaction.Line.Views.Cell.Actionable.Expanded.View.js.map
