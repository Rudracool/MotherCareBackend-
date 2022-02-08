/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PromocodeForm", ["require", "exports", "underscore", "order_wizard_promocodeform.tpl", "Configuration", "Wizard.StepModule", "Cart.PromocodeForm.View"], function (require, exports, _, order_wizard_promocodeform_tpl, Configuration_1, Wizard_StepModule_1, CartPromocodeFormView) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: order_wizard_promocodeform_tpl,
        // @property {Object} events
        events: {
            'shown [data-action="show-promo-code-container"]': 'onPromocodeFormShown'
        },
        // @method initialize
        initialize: function initialize() {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            this.promocodeFormComponent = new CartPromocodeFormView({
                model: this.wizard.model,
                application: this.wizard.application
            });
            this.promocodeFormComponent.on('applying_promocode', function () {
                this.isSaving = true;
                this.trigger('change_enable_continue', false);
            }, this);
            // this.promocodeFormComponent.on('apply_promocode_finished', function ()
            this.promocodeFormComponent.on('apply_promocode_failed', function () {
                this.isSaving = false;
                this.trigger('change_enable_continue', true);
            }, this);
            this.promocodeFormComponent.on('apply_promocode_succeeded', function () {
                this.isSaving = false;
                this.trigger('change_enable_continue', true);
                this.render();
            }, this);
        },
        // @method render
        // @return {Void}
        render: function render() {
            if (this.state === 'present' && !this.isSaving) {
                this._render();
                this.trigger('ready', true);
            }
        },
        // @method onPromocodeFormShown Handles the shown of promocode form
        // @param {jQuery.Element} e
        // @return {Void}
        onPromocodeFormShown: function onPromocodeFormShown(e) {
            this.$(e.target)
                .find('input[name="promocode"]')
                .focus();
        },
        // @property {Object} childViews
        childViews: {
            'Cart.PromocodeForm': function () {
                return this.promocodeFormComponent;
            }
        },
        // @method getContext
        // @returns {OrderWizard.Module.PromocodeForm.Context}
        getContext: function getContext() {
            var promocodes = this.wizard.model.get('promocodes') || [];
            var promocodes_applied = _.filter(promocodes, function (promo) {
                return ((promo.isautoapplied == true && promo.isvalid == true) ||
                    promo.isautoapplied == false);
            });
            // @class OrderWizard.Module.PromocodeForm.Context
            return {
                // @property {LiveOrder.Model} model
                model: this.wizard.model,
                // @property {Boolean} showPromocodeForm
                showPromocodeForm: Configuration_1.Configuration.get('promocodes.allowMultiples', true) || !promocodes_applied.length
            };
            // @class OrderWizard.Module.PromocodeForm
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.PromocodeForm.js.map
