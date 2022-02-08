/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ItemRelations.Related.View", ["require", "exports", "underscore", "item_relations_related.tpl", "item_relations_row.tpl", "item_relations_cell.tpl", "Utils", "Configuration", "Backbone.CollectionView", "ItemRelations.RelatedItem.View", "ItemRelations.Related.Collection", "Tracker", "Backbone"], function (require, exports, _, item_relations_related_tpl, item_relations_row_tpl, item_relations_cell_tpl, Utils, Configuration_1, BackboneCollectionView, ItemRelationsRelatedItemView, ItemRelationsRelatedCollection, Tracker, Backbone) {
    "use strict";
    var ItemRelationsRelatedView = BackboneCollectionView.extend({
        initialize: function () {
            var siteSettings = this.options.application.getConfig().siteSettings;
            var is_sca_advance = siteSettings.sitetype === 'ADVANCED';
            var collection = is_sca_advance
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
            if (is_sca_advance) {
                this.once('afterCompositeViewRender', this.loadRelatedItem, this);
            }
        },
        loadRelatedItem: function loadRelatedItem() {
            var self = this;
            self.collection.fetchItems().done(function () {
                var _a = self.options.application.getConfig(), siteSettings = _a.siteSettings, imageSizeMapping = _a.imageSizeMapping;
                if (self.collection.length) {
                    if (!self.view_tracked) {
                        Tracker.getInstance().trackProductListEvent(self.collection, 'Related Items');
                        self.view_tracked = true;
                    }
                }
                self.render();
                setTimeout(function () {
                    var carousel = self.$el.find('[data-type="carousel-items"]');
                    if (Utils.isPhoneDevice() === false && (siteSettings.imagesizes || false)) {
                        var img_min_height = _.where(siteSettings.imagesizes || [], {
                            name: imageSizeMapping.thumbnail || ''
                        })[0].maxheight;
                        carousel
                            .find('.item-relations-related-item-thumbnail')
                            .css('minHeight', img_min_height);
                    }
                    Utils.initBxSlider(carousel, Configuration_1.Configuration.get('bxSliderDefaults', {}));
                });
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
