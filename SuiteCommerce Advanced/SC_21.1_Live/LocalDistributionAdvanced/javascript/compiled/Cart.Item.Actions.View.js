/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Cart.Item.Actions.View", ["require", "exports", "cart_item_actions.tpl", "Utils", "Configuration", "Backbone.View"], function (require, exports, cart_item_actions_tpl, Utils, Configuration_1, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: cart_item_actions_tpl,
        initialize: function () {
            this.application = this.options.application;
        },
        // @method getContext @return Cart.Item.Actions.View.Context
        getContext: function () {
            // @class Cart.Item.Actions.View.Context
            return {
                // @property {Model} line
                line: this.model,
                // @property {Item.Model} item
                item: this.model.get('item'),
                // @property {String} editUrl
                editUrl: Utils.addParamsToUrl(this.model.generateURL(), {
                    source: 'cart',
                    internalid: this.model.get('internalid')
                }),
                // @property {Boolean} isAdvanced
                isAdvanced: Configuration_1.Configuration.siteSettings.sitetype !== 'STANDARD',
                // @property {Boolean} showSaveForLateButton
                showSaveForLateButton: this.application.ProductListModule &&
                    this.application.ProductListModule.Utils.isProductListEnabled() &&
                    Configuration_1.Configuration.currentTouchpoint === 'home',
                // @property {String} lineId
                lineId: this.model.get('internalid'),
                // @property {Boolean} showQuantity
                showQuantity: this.model.get('item').get('_itemType') === 'GiftCert',
                // @property {Boolean} isEditable
                isEditable: !this.application.isStandalone()
            };
            // @class Cart.Item.Actions.View
        }
    });
});

//# sourceMappingURL=Cart.Item.Actions.View.js.map
