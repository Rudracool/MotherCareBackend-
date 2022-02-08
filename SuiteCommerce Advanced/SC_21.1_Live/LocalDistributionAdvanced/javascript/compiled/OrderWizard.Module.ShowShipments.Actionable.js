/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.ShowShipments.Actionable", ["require", "exports", "order_wizard_showshipments_actionable_module.tpl", "OrderWizard.Module.ShowShipments", "Address.Details.View", "Backbone.CollectionView", "Transaction.Line.Views.Cell.Navigable.View"], function (require, exports, order_wizard_showshipments_actionable_module_tpl, OrderWizardModuleShowShipments, Address_Details_View_1, BackboneCollectionView, Transaction_Line_Views_Cell_Navigable_View_1) {
    "use strict";
    return OrderWizardModuleShowShipments.extend({
        // @property {Function} template
        template: order_wizard_showshipments_actionable_module_tpl,
        // @property {Object} childViews
        childViews: {
            'Shipping.Address': function () {
                return new Address_Details_View_1.AddressDetailsView({
                    hideActions: true,
                    hideDefaults: true,
                    manage: 'shipaddress',
                    model: this.profile.get('addresses').get(this.model.get('shipaddress')),
                    hideSelector: true
                });
            },
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.model.get('lines'),
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: !this.options.hide_item_link
                    }
                });
            }
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.ShowShipments.Actionable.js.map
