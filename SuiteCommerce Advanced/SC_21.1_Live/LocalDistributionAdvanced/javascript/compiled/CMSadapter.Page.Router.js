/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Page.Router", ["require", "exports", "Utils", "CMSadapter.Landing.View", "Backbone", "Backbone.Model"], function (require, exports, Utils, CMSadapterLandingView, Backbone, BackboneModel) {
    "use strict";
    // @module CMSadapter
    // @class CMSadapter.Page.Router
    function CMSadapterPageRouter(application, collection) {
        this.application = application;
        this.allPages = collection;
        this.enhancedPages = new Backbone.Collection();
        this.initRouter();
    }
    CMSadapterPageRouter.prototype._addEnhancedPage = function _addEnhancedPage(page) {
        var url = page.get('urlPath') || page.get('url');
        var enhancedPage = this.enhancedPages.find(function (page) {
            return page.get('urlPath') === url || page.get('url') === url;
        });
        if (enhancedPage) {
            this.enhancedPages.remove(enhancedPage);
        }
        this.enhancedPages.add(page);
    };
    CMSadapterPageRouter.prototype.initRouter = function initRouter() {
        var pageType = this.application.getComponent('PageType');
        var self = this;
        this.allPages.each(function (page) {
            if (page.get('type') === 1) {
                var type = page.get('pageTypeName') || 'cms-landing-page';
                var url = page.get('urlPath') || page.get('url');
                pageType._addPage(page, type, url);
            }
            else {
                self._addEnhancedPage(page);
            }
        });
        pageType.registerPageType({
            name: 'cms-landing-page',
            view: CMSadapterLandingView,
            defaultTemplate: {
                name: 'cms_landing_page.tpl',
                displayName: 'Landing Pages Default',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-cms-landing.png')
            }
        });
    };
    // @method getPageForFragment
    // A handcrafted method for getting the page model given a url.
    CMSadapterPageRouter.prototype.getPageForFragment = function getPageForFragment() {
        var pageType = this.application.getComponent('PageType');
        var fragment = Backbone.history.fragment || '/';
        fragment = fragment.split('?')[0] || '/'; // remove options
        var page = pageType._getPage(fragment);
        if (!page) {
            page = this.enhancedPages.find(function (page) {
                return page.get('urlPath') === fragment || page.get('url') === fragment;
            });
        }
        return page;
    };
    CMSadapterPageRouter.prototype.addLandingRoute = function addLandingRoute(page, _originalUrl) {
        var pageType = this.application.getComponent('PageType');
        var type = page.pageTypeName || 'cms-landing-page';
        var url = page.urlPath || page.url;
        var model = new BackboneModel(page);
        if (model.get('type') === 1) {
            pageType._addPage(model, type, url);
            pageType.registerPageType({
                name: type || 'cms-landing-page',
                routes: [url, url + '?*options']
            });
        }
        else {
            this._addEnhancedPage(model);
        }
    };
    return CMSadapterPageRouter;
});

//# sourceMappingURL=CMSadapter.Page.Router.js.map
