/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ItemRelations.Correlated.View"/>

import * as _ from 'underscore';
import * as item_relations_cell_tpl from 'item_relations_cell.tpl';
import * as item_relations_row_tpl from 'item_relations_row.tpl';
import * as item_relations_correlated_tpl from 'item_relations_correlated.tpl';
import * as Utils from '../../Utilities/JavaScript/Utils';
import * as jQuery from '../../Core/JavaScript/jQuery';

import BackboneCollectionView = require('../../Backbone.CollectionView/JavaScript/Backbone.CollectionView');
import ItemRelationsRelatedItemView = require('./ItemRelations.RelatedItem.View');
import ItemRelationsCorrelatedCollection = require('./ItemRelations.Correlated.Collection');
import Tracker = require('../../Tracker/JavaScript/Tracker');
import Backbone = require('../../Utilities/JavaScript/backbone.custom');

// @class ItemRelations.Correlated.View @extends Backbone.CollectionView
const ItemRelationsCorrelatedView = BackboneCollectionView.extend({
    initialize: function() {
        const { siteSettings } = this.options.application.getConfig();
        this.is_sca_advanced = siteSettings.sitetype === 'ADVANCED';
        const collection = this.is_sca_advanced
            ? new ItemRelationsCorrelatedCollection({ itemsIds: this.options.itemsIds })
            : new Backbone.Collection();

        BackboneCollectionView.prototype.initialize.call(this, {
            collection: collection,
            viewsPerRow: Infinity,
            cellTemplate: item_relations_cell_tpl,
            rowTemplate: item_relations_row_tpl,
            childView: ItemRelationsRelatedItemView,
            template: item_relations_correlated_tpl
        });

        this.view_tracked = false;
        this.loadRelatedItems();
    },
    render: function() {
        BackboneCollectionView.prototype.render.call(this);
        if (this.is_sca_advanced) {
            const layout = this.options.application.getLayout();
            if (!jQuery.contains(document.documentElement, this.$el[0])) {
                layout.once('afterAppendView', this.carouselInitialize, this);
            } else {
                this.carouselInitialize();
            }
        }
        return this;
    },
    carouselInitialize: function carouselInitialize() {
        const carousel = this.$el.find('[data-type="carousel-items"]');
        const {
            siteSettings,
            imageSizeMapping,
            bxSliderDefaults
        } = this.options.application.getConfig();

        if (carousel.length > 0) {
            if (Utils.isPhoneDevice() === false && siteSettings.imagesizes) {
                const img_min_height = (<any>_.where(siteSettings.imagesizes, {
                    name: imageSizeMapping.thumbnail
                })[0]).maxheight;

                carousel
                    .find('.item-relations-related-item-thumbnail')
                    .css('minHeight', img_min_height);
            }

            Utils.initBxSlider(carousel, bxSliderDefaults);
        }
    },

    loadRelatedItems: function loadRelatedItems() {
        const self = this;

        self.collection.fetchItems().then(function() {
            if (self.collection.length) {
                if (!self.view_tracked) {
                    Tracker.getInstance().trackProductListEvent(
                        self.collection,
                        'Correlated Items'
                    );
                    self.view_tracked = true;
                }
            }

            self.render();
        });
    },

    destroy: function destroy() {
        this._destroy();
        this.off('afterCompositeViewRender', this.loadRelatedItems, this);
    }
});

export = ItemRelationsCorrelatedView;
