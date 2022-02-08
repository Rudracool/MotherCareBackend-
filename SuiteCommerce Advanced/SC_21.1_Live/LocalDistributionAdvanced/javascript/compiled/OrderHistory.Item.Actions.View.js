/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory.Item.Actions.View", ["require", "exports", "order_history_item_actions.tpl", "Backbone.View", "Utils"], function (require, exports, order_history_item_actions_tpl, BackboneView) {
    "use strict";
    // @class OrderHistory.Item.Actions.View @extend Backbone.View
    var OrderHistoryItemActionsView = BackboneView.extend({
        // @property {Function} template
        template: order_history_item_actions_tpl,
        // @method getContext @return OrderHistory.Item.Actions.View.Context
        getContext: function () {
            var line = this.model;
            var item = line.get('item');
            // @class OrderHistory.Item.Actions.View.Context
            return {
                // @property {Boolean} isStandalone also adds control for
                // reorder feature to avoid modifying tpl
                isStandalone: !!this.options.application.isStandalone() &&
                    !this.options.application.isReorderEnabled(),
                // @property {Model} line
                line: line,
                // @property {String} lineId
                lineId: line.get('internalid') || line.get('id'),
                // @property {Boolean} showActions
                showActions: !!line.get('item').get('_isPurchasable') &&
                    item.get('itemtype') !== 'GiftCert' &&
                    line.get('free_gift') !== true,
                // @property {String} itemURL
                itemURL: item.get('_url'),
                // @property {String} itemSKU
                itemSKU: item.get('_sku'),
                // @property {String} itemParentId
                itemParentId: item.get('parent_internalid'),
                // @property {String} lineFormatOptions
                lineFormatOptions: line.format_options,
                // @property {String} itemId
                itemId: item.get('_id'),
                // @property {Boolean} isQuantityGreaterThan1
                isQuantityGreaterThan1: line.quantity > 1
            };
        }
    });
    return OrderHistoryItemActionsView;
});

//# sourceMappingURL=OrderHistory.Item.Actions.View.js.map
