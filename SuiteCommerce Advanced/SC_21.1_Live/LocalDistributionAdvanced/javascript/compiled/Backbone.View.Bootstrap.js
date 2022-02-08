/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.View.Bootstrap", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function backboneViewBootstrap(_$el, view) {
        if (!_.result(SC, 'isPageGenerator')) {
            if (view.$('[data-toggle="tooltip"]').length != 0)
                view.$('[data-toggle="tooltip"]').tooltip({ html: true });
            view.$('[data-toggle="dropdown"]').dropdown();
            // view.$('[data-toggle="collapse"]').collapse();
        }
    }
    exports.backboneViewBootstrap = backboneViewBootstrap;
});

//# sourceMappingURL=Backbone.View.Bootstrap.js.map
