/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductReviews.FormConfirmation.View", ["require", "exports", "underscore", "product_reviews_form_confirmation.tpl", "Utils", "Facets.ItemCell.View", "GlobalViews.StarRating.View", "Backbone", "Backbone.View", "Backbone.CollectionView"], function (require, exports, _, product_reviews_form_confirmation, Utils, FacetsItemCellView, GlobalViewsStarRatingView, Backbone, BackboneView, BackboneCollectionView) {
    "use strict";
    return BackboneView.extend({
        template: product_reviews_form_confirmation,
        attributes: {
            id: 'product-review-form-confirmation',
            class: 'product-review-form-confirmation'
        },
        title: Utils.translate('Confirmation'),
        confirmation_message: Utils.translate('<h2>Thank You!</h2><p>Your review has been submitted.</p>'),
        initialize: function (options) {
            this.product = options.product;
            this.item = this.product.get('item');
        },
        // @method getBreadcrumb
        getBreadcrumb: function () {
            var result = this.item.get('_breadcrumb').slice(0);
            // we add the new element to the breadcrumb array
            result.push({
                href: this.item.get('_url') + '/reviews',
                text: Utils.translate('Reviews')
            });
            result.push({
                href: this.item.get('_url') + '/reviews/new',
                text: Utils.translate('Thank you')
            });
            return result;
        },
        childViews: {
            'Global.StarRating': function () {
                return new GlobalViewsStarRatingView({
                    model: this.model,
                    showRatingCount: false,
                    showLabelRating: true,
                    isReviewMode: true
                });
            },
            'Global.StarRatingAttribute': function () {
                var collection = new Backbone.Collection(_.map(this.model.get('rating_per_attribute'), function (value, key) {
                    return {
                        label: key,
                        rating: value
                    };
                }));
                return new BackboneCollectionView({
                    collection: collection,
                    childView: GlobalViewsStarRatingView,
                    childViewOptions: {
                        showRatingCount: false,
                        className: 'pegs text-center'
                    },
                    viewsPerRow: 1
                });
            },
            'Facets.ItemCell': function () {
                return new FacetsItemCellView({
                    model: this.product,
                    itemIsNavigable: false
                });
            }
        },
        // @method getContext
        // @returns {ProductReviews.FormConfirmation.View.Context}
        getContext: function () {
            // @class ProductReviews.FormConfirmation.View.Context
            return {
                // @property {String} header
                header: this.title,
                // @property {String} confirmationMessage
                confirmationMessage: this.confirmation_message,
                // @property {String} productTitle
                productTitle: this.item.get('_name'),
                // @property {String} itemUrl
                itemUrl: this.item.get('_url'),
                // @property {String} reviewCreatedOn
                reviewCreatedOn: this.model.get('created_on') || new Date().toDateString(),
                // @property {String} reviewTitle
                reviewTitle: this.model.get('title'),
                // @property {String} reviewAuthor
                reviewAuthor: this.model.get('writer').name || Utils.translate('anonymous'),
                // @property {Boolean} isReviewVerified
                isReviewVerified: !!this.model.get('isVerified'),
                // @property {String} reviewText
                reviewText: this.model.get('text')
            };
            // @class ProductReviews.FormConfirmation.View
        }
    });
});

//# sourceMappingURL=ProductReviews.FormConfirmation.View.js.map
