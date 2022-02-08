/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Home", ["require", "exports", "home_cms.tpl", "Utils", "Home.View"], function (require, exports, home_cms_tpl, Utils, HomeView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.excludeFromMyAccount = true;
    // @class Home @extends ApplicationModule
    function mountToApp(application) {
        var homeCMSTemplate = home_cms_tpl;
        var pageType = application.getComponent('PageType');
        pageType.registerPageType({
            name: 'home-page',
            routes: ['', '?*params'],
            view: HomeView,
            defaultTemplate: {
                name: 'home.tpl',
                displayName: 'Home Default',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-home.png')
            }
        });
        pageType.registerTemplate({
            pageTypes: ['home-page'],
            template: {
                name: 'home_cms.tpl',
                displayName: 'Home CMS',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/cms-layout-home.png')
            }
        });
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=Home.js.map
