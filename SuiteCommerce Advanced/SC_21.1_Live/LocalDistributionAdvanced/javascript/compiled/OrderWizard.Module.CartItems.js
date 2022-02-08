/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.CartItems", ["require", "exports", "underscore", "order_wizard_cartitems_module.tpl", "Utils", "Wizard.StepModule", "Backbone.CollectionView", "Transaction.Line.Views.Cell.Navigable.View", "LiveOrder.Model"], function (require, exports, _, order_wizard_cartitems_module_tpl, Utils, Wizard_StepModule_1, BackboneCollectionView, Transaction_Line_Views_Cell_Navigable_View_1, LiveOrderModel) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: order_wizard_cartitems_module_tpl,
        // @method render
        render: function () {
            this.application = this.wizard.application;
            this.profile = this.wizard.options.profile;
            this.options.application = this.wizard.application;
            if (this.isActive()) {
                this._render();
            }
        },
        initialize: function () {
            var self = this;
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            this.wizard.model.on('ismultishiptoUpdated', function () {
                self.render();
            });
            this.wizard.model.on('promocodeUpdated', function () {
                self.render();
            });
        },
        // @property {Object} childViews
        childViews: {
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.model.get('lines'),
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: !this.options.hide_item_link,
                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',
                        detail2Title: Utils.translate('Unit price:'),
                        detail2: 'rate_formatted',
                        detail3Title: Utils.translate('Amount:'),
                        detail3: 'amount_formatted'
                    }
                });
            }
        },
        // @method getContext @returns {OrderWizard.Module.CartItems.Context}
        getContext: function () {
            var lines = this.model.get('lines');
            var item_count = LiveOrderModel.countItems(lines);
            // @class OrderWizard.Module.CartItems.Context
            return {
                // @property {LiveOrder.Model} model
                model: this.model,
                // @property {Boolean} itemCountGreaterThan1
                itemCountGreaterThan1: item_count > 1,
                // @property {Number} itemCount
                itemCount: item_count,
                // @property {Boolean} showOpenedAccordion
                showOpenedAccordion: _.result(this.options || {}, 'showOpenedAccordion', false),
                // @property {Boolean} showEditCartButton
                showEditCartButton: !this.options.hide_edit_cart_button,
                // @property {Boolean} showHeaders
                showHeaders: !this.options.hideHeaders,
                // @property {Boolean} showMobile
                showMobile: this.options.showMobile
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.CartItems.js.map
