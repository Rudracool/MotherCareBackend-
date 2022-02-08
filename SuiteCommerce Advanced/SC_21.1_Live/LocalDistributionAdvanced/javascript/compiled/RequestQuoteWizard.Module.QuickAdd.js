/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RequestQuoteWizard.Module.QuickAdd", ["require", "exports", "underscore", "requestquote_wizard_module_quickadd.tpl", "Utils", "jQuery", "Wizard.StepModule", "QuickAdd.View"], function (require, exports, _, requestquote_wizard_module_quickadd_tpl, Utils, jQuery, Wizard_StepModule_1, QuickAddView) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: requestquote_wizard_module_quickadd_tpl,
        // @property {errorCode: String, errorMessage:String} selectItemErrorMessage Specification of the error when no item is selected
        selectItemErrorMessage: {
            errorCode: 'ERR_RQW_SELECT_AN_ITEM',
            errorMessage: Utils.translate('Please select at least one item')
        },
        // @property {Array<String>} errors
        errors: ['ERR_RQW_SELECT_AN_ITEM'],
        // @method initialize Override default method to make this module composite
        // @return {Void}
        initialize: function () {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
        },
        // @method getItemQuantitySet Auxiliary method used to provide the amount of already added items into the transaction to the quick add component
        // @param {Number} item_id
        // @return {Number}
        getItemQuantitySet: function (item_id) {
            var selected_line = this.wizard.model.get('lines').find(function (line) {
                return line.get('item').id === item_id;
            });
            return selected_line ? parseInt(selected_line.get('quantity'), 10) : 0;
        },
        // @method addNewLine
        // @param {QuickAdd.View.SelectedLine.Properties} options
        // @return {Void}
        addNewLine: function (options) {
            var selected_line = this.wizard.model.get('lines').find(function (line) {
                // as line save child item it does not matter use getItemId or get('item')
                return line.get('item').id === options.selectedLine.get('item').id;
            });
            var price;
            if (!selected_line) {
                price = options.selectedLine.getPrice();
                options.selectedLine.set('rate', price.price);
                options.selectedLine.set('rate_formatted', price.price_formatted);
                this.wizard.model.get('lines').add(options.selectedLine, { at: 0 });
            }
            else {
                this.setLineIndex(selected_line, 0, this.wizard.model.get('lines'));
                selected_line.set('quantity', selected_line.get('quantity') + options.selectedLine.get('quantity'));
            }
        },
        // @method setLineIndex Sets a line in a particular position
        // @param {Transaction.Line.Model} selected_line
        // @param {Number} new_position
        // @param {Transaction.Line.Collection} collection
        // @return {Void}
        setLineIndex: function (selected_line, new_position, collection) {
            var old_index = _.indexOf(collection.models, selected_line);
            new_position = new_position || 0;
            collection.models.splice(old_index, 1);
            collection.models.splice(new_position, 0, selected_line);
        },
        // @property {ChildViews} childViews
        childViews: {
            QuickAddView: function () {
                this.quickAddViewComponent = new QuickAddView({
                    getItemQuantitySet: _.bind(this.getItemQuantitySet, this),
                    showBackorderable: true
                });
                this.quickAddViewComponent.on('selectedLine', this.addNewLine, this);
                return this.quickAddViewComponent;
            }
        },
        // @method isValid Check if there is at least one item selected
        // @return {jQuery.Deferred}
        isValid: function () {
            return this.wizard.model.get('lines').length
                ? jQuery.Deferred().resolve()
                : jQuery.Deferred().reject(this.selectItemErrorMessage);
        },
        // @method getContext
        // @return {RequestQuoteWizard.Module.QuickAdd.Context}
        getContext: function () {
            // @class RequestQuoteWizard.Module.QuickAdd.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header
            };
            // @class RequestQuoteWizard.Module.QuickAdd
        }
    });
});

//# sourceMappingURL=RequestQuoteWizard.Module.QuickAdd.js.map
