/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("ReorderItems.Actions.Quantity.View", ["require", "exports", "reorder_items_actions_quantity.tpl", "jQuery", "View"], function (require, exports, reorder_items_actions_quantity_tpl, jQuery, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReorderItemsActionsQuantityView = /** @class */ (function (_super) {
        __extends(ReorderItemsActionsQuantityView, _super);
        function ReorderItemsActionsQuantityView(options) {
            var _this = _super.call(this) || this;
            _this.template = reorder_items_actions_quantity_tpl;
            _this.options = options;
            _this.line = options.model;
            return _this;
        }
        ReorderItemsActionsQuantityView.prototype.getEvents = function () {
            return {
                'click [data-action="plus"]': 'addQuantity',
                'click [data-action="minus"]': 'subQuantity'
            };
        };
        ReorderItemsActionsQuantityView.prototype.getContext = function () {
            var item = this.line.get('item');
            var minimum_quantity = item.get('_minimumQuantity', true) || 1;
            var maximum_quantity = item.get('_maximumQuantity', true) || 0;
            var itemQuantity = this.line.get('quantity') > minimum_quantity
                ? this.line.get('quantity')
                : minimum_quantity;
            return {
                line: this.line,
                showQuantityInput: !!item.get('_isPurchasable'),
                lineId: this.line.get('internalid'),
                itemQuantity: itemQuantity,
                showLastPurchased: !!this.line.get('trandate'),
                showMinimumQuantity: minimum_quantity > 1,
                minimumQuantity: minimum_quantity,
                showMaximumQuantity: maximum_quantity !== 0,
                maximumQuantity: maximum_quantity
            };
        };
        ReorderItemsActionsQuantityView.prototype.addQuantity = function (e) {
            e.preventDefault();
            var $element = jQuery(e.target);
            var oldValue = $element
                .parent()
                .find('input')
                .val();
            var newVal = parseFloat(oldValue) + 1;
            $element
                .parent()
                .find('input')
                .val(newVal);
        };
        ReorderItemsActionsQuantityView.prototype.subQuantity = function (e) {
            e.preventDefault();
            var $element = jQuery(e.target);
            var oldValue = $element
                .parent()
                .find('input')
                .val();
            var newVal = parseFloat(oldValue) - 1;
            newVal = Math.max(1, newVal);
            $element
                .parent()
                .find('input')
                .val(newVal);
        };
        return ReorderItemsActionsQuantityView;
    }(View_1.View));
    exports.ReorderItemsActionsQuantityView = ReorderItemsActionsQuantityView;
});

//# sourceMappingURL=ReorderItems.Actions.Quantity.View.js.map
