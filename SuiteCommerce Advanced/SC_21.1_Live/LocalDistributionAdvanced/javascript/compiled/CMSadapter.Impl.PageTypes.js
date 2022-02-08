/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Impl.PageTypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CMSadapterPageTypes = /** @class */ (function () {
        function CMSadapterPageTypes(application, CMS) {
            this.application = application;
            this.CMS = CMS;
            this.listenForCMS();
        }
        CMSadapterPageTypes.prototype.listenForCMS = function () {
            var _this = this;
            this.CMS.on('pagetype:update', function (promise, page) {
                var pageTypeComponent = _this.application.getComponent('PageType');
                var pageType = pageTypeComponent._getPageType(page.name);
                pageType.set('template', page.layout);
                promise.resolve();
            });
        };
        return CMSadapterPageTypes;
    }());
    exports.CMSadapterPageTypes = CMSadapterPageTypes;
});

//# sourceMappingURL=CMSadapter.Impl.PageTypes.js.map
