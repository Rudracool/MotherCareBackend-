/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.MultiShipTo.Package.Details", ["require", "exports", "order_wizard_msr_package_details.tpl", "Wizard.StepModule", "Backbone.CollectionView", "Transaction.Line.Views.Cell.Actionable.View", "Address.Details.View", "OrderWizard.Module.MultiShipTo.Package.Details.Quantity", "OrderWizard.Module.MultiShipTo.Package.Details.Actions", "LiveOrder.Model"], function (require, exports, order_wizard_msr_package_details_tpl, Wizard_StepModule_1, BackboneCollectionView, TransactionLineViewsCellActionableView, Address_Details_View_1, OrderWizardModuleMultiShipToPackageDetailsQuantity, OrderWizardModuleMultiShipToPackageDetailsActions, LiveOrderModel) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        template: order_wizard_msr_package_details_tpl,
        initialize: function (options) {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            this.model = options.model;
        },
        childViews: {
            'Address.Details': function () {
                return new Address_Details_View_1.AddressDetailsView({
                    model: this.model.get('address'),
                    hideActions: true,
                    hideDefaults: true,
                    manage: 'shipaddress',
                    hideSelector: true
                });
            },
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    childView: TransactionLineViewsCellActionableView,
                    viewsPerRow: 1,
                    collection: this.model.get('lines'),
                    childViewOptions: {
                        navigable: false,
                        // ,	useLinePrice: true
                        application: this.options.application,
                        SummaryView: OrderWizardModuleMultiShipToPackageDetailsQuantity,
                        ActionsView: OrderWizardModuleMultiShipToPackageDetailsActions
                    }
                });
            }
        },
        // @method getContext @return {OrderWizard.Module.MultiShipTo.Package.Details.Context}
        getContext: function () {
            var item_count = LiveOrderModel.countItems(this.model.get('lines'));
            // @class OrderWizard.Module.MultiShipTo.Package.Details.Context
            return {
                // @property {String} packageTitle
                packageTitle: this.model.get('packageTitle'),
                // @property {Boolean} totalItemsGreaterThan1
                itemCountGreaterThan1: item_count > 1,
                // @property {Number} totalItems
                itemCount: item_count,
                // @property {Boolean} isPackageExpanded
                isPackageExpanded: !!this.model.get('isPackageExpanded'),
                // @property {String} addressId
                addressId: this.model.get('address').id,
                // @property {String} addressName
                addressName: this.model.get('address').get('fullname'),
                // @property {String} address
                address: this.model.get('address').get('addr1')
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.MultiShipTo.Package.Details.js.map
