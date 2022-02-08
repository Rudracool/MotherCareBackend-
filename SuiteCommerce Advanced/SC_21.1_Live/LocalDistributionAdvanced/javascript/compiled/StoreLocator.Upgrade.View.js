/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocator.Upgrade.View", ["require", "exports", "store_locator_upgrade.tpl", "Backbone.View"], function (require, exports, store_locator_upgrade, BackboneView) {
    "use strict";
    var StoreLocatorUpgradeView = BackboneView.extend({
        template: store_locator_upgrade,
        // @property {Object} attributes
        attributes: {
            id: 'StoreLocatorUpgrade',
            class: 'StoreLocatorUpgrade'
        },
        // @method initialize
        // @param {Object} options
        initialize: function initialize(options) {
            this.application = options.application;
        }
    });
    return StoreLocatorUpgradeView;
});

//# sourceMappingURL=StoreLocator.Upgrade.View.js.map
