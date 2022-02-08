/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.MultiShipTo.EnableLink", ["require", "exports", "underscore", "order_wizard_msr_enablelink_module.tpl", "Utils", "Wizard.StepModule", "GlobalViews.Message.View", "GlobalViews.Confirmation.View", "OrderWizard.Module.MultiShipTo.RemovedPromoCodes", "Backbone"], function (require, exports, _, order_wizard_msr_enablelink_module_tpl, Utils, Wizard_StepModule_1, GlobalViews_Message_View_1, GlobalViewsConfirmationView, OrderWizardModuleMultiShipToRemovedPromoCodes, Backbone) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: order_wizard_msr_enablelink_module_tpl,
        className: 'OrderWizard.Module.MultiShipTo.EnableLink',
        events: {
            'click [data-action="change-status-multishipto"]': 'toggleMultiShipTo',
            'click [data-action="order-wizard-msr-promocodes-undo"]': 'revertMultiShipToAndPromoCodes'
        },
        // @method initialize Override default method to attach current module on wizard's model events
        // @return {Void}
        initialize: function initialize() {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            if (!this.wizard.model._events['toggle-multi-ship-to']) {
                this.wizard.model.on('toggle-multi-ship-to', this.toggleMultiShipTo, this);
                this.wizard.model.on('update-multi-ship-to-status', this.toggleMultiShipTo, this);
                this.wizard.model.on('ismultishiptoUpdated', this.render, this);
            }
            this.wizard.closedModal = this.wizard.pressedModalButton = false;
        },
        // @method isActive Determines if the current module is valid to be shown and operate with
        // @return {Boolean}
        isActive: function isActive() {
            var shippable_items = this.wizard.model.getShippableLines();
            var siteSettings = this.wizard.application.getConfig().siteSettings || {};
            return (siteSettings.isMultiShippingRoutesEnabled &&
                (shippable_items.length > 1 ||
                    (shippable_items.length === 1 && shippable_items[0].get('quantity') > 1)) &&
                !this.wizard.model.getPickupInStoreLines().length);
        },
        // @method toggleMultiShipTo Toggle the MST status of the order
        // @return {jQuery.Deferred}
        toggleMultiShipTo: function toggleMultiShipTo() {
            if (!this.wizard.model.get('ismultishipto')) {
                // These unsets are silent in order to avoid problems with other modules
                this.wizard.model.set('shipmethod', null, { silent: true });
                this.wizard.model.set('sameAs', false, { silent: true });
                this.wizard.model.set('shipaddress', null, { silent: true });
            }
            var self = this;
            this.wizard.model.set('ismultishipto', !this.wizard.model.get('ismultishipto'));
            return this.wizard.model.save().done(function () {
                self.wizard.model.trigger('ismultishiptoUpdated');
                self.wizard.invalidPromocodes = self.wizard.model.get('automaticallyremovedpromocodes');
                self.wizard.model.unset('automaticallyremovedpromocodes');
                Backbone.history.navigate(self.options.change_url || '/', { trigger: true });
                self.render();
                if (self.wizard.invalidPromocodes && self.wizard.invalidPromocodes.length) {
                    self.removedPromocodesConfirmation(self.wizard.invalidPromocodes);
                }
            });
        },
        // @method removedPromocodesConfirmation
        // @param {Array<LiveOrder.Model.PromoCode>} invalid_promocodes
        // @return {Void}
        removedPromocodesConfirmation: function removedPromocodesConfirmation() {
            var removedPromocodesConfirmationView = new GlobalViewsConfirmationView({
                callBack: _.bind(this.revertMultiShipToAndPromoCodesCallback, this),
                cancelCallBack: _.bind(this.canceledModalCallback, this),
                confirmLabel: Utils.translate('Cancel and Keep the Promotions'),
                cancelLabel: Utils.translate('Continue Without them'),
                className: 'order-wizard-msr-removed-promocodes-confirmation',
                title: Utils.translate('Promotions not Supported'),
                view: OrderWizardModuleMultiShipToRemovedPromoCodes,
                viewParameters: {
                    invalidPromocodes: this.wizard.invalidPromocodes
                },
                autohide: true
            });
            var self = this;
            removedPromocodesConfirmationView.on('modal-close', function () {
                self.wizard.closedModal = true;
                if (!self.wizard.pressedModalButton) {
                    // Refresh
                    Backbone.history.navigate(this.options.change_url || '/', { trigger: true });
                }
            });
            this.wizard.closedModal = this.wizard.pressedModalButton = false;
            this.wizard.application.getLayout().showInModal(removedPromocodesConfirmationView);
        },
        // @method canceledModalCallback
        // @return {Void}
        canceledModalCallback: function canceledModalCallback() {
            this.wizard.pressedModalButton = true;
        },
        // @method revertMultiShipToAndPromoCodesCallback
        // @return {Void}
        revertMultiShipToAndPromoCodesCallback: function revertMultiShipToAndPromoCodesCallback() {
            this.wizard.pressedModalButton = true;
            this.revertMultiShipToAndPromoCodes();
        },
        // @method revertMultiShipToAndPromoCodesCallback
        // @return {jQuery.Deferred}
        revertMultiShipToAndPromoCodes: function revertMultiShipToAndPromoCodes() {
            var new_promocodes = (this.wizard.model.get('promocodes') || []).concat(this.wizard.invalidPromocodes);
            var save = this.wizard.model.save({ promocodes: new_promocodes, ismultishipto: false });
            Backbone.history.navigate(this.options.change_url || '/', { trigger: true });
            return save;
        },
        // @method render We override render to just render this module in case the multi ship to feature is enabled
        // @return {Void}
        render: function render() {
            if (this.isActive()) {
                this._render();
                this.trigger('ready', true);
            }
        },
        childViews: {
            PromocodesRemovedWarning: function () {
                var msg = Utils.translate('The following promotions are not supported when shipping to multiple addresses and have been removed: ');
                msg += '<span class="order-wizard-msr-removed-promocodes-list">';
                _.each(this.wizard.invalidPromocodes, function (e) {
                    msg += e.code + "&nbsp;";
                });
                msg += '</span><br />';
                msg += '<a href="#" data-action="order-wizard-msr-promocodes-undo">';
                msg += Utils.translate('Ship to a single address and re-apply codes.');
                msg += '</a>';
                return new GlobalViews_Message_View_1.GlobalViewsMessageView({ message: msg, type: 'warning', closable: true });
            }
        },
        // @method getContext
        // @return {OrderWizard.Module.MultiShipTo.EnableLink.Context}
        getContext: function getContext() {
            var showPromocodesRemovedWarning = this.wizard.closedModal && !this.wizard.pressedModalButton;
            if (showPromocodesRemovedWarning) {
                // Reset warning after showing to make sure it's a one time operation.
                this.wizard.closedModal = this.wizard.pressedModalButton = false;
            }
            // @class OrderWizard.Module.MultiShipTo.EnableLink.Context
            return {
                // @property {Boolean} isMultiShipToEnabled
                isMultiShipToEnabled: !!this.model.get('ismultishipto'),
                // @property {Boolean} showPromocodesRemovedWarning
                showPromocodesRemovedWarning: showPromocodesRemovedWarning
            };
            // @class OrderWizard.Module.MultiShipTo.EnableLink
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.MultiShipTo.EnableLink.js.map
