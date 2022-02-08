/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RequestQuoteWizard.Module.Items", ["require", "exports", "requestquote_wizard_module_items.tpl", "Wizard.StepModule", "Backbone.CollectionView", "Transaction.Line.Views.Cell.Actionable.Expanded.View", "RequestQuoteWizard.Module.Items.Line.Actions.View", "RequestQuoteWizard.Module.Items.Line.Quantity.View"], function (require, exports, requestquote_wizard_module_items_tpl, Wizard_StepModule_1, BackboneCollectionView, TransactionLineViewsCellActionableExpandedView, RequestQuoteWizardModuleItemsLineActionsView, RequestQuoteWizardModuleItemsLineQuantityView) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: requestquote_wizard_module_items_tpl,
        // @method initialize
        // @return {Void}
        initialize: function () {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            this.wizard.model.get('lines').on('add remove change', this.render, this);
        },
        // @property {Object} childViews
        childViews: {
            'Items.Collection': function (options) {
                return new BackboneCollectionView({
                    collection: this.model.get('lines'),
                    viewsPerRow: 1,
                    childView: TransactionLineViewsCellActionableExpandedView,
                    childViewOptions: {
                        navigable: true,
                        application: this.wizard.application,
                        SummaryView: RequestQuoteWizardModuleItemsLineQuantityView,
                        ActionsView: RequestQuoteWizardModuleItemsLineActionsView,
                        showAlert: false,
                        generalClass: options.generalClass || 'requestquote-wizard-module-items-item'
                    }
                });
            }
        },
        // @method getContext
        // @return {RequestQuoteWizard.Module.Items.Context}
        getContext: function () {
            // @class RequestQuoteWizard.Module.Items.Context
            return {
                // @property {Boolean} showTitle
                showTitle: !!(!this.options.hide_title && this.getTitle()),
                // @property {String} title
                title: this.getTitle(),
                // @property {Boolean} showHeaders
                showHeaders: !this.options.hideHeaders,
                // @property {Boolean} hasItems
                hasItems: !!this.wizard.model.get('lines').length
            };
            // @class RequestQuoteWizard.Model.Items
        },
        // @method destroy Override default implementation to detach form wizard's model events
        // @return {Void}
        destroy: function () {
            this.wizard.model.get('lines').off('add remove', this.render);
            Wizard_StepModule_1.WizardStepModule.prototype.destroy.apply(this, arguments);
        }
    });
});

//# sourceMappingURL=RequestQuoteWizard.Module.Items.js.map
