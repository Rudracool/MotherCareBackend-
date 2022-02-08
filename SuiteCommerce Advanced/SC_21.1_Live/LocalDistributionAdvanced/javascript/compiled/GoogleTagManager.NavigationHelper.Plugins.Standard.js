/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GoogleTagManager.NavigationHelper.Plugins.Standard", ["require", "exports", "jQuery", "Tracker", "Backbone.Model"], function (require, exports, jQuery, Tracker, BackboneModel) {
    "use strict";
    return {
        // @method mouseClickNavigation Handle standard mouseClick event
        // @param {ApplicationSkeleton.Layout} layout General application layout
        // @param {jQuery.Event} e jQuery event
        // @return {jQuery.Event} e
        mouseDownNavigation: function (_layout, e) {
            var $item = jQuery(e.currentTarget).closest('[itemprop="itemListElement"]');
            if ($item.length) {
                var category = $item.data('track-productlist-category');
                if (category) {
                    var item = {
                        category: category,
                        position: $item.data('track-productlist-position'),
                        list: $item.data('track-productlist-list'),
                        sku: $item.data('sku'),
                        itemId: $item.data('item-id'),
                        name: $item.find('[itemprop="name"]').text(),
                        price: $item.find('[itemprop="price"]').data('rate')
                    };
                    Tracker.getInstance().trackProductClick(new BackboneModel(item));
                }
            }
            return e;
        }
    };
});

//# sourceMappingURL=GoogleTagManager.NavigationHelper.Plugins.Standard.js.map
