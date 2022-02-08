/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PageType.Router", ["require", "exports", "Backbone"], function (require, exports, Backbone) {
    "use strict";
    return Backbone.Router.extend({
        initialize: function (application) {
            this.application = application;
        }
    });
});

//# sourceMappingURL=PageType.Router.js.map
