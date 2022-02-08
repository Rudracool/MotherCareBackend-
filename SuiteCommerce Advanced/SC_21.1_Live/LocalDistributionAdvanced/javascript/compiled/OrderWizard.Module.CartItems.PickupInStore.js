/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.CartItems.PickupInStore", ["require", "exports", "underscore", "order_wizard_cartitems_module_pickup_in_store.tpl", "Configuration", "Wizard.StepModule", "Backbone.CollectionView", "OrderWizard.Module.CartItems.PickupInStore.Package.View", "Transaction.Line.Views.Cell.Navigable.View", "Utils"], function (require, exports, _, order_wizard_cartitems_module_pickup_in_store_tpl, Configuration_1, Wizard_StepModule_1, BackboneCollectionView, OrderWizardModuleCartItemsPickupInStorePackageView) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: order_wizard_cartitems_module_pickup_in_store_tpl,
        initialize: function () {
            var self = this;
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            this.wizard.model.on('ismultishiptoUpdated', function () {
                self.render();
            });
            this.wizard.model.on('promocodeUpdated', function () {
                self.render();
            });
            this.wizard.model.on('change:lines', function () {
                self.lines = self.wizard.model.getPickupInStoreLines();
                self.render();
            });
            this.lines = this.model.getPickupInStoreLines();
            this.options = this.options || {};
            this.options.exclude_on_skip_step = true;
        },
        isActive: function isActive() {
            return Configuration_1.Configuration.get('siteSettings.isPickupInStoreEnabled') && this.lines.length;
        },
        // @property {Object} childViews
        childViews: {
            'Packages.Collection': function () {
                var lines_for_pickup = this.model.getPickupInStoreLines();
                var lines_by_location = _.groupBy(lines_for_pickup, function (line) {
                    return line.get('location');
                });
                lines_by_location = _.map(lines_by_location, function (lines, location_id) {
                    return {
                        lines: lines,
                        location: location_id
                    };
                });
                return new BackboneCollectionView({
                    collection: lines_by_location,
                    childView: OrderWizardModuleCartItemsPickupInStorePackageView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        hide_location: this.options.hide_location,
                        show_opened_accordion: this.options.show_opened_accordion,
                        show_edit_cart_button: this.options.show_edit_cart_button,
                        show_headers: this.options.show_headers,
                        show_mobile: this.options.show_mobile,
                        application: this.wizard.application
                    }
                });
            }
        },
        // @method render
        render: function () {
            this.application = this.wizard.application;
            this.profile = this.wizard.options.profile;
            this.options.application = this.wizard.application;
            if (this.isActive()) {
                this._render();
            }
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.CartItems.PickupInStore.js.map
