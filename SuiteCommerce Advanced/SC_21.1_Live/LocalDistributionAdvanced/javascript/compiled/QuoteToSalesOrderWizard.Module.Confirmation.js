/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuoteToSalesOrderWizard.Module.Confirmation", ["require", "exports", "quote_to_salesorder_wizard_module_confirmation.tpl", "Utils", "Configuration", "Wizard.StepModule", "Backbone"], function (require, exports, quote_to_salesorder_wizard_module_confirmation_tpl, Utils, Configuration_1, Wizard_StepModule_1, Backbone) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: quote_to_salesorder_wizard_module_confirmation_tpl,
        // @method present Override default implementation so when the modules is being rendered we set the salesorderid parameter into the url
        // @return {Void}
        present: function () {
            var confirmation = this.model.get('confirmation') || new Backbone.Model();
            // store current order id in the hash so it is available even when the checkout process ends.
            var newHash = Utils.addParamsToUrl(Backbone.history.fragment, {
                salesorderid: confirmation.get('internalid')
            });
            Backbone.history.navigate(newHash, {
                trigger: false
            });
        },
        // @method getContext
        // @return {OrderWizard.Module.Confirmation.Context}
        getContext: function () {
            // @class OrderWizard.Module.Confirmation.Context
            return {
                // property {QuoteToSalesOrder.Model} model
                model: this.model,
                // @property {String} orderId
                orderId: this.model.get('confirmation').get('internalid'),
                // @property {String} orderNumber
                orderNumber: this.model.get('confirmation').get('tranid'),
                // @property {Boolen} hasSalesrep
                hasSalesrep: !!this.model.get('quoteDetails').salesrep.internalid,
                // @property {String} salesrepPhone
                salesrepPhone: this.model.get('quoteDetails').salesrep.phone
                    ? this.model.get('quoteDetails').salesrep.phone
                    : Configuration_1.Configuration.get('quote.defaultPhone', ''),
                // @property {String} salesrepEmail
                salesrepEmail: this.model.get('quoteDetails').salesrep.email
                    ? this.model.get('quoteDetails').salesrep.email
                    : Configuration_1.Configuration.get('quote.defaultEmail', ''),
                // @property {String} disclaimer
                disclaimer: Configuration_1.Configuration.get('quote.disclaimer', '')
            };
            // @class QuoteToSalesOrderWizard.Module.Confirmation
        }
    });
});

//# sourceMappingURL=QuoteToSalesOrderWizard.Module.Confirmation.js.map
