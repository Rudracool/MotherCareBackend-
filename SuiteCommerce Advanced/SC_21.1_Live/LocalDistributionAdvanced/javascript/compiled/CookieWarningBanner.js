/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CookieWarningBanner", ["require", "exports", "Header.View", "CookieWarningBanner.View"], function (require, exports, HeaderView, CookieWarningBannerView) {
    "use strict";
    // @class CookieWarningBanner
    // @extends ApplicationModule
    var CookieWarningBanner = {
        mountToApp: function (application) {
            // Set the request a quote link on the Desktop header
            HeaderView.addChildViews({
                'Message.Placeholder': function wrapperFunction() {
                    return function () {
                        return new CookieWarningBannerView({ application: application });
                    };
                }
            });
        }
    };
    return CookieWarningBanner;
});

//# sourceMappingURL=CookieWarningBanner.js.map
