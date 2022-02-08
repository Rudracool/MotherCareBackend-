/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuoteToSalesOrderWizard.Step", ["require", "exports", "quote_to_salesorder_wizard_step.tpl", "Utils", "Footer.Simplified.View", "Configuration", "Wizard.Step", "Header.Simplified.View"], function (require, exports, quote_to_salesorder_wizard_step_tpl, Utils, Footer_Simplified_View_1, Configuration_1, WizardStep, HeaderSimplifiedView) {
    "use strict";
    return WizardStep.extend({
        // @property {Function} template
        template: quote_to_salesorder_wizard_step_tpl,
        // @property {Header.Simplified.View} headerView
        headerView: HeaderSimplifiedView,
        // @property {Function} headerViewOptions @return {Header.LogoView.Initialize.Options}
        headerViewOptions: function () {
            return {
                headerLinkHref: '/quotes/' + this.options.wizard.model.get('quoteid'),
                headerLinkTouchPoint: 'customercenter',
                headerLinkHashtag: '#/quotes/' + this.options.wizard.model.get('quoteid'),
                headerLinkTitle: Utils.translate('Back to quote')
            };
        },
        // @property {Footer.Simplified.View} footerView
        footerView: Footer_Simplified_View_1.FooterSimplifiedView,
        // @method render
        render: function () {
            var layout = this.wizard.application.getLayout();
            WizardStep.prototype.render.apply(this, arguments);
            // Also trigger the afterRender event so the site search module can load the typeahead.
            layout.trigger('afterRender');
        },
        // @method getContext @return {QuoteToSalesOrderWizard.Step.Context}
        getContext: function () {
            // @class QuoteToSalesOrderWizard.Step.Context
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
                showBreadcrumb: !this.hideBreadcrumb,
                // @property {Boolean} showBottomMessage
                showBottomMessage: !!this.showBottomMessage,
                // @property {Boolean} hasSalesrep
                hasSalesrep: !!this.wizard.model.get('quoteDetails').salesrep.internalid,
                // @property {String} disclaimer
                disclaimer: Configuration_1.Configuration.get('quote.disclaimer', ''),
                // @property {String} salesrepName
                salesrepName: this.wizard.model.get('quoteDetails').salesrep.name,
                // @property {String} salesrepPhone
                salesrepPhone: this.wizard.model.get('quoteDetails').salesrep.phone
                    ? this.wizard.model.get('quoteDetails').salesrep.phone
                    : Configuration_1.Configuration.get('quote.defaultPhone', ''),
                // @property {String} salesrepEmail
                salesrepEmail: this.wizard.model.get('quoteDetails').salesrep.email
                    ? this.wizard.model.get('quoteDetails').salesrep.email
                    : Configuration_1.Configuration.get('quote.defaultEmail', '')
            };
        }
    });
});

//# sourceMappingURL=QuoteToSalesOrderWizard.Step.js.map
