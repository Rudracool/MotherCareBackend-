/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter", ["require", "exports", "jQuery", "Configuration", "CMSadapter.Impl.Enhanced", "CMSadapter.Component", "Backbone"], function (require, exports, jQuery, Configuration_1, CMSadapterImplEnhanced, CMSadapterComponent, Backbone) {
    "use strict";
    return {
        mountAdapter: function (application) {
            if (Configuration_1.Configuration.get('cms.useCMS')) {
                application.registerComponent(CMSadapterComponent(application));
                var routes = this.initPageRoutes(application);
                this.adapterEnhanced = new CMSadapterImplEnhanced(application, routes);
                this.installBackboneViewPlugins(application);
                if (Configuration_1.Configuration.get('cms.adapterVersion') === '2' || SC.isDevelopment) {
                    this.loadScript(application, routes);
                }
                else {
                    this.initAdapter(application, routes);
                }
            }
            return this.postMountAdapter(application);
        },
        loadScript: function loadScript(application, routes) {
            var self = this;
            jQuery
                .getScript('/cms/' + Configuration_1.Configuration.get('cms.adapterVersion') + '/cms.js')
                .done(function () {
                self.initAdapter(application, routes);
            });
        },
        initAdapter: function initAdapter(application, landingRouter) {
            if (typeof CMS !== 'undefined') {
                this.initAdapterImpls(application, CMS, landingRouter);
                Backbone.trigger('cms:loaded', CMS);
            }
        },
        initPageRoutes: jQuery.noop,
        installBackboneViewPlugins: jQuery.noop,
        initAdapterImpls: jQuery.noop,
        postMountAdapter: jQuery.noop
    };
});

//# sourceMappingURL=CMSadapter.js.map
