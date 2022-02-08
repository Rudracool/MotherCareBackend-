/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.SubmitButton", ["require", "exports", "order_wizard_submitbutton_module.tpl", "Utils", "Configuration", "Wizard.StepModule"], function (require, exports, order_wizard_submitbutton_module_tpl, Utils, Configuration_1, Wizard_StepModule_1) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        template: order_wizard_submitbutton_module_tpl,
        render: function () {
            if (this.wizard.currentStep === 'review' ||
                !this.options.is_below_summary ||
                (this.options.is_below_summary && Configuration_1.Configuration.get('promocodes.allowMultiples', true))) {
                this._render();
                this.trigger('ready', true);
            }
        },
        // @method getContinueButtonLabel @returns {String}
        getContinueButtonLabel: function () {
            var current_step = this.wizard.getCurrentStep();
            var label = Utils.translate('Place Order');
            if (current_step) {
                label = current_step.getContinueButtonLabel();
            }
            return label;
        },
        // @method getContext @return OrderWizard.Module.SubmitButton.Context
        getContext: function () {
            // @class OrderWizard.Module.SubmitButton.Context
            return {
                // @property {Boolean} showWrapper
                showWrapper: !!this.options.showWrapper,
                // @property {String} wrapperClass
                wrapperClass: this.options.wrapperClass,
                // @property {String} continueButtonLabel
                continueButtonLabel: this.getContinueButtonLabel() || ''
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.SubmitButton.js.map
