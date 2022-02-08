/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.v2", ["require", "exports", "underscore", "CMSadapter", "CMSadapter.Impl.Core.v2", "CMSadapter.Impl.Landing.v2", "CMSadapter.Impl.Categories.v2", "CMSadapter.Impl.Merchandising.v2", "CMSadapter.Page.Router", "CMSadapter.Page.Collection"], function (require, exports, _, CMSadapter, CMSadapterImplCore2, CMSadapterImplLanding2, CMSadapterImplCategories2, CMSadapterImplMerchandising2, CMSadapterPagePageRouter, CMSadapterPagePageCollection) {
    "use strict";
    return _.extend({}, CMSadapter, {
        initAdapterImpls: function initAdapterImpls(application, cmsObject, landingRouter) {
            this.adapterCore = new CMSadapterImplCore2(application, cmsObject);
            this.adapterLanding = new CMSadapterImplLanding2(application, cmsObject, landingRouter);
            this.adapterCategories = new CMSadapterImplCategories2(application, cmsObject);
            this.adapterMerchandising = new CMSadapterImplMerchandising2(application, cmsObject);
        },
        // @method initPageRoutes Register the landing pages PageType and urls using bootstrapped data.
        initPageRoutes: function initPageRoutes(application) {
            var pages = (SC.ENVIRONMENT.CMS && SC.ENVIRONMENT.CMS.pages && SC.ENVIRONMENT.CMS.pages.pages) ||
                [];
            var collection = new CMSadapterPagePageCollection(pages);
            return new CMSadapterPagePageRouter(application, collection);
        }
    });
});

//# sourceMappingURL=CMSadapter.v2.js.map
