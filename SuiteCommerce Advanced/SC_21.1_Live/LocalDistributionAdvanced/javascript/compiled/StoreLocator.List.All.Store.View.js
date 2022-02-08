/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocator.List.All.Store.View", ["require", "exports", "store_locator_list_all_store.tpl", "Configuration", "Backbone.View"], function (require, exports, store_locator_list_all_store_tpl, Configuration_1, BackboneView) {
    "use strict";
    var StoreLocatorListAllStoreView = BackboneView.extend({
        template: store_locator_list_all_store_tpl,
        // @method initialize
        // @param {Object} options
        initialize: function initialize(options) {
            this.index = options.index;
        },
        // @method getContext
        // @return StoreLocator.ListAll.Store.View.Context
        getContext: function getContext() {
            return {
                // @property {String} name
                name: this.model.get('name'),
                // @property {String} storeId
                storeId: this.model.get('internalid'),
                // @property {String} touchpoint
                touchpoint: Configuration_1.Configuration.get('siteSettings.isHttpsSupported') ? 'home' : 'storelocator'
            };
        }
    });
    return StoreLocatorListAllStoreView;
});

//# sourceMappingURL=StoreLocator.List.All.Store.View.js.map
