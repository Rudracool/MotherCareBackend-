/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Overview.Banner.View", ["require", "exports", "underscore", "overview_banner.tpl", "Configuration", "Backbone.View"], function (require, exports, _, overview_banner_tpl, Configuration_1, BackboneView) {
    "use strict";
    var OverviewBannerView = BackboneView.extend({
        template: overview_banner_tpl,
        initialize: function () { },
        // @method getContext @returns {Overview.Banner.View.Context}
        getContext: function () {
            var bannersConfig = Configuration_1.Configuration.get('overview.homeBanners');
            var banners = _.isArray(bannersConfig) ? bannersConfig : [bannersConfig];
            var random_banner = banners[Math.floor(Math.random() * banners.length)];
            // @class Overview.Banner.View.Context
            return {
                // @property {Boolean} hasBanner
                hasBanner: !!random_banner,
                // @property {Boolean} hasLink
                hasLink: !!(random_banner && random_banner.linkUrl),
                // @property {String} linkUrl
                linkUrl: random_banner && random_banner.linkUrl,
                // @property {String} linkTarget
                linkTarget: random_banner && random_banner.linkTarget,
                // @property {String} imageSource
                imageSource: random_banner && random_banner.imageSource
            };
        }
    });
    return OverviewBannerView;
});

//# sourceMappingURL=Overview.Banner.View.js.map
