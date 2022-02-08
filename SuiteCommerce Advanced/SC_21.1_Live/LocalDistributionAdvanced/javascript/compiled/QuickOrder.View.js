/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuickOrder.View", ["require", "exports", "underscore", "quick_order.tpl", "Loggers", "InstrumentationAddToCart", "QuickAdd.View", "LiveOrder.Model", "Backbone.View"], function (require, exports, _, quick_order_tpl, Loggers_1, InstrumentationAddToCart, QuickAddView, LiveOrderModel, BackboneView) {
    "use strict";
    // @class QuickOrder.View @extend Backbone.View
    var QuickOrderView = BackboneView.extend({
        // @property {Function} template
        template: quick_order_tpl,
        // @method initialize Overrides default method to convert current view in to composite
        // @return {Void}
        initialize: function () {
            this.cart = LiveOrderModel.getInstance();
            this.quickAddViewComponent = new QuickAddView({
                getItemQuantitySet: _.bind(this.getItemQuantitySet, this),
                showBackorderable: false,
                validateMaxQty: true
            });
            this.quickAddViewComponent.on('selectedLine', this.addNewLine, this);
        },
        // @method getItemQuantitySet Auxiliary method used to provide the amount of already added items into the transaction to the quick add component
        // @param {Number} item_id
        // @return {Number}
        getItemQuantitySet: function (item_id) {
            var selected_line = this.cart.get('lines').find(function (line) {
                return line.get('item').id === item_id;
            });
            return selected_line ? parseInt(selected_line.get('quantity'), 10) : 0;
        },
        // @method addNewLine
        // @param {QuickAdd.View.SelectedLine.Properties} options
        // @return {Void}
        addNewLine: function (options) {
            var _this = this;
            var loggers = Loggers_1.Loggers.getLogger();
            var itemTrack = InstrumentationAddToCart.itemToTrack(options.selectedLine);
            var actionId = loggers.start('Add to Cart');
            var selectedLine = options.selectedLine;
            this.cart.addLine(selectedLine).then(function () {
                var addToCartOperationIds = InstrumentationAddToCart.getAddToCartOperationId(_this.cart.get('lines').models, selectedLine);
                loggers.end(actionId, {
                    operationIds: addToCartOperationIds,
                    status: 'success',
                    itemId: itemTrack.itemId,
                    itemQuantity: itemTrack.itemQuantity
                });
            });
        },
        // @property {ChildViews} childViews
        childViews: {
            QuickAddView: function () {
                return this.quickAddViewComponent;
            }
        },
        // @method destroy Override default implementation to clean up all attached events of the initialize
        // @return {Void}
        destroy: function () {
            this.quickAddViewComponent.off('selectedLine');
            this._destroy();
        },
        // @method getContext
        // @return {QuickOrder.View.Context}
        getContext: function () {
            // @class QuickOrder.View.Context
            return {
                // @property {Boolean} showOpenedAccordion
                showOpenedAccordion: !!this.options.openQuickOrder
            };
            // @class QuickOrder.View
        }
    });
    return QuickOrderView;
});

//# sourceMappingURL=QuickOrder.View.js.map
