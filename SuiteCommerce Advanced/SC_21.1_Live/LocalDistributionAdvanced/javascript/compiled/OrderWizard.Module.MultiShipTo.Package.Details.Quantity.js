/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.MultiShipTo.Package.Details.Quantity", ["require", "exports", "order_wizard_msr_package_details_quantity.tpl", "Backbone.View"], function (require, exports, order_wizard_msr_package_details_quantity_tpl, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: order_wizard_msr_package_details_quantity_tpl,
        // @method getContext @return {OrderWizard.Module.MultiShipTo.Package.Details.Quantity.Context}
        getContext: function () {
            // @class OrderWizard.Module.MultiShipTo.Package.Details.Quantity.Context
            return {
                // @property {Number} lineQuantity
                lineQuantity: this.model.get('quantity'),
                // @property {String} lineTotalFormatted
                lineTotalFormatted: this.model.get('total_formatted'),
                // @property {String} lineAmountFormatted
                lineAmountFormatted: this.model.get('amount_formatted'),
                // @property {Boolean} isAmountGreaterThanTotal
                isAmountGreaterThanTotal: this.model.get('amount') > this.model.get('total')
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.MultiShipTo.Package.Details.Quantity.js.map
