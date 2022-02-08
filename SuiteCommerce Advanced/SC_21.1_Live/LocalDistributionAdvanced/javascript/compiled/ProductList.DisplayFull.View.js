/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductList.DisplayFull.View", ["require", "exports", "product_list_display_full.tpl", "ProductViews.Price.View", "ProductLine.Stock.View", "GlobalViews.StarRating.View", "ProductLine.StockDescription.View", "ProductList.DetailsMinQuantity.View", "Transaction.Line.Views.Options.Selected.View", "Backbone.View"], function (require, exports, product_list_display_full_tpl, ProductViewsPriceView, ProductLineStockView, GlobalViewsStarRatingView, ProductLineStockDescriptionView, ProductListDetailsMinQuantityView, TransactionLineViewsOptionsSelectedView, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: product_list_display_full_tpl,
        childViews: {
            'ItemViews.Price': function () {
                return new ProductViewsPriceView({
                    model: this.model,
                    origin: 'PRODUCTLISTDETAILSFULL'
                });
            },
            'Item.SelectedOptions': function () {
                return new TransactionLineViewsOptionsSelectedView({
                    model: this.model
                });
            },
            'ItemViews.Stock': function () {
                return new ProductLineStockView({
                    model: this.model
                });
            },
            'GlobalViews.StarRating': function () {
                return new GlobalViewsStarRatingView({
                    model: this.model.get('item')
                });
            },
            'ProductList.DetailsMinQuantity': function () {
                return new ProductListDetailsMinQuantityView({
                    model: this.model
                });
            },
            StockDescription: function () {
                return new ProductLineStockDescriptionView({
                    model: this.model
                });
            }
        },
        // @method getContext
        // @return {ProductList.DisplayFull.View.Context}
        getContext: function getContext() {
            var line = this.model;
            var options = this.options || {};
            var priority = line.get('priority');
            var item = line.get('item');
            var description = line.get('description');
            // @class ProductList.DisplayFull.View.Context
            return {
                // @property {String} lineId
                lineId: line.get('internalid'),
                // @property {Boolean} isChecked
                isChecked: !!line.get('checked'),
                // @property {Integer} quantity
                quantity: line.get('quantity'),
                // @property {String} description
                description: description,
                // @property {Boolean} hasDescription
                hasDescription: !!description,
                // @property {Boolean} showEdit
                showEdit: options.show_edit_action,
                // @property {Boolean} showMoveAction
                showMoveAction: options.show_move_action,
                // @property {Boolean} showAddedOn
                showAddedOn: !options.hide_added_on,
                // @property {String} itemId
                itemId: line.getItemId(),
                // @property {Boolean} isAvailableForCart
                isAvailableForCart: item.get('_isPurchasable') &&
                    line.fulfillsMinimumQuantityRequirement() &&
                    line.fulfillsMaximumQuantityRequirement(),
                // @property {Boolean} showRating
                showRating: !options.hide_rating,
                // @property {Boolean} showCheckbox
                showCheckbox: !options.hide_checkbox,
                // @property {String} productName
                productName: item.get('_name'),
                // @property {String} priorityName
                priorityName: priority.name,
                // @property {String} itemCreatedDate
                itemCreatedDate: line.get('createddate'),
                // @property {String} linkAttributes
                linkAttributes: line.getFullLink(),
                // @property {ImageContainer} thumbnail
                thumbnail: this.model.getThumbnail()
            };
        }
    });
});

//# sourceMappingURL=ProductList.DisplayFull.View.js.map
