/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.AddOn.Quantity.Amount.View", ["require", "exports", "underscore", "subscriptions_addon_quantity_amount.tpl", "Backbone.View"], function (require, exports, _, template, BackboneView) {
    "use strict";
    var SubscriptionsAddOnQuantityAmountView = BackboneView.extend({
        template: template,
        events: {
            'click [data-action="plus"]': 'addQuantity',
            'click [data-action="minus"]': 'subQuantity',
            'change [data-type="quantity-input"]': 'changeQuantity',
            'keypress [data-type="quantity-input"]': 'changeQuantity'
        },
        initialize: function () {
            this.$('[data-type="quantity-input"]').value = this.model.get('quantity');
        },
        // @method addQuantity Add 1 the current to quantity-input field
        // @param {jQuery.Event} e
        // @return {Void}
        addQuantity: function (e) {
            e.preventDefault();
            var old_quantity = parseInt(this.$('[data-type="quantity-input"]').val(), 10);
            this.new_quantity = old_quantity + 1;
            if (this.new_quantity !== old_quantity) {
                var $element = this.$(e.target);
                var quantity_input = $element.parent().find('input');
                quantity_input.val(this.new_quantity);
                quantity_input.change();
                this.setQuantity();
            }
        },
        // @method subQuantity Subtracts 1 from quantity-input field
        // @param {jQuery.Event} e
        // @return {Void}
        subQuantity: function (e) {
            e.preventDefault();
            var old_quantity = parseInt(this.$('[data-type="quantity-input"]').val(), 10);
            this.new_quantity = old_quantity - 1;
            if (this.new_quantity !== old_quantity && this.new_quantity >= 1) {
                var $element = this.$(e.target);
                var quantity_input = $element.parent().find('input');
                quantity_input.val(this.new_quantity);
                quantity_input.change();
                this.setQuantity();
            }
        },
        // @method changeQuantity Debounce callings to setQuantity function to prevent losing focus
        // @param {jQuery.Event} e
        // @return {Void}
        changeQuantity: _.debounce(function () {
            this.setQuantity();
        }, 1000),
        // @method setQuantity Updates the model quantity and the input field.
        // @return {Void}
        setQuantity: function () {
            var str_quantity = this.$('[data-type="quantity-input"]').val();
            var quantity = Math.round(parseFloat(str_quantity));
            if (!_.isNaN(quantity) && _.isNumber(quantity) && quantity > 0) {
                this.isMinusButtonDisabled = quantity <= 1;
                if (!this.model.has('initialQuantity')) {
                    this.model.set('initialQuantity', this.model.get('quantity'));
                }
                this.model.set('quantity', quantity);
            }
        },
        // @method getContext @returns {Overview.Banner.View.Context}
        getContext: function () {
            // @class Overview.Banner.View.Context
            return {
                // @property {bool} isMinusButtonDisabled
                isMinusButtonDisabled: this.isMinusButtonDisabled,
                quantity: this.model.get('quantity'),
                isReadOnly: this.model.isReadOnly()
            };
        }
    });
    return SubscriptionsAddOnQuantityAmountView;
});

//# sourceMappingURL=Subscriptions.AddOn.Quantity.Amount.View.js.map
