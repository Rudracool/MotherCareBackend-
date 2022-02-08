/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductList.DetailsLaterMacro.View", ["require", "exports", "product_list_details_later_macro.tpl", "ProductViews.Price.View", "ProductLine.Stock.View", "ProductLine.StockDescription.View", "ProductList.DetailsMinQuantity.View", "Transaction.Line.Views.Options.Selected.View", "Backbone.View", "Backbone.View.render"], function (require, exports, product_list_details_later_macro_tpl, ProductViewsPriceView, ProductLineStockView, ProductLineStockDescriptionView, ProductListDetailsMinQuantityView, TransactionLineViewsOptionsSelectedView, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: product_list_details_later_macro_tpl,
        childViews: {
            'ItemViews.Price': function () {
                return new ProductViewsPriceView({
                    model: this.model,
                    origin: 'PRODUCTLISTDETAILSLATER'
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
        // @return {ProductList.DetailsLaterMacro.View.Context}
        getContext: function () {
            var item = this.model.get('item');
            // @class ProductList.DetailsLaterMacro.View.Context
            return {
                // @property {ProductList.Item.Model} model
                model: this.model,
                // @property {Integer} quantity
                quantity: this.model.get('quantity'),
                // @property {String} itemId
                itemId: item.get('internalid'),
                // @property {Boolean} canBeAddedToCart
                canBeAddedToCart: item.get('ispurchasable') &&
                    this.model.fulfillsMinimumQuantityRequirement() &&
                    this.model.fulfillsMaximumQuantityRequirement(),
                // @property {String} itemDetailsUrl
                itemDetailsUrl: this.model.generateURL(),
                // @property {Boolean} isGiftCertificate
                isGiftCertificate: item.get('itemtype') === 'GiftCert',
                // @property {Boolean} showActions
                showActions: !this.options.hide_actions,
                // @property {ImageContainer} thumbnail
                thumbnail: this.model.getThumbnail()
            };
            // @class ProductList.DetailsLaterMacro.View
        }
    });
});

//# sourceMappingURL=ProductList.DetailsLaterMacro.View.js.map
