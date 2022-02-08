/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.NonShippableItems", ["require", "exports", "order_wizard_non_shippable_items_module.tpl", "Utils", "Wizard.StepModule", "Transaction.Line.Views.Cell.Navigable.View", "Backbone.CollectionView"], function (require, exports, order_wizard_non_shippable_items_module_tpl, Utils, Wizard_StepModule_1, Transaction_Line_Views_Cell_Navigable_View_1, BackboneCollectionView) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        template: order_wizard_non_shippable_items_module_tpl,
        initialize: function (options) {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            this.wizard.model.on('ismultishiptoUpdated', this.render, this);
            this.options = options;
        },
        // Returns the list of non shippable items/lines
        getLinesNotShippable: function () {
            return this.wizard.model.getNonShippableLines();
        },
        isActive: function () {
            return this.getLinesNotShippable().length;
        },
        render: function () {
            if (this.isActive()) {
                this._render();
            }
            else {
                this.$el.empty();
            }
        },
        childViews: {
            'NonShippableItems.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.getLinesNotShippable(),
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: false,
                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',
                        detail2Title: Utils.translate('Unit price'),
                        detail2: 'rate_formatted',
                        detail3Title: Utils.translate('Amount:'),
                        detail3: 'amount_formatted'
                    }
                });
            }
        },
        // @method getContext @return {OrderWizard.Module.NonShippalbeItems.Context}
        getContext: function () {
            var lines_not_shippable = this.getLinesNotShippable();
            // @class OrderWizard.Module.NonShippalbeItems.Context
            return {
                // @property {Boolean} showNonShippableLines
                showNonShippableLines: !!(lines_not_shippable && lines_not_shippable.length),
                // @property {Number} nonShippableLinesLength
                nonShippableLinesLength: lines_not_shippable.length,
                // @property {String} title
                title: this.options.title,
                // @property {Boolean} showCustomTitle
                showCustomTitle: !!this.options.title,
                // @property {Boolean} showEditCartButton
                showEditCartButton: !!this.options.show_edit_cart_button,
                // @property {Boolean} showMobile
                showMobile: !!this.options.showMobile,
                // @property {Boolean} showTableHeader
                showTableHeader: !!this.options.show_table_header,
                // @property {Boolean} showOpenedAccordion
                showOpenedAccordion: !!this.options.show_opened_accordion
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.NonShippableItems.js.map
