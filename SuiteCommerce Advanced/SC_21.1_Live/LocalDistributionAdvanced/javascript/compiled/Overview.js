/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Overview", ["require", "exports", "Utils", "Overview.Home.View", "Overview.Home.Standalone.View"], function (require, exports, Utils, OverviewHomeView, OverviewHomeStandaloneView) {
    "use strict";
    // @class Overview @extends ApplicationModule
    var Overview = {
        mountToApp: function (application) {
            var isStandalone = application.isStandalone();
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'MyAccountOverview',
                routes: ['', '?*params', 'overview', 'overview?*params'],
                view: isStandalone ? OverviewHomeStandaloneView : OverviewHomeView,
                defaultTemplate: {
                    name: 'overview_home.tpl',
                    displayName: 'My Account Overview Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-myaccount-overview.png')
                }
            });
        }
    };
    return Overview;
});

//# sourceMappingURL=Overview.js.map
