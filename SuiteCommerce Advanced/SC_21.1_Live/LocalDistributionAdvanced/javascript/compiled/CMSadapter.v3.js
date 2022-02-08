/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.v3", ["require", "exports", "underscore", "CMSadapter.Impl.ThemeCustomizerPreview", "CMSadapter.Impl.PageTypes", "CMSadapter.Plugin.RecollectCMSSelectors", "CMSadapter.Plugin.PostRender", "CMSadapter", "CMSadapter.Impl.Core.v3", "CMSadapter.Impl.Landing.v3", "CMSadapter.Impl.Categories.v3", "CMSadapter.Impl.CustomContentType", "CMSadapter.Impl.Merchandising.v3", "CMSadapter.Page.Router", "CMSadapter.Page.Collection", "Backbone.CollectionView", "Backbone.View"], function (require, exports, _, CMSadapter_Impl_ThemeCustomizerPreview_1, CMSadapter_Impl_PageTypes_1, CMSadapter_Plugin_RecollectCMSSelectors_1, CMSadapter_Plugin_PostRender_1, CMSadapter, CMSadapterImplCore3, CMSadapterImplLanding3, CMSadapter_Impl_Categories_v3_1, CMSadapterImplCustomContentType, CMSadapterImplMerchandising3, CMSadapterPagePageRouter, CMSadapterPagePageCollection, BackboneCollectionView, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @class CMSadapter responsible of starting both the adapter implementation and cms landing pages router.
    // Assumes cms.js is already loaded
    // @extend ApplicationModule
    var CMSadapter3 = /** @class */ (function () {
        function CMSadapter3() {
            return _.extend({}, CMSadapter, {
                installBackboneViewPlugins: function installBackboneViewPlugins(application) {
                    BackboneView.postCompile.install(CMSadapter_Plugin_RecollectCMSSelectors_1.CMSadapterPluginRecollectCMSSelectorsGenerator(application));
                    BackboneView.postCompile.install(CMSadapter_Plugin_PostRender_1.CMSadapterPluginPostRender(application));
                    // adds support for CCTs on collection rows template
                    BackboneCollectionView.postRowCompile.install(CMSadapter_Plugin_RecollectCMSSelectors_1.CMSadapterPluginRecollectCMSSelectorsGenerator(application));
                    BackboneCollectionView.postRowCompile.install(CMSadapter_Plugin_PostRender_1.CMSadapterPluginPostRender(application));
                },
                initAdapterImpls: function initAdapterImpls(application, cmsObject, landingRouter) {
                    this.adapterLanding = new CMSadapterImplLanding3(application, cmsObject, landingRouter);
                    this.adapterCategories = new CMSadapter_Impl_Categories_v3_1.CMSadapterImplCategories3(application, cmsObject);
                    this.adapterCustomContentTypes = new CMSadapterImplCustomContentType(application, cmsObject);
                    this.adapterThemeCustomizerPreview = new CMSadapter_Impl_ThemeCustomizerPreview_1.CMSAdapterImplThemeCustomizerPreview(application, cmsObject);
                    this.adapterMerchandising = new CMSadapterImplMerchandising3(application, cmsObject);
                    this.adapterPageTypes = new CMSadapter_Impl_PageTypes_1.CMSadapterPageTypes(application, cmsObject);
                    // CMSadapterImplCore3 must be the last on been created, constructor triggers the "app:ready" event
                    this.adapterCore = new CMSadapterImplCore3(application, cmsObject);
                },
                // @method initPageRoutes Register the landing pages PageType and urls using bootstrapped data.
                initPageRoutes: function initPageRoutes(application) {
                    var pages = (SC.ENVIRONMENT.CMS && SC.ENVIRONMENT.CMS.pages && SC.ENVIRONMENT.CMS.pages.pages) ||
                        [];
                    var collection = new CMSadapterPagePageCollection(pages);
                    return new CMSadapterPagePageRouter(application, collection);
                }
            });
        }
        return CMSadapter3;
    }());
    exports.CMSadapter3 = CMSadapter3;
});

//# sourceMappingURL=CMSadapter.v3.js.map
