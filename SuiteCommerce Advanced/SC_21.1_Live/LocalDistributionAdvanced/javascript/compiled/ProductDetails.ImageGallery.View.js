/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductDetails.ImageGallery.View", ["require", "exports", "underscore", "product_details_image_gallery.tpl", "Utils", "Utilities.ResizeImage", "SocialSharing.Flyout.Hover.View", "Backbone.View", "zoom", "jQuery.bxSlider"], function (require, exports, _, product_details_image_gallery_tpl, Utils, resizeImage, SocialSharingFlyoutHoverView, BackboneView) {
    "use strict";
    // @class ProductDetails.ImageGallery.View @extends Backbone.View
    var ProductDetailsImageGalleryView = BackboneView.extend({
        template: product_details_image_gallery_tpl,
        initialize: function initialize() {
            BackboneView.prototype.initialize.apply(this, arguments);
            this.application = this.options.application;
            this.images = this.model.getImages();
            this.model.on('change', function () {
                var modelImages = this.model.getImages();
                var forceInitSlider = true;
                if (!_.isEqual(this.images, modelImages)) {
                    this.images = modelImages;
                    this.render();
                    this.initSliderZoom(forceInitSlider);
                }
            }, this);
            this.isZoomEnabled = SC.CONFIGURATION.isZoomEnabled;
            this.application.getLayout().on('afterAppendView', this.initSliderZoom, this);
        },
        initSliderZoom: function initSliderZoom(forceInit) {
            if (this.isZoomEnabled) {
                this.initZoom();
            }
            this.initSlider(forceInit);
        },
        // @method destroy
        // @returns {Void}
        destroy: function destroy() {
            this.model.off('change', this.render, this);
            this.application.getLayout().off('afterAppendView', this.initSliderZoom, this);
            this._destroy();
        },
        // @method initSlider Initialize the bxSlider
        // @return {Void}
        initSlider: function initSlider(forceInit) {
            if (this.images.length > 1 && (!this.$slider || forceInit === true)) {
                this.$slider = Utils.initBxSlider(this.$('[data-slider]'), {
                    buildPager: _.bind(this.buildSliderPager, this),
                    startSlide: 0,
                    adaptiveHeight: true,
                    touchEnabled: true,
                    nextText: '<a class="product-details-image-gallery-next-icon" data-action="next-image"></a>',
                    prevText: '<a class="product-details-image-gallery-prev-icon" data-action="prev-image"></a>',
                    controls: true
                });
                this.$('[data-action="next-image"]').off();
                this.$('[data-action="prev-image"]').off();
                this.$('[data-action="next-image"]').click(_.bind(this.nextImageEventHandler, this));
                this.$('[data-action="prev-image"]').click(_.bind(this.previousImageEventHandler, this));
            }
        },
        // @method previousImageEventHandler Handle the clicking over the previous button to show the previous main image. It does it by triggering a cancelable event.
        // @return {Void}
        previousImageEventHandler: function previousImageEventHandler() {
            var self = this;
            var current_index = self.$slider.getCurrentSlide();
            var next_index = current_index === 0 ? self.$slider.getSlideCount() - 1 : current_index - 1;
            // IMPORTANT This event is used to notify the ProductDetails.Component that the images have changed
            // @event {ProductDetails.ImageGallery.ChangeEvent} 'afterChangeImage
            self.model
                .cancelableTrigger('beforeChangeImage', {
                currentIndex: current_index,
                nextIndex: next_index
            })
                .then(function () {
                self.$slider.goToPrevSlide();
                self.model.cancelableTrigger('afterChangeImage', next_index);
            });
        },
        // @method nextImageEventHandler Handle the clicking over the next button to show the next main image. It does it by triggering a cancelable event
        // @return {Void}
        nextImageEventHandler: function nextImageEventHandler() {
            var self = this;
            var current_index = self.$slider.getCurrentSlide();
            var next_index = current_index === self.$slider.getSlideCount() - 1 ? 0 : current_index + 1;
            // IMPORTANT This event is used to notify the ProductDetails.Component that the images have changed
            // @event {ProductDetails.ImageGallery.ChangeEvent} beforeChangeImage
            self.model
                .cancelableTrigger('beforeChangeImage', 
            // @class ProductDetails.ImageGallery.ChangeEvent Image change event information container
            {
                // @property {Number} currentIndex
                currentIndex: current_index,
                // @property {Number} nextIndex
                nextIndex: next_index
            }
            // @class ProductDetails.ImageGallery.View
            )
                .then(function () {
                self.$slider.goToNextSlide();
                self.model.cancelableTrigger('afterChangeImage', next_index);
            });
        },
        // @property {ChildViews} childViews
        childViews: {
            'SocialSharing.Flyout.Hover': function () {
                return new SocialSharingFlyoutHoverView({});
            }
        },
        // @method initZoom If this.$Slider exists, the zoom script is already applied,
        // but it needs to be reapplied as the images in the slider may change due to product characteristics such as color.
        // @return {Void}
        initZoom: function () {
            var self = this;
            if (!SC.ENVIRONMENT.isTouchEnabled) {
                var images_1 = this.images;
                this.$('[data-zoom]:not(.bx-clone)').each(function (slide_index) {
                    self.$(this).zoom(resizeImage(images_1[slide_index].url, 'zoom'), slide_index);
                });
            }
        },
        // @method buildSliderPager
        // @param {Number} slide_index
        // @return {String}
        buildSliderPager: function (slide_index) {
            var image = this.images[slide_index];
            if (image) {
                return ('<img src="' +
                    resizeImage(image.url, 'tinythumb') +
                    '" alt="' +
                    image.altimagetext +
                    '">');
            }
        },
        // @method getContext
        // @returns {ProductDetails.ImageGallery.View.Context}
        getContext: function () {
            // @class ProductDetails.ImageGallery.View.Context
            return {
                // @property {String} imageResizeId
                imageResizeId: Utils.getViewportWidth() < 768 ? 'thumbnail' : 'main',
                // @property {Array<ImageContainer>} images
                images: this.images || [],
                // @property {ImageContainer} firstImage
                firstImage: this.images[0] || {},
                // @property {Boolean} showImages
                showImages: this.images.length > 0,
                // @property {Boolean} showImageSlider
                showImageSlider: this.images.length > 1
            };
            // @class ProductDetails.ImageGallery.View
        }
    });
    return ProductDetailsImageGalleryView;
});

//# sourceMappingURL=ProductDetails.ImageGallery.View.js.map
