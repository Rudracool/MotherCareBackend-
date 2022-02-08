/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ImageNotAvailable", ["require", "exports", "Utils", "jQuery"], function (require, exports, Utils, jQuery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mountToApp(application) {
        // Every time a new view is rendered
        application.getLayout().on('afterAppendView', function (view) {
            // it will look at the img and bind the error event to it
            view.$('img').on('error', function () {
                var imageNotAvailable = application.getConfig().imageNotAvailable;
                // and haven't tried to changed it before, so we don't enter an infinite loop
                if (!this.errorCounter) {
                    var $this = jQuery(this);
                    var src = application.resizeImage(Utils.getThemeAbsoluteUrlOfNonManagedResources('img/no_image_available.jpeg', imageNotAvailable), Utils.getViewportWidth() < 768 ? 'thumbnail' : 'zoom');
                    // it will set the src of the img to the default image not available.
                    // You can set logic based on size or a class for displaying different
                    // urls if you need
                    $this
                        .attr('src', src)
                        // ImageLoader compatibility
                        .attr('data-image-status', 'done');
                    $this.parent('[data-zoom]').length && $this.parent('[data-zoom]').zoom();
                    this.errorCounter = true;
                }
            });
        });
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=ImageNotAvailable.js.map
