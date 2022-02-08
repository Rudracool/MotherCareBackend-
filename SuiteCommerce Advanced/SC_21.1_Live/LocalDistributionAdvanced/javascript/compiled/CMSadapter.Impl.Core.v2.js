/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Impl.Core.v2", ["require", "exports", "Configuration", "CMSadapter.Impl.Core"], function (require, exports, Configuration_1, CMSadapterImplCore) {
    "use strict";
    /* global CMS: false */
    /*
    
    @module CMSadapter
    @class CMSadapter.Impl.Core.v2 the class that has the core integration using the CMS API v2.
    */
    var CMSadapterImplCore2 = function (application, CMS) {
        CMSadapterImplCore.call(this, application, CMS);
    };
    CMSadapterImplCore2.prototype = Object.create(CMSadapterImplCore.prototype);
    CMSadapterImplCore2.prototype.init = function init() {
        var self = this;
        this.application.getLayout().on('afterAppendView', function () {
            self.CMS.trigger('adapter:page:changed');
        });
        this.CMS.trigger('adapter:ready');
    };
    CMSadapterImplCore2.prototype.listenForCMS = function listenForCMS() {
        // CMS listeners - CMS tells us to do something, could fire anytime.
        var self = this;
        self.CMS.on('adapter:get:setup', function () {
            var setup = self.getSetupOptions(); // Config values the adapter can give the cms on startup. Currently nothing is used (cms ignores values).
            self.CMS.trigger('adapter:got:setup', setup);
        });
        self.CMS.on('adapter:get:context', function () {
            var context = self.getCmsContext();
            self.CMS.trigger('adapter:got:context', context);
        });
    };
    CMSadapterImplCore2.prototype.getSetupOptions = function getSetupOptions() {
        return {
            esc_to_login_disabled: Configuration_1.Configuration.get('cms.escToLoginDisabled', false),
            features: ['landingPages', 'categories', 'customerSegmentPreview']
        };
    };
    return CMSadapterImplCore2;
});

//# sourceMappingURL=CMSadapter.Impl.Core.v2.js.map
