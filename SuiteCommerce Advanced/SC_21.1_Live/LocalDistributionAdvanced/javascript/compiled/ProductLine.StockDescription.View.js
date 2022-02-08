/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductLine.StockDescription.View", ["require", "exports", "product_line_stock_description.tpl", "Backbone.View"], function (require, exports, product_line_stock_description_tpl, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: product_line_stock_description_tpl,
        // @method initialize Override default method to attach model's change event to re-render
        initialize: function () {
            this.model.on('change', this.render, this);
        },
        // @method getContext
        // @return {ProductLine.StockDescription.View.Context}
        getContext: function () {
            this.stock_info = this.model.getStockInfo();
            // @class ProductLine.Stock.View.Context
            return {
                // @property {Boolean} showStockDescription
                showStockDescription: !!(this.stock_info.showStockDescription && this.stock_info.stockDescription),
                // @property {Item.Model.StockInfo} stockInfo
                stockInfo: this.stock_info
            };
            // @class ProductLine.StockDescription.View
        }
    });
});
// @class ProductLine.StockDescription.View.Initialize.options

//# sourceMappingURL=ProductLine.StockDescription.View.js.map
