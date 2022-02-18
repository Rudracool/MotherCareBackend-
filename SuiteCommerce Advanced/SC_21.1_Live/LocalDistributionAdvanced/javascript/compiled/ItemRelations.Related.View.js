/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ItemRelations.Related.View", ["require", "exports", "underscore", "item_relations_related.tpl", "item_relations_row.tpl", "item_relations_cell.tpl", "Utils", "Configuration", "jQuery", "Backbone.CollectionView", "ItemRelations.RelatedItem.View", "ItemRelations.Related.Collection", "Tracker", "Backbone"], function (require, exports, _, item_relations_related_tpl, item_relations_row_tpl, item_relations_cell_tpl, Utils, Configuration_1, jQuery, BackboneCollectionView, ItemRelationsRelatedItemView, ItemRelationsRelatedCollection, Tracker, Backbone) {
    "use strict";
    var ItemRelationsRelatedView = BackboneCollectionView.extend({
        initialize: function () {
            var siteSettings = this.options.application.getConfig().siteSettings;
            this.is_sca_advance = siteSettings.sitetype === 'ADVANCED';
            var collection = this.is_sca_advance
                ? new ItemRelationsRelatedCollection({ itemsIds: this.options.itemsIds })
                : new Backbone.Collection();
            BackboneCollectionView.prototype.initialize.call(this, {
                collection: collection,
                viewsPerRow: Infinity,
                cellTemplate: item_relations_cell_tpl,
                rowTemplate: item_relations_row_tpl,
                childView: ItemRelationsRelatedItemView,
                template: item_relations_related_tpl
            });
            this.view_tracked = false;
            this.loadRelatedItem();
        },
        render: function () {
            BackboneCollectionView.prototype.render.call(this);
            if (this.is_sca_advance) {
                var layout = this.options.application.getLayout();
                if (!jQuery.contains(document.documentElement, this.$el[0])) {
                    layout.once('afterAppendView', this.carouselInitialize, this);
                }
                else {
                    this.carouselInitialize();
                }
            }
            return this;
        },
        carouselInitialize: function carouselInitialize() {
            var _a = this.options.application.getConfig(), siteSettings = _a.siteSettings, imageSizeMapping = _a.imageSizeMapping;
            var carousel = this.$el.find('[data-type="carousel-items"]');
            if (carousel.length > 0) {
                if (Utils.isPhoneDevice() === false && (siteSettings.imagesizes || false)) {
                    var img_min_height = _.where(siteSettings.imagesizes || [], {
                        name: imageSizeMapping.thumbnail || ''
                    })[0].maxheight;
                    carousel
                        .find('.item-relations-related-item-thumbnail')
                        .css('minHeight', img_min_height);
                }
                var itemspage = {
                    pager: true,
                    touchEnabled: false
                };
                Utils.initBxSlider(carousel, _.extend(Configuration_1.Configuration.get('bxSliderDefaults', {}), itemspage));
            }
        },
        loadRelatedItem: function loadRelatedItem() {
            var self = this;
            self.collection.fetchItems().then(function () {
                if (self.collection.length) {
                    if (!self.view_tracked) {
                        Tracker.getInstance().trackProductListEvent(self.collection, 'Related Items');
                        self.view_tracked = true;
                    }
                }
                self.render();
            });
        },
        destroy: function destroy() {
            this._destroy();
            this.off('afterCompositeViewRender', this.loadRelatedItem, this);
        }
    });
    return ItemRelationsRelatedView;
});

//# sourceMappingURL=ItemRelations.Related.View.js.map
