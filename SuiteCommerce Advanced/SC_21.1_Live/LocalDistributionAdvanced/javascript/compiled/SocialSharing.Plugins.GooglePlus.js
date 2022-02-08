/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SocialSharing.Plugins.GooglePlus", ["require", "exports", "underscore", "Configuration", "SocialSharing"], function (require, exports, _, Configuration_1, SocialSharing) {
    "use strict";
    // @class SocialSharing.GooglePlus @extends ApplicationModule
    var googleplusPlugin = {
        excludeFromMyAccount: true,
        // @method shareInGooglePlus opens a new window to share
        // the page in Google+ based on some configuration options
        shareInGooglePlus: function (url, popup_options) {
            var popup_options_string = this.getPopupOptionsStringFromObject(popup_options || Configuration_1.Configuration.get('googlePlus.popupOptions'));
            var target_url = 'https://plus.google.com/share?url=' + encodeURIComponent(url);
            window.open(target_url, _.uniqueId('window'), popup_options_string);
        },
        // @method shareInGooglePlusEventListener
        // calls shareInGooglePlus method passing the configuration options
        shareInGooglePlusEventListener: function (e) {
            e.preventDefault();
            var metaTagMappingOg = Configuration_1.Configuration.get('metaTagMappingOg');
            var url = metaTagMappingOg['og:url'](this);
            this.shareInGooglePlus(url);
        },
        mountToApp: function (application) {
            if (Configuration_1.Configuration.get('googlePlus.enable')) {
                var layout = application.getLayout();
                // This are mostly related to the dom, or to events, so we add them in the layout
                _.extend(layout, {
                    shareInGooglePlus: this.shareInGooglePlus
                });
                // extend Layout and add event listeners
                _.extend(layout.events, {
                    'click [data-action="share-in-google-plus"]': this.shareInGooglePlusEventListener
                });
                // @class SocialSharing.GooglePlus.Plugin @extends Plugin
                SocialSharing.afterAppendView.install({
                    name: 'googleplusPlugin',
                    priority: 10,
                    execute: function (application) {
                        var layout = application.getLayout();
                        layout.$el
                            .find('[data-type="social-share-icons"]')
                            .append('<a href="#" class="social-sharing-flyout-content-social-google" data-action="share-in-google-plus"><i class="social-sharing-flyout-content-social-google-icon"></i> <span>Google +</span></a>');
                    }
                });
            }
        }
    };
    return googleplusPlugin;
});

//# sourceMappingURL=SocialSharing.Plugins.GooglePlus.js.map
