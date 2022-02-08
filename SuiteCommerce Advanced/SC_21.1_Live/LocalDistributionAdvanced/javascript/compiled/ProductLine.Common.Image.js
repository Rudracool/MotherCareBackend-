/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductLine.Common.Image", ["require", "exports", "underscore", "Utils", "Configuration"], function (require, exports, _, Utils, Configuration_1) {
    "use strict";
    return {
        // @method filterImages Given the tree-like object returned by
        // the Search API containing the item's images and a group of options,
        // filters the item images
        // @param {Object} item_images_detail
        // @param {Array<String>} image_option_filters
        // @return {Object} The same input parameters filtered based on the current
        // selection of the line/product taking into account the image option filters
        filterImages: function filterImages(item_images_detail, image_option_filters) {
            var self = this;
            var images_container = item_images_detail;
            var selected_option_filter;
            _.each(image_option_filters, function (image_filter) {
                selected_option_filter = self.get('options').findWhere({ cartOptionId: image_filter });
                // if the option/dimension has a value set
                if (selected_option_filter &&
                    selected_option_filter.get('value') &&
                    selected_option_filter.get('value').label) {
                    var label_1 = selected_option_filter.get('value').label.toLowerCase();
                    _.each(images_container, function (value, key) {
                        if (key.toLowerCase() === label_1) {
                            images_container = value;
                        }
                    });
                }
            });
            return images_container;
        },
        // @method getThumbnail Gets the thumbnail for the model based on the current selection
        // @return {ImageContainer}
        getThumbnail: function getThumbnail() {
            var item = this.get('item');
            var item_images_detail = item.get('itemimages_detail') || {};
            var image_filters = Configuration_1.Configuration.get('productline.multiImageOption', []);
            var images = [];
            var images_container = {};
            if (_.isEqual(item_images_detail, {}) &&
                item.get('_matrixParent').get('internalid') &&
                item.get('_matrixParent').get('itemimages_detail')) {
                item_images_detail = item.get('_matrixParent').get('itemimages_detail');
            }
            // If you generate a thumbnail position in the itemimages_detail it will be used
            if (item_images_detail.thumbnail) {
                images_container = this.filterImages(item_images_detail.thumbnail, image_filters);
                images = Utils.imageFlatten(images_container);
                return item.getFirstImage(images) || item_images_detail.thumbnail;
            }
            if (SC.ENVIRONMENT.siteType === 'STANDARD') {
                return item.getThumbnail();
            }
            item_images_detail = item_images_detail.media || item_images_detail;
            images_container = this.filterImages(item_images_detail, image_filters);
            images = Utils.imageFlatten(images_container);
            return images.length
                ? // If you using the advance images features it will grab the 1st one
                    item.getFirstImage(images)
                : // still nothing? image the not available
                    {
                        url: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/no_image_available.jpeg', Configuration_1.Configuration.get('imageNotAvailable')),
                        altimagetext: item.get('_name')
                    };
        }
    };
});

//# sourceMappingURL=ProductLine.Common.Image.js.map
