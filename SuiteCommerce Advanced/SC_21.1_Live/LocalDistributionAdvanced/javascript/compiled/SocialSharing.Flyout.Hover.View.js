/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SocialSharing.Flyout.Hover.View", ["require", "exports", "social_sharing_flyout_hover.tpl", "Backbone.View"], function (require, exports, social_sharing_flyout_hover_tpl, BackboneView) {
    "use strict";
    // @class SocialSharing.Flyout.Hover.View @extends Backbone.View
    var SocialSharingFlyoutHoverView = BackboneView.extend({
        template: social_sharing_flyout_hover_tpl,
        // @method getContext @returns {SocialSharing.Flyout.Hover.View.Context}
        getContext: function () {
            // @class SocialSharing.Flyout.Hover.View.Context
            return {};
        }
    });
    return SocialSharingFlyoutHoverView;
});

//# sourceMappingURL=SocialSharing.Flyout.Hover.View.js.map
