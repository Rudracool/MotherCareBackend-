/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PickupInStore.FulfillmentOptions.View", ["require", "exports", "pickup_in_store_fulfillment_options.tpl", "Backbone.View"], function (require, exports, pickup_in_store_fulfillment_options_tpl, BackboneView) {
    "use strict";
    var PickupInStoreFulfillmentOptionsView = BackboneView.extend({
        // @property {Function} template
        template: pickup_in_store_fulfillment_options_tpl,
        // @method initialize
        initialize: function initialize(options) {
            this.model = options.model;
        },
        // @method getContext
        getContext: function getContext() {
            this.item = this.model;
            var stock_information = this.model.getStockInfo();
            var is_available_for_ship = this.item.get('_isBackorderable') || this.item.get('_isInStock');
            return {
                // @property {Boolean} isAvailableForShip
                isAvailableForShip: is_available_for_ship,
                // @property {Boolean} isAvailableForPickup
                isAvailableForPickup: stock_information.isAvailableForPickup
            };
        }
    });
    return PickupInStoreFulfillmentOptionsView;
});

//# sourceMappingURL=PickupInStore.FulfillmentOptions.View.js.map
