/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PageType.Collection", ["require", "exports", "PageType.Model", "Utils", "Backbone"], function (require, exports, PageType_Model_1, Utils, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageTypeCollection = Backbone.Collection.extend({
        cacheSupport: false,
        url: Utils.getAbsoluteUrl('services/PageType.Service.ss'),
        model: PageType_Model_1.PageTypeModel,
        parse: function (data) {
            return data.pageTypes;
        }
    });
});

//# sourceMappingURL=PageType.Collection.js.map
