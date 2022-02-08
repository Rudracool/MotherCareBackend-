/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PaymentMethod.Others", ["require", "exports", "underscore", "Utils", "order_wizard_paymentmethod_others_module.tpl", "backbone_collection_view_cell.tpl", "backbone_collection_view_row.tpl", "jQuery", "OrderWizard.Module.PaymentMethod", "OrderWizard.Module.PaymentMethod.External", "Backbone.CollectionView", "GlobalViews.Message.View", "Transaction.Paymentmethod.Model", "Backbone", "Configuration"], function (require, exports, _, Utils, order_wizard_paymentmethod_others_module_tpl, backbone_collection_view_cell_tpl, backbone_collection_view_row_tpl, jQuery, OrderWizardModulePaymentMethod, OrderWizardModulePaymentMethodExternal, BackboneCollectionView, GlobalViews_Message_View_1) {
    "use strict";
    // @class OrderWizard.Module.PaymentMethod.Others @extends OrderWizard.Module.PaymentMethod
    var OrderWizardModulePaymentMethodOthers = OrderWizardModulePaymentMethod.extend({
        template: order_wizard_paymentmethod_others_module_tpl,
        events: {
            'click [data-action="select"]': 'setSelectedExternalId'
        },
        initialize: function (options) {
            OrderWizardModulePaymentMethod.prototype.initialize.apply(this, arguments);
            var self = this;
            _.each(this.options.external, function (module) {
                // var ModuleClass = require(module.classModule);
                var ModuleClass = module.classModule;
                module.instance = new ModuleClass(_.extend({
                    wizard: self.wizard,
                    step: self.step,
                    stepGroup: self.stepGroup
                }, module.options));
            });
        },
        setSelectedExternalId: function (e) {
            this.options.selectedExternalId = jQuery(e.target).data('id');
            this.options.selector.setModuleByType(this.options.selectedExternalId, true);
            this.render();
        },
        childViews: {
            'Others.List': function () {
                return new BackboneCollectionView({
                    collection: this.options.external,
                    childView: OrderWizardModulePaymentMethodExternal,
                    viewsPerRow: this.itemsPerRow ||
                        (Utils.isDesktopDevice() ? 3 : Utils.isTabletDevice() ? 2 : 1),
                    cellTemplate: backbone_collection_view_cell_tpl,
                    rowTemplate: backbone_collection_view_row_tpl,
                    childViewOptions: this.options
                });
            },
            'External.Description': function () {
                return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: Utils.translate('You will be <b>redirected to your external payment site</b> after reviewing your order <b>on next step</b>. Once your order is placed, you <b>will return to our site to see the confirmation</b> of your purchase.'),
                    type: 'info',
                    closable: false
                });
            }
        }
    });
    return OrderWizardModulePaymentMethodOthers;
});

//# sourceMappingURL=OrderWizard.Module.PaymentMethod.Others.js.map
