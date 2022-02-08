/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Impl.Core", ["require", "exports", "Utils", "jQuery", "Backbone"], function (require, exports, Utils, jQuery, Backbone) {
    "use strict";
    /*
    @module CMSadapter
    @class CMSadapter.Impl.Core the class that has the core integration using the CMS API.
    */
    var AdapterCore = function (application, CMS) {
        this.CMS = CMS;
        this.application = application;
        this.listenForCMS();
        this.init();
    };
    AdapterCore.prototype.init = jQuery.noop;
    AdapterCore.prototype.listenForCMS = jQuery.noop;
    AdapterCore.prototype.getSetupOptions = jQuery.noop;
    AdapterCore.prototype.getCmsContext = function getCmsContext() {
        var url = Backbone.history.fragment.split('?')[0];
        var path = Utils.correctURL(url);
        var siteSettings = this.wizard.application.getConfig().siteSettings || {};
        var context = {
            path: path,
            site_id: siteSettings.siteid,
            page_type: this.application.getLayout().currentView
                ? this.application.getLayout().currentView.el.id
                : ''
        };
        return context;
    };
    return AdapterCore;
});

//# sourceMappingURL=CMSadapter.Impl.Core.js.map
