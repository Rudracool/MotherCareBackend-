/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Merchandising.View", ["require", "exports", "underscore", "merchandising_zone.tpl", "merchandising_zone_cell_template.tpl", "merchandising_zone_row_template.tpl", "Utils", "Configuration", "Backbone.View", "Backbone.CollectionView", "ItemRelations.RelatedItem.View"], function (require, exports, _, merchandising_zone_tpl, merchandising_zone_cell_template_tpl, merchandising_zone_row_template_tpl, Utils, Configuration_1, BackboneView, BackboneCollectionView, ItemRelationsRelatedItemView) {
    "use strict";
    return BackboneView.extend({
        template: merchandising_zone_tpl,
        // @method initialize Creates a new instance of the current view
        // @param {MerchandisingRule.Model} options.model
        // @param {Merchandising.ItemCollection} options.items
        initialize: function (options) {
            this.model = options.model;
            this.items = options.items;
            BackboneView.prototype.initialize.apply(this, arguments);
            var self = this;
            this.on('afterMerchandAppendToDOM', _.bind(this.initSlider, self));
        },
        childViews: {
            'Zone.Items': function () {
                var itemsCollectionView = new BackboneCollectionView({
                    childView: ItemRelationsRelatedItemView,
                    viewsPerRow: Infinity,
                    cellTemplate: merchandising_zone_cell_template_tpl,
                    rowTemplate: merchandising_zone_row_template_tpl,
                    collection: _.first(this.items.models, this.model.get('show'))
                });
                return itemsCollectionView;
            }
        },
        // @method initSlider
        initSlider: function () {
            var element = this.$el.find('[data-type="carousel-items"]');
            this.$slider = Utils.initBxSlider(element, Configuration_1.Configuration.bxSliderDefaults);
        },
        // @method getContext @returns {Content.LandingPages.View.Context}
        getContext: function () {
            // @class Content.LandingPages.View.Context
            return {
                // @property {String} zoneTitle
                zoneTitle: this.model.get('title'),
                // @property {Boolean} isZoneDescription
                isZoneDescription: !!this.model.get('description'),
                // @property {Stirng} zoneDescription
                zoneDescription: this.model.get('description')
            };
        }
    });
});

//# sourceMappingURL=Merchandising.View.js.map
