/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Home.View", ["require", "exports", "underscore", "home.tpl", "Utils", "jQuery", "Configuration", "Tracker", "Backbone", "Backbone.View"], function (require, exports, _, home_tpl, Utils, jQuery, Configuration_1, Tracker, Backbone, BackboneView) {
    "use strict";
    // @module Home.View @extends Backbone.View
    var HomeView = BackboneView.extend({
        template: home_tpl,
        title: Utils.translate('Welcome to the store'),
        page_header: Utils.translate('Welcome to the store'),
        attributes: {
            id: 'home-page',
            class: 'home-page'
        },
        events: {
            'click [data-action=slide-carousel]': 'carouselSlide'
        },
        initSlider: function initSlider() {
            Utils.initBxSlider(this.$('[data-slider]'), {
                nextText: '<a class="home-gallery-next-icon"></a>',
                prevText: '<a class="home-gallery-prev-icon"></a>'
            });
        },
        initialize: function () {
            this.windowWidth = jQuery(window).width();
            this.options.application.getLayout().on('afterAppendView', this.initSlider, this);
            this.options.application.getLayout().once('afterAppendView', function () {
                Tracker.getInstance().trackHomePageview('/' + Backbone.history.fragment);
            }, this);
            var windowResizeHandler = _.throttle(function () {
                if (Utils.getDeviceType(this.windowWidth) ===
                    Utils.getDeviceType(jQuery(window).width())) {
                    return;
                }
                this.showContent();
                Utils.resetViewportWidth();
                this.windowWidth = jQuery(window).width();
            }, 1000);
            this._windowResizeHandler = _.bind(windowResizeHandler, this);
            jQuery(window).on('resize', this._windowResizeHandler);
        },
        destroy: function () {
            BackboneView.prototype.destroy.apply(this, arguments);
            jQuery(window).off('resize', this._windowResizeHandler);
            this.options.application.getLayout().off('afterAppendView', this.initSlider, this);
        },
        // @method getContext @return Home.View.Context
        getContext: function () {
            var carouselImages = _.map(Configuration_1.Configuration.get('home.carouselImages', []), function (url) {
                return Utils.getAbsoluteUrlOfNonManagedResources(url);
            });
            var bottomBannerImages = _.map(Configuration_1.Configuration.get('home.bottomBannerImages', []), function (url) {
                return Utils.getAbsoluteUrlOfNonManagedResources(url);
            });
            return {
                // @class Home.View.Context
                // @property {String} imageResizeId
                imageHomeSize: Utils.getViewportWidth() < 768 ? 'homeslider' : 'main',
                // @property {String} imageHomeSizeBottom
                imageHomeSizeBottom: Utils.getViewportWidth() < 768 ? 'homecell' : 'main',
                // @property {Array} carouselImages
                carouselImages: carouselImages,
                // @property {Array} bottomBannerImages
                bottomBannerImages: bottomBannerImages
                // @class Home.View
            };
        }
    });
    return HomeView;
});

//# sourceMappingURL=Home.View.js.map
