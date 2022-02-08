/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.CartItems.Ship", ["require", "exports", "order_wizard_cartitems_module_ship.tpl", "Utils", "Wizard.StepModule", "Backbone.CollectionView", "Address.Details.View", "Transaction.Line.Views.Cell.Navigable.View", "LiveOrder.Model", "Configuration"], function (require, exports, order_wizard_cartitems_module_ship_tpl, Utils, Wizard_StepModule_1, BackboneCollectionView, Address_Details_View_1, Transaction_Line_Views_Cell_Navigable_View_1, LiveOrderModel) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: order_wizard_cartitems_module_ship_tpl,
        initialize: function () {
            var _this = this;
            var self = this;
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            this.wizard.model.on('ismultishiptoUpdated', function () {
                self.render();
            });
            this.wizard.model.on('promocodeUpdated', function () {
                self.render();
            });
            this.wizard.model.on('change:lines', function () {
                self.lines = self.wizard.model.getShippableLines();
                self.render();
            });
            this.lines = this.wizard.model.getShippableLines();
            this.options = this.options || {};
            this.options.exclude_on_skip_step = true;
            this.wizard.model.on('change:shipaddress', function () { return _this.initializeAddress(); });
            this.initializeAddress(true);
        },
        initializeAddress: function (no_render) {
            var _this = this;
            this.wizard.model.off('change:shipaddress', function () { return _this.initializeAddress(); });
            if (this.address) {
                this.address.off('change', null, null);
            }
            this.address = this.wizard.options.profile
                .get('addresses')
                .get(this.wizard.model.get('shipaddress'));
            if (this.address) {
                this.address.on('change', this.render, this);
            }
            if (!no_render) {
                this.render();
            }
        },
        isActive: function isActive() {
            return this.lines.length;
        },
        // @property {Object} childViews
        childViews: {
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.lines,
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: false,
                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',
                        detail2Title: Utils.translate('Unit price:'),
                        detail2: 'rate_formatted',
                        detail3Title: Utils.translate('Amount:'),
                        detail3: 'total_formatted'
                    }
                });
            },
            'Address.Details': function () {
                if (this.address) {
                    return new Address_Details_View_1.AddressDetailsView({
                        model: this.address,
                        hideActions: true,
                        hideDefaults: true,
                        hideSelector: true
                    });
                }
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
        },
        // @method getContext @returns {OrderWizard.Module.CartItems.Context}
        getContext: function () {
            var lines = this.lines;
            var item_count = LiveOrderModel.countItems(lines);
            // @class OrderWizard.Module.CartItems.Context
            return {
                // @property {LiveOrder.Model} model
                model: this.model,
                // @property {Number} itemCount
                itemCount: item_count,
                // @property {Boolean} showOpenedAccordion
                showOpenedAccordion: !!this.options.show_opened_accordion,
                // @property {Boolean} showOpenedAccordion
                isAccordionPrimary: !!this.options.is_accordion_primary,
                // @property {Boolean} showEditCartButton
                showEditCartButton: !!this.options.show_edit_cart_button,
                // @property {Boolean} showHeaders
                showHeaders: !!this.options.show_headers,
                // @property {Boolean} showMobile
                showMobile: !!this.options.show_mobile,
                // @property {Address.Model} address
                address: this.address,
                // @property {Boolean} showAddress
                showAddress: !!this.address && this.options.hide_address !== true && !this.wizard.isMultiShipTo()
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.CartItems.Ship.js.map
