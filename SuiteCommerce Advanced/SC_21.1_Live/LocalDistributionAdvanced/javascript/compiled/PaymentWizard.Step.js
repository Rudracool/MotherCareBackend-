/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Step", ["require", "exports", "payment_wizard_step.tpl", "Utils", "Footer.Simplified.View", "Wizard.Step", "Header.Simplified.View"], function (require, exports, payment_wizard_step_tpl, Utils, Footer_Simplified_View_1, WizardStep, HeaderSimplifiedView) {
    "use strict";
    // @class PaymentWizard.Step Step View, Renders all the components of the Step @extend Wizard.Step
    var PaymentWizardStep = WizardStep.extend({
        template: payment_wizard_step_tpl,
        // @property {Function} headerView
        headerView: HeaderSimplifiedView,
        // @property {Function} headerViewOptions
        headerViewOptions: function () {
            return {
                headerLinkHref: '/',
                headerLinkTouchPoint: 'customercenter',
                headerLinkHashtag: '#balance',
                headerLinkTitle: Utils.translate('Account Balance')
            };
        },
        // @property {Function} footerView
        footerView: Footer_Simplified_View_1.FooterSimplifiedView,
        render: function () {
            var layout = this.wizard.application.getLayout();
            WizardStep.prototype.render.apply(this, arguments);
            // Also trigger the afterRender event so the site search module can load the typeahead.
            layout.trigger('afterRender');
        },
        // @method getContext @return {PaymentWizard.Step.Context}
        getContext: function () {
            // @class PaymentWizard.Step.Context
            return {
                // @property {String} currentStepGroupName
                currentStepGroupName: this.wizard.steps[this.wizard.currentStep].options.stepGroup.name,
                // @property {String} continueButtonLabel
                continueButtonLabel: this.continueButtonLabel,
                // @property {Boolean} showNavButtons
                showNavButtons: !!(!this.hideBackButton || !this.hideContinueButton),
                // @property {Boolean} showBackButton
                showBackButton: !this.hideBackButton || !this.wizard.isCurrentStepFirst(),
                // @property {Boolean} showContinueButton
                showContinueButton: !this.hideContinueButton,
                // @property {Boolean} showBreadcrumb
                showBreadcrumb: !this.hideBreadcrumb
            };
        }
    });
    return PaymentWizardStep;
});

//# sourceMappingURL=PaymentWizard.Step.js.map
