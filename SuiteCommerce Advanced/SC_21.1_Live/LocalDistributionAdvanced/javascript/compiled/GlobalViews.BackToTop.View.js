/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GlobalViews.BackToTop.View", ["require", "exports", "global_views_back_to_top.tpl", "jQuery", "Backbone.View"], function (require, exports, global_views_back_to_top_tpl, jQuery, BackboneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @class GlobalViews.BackToTop.View @extends Backbone.View
    exports.GlobalViewsBackToTopView = BackboneView.extend({
        template: global_views_back_to_top_tpl,
        events: {
            'click [data-action="back-to-top"]': 'backToTop'
        },
        // @method backToTop
        backToTop: function () {
            jQuery('html, body').animate({ scrollTop: '0px' }, 300);
        }
    });
});

//# sourceMappingURL=GlobalViews.BackToTop.View.js.map
