/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RequestQuoteWizard.Module.Confirmation", ["require", "exports", "requestquote_wizard_module_confirmation.tpl", "Utils", "Configuration", "Wizard.StepModule", "Backbone"], function (require, exports, requestquote_wizard_module_confirmation_tpl, Utils, Configuration_1, Wizard_StepModule_1, Backbone) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: requestquote_wizard_module_confirmation_tpl,
        // @method present Override default implementation so when the modules is being rendered we set the salesorderid parameter into the url
        // @return {Void}
        present: function () {
            var confirmation = this.model.get('confirmation') || {};
            // store current order id in the hash so it is available even when the checkout process ends.
            var newHash = Utils.addParamsToUrl(Backbone.history.fragment, {
                quoteid: confirmation.internalid
            });
            Backbone.history.navigate(newHash, {
                trigger: false
            });
        },
        // @method getContext
        // @return {RequestQuoteWizard.Module.Confirmation.Context}
        getContext: function () {
            // @class RequestQuoteWizard.Module.Confirmation.Context
            return {
                // property {Model.Model} model
                model: this.model,
                // @property {String} quoteId
                quoteId: this.model.get('confirmation').internalid,
                // @property {String} quoteTranId
                quoteTranId: this.model.get('confirmation').tranid,
                // @property {String} contactBusinessDaysMessage
                contactBusinessDaysMessage: Configuration_1.Configuration.get('quote.contactBusinessDaysMessage', ''),
                // @property {String} disclaimer
                disclaimer: Configuration_1.Configuration.get('quote.disclaimer', ''),
                // @property {String} confirmationMessage
                confirmationMessage: this.options.message || this.wizard.getCurrentStep().confirmationMessage
            };
            // @class QuoteToSalesOrderWizard.Module.Confirmation
        }
    });
});

//# sourceMappingURL=RequestQuoteWizard.Module.Confirmation.js.map
