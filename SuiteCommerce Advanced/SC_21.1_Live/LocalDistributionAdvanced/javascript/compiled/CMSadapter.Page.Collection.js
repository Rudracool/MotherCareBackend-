/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Page.Collection", ["require", "exports", "CMSadapter.Page.Model", "Backbone"], function (require, exports, CMSadapterPageModel, Backbone) {
    "use strict";
    return Backbone.Collection.extend({
        model: CMSadapterPageModel
    });
});

//# sourceMappingURL=CMSadapter.Page.Collection.js.map
