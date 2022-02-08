/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RecentlyViewedItems.View", ["require", "exports", "underscore", "recently_viewed_items.tpl", "recently_viewed_row.tpl", "recently_viewed_cell.tpl", "Utils", "Configuration", "Backbone.CollectionView", "ItemRelations.RelatedItem.View", "RecentlyViewedItems.Collection", "Backbone"], function (require, exports, _, recently_viewed_items_tpl, recently_viewed_row_tpl, recently_viewed_cell_tpl, Utils, Configuration_1, BackboneCollectionView, ItemRelationsRelatedItemView, RecentlyViewedItemsCollection, Backbone) {
    "use strict";
    var RecentlyViewedItemsView = BackboneCollectionView.extend({
        initialize: function () {
            var application = this.options.application;
            var layout = application.getLayout();
            var siteSettings = application.getConfig().siteSettings;
            var collection = siteSettings.sitetype === 'ADVANCED'
                ? RecentlyViewedItemsCollection.getInstance()
                : new Backbone.Collection();
            var self = this;
            BackboneCollectionView.prototype.initialize.call(this, {
                collection: collection,
                viewsPerRow: Infinity,
                cellTemplate: recently_viewed_cell_tpl,
                rowTemplate: recently_viewed_row_tpl,
                childView: ItemRelationsRelatedItemView,
                template: recently_viewed_items_tpl
            });
            layout.once('afterAppendView', self.loadRecentlyViewedItem, self);
        },
        loadRecentlyViewedItem: function loadRecentlyViewedItem() {
            var self = this;
            RecentlyViewedItemsCollection.getInstance().turnOnTracking();
            this.collection.promise &&
                this.collection.promise.done(function () {
                    var application = self.options.application;
                    var number_of_items_displayed = application.getConfig().siteSettings.sitetype === 'ADVANCED'
                        ? application.Configuration.get('recentlyViewedItems.numberOfItemsDisplayed')
                        : application.getConfig('recentlyViewedItems.numberOfItemsDisplayed');
                    self.collection = self.collection.first(parseInt(number_of_items_displayed));
                    self.render();
                    var carousel = self.$el.find('[data-type="carousel-items"]');
                    var _a = application.getConfig(), siteSettings = _a.siteSettings, imageSizeMapping = _a.imageSizeMapping;
                    if (Utils.isPhoneDevice() === false && siteSettings.imagesizes) {
                        var thumbnail = _.where(siteSettings.imagesizes, {
                            name: imageSizeMapping.thumbnail
                        })[0];
                        var img_min_height = thumbnail.maxheight;
                        carousel
                            .find('.item-relations-related-item-thumbnail')
                            .css('minHeight', img_min_height);
                    }
                    var itemspager = {
                        pager: true
                    };
                    Utils.initBxSlider(carousel, _.extend(Configuration_1.Configuration.bxSliderDefaults, itemspager));
                });
        }
    });
    return RecentlyViewedItemsView;
});

//# sourceMappingURL=RecentlyViewedItems.View.js.map
