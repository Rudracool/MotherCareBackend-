/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.MultiShipTo.Package.Creation.EditQuantity", ["require", "exports", "Utils", "order_wizard_msr_package_creation_edit_quantity.tpl", "Backbone.View"], function (require, exports, Utils, order_wizard_msr_package_creation_edit_quantity_tpl, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: order_wizard_msr_package_creation_edit_quantity_tpl,
        // @method getContext @return {OrderWizard.Module.MultiShipTo.Package.Creation.EditQuantity.Context}
        getContext: function () {
            var quantity = this.model.get('quantity');
            var min_quantity = this.model.get('minimumquantity') || 1;
            var has_minimum_quantity_constrain = min_quantity > 1 && quantity < 2 * min_quantity;
            // @class OrderWizard.Module.MultiShipTo.Package.Creation.EditQuantity.Context
            return {
                // @property {Boolean} totalQuantityGreaterThan1
                totalQuantityGreaterThan1: quantity > 1,
                // @property {Number} totalQuantity
                totalQuantity: quantity,
                // @property {Boolean} isReadOnly
                isReadOnly: !this.model.get('check') || quantity === 1 || has_minimum_quantity_constrain,
                // @property {String} itemId
                itemId: this.model.get('item').id,
                // @property {Number} selectedQuantity
                selectedQuantity: this.model.get('splitquantity') || quantity,
                // @property {Boolean} isDesktop
                isDesktop: Utils.isDesktopDevice(),
                // @property {Boolean} showMinimumQuantity
                showMinimumQuantity: min_quantity > 1,
                // @property {Integer} minimumQuantity
                minQuantity: min_quantity
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.MultiShipTo.Package.Creation.EditQuantity.js.map
