/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ItemRelations.RelatedItem.View"/>

import * as item_relations_related_item_tpl from 'item_relations_related_item.tpl';
import * as cart_add_to_cart_button_tpl from 'cart_add_to_cart_button.tpl';
import * as Utils from '../../../commons/Utilities/JavaScript/Utils';

import * as _ from 'underscore';
import { Configuration } from '../../../commons/Utilities/JavaScript/Configuration';
import BackboneCollectionView = require('../../../Commons/Backbone.CollectionView/JavaScript/Backbone.CollectionView');
import ProductViewsOptionView = require('../../../Commons/ProductViews/JavaScript/ProductViews.Option.View');
import ProductViewsPriceView = require('../../../commons/ProductViews/JavaScript/ProductViews.Price.View');
import GlobalViewsStarRatingView = require('../../../commons/GlobalViews/JavaScript/GlobalViews.StarRating.View');
import BackboneView = require('../../../commons/BackboneExtras/JavaScript/Backbone.View');

// *
import ProductModel = require('../../../Commons/Product/JavaScript/Product.Model');
import CartQuickAddToCartView = require('../../../Commons/Cart/JavaScript/Cart.QuickAddToCart.View');
import ProductDetailsAddToProductListView = require('../../../Advanced/ProductDetails/JavaScript/ProductDetails.AddToProductList.View');

import CartAddToCartButtonView = require('../../../Commons/Cart/JavaScript/Cart.AddToCart.Button.View');
import ProductDetailsOptionsSelectorView = require('../../../Advanced/ProductDetails/JavaScript/ProductDetails.Options.Selector.View');
// @class ItemViews.RelatedItem.View Responsible for rendering an item details. The idea is that the item rendered is related to another one in the same page
// @extend Backbone.View
const ItemRelationsRelatedItemView = BackboneView.extend({
    // @property {Function} template
    template: item_relations_related_item_tpl,

    // @method initialize Override default method to make this view composite
    // @param {ItemViews.RelatedItem.View.Initialize.Options} options
    // @return {Void}
    initialize: function(options) {
        BackboneView.prototype.initialize.apply(this, arguments);
        var self = this;
        if(this.model.get("itemoptions_detail") && !_.isUndefined(this.model.get("itemoptions_detail").fields)){
        self.hasMatrixoptions = true;
        }else{
        self.hasMatrixoptions = false;
        }
        if(!_.isUndefined(this.model.get("itemoptions_detail"))){
        this.product = new ProductModel({
        item: this.model,
        quantity: this.model.get('_minimumQuantity', true)
        });

        _.each(this.model.getPosibleOptions().models,function(options:any){

        if(options.get('isMandatory') && !_.isUndefined(options.get('values')) && options.get('values').length > 0 &&  !_.isUndefined(options.get('values')[0].internalid )){
        self.product.setOption(options.get('cartOptionId'), options.get('values')[0].internalid)
        }
        })
        self.model = self.product.get('item')   
        }

    },
    events:{
        'click [data-action="changethumbnail"]' : 'thumbnailchange'
    },

    thumbnailchange:function(e){
        e.preventDefault();

    const  itemimages =  this.model.attributes.itemimages_detail;
    const color =$(e.currentTarget).attr('value')
    const colrs:any = itemimages[color]
    const link:any = _.findWhere(colrs, "url")
    const finalurl =    link.hasOwnProperty('urls')? link.urls[0].url : link[0].url;
 
        if($(e.currentTarget).parentsUntil(".item-relations-cell").parent().hasClass('item-relations-cell')){
            $(e.currentTarget).parentsUntil(".item-relations-cell").parent().find(".item-relations-related-item-thumbnail").html(
            `<img class="facets-item-cell-grid-image" src="${finalurl}" alt="{{thumbnail.altimagetext}}" itemprop="image"/>
            `)
        }
        else 
        {
            $(e.currentTarget).parentsUntil(".recently-viewed-cell-item-cell").parent().find(".item-relations-related-item-thumbnail").html(
                `<img class="facets-item-cell-grid-image" src="${finalurl}" alt="{{thumbnail.altimagetext}}" itemprop="image"/>
            `)
        }
    },
    contextData: {
        item: function() {
            return Utils.deepCopy(this.model);
        }
    },

    childViews: {

        'ItemDetails.Options': function() {
            const options_configuration = Configuration.get('ItemOptions.optionsConfiguration', []);

            return new BackboneCollectionView({
                collection: _.filter(this.model.get('options').sortBy('index'), function(
                    option: any
                ) {
                    const option_configuration: any = _.findWhere(options_configuration, {
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
        AddToCart: function() {

                const product = new ProductModel({
                        item: this.model,
                        quantity: this.model.get('_minimumQuantity', true),
                        mybutton:true // for button template customisation
                    });
                    try {
                        if(this.model.attributes.itemoptions_detail){
                        this.itemwithoptions = true;
                    }
                    } catch (error) {
                        console.log('error', error)
                    }
            return new CartAddToCartButtonView({
                model: product,
                application: this.parentView.options.application, //this.options.application
            });
        },

        'Product.Options': function() { 
            const product = new ProductModel({
                item: this.model,
                quantity: this.model.get('_minimumQuantity', true),
                mybutton:true, // for button template customisation
            });
            return new ProductDetailsOptionsSelectorView({
                model: product, 
                application: this.parentView.options.application, //this.options.application,
                show_pusher:true,  //this.showOptionsPusher(),
                show_required_label:false //this.model.get('item').get('itemtype') === 'GiftCert'
            });
        },
        

        AddToProductList: function() {  
            if(this.hasMatrixoptions == false){
                        const product = new ProductModel({
                            item: this.model,
                            quantity: this.model.get('_minimumQuantity', true)
                            
                        });
                        return new ProductDetailsAddToProductListView({
                            model: product,
                            application: this.parentView.options.application,
                        });
                    }else if(this.hasMatrixoptions == true){
                        return new ProductDetailsAddToProductListView({
                            model: this.product,
                            application: this.parentView.options.application
                        });
                    }
                },

        'Item.Price': function() {
            return new ProductViewsPriceView({
                model: this.model,
                origin: 'RELATEDITEM'
            });
        },
        'Global.StarRating': function() {
            return new GlobalViewsStarRatingView({
                model: this.model,
                showRatingCount: false
            });
        }
    },

    // @method getContext 
    // @returns {ItemViews.RelatedItem.View.Context}
    getContext: function() {
        // @class ItemViews.RelatedItem.View.Context
        return {
            url : this.model.get("_url"),
            itemwithoptions: this.model.get('itemoptions_detail') || this.model.get('itemoptions_detail') == "undefined", //this.itemwithoptions,
            iscustom : true,
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

// @class ItemViews.RelatedItem.View.Initialize.Options
// @property {Item.Model} model

export = ItemRelationsRelatedItemView;