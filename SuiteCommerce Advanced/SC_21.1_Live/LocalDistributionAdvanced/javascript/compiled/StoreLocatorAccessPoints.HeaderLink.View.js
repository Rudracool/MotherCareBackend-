/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocatorAccessPoints.HeaderLink.View", ["require", "exports", "storelocator_accesspoints_headerlink.tpl", "Configuration", "ReferenceMap.Configuration", "Backbone.View"], function (require, exports, storelocator_accesspoints_headerlink_tpl, Configuration_1, ReferenceConfiguration, BackboneView) {
    "use strict";
    // @class StoreLocatorAccessPoints.HeaderLink.View @extend Backbone.View
    var StoreLocatorAccessPointsHeaderLinkView = BackboneView.extend({
        // @property {Function} template
        template: storelocator_accesspoints_headerlink_tpl,
        // @method getContext
        // @return {StoreLocatorAccessPoints.HeaderLink.View.Context}
        getContext: function () {
            // @class StoreLocatorAccessPoints.HeaderLink.View.Context
            return {
                // @Property {String} title
                title: ReferenceConfiguration.title(),
                // @property {Boolean} hasClass
                hasClass: !!this.options.className,
                // @property {String} className
                className: this.options.className,
                // @property {String} touchpoint
                touchpoint: Configuration_1.Configuration.get('siteSettings.isHttpsSupported') ? 'home' : 'storelocator'
            };
            // @class StoreLocatorAccessPoints.HeaderLink.View
        }
    });
    return StoreLocatorAccessPointsHeaderLinkView;
});

//# sourceMappingURL=StoreLocatorAccessPoints.HeaderLink.View.js.map
