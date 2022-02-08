/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocator.List.View", ["require", "exports", "underscore", "store_locator_list.tpl", "Utils", "Configuration", "Backbone.View"], function (require, exports, _, store_locator_list_tpl, Utils, Configuration_1, BackboneView) {
    "use strict";
    // @class StoreLocator.List.View @extend Backbone.View
    var StoreLocatorListView = BackboneView.extend({
        template: store_locator_list_tpl,
        events: {
            'mouseover li': 'openMapInfoWindow'
        },
        // @method initialize
        initialize: function initialize(options) {
            this.reference_map = options.reference_map;
            this.index = options.index + 1;
            this.events = this.events || {};
        },
        // @method openMapInfoWindow
        // @return {void}
        openMapInfoWindow: function openMapInfoWindow() {
            if (this.reference_map.configuration.openPopupOnMouseOver() &&
                !Utils.isPhoneDevice() &&
                !Utils.isTabletDevice()) {
                var marker = _.findWhere(this.reference_map.points, {
                    store_id: this.model.get('internalid')
                });
                this.reference_map.showInfoWindow(marker, this.model, this.index);
            }
        },
        // @method getContext @returns StoreLocator.List.View.Context
        getContext: function getContext() {
            // @Class StoreLocator.List.View.Context
            return {
                // @property {{String}} storeName
                storeName: this.model.get('name'),
                // @property {{String}} storeDistance
                storeDistance: this.model.get('distance'),
                // @property {{String}} distanceUnit
                distanceUnit: this.model.get('distanceunit'),
                // @property {{String}} storeAddress
                storeAddress: this.model.get('address1'),
                // @property {{String}} storeId
                storeId: this.model.get('internalid'),
                // @property {{Number}} index
                index: this.index,
                // @property {{StoreLocation.Model}} model
                model: this.model,
                // @property {String} touchpoint
                touchpoint: Configuration_1.Configuration.get('siteSettings.isHttpsSupported') ? 'home' : 'storelocator'
            };
        }
    });
    return StoreLocatorListView;
});

//# sourceMappingURL=StoreLocator.List.View.js.map
