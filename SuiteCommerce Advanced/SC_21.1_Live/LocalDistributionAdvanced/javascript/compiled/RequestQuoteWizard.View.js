/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RequestQuoteWizard.View", ["require", "exports", "Utils", "requestquote_wizard_layout.tpl", "Wizard.View", "Wizard.StepNavigation.View"], function (require, exports, Utils, requestquote_wizard_layout_tpl, WizardView, WizardStepNavigationView) {
    "use strict";
    return WizardView.extend({
        // @property {Function} template
        template: requestquote_wizard_layout_tpl,
        attributes: {
            id: 'request-quote-wizard',
            'data-root-component-id': 'Wizard.View'
        },
        // @property {String} page_header
        page_header: Utils.translate('Request a Quote'),
        // @property {String} bodyClass This property indicate the class used on the body to remove the My Account side menu
        bodyClass: 'force-hide-side-nav',
        initialize: function initialize() {
            this.wizard = this.constructor.wizard;
            WizardView.prototype.initialize.apply(this, arguments);
        },
        beforeShowContent: function beforeShowContent() {
            return this.wizard.runStep();
        },
        // @method getBreadcrumbPages
        // @return {BreadcrumbPage}
        getBreadcrumbPages: function () {
            return { href: '/request-a-quote', text: Utils.translate('Request a Quote') };
        },
        // @property {ChildViews} childViews
        childViews: {
            'Wizard.StepNavigation': function () {
                return new WizardStepNavigationView({ wizard: this.wizard });
            }
        },
        // @method getContext
        // @return {RequestQuoteWizard.View.Context}
        getContext: function () {
            // @class RequestQuoteWizard.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header
            };
            // @class RequestQuoteWizard.View
        }
    });
});

//# sourceMappingURL=RequestQuoteWizard.View.js.map
