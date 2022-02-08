/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CookieWarningBanner.View", ["require", "exports", "cookie_warning_banner_view.tpl", "Configuration", "Backbone.View", "js.cookie"], function (require, exports, cookie_warning_banner_view_tpl, Configuration_1, BackboneView, Cookies) {
    "use strict";
    // @class CookieWarningBanner.View @extend Backbone.View
    var CookieWarningBannerView = BackboneView.extend({
        template: cookie_warning_banner_view_tpl,
        events: {
            'click [data-action="close-message"]': 'closeMessage'
        },
        // @return {Void}
        initialize: function initialize() {
            BackboneView.prototype.initialize.apply(this, arguments);
        },
        // @method closeMessage Event handle for the close action
        closeMessage: function closeMessage() {
            Cookies.set('isCookieWarningClosed', true, { expires: 365 });
        },
        // @method showBanner Indicate if this current message should be shown or not
        // @return {Boolean}
        showBanner: function showBanner() {
            return (Configuration_1.Configuration.get('siteSettings.showcookieconsentbanner') === 'T' &&
                !(Configuration_1.Configuration.get('cookieWarningBanner.saveInCookie', false) &&
                    Cookies.get('isCookieWarningClosed')));
        },
        // @method getContext
        // @return {CookieWarningBanner.View.Context}
        getContext: function getContext() {
            // @class CookieWarningBanner.View.Context
            return {
                // @property {Boolean} showBanner
                showBanner: this.showBanner(),
                // @property {String} cookieMessage
                cookieMessage: Configuration_1.Configuration.get('cookieWarningBanner.message', ''),
                // @property {Boolean} showLink
                showLink: !!Configuration_1.Configuration.get('siteSettings.cookiepolicy', false),
                // @property {String} linkHref
                linkHref: Configuration_1.Configuration.get('siteSettings.cookiepolicy', false),
                // @property {String} linkContent
                linkContent: Configuration_1.Configuration.get('cookieWarningBanner.anchorText', ''),
                // @property {Boolean} showLink
                closable: Configuration_1.Configuration.get('cookieWarningBanner.closable', true)
            };
            // @class CookieWarningBanner.View
        }
    });
    return CookieWarningBannerView;
});

//# sourceMappingURL=CookieWarningBanner.View.js.map
