/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Cart.Lines.View", ["require", "exports", "underscore", "cart_lines.tpl", "Configuration", "Transaction.Line.Views.Price.View", "Transaction.Line.Views.Options.Selected.View", "ProductLine.Stock.View", "ProductLine.Sku.View", "ProductLine.StockDescription.View", "Transaction.Line.Views.Tax", "Backbone.View"], function (require, exports, _, cart_lines_tpl, Configuration_1, TransactionLineViewsPriceView, TransactionLineViewsOptionsSelectedView, ProductLineStockView, ProductLineSkuView, ProductLineStockDescriptionView, TransactionLineViewsTax, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: cart_lines_tpl,
        childViews: {
            'Item.Price': function () {
                return new TransactionLineViewsPriceView({
                    model: this.model,
                    showComparePrice: true
                });
            },
            'Item.Sku': function () {
                return new ProductLineSkuView({
                    model: this.model
                });
            },
            'Item.SelectedOptions': function () {
                return new TransactionLineViewsOptionsSelectedView({
                    model: this.model
                });
            },
            'Product.Stock.Info': function () {
                return new ProductLineStockView({
                    model: this.model
                });
            },
            'Item.Tax.Info': function () {
                if (Configuration_1.Configuration.get('showTaxDetailsPerLine')) {
                    return new TransactionLineViewsTax({
                        model: this.model
                    });
                }
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
            // @class Transaction.Line.Views.Actionable.View.Context
            return {
                // @property {OrderLine.Model|Transaction.Line.Model} line
                line: this.model,
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
                generalClass: this.options.generalClass,
                // @property {ImageContainer} thumbnail
                thumbnail: this.model.getThumbnail()
            };
            // @class Transaction.Line.Views.Actionable.View
        }
    });
});
// @class Cart.Lines.Initialize.Options
// @property {Transaction.Line.Model} model
// @property {String} generalClass Class name used in the generated HTML
// @property {Backbone.View} SummaryView View to show details
// @property {Backbone.View} ActionsView View to show actions buttons
// @property {Object} actionsOptions Any object used to extend the options sent to the Action View
// @property {Object} summaryOptions Any object used to extend the options sent to the Summary View
// @property {Boolean} navigable
// @property {Boolean} showAlert Indicate if a place holder is added in the final HTML, used when the action can generate errors
// @property {ApplicationSkeleton} application
// @property {Boolean} hideComparePrice Property used to bypass to the TransactionLineViewsPriceView

//# sourceMappingURL=Cart.Lines.View.js.map
