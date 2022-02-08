/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductLine.Sku.View", ["require", "exports", "product_line_sku.tpl", "Utils", "GlobalViews.Message.View", "Backbone.View"], function (require, exports, product_line_sku_tpl, Utils, GlobalViews_Message_View_1, BackboneView) {
    "use strict";
    return BackboneView.extend({
        // @property {Function} template
        template: product_line_sku_tpl,
        // @method initialize Override default method to attach model's change event to re-render
        // @param {ProductLine.Sku.View.Initialize.options} options
        // @return {Void}
        initialize: function () {
            this.model.on('change', this.render, this);
        },
        // @method destroy Override default method to detach from model's change event
        // @return {Void}
        destroy: function destroy() {
            BackboneView.prototype.destroy.apply(this, arguments);
            this.model.off('change', this.render, this);
        },
        // @method getContext
        // @returns {ProductLine.Sku.View.Context}
        getContext: function () {
            // @class ProductLine.Sku.View.Context
            return {
                // @property {Product.Model|Transaction.Line.Model|Item.Model} model
                model: this.model,
                // @property {String} sku
                sku: this.model.getSku(),
                // @property {Boolean} noLongerAvailable
                noLongerAvailable: this.model.get('item').get('noLongerAvailable')
            };
            // @class ProductLine.Sku.View
        },
        childViews: {
            GlobalMessageNoLongerAvailable: function () {
                return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: Utils.translate('This item is not longer available'),
                    type: 'error',
                    closable: false
                });
            }
        }
    });
});
// @class ProductLine.Sku.View.Initialize.options
// @property {Transaction.Line.Model|Item.Model|Product.Model} model

//# sourceMappingURL=ProductLine.Sku.View.js.map
