/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SocialSharing.Flyout.View", ["require", "exports", "social_sharing_flyout.tpl", "Backbone.View"], function (require, exports, social_sharing_flyout_tpl, BackboneView) {
    "use strict";
    // @class SocialSharing.Flyout.View @extends Backbone.View
    var SocialSharingFlyoutView = BackboneView.extend({
        template: social_sharing_flyout_tpl,
        // @method getContext @returns {SocialSharing.Flyout.View.Context}
        getContext: function () {
            // @class SocialSharing.Flyout.View.Context
            return {
            // @property {SiteSearch.Model} model
            // model: this.model
            };
        }
    });
    return SocialSharingFlyoutView;
});

//# sourceMappingURL=SocialSharing.Flyout.View.js.map
