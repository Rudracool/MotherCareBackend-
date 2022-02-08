/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductList.BulkActions.View", ["require", "exports", "product_list_bulk_actions.tpl", "Backbone.View"], function (require, exports, product_list_bulk_actions_tpl, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: product_list_bulk_actions_tpl,
        // @method getContext @return ProductList.BulkActions.View.Context
        getContext: function () {
            var model = this.options.model;
            var isAtLeastOneItemChecked = model.someCheckedItemsExist();
            return {
                // @property {Boolean} isAtLeastOneItemChecked
                isAtLeastOneItemChecked: isAtLeastOneItemChecked,
                // @property {Boolean} hasItems
                hasItems: model.get('items').length,
                // @property {Boolean} isAddToCartEnabled
                isAddToCartEnabled: isAtLeastOneItemChecked && model.canBeAddedToCart(true),
                // @property {Boolean} isTypePredefined
                isTypePredefined: model.get('typeName') === 'predefined'
            };
        }
    });
});

//# sourceMappingURL=ProductList.BulkActions.View.js.map
