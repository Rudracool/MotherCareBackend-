/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ItemRelations.RelatedItem.View", ["require", "exports", "item_relations_related_item.tpl", "Utils", "underscore", "Configuration", "Backbone.CollectionView", "ProductViews.Option.View", "ProductViews.Price.View", "GlobalViews.StarRating.View", "Backbone.View", "Product.Model", "ProductDetails.AddToProductList.View", "Cart.AddToCart.Button.View", "ProductDetails.Options.Selector.View"], function (require, exports, item_relations_related_item_tpl, Utils, _, Configuration_1, BackboneCollectionView, ProductViewsOptionView, ProductViewsPriceView, GlobalViewsStarRatingView, BackboneView, ProductModel, ProductDetailsAddToProductListView, CartAddToCartButtonView, ProductDetailsOptionsSelectorView) {
    "use strict";
    // @class ItemViews.RelatedItem.View Responsible for rendering an item details. The idea is that the item rendered is related to another one in the same page
    // @extend Backbone.View
    var ItemRelationsRelatedItemView = BackboneView.extend({
        // @property {Function} template
        template: item_relations_related_item_tpl,
        // @method initialize Override default method to make this view composite
        // @param {ItemViews.RelatedItem.View.Initialize.Options} options
        // @return {Void}
        initialize: function (options) {
            BackboneView.prototype.initialize.apply(this, arguments);
            var self = this;
            if (this.model.get("itemoptions_detail") && !_.isUndefined(this.model.get("itemoptions_detail").fields)) {
                self.hasMatrixoptions = true;
            }
            else {
                self.hasMatrixoptions = false;
            }
            if (!_.isUndefined(this.model.get("itemoptions_detail"))) {
                this.product = new ProductModel({
                    item: this.model,
                    quantity: this.model.get('_minimumQuantity', true)
                });
                _.each(this.model.getPosibleOptions().models, function (options) {
                    if (options.get('isMandatory') && !_.isUndefined(options.get('values')) && options.get('values').length > 0 && !_.isUndefined(options.get('values')[0].internalid)) {
                        self.product.setOption(options.get('cartOptionId'), options.get('values')[0].internalid);
                    }
                });
                self.model = self.product.get('item');
            }
        },
        events: {
            'click [data-action="changethumbnail"]': 'thumbnailchange'
        },
        thumbnailchange: function (e) {
            e.preventDefault();
            var itemimages = this.model.attributes.itemimages_detail;
            var color = $(e.currentTarget).attr('value');
            var colrs = itemimages[color];
            var link = _.findWhere(colrs, "url");
            var finalurl = link.hasOwnProperty('urls') ? link.urls[0].url : link[0].url;
            if ($(e.currentTarget).parentsUntil(".item-relations-cell").parent().hasClass('item-relations-cell')) {
                $(e.currentTarget).parentsUntil(".item-relations-cell").parent().find(".item-relations-related-item-thumbnail").html("<img class=\"facets-item-cell-grid-image\" src=\"" + finalurl + "\" alt=\"{{thumbnail.altimagetext}}\" itemprop=\"image\"/>\n            ");
            }
            else {
                $(e.currentTarget).parentsUntil(".recently-viewed-cell-item-cell").parent().find(".item-relations-related-item-thumbnail").html("<img class=\"facets-item-cell-grid-image\" src=\"" + finalurl + "\" alt=\"{{thumbnail.altimagetext}}\" itemprop=\"image\"/>\n            ");
            }
        },
        contextData: {
            item: function () {
                return Utils.deepCopy(this.model);
            }
        },
        childViews: {
            'ItemDetails.Options': function () {
                var options_configuration = Configuration_1.Configuration.get('ItemOptions.optionsConfiguration', []);
                return new BackboneCollectionView({
                    collection: _.filter(this.model.get('options').sortBy('index'), function (option) {
                        var option_configuration = _.findWhere(options_configuration, {
                            cartOptionId: option.get('cartOptionId')
                        });
                        return option_configuration && option_configuration.showSelectorInList;
                    }),
                    childView: ProductViewsOptionView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        item: this.model,
                        templateName: 'facetCell',
                        showLink: true,
                        hideLabel: true,
                        showSmall: true
                    }
                });
            },
            AddToCart: function () {
                var product = new ProductModel({
                    item: this.model,
                    quantity: this.model.get('_minimumQuantity', true),
                    mybutton: true // for button template customisation
                });
                try {
                    if (this.model.attributes.itemoptions_detail) {
                        this.itemwithoptions = true;
                    }
                }
                catch (error) {
                    // console.log('error', error)
                }
                return new CartAddToCartButtonView({
                    model: product,
                    application: this.parentView.options.application,
                });
            },
            'Product.Options': function () {
                var product = new ProductModel({
                    item: this.model,
                    quantity: this.model.get('_minimumQuantity', true),
                    mybutton: true,
                });
                return new ProductDetailsOptionsSelectorView({
                    model: product,
                    application: this.parentView.options.application,
                    show_pusher: true,
                    show_required_label: false //this.model.get('item').get('itemtype') === 'GiftCert'
                });
            },
            AddToProductList: function () {
                if (this.hasMatrixoptions == false) {
                    var product = new ProductModel({
                        item: this.model,
                        quantity: this.model.get('_minimumQuantity', true)
                    });
                    return new ProductDetailsAddToProductListView({
                        model: product,
                        application: this.parentView.options.application,
                    });
                }
                else if (this.hasMatrixoptions == true) {
                    return new ProductDetailsAddToProductListView({
                        model: this.product,
                        application: this.parentView.options.application
                    });
                }
            },
            'Item.Price': function () {
                return new ProductViewsPriceView({
                    model: this.model,
                    origin: 'RELATEDITEM'
                });
            },
            'Global.StarRating': function () {
                return new GlobalViewsStarRatingView({
                    model: this.model,
                    showRatingCount: false
                });
            }
        },
        // @method getContext 
        // @returns {ItemViews.RelatedItem.View.Context}
        getContext: function () {
            // @class ItemViews.RelatedItem.View.Context
            return {
                url: this.model.get("_url"),
                itemwithoptions: this.model.get('itemoptions_detail') || this.model.get('itemoptions_detail') == "undefined",
                iscustom: true,
                // @property {String} itemURL
                itemURL: this.model.getFullLink(),
                // @property {String} itemName
                itemName: this.model.get('_name') || this.model.Name,
                // @property {ImageContainer} thumbnail
                thumbnail: this.model.getThumbnail(),
                // @property {String} sku
                sku: this.model.get('_sku'),
                // @property {String} itemId
                itemId: this.model.get('_id'),
                // @property {Item.Model} model
                model: this.model,
                // @property {Boolean} showRating
                showRating: SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled,
                // @property {String} track_productlist_list
                track_productlist_list: this.model.get('track_productlist_list'),
                // @property {String} track_productlist_position
                track_productlist_position: this.model.get('track_productlist_position'),
                // @property {String} track_productlist_category
                track_productlist_category: this.model.get('track_productlist_category')
            };
            // @class ItemViews.RelatedItem.View
        }
    });
    return ItemRelationsRelatedItemView;
});

//# sourceMappingURL=ItemRelations.RelatedItem.View.js.map
