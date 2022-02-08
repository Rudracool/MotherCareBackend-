/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocatorAccessPoints", ["require", "exports", "ReferenceMap.Configuration", "StoreLocatorAccessPoints.HeaderLink.View", "Header.View", "Header.Menu.View"], function (require, exports, ReferenceConfiguration, StoreLocatorWizardHeaderLinkView, HeaderView, HeaderMenuView) {
    "use strict";
    // @class StoreLocatorAccessPoints @extend ApplicationModule
    var StoreLocatorAccessPoints = {
        excludeFromMyAccount: true,
        // @method mountToApp
        // @param {ApplicationSkeleton} application
        // @return {Void}
        mountToApp: function () {
            if (!ReferenceConfiguration.isEnabled()) {
                return;
            }
            HeaderView.addChildViews &&
                HeaderView.addChildViews({
                    StoreLocatorHeaderLink: function wrapperFunction() {
                        return function () {
                            return new StoreLocatorWizardHeaderLinkView({});
                        };
                    }
                });
            HeaderMenuView.addChildViews &&
                HeaderMenuView.addChildViews({
                    StoreLocatorHeaderLink: function wrapperFunction() {
                        return function () {
                            return new StoreLocatorWizardHeaderLinkView({
                                className: ' '
                            });
                        };
                    }
                });
        }
    };
    return StoreLocatorAccessPoints;
});

//# sourceMappingURL=StoreLocatorAccessPoints.js.map
