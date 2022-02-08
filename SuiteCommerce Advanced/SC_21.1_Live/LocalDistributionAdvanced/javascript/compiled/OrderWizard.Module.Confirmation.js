/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.Confirmation", ["require", "exports", "order_wizard_confirmation_module.tpl", "Utils", "Configuration", "Wizard.StepModule", "Tracker", "Backbone"], function (require, exports, order_wizard_confirmation_module_tpl, Utils, Configuration_1, Wizard_StepModule_1, Tracker, Backbone) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        template: order_wizard_confirmation_module_tpl,
        className: 'OrderWizard.Module.Confirmation',
        enhancedEcommercePage: true,
        render: function () {
            var confirmation = this.model.get('confirmation');
            // store current order id in the hash so it is available even when the checkout process ends.
            var new_hash;
            if (!Utils.parseUrlOptions(Backbone.history.fragment).last_order_id) {
                this.trackTransaction(confirmation);
                new_hash = Utils.addParamsToUrl(Backbone.history.fragment, {
                    last_order_id: confirmation.get('internalid')
                });
                Backbone.history.navigate(new_hash, {
                    trigger: false
                });
            }
            this.confirmation_number =
                confirmation.get('tranid') || confirmation.get('confirmationnumber');
            this.order_id = confirmation.get('internalid');
            this._render();
            if (!(this.model.get('confirmation') && this.model.get('confirmation').get('internalid'))) {
                this.$el.html('<h3>' + Utils.translate('Your Order has been placed') + '</h3>');
                this.$el.append('<p>' +
                    Utils.translate('Continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>. ') +
                    '</p>');
            }
        },
        // @method trackTransaction Convert the LiveOrder.Model into Track.Transaction.Model until we unified it with the Transaction.Model
        trackTransaction: function (confirmation) {
            var summary = confirmation.get('summary');
            var transaction = {
                confirmationNumber: confirmation.get('tranid'),
                subTotal: summary && summary.subtotal,
                total: summary && summary.total,
                taxTotal: summary && summary.taxtotal,
                shippingCost: summary && summary.shippingcost,
                handlingCost: summary && summary.handlingcost,
                products: new Backbone.Collection(),
                promocodes: confirmation.get('promocodes')
            };
            var transactionModel = new Backbone.Model(transaction);
            confirmation.get('lines').each(function (line) {
                var options = [];
                line.get('options').each(function (option) {
                    if (option.get('value').label) {
                        options.push(option.get('value').label);
                    }
                });
                transactionModel.get('products').add(new Backbone.Model({
                    name: line.get('item').get('_name'),
                    id: line.get('item').get('itemid'),
                    rate: line.get('rate'),
                    category: '/' + line.get('item').get('urlcomponent'),
                    options: options.sort().join(', '),
                    quantity: line.get('quantity')
                }));
            });
            Tracker.getInstance().trackTransaction(transactionModel);
        },
        // @method getContext @return OrderWizard.Module.Confirmation.Context
        getContext: function () {
            var continue_url = '/';
            var touchpoint = true;
            if (Configuration_1.Configuration.get('siteSettings.iswsdk') &&
                Configuration_1.Configuration.get('siteSettings.wsdkcancelcarturl')) {
                continue_url = Configuration_1.Configuration.get('siteSettings.wsdkcancelcarturl');
                touchpoint = false;
            }
            // @class OrderWizard.Module.Confirmation.Context
            return {
                // @property {String} continueURL
                continueURL: continue_url,
                // @property {Boolean} isGuestAndCustomerCenter
                isGuestAndCustomerCenter: !!(this.wizard.profileModel.get('isGuest') === 'F' &&
                    Configuration_1.Configuration.get('siteSettings.touchpoints.customercenter')),
                // @property {String} additionalConfirmationMessage
                additionalConfirmationMessage: this.options.additional_confirmation_message,
                // @property {Boolean} touchPoint
                touchPoint: touchpoint,
                // @property {String} confirmationNumber
                confirmationNumber: this.confirmation_number,
                // @property {Number} orderId
                orderId: this.order_id,
                // @property {String} pdfUrl
                pdfUrl: Utils.getDownloadPdfUrl({
                    asset: 'order-details',
                    id: this.order_id
                })
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.Confirmation.js.map
