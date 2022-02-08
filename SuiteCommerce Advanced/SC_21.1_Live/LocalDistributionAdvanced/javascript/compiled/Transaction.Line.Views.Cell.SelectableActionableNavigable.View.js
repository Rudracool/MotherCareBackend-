/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Transaction.Line.Views.Cell.SelectableActionableNavigable.View", ["require", "exports", "underscore", "transaction_line_views_cell_selectable_actionable_navigable.tpl", "Transaction.Line.Views.Price.View", "Transaction.Line.Views.Options.Selected.View", "ProductLine.Sku.View", "Backbone.View"], function (require, exports, _, transaction_line_views_cell_selectable_actionable_navigable_tpl, TransactionLineViewsPriceView, TransactionLineViewsOptionsSelectedView, ProductLineSkuView, BackboneView) {
    "use strict";
    var TransactionLineViewsCellSelectableActionableNavigableView = BackboneView.extend({
        // @property {Function} template
        template: transaction_line_views_cell_selectable_actionable_navigable_tpl,
        // @method initialize
        // @param {Transaction.Line.Views.Cell.SelectableActionableNavigable.View.Initialize} options
        // @return {Void}
        initialize: function (options) {
            this.options = options;
            this.application = options.application;
            this.model = options.model;
        },
        // @property {Object} childViews
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
                var child_options = _.extend(this.options.summaryOptions || {}, {
                    model: this.model,
                    application: this.application
                });
                return new this.options.SummaryView(child_options);
            },
            'Item.Actions.View': function () {
                var child_options = _.extend(this.options.actionsOptions || {}, {
                    model: this.model,
                    application: this.application
                });
                return new this.options.ActionsView(child_options);
            },
            'Item.Sku': function () {
                return new ProductLineSkuView({
                    model: this.model
                });
            }
        },
        // @method getContext
        // @return {Transaction.Line.Views.Cell.SelectableActionableNavigable.View.Context}
        getContext: function () {
            var item = this.model.get('item');
            // @class Transaction.Line.Views.Cell.SelectableActionableNavigable.View.Context
            return {
                // @property {Transaction.Line.Model} model
                model: this.model,
                // @property {String} lineId
                lineId: this.model.get('internalid'),
                // @property {Item.Model} item
                item: this.model.get('item'),
                // @property {String} itemName
                itemName: item.get('_name'),
                // @property {String} itemId
                itemId: item.get('internalid'),
                // @property {String} linkAttributes
                linkAttributes: this.model.getFullLink({
                    quantity: null,
                    location: null,
                    fulfillmentChoice: null
                }),
                // @property {Boolean} isNavigable
                isNavigable: !!this.options.navigable,
                // @property {Boolean} showCustomAlert
                showCustomAlert: !!item.get('_cartCustomAlert'),
                // @property {String} alertText
                alertText: item.get('_cartCustomAlert'),
                // @property {String} actionType
                actionType: this.options.actionType,
                // @property {String} customAlertType
                customAlertType: item.get('_cartCustomAlertType') || 'info',
                // @property {Boolean} showActionsView
                showActionsView: !!this.options.ActionsView,
                // @property {Boolean} showSummaryView
                showSummaryView: !!this.options.SummaryView,
                // @property {Boolean} isLineChecked
                isLineChecked: this.model.get('checked'),
                // @property {Boolean} activeLinesLengthGreaterThan1
                activeLinesLengthGreaterThan1: this.options.activeLinesLength > 1,
                // @property {ImageContainer} thumbnail
                thumbnail: this.model.getThumbnail()
            };
            // @class Transaction.Line.Views.Cell.SelectableActionableNavigable.View
        }
    });
    return TransactionLineViewsCellSelectableActionableNavigableView;
});
// @class Transaction.Line.Views.Cell.SelectableActionableNavigable.View.Initialize
// @property {Application} application
// @property {Boolean} navigable
// @property {Function} ActionsView
// @property {Function} SummaryView

//# sourceMappingURL=Transaction.Line.Views.Cell.SelectableActionableNavigable.View.js.map
