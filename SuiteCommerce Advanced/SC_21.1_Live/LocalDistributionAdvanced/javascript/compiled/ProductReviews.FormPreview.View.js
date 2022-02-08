/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductReviews.FormPreview.View", ["require", "exports", "Utils", "product_reviews_form_preview.tpl", "ProductReviews.FormConfirmation.View", "ProductReviews.Preview.View", "Facets.ItemCell.View", "Backbone.View"], function (require, exports, Utils, product_reviews_form_preview, ProductReviewsFormConfirmationView, ProductReviewsPreview, FacetsItemCellView, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: product_reviews_form_preview,
        attributes: {
            id: 'product-review-form-preview',
            class: 'product-review-form-preview'
        },
        title: Utils.translate('Submit your Review'),
        page_header: Utils.translate('Submit your Review'),
        events: {
            'click [data-action="edit"]': 'edit',
            'click [data-action="save"]': 'save'
        },
        initialize: function (options) {
            this.product = options.product;
            this.item = this.product.get('item');
            this.formView = options.formView;
        },
        childViews: {
            'Facets.ItemCell': function () {
                return new FacetsItemCellView({
                    model: this.product,
                    itemIsNavigable: false
                });
            },
            'ProductReviews.Preview': function () {
                return new ProductReviewsPreview({
                    model: this.model
                });
            }
        },
        // @method edit when the edit button is clicked, we show the Form view
        edit: function () {
            this.formView.showContent();
        },
        // @method save dispatch when the user saves a new review
        save: function (e) {
            e && e.preventDefault();
            var self = this;
            return this.model
                .set('itemid', this.item.get('internalid'))
                .save(null, {
                statusCode: {
                    '401': function () {
                        // If login is required from the server side
                        // we need to handle it here
                    }
                }
            })
                .done(function () {
                // Once the review is submited, we show the Confirmation View
                var preview_review = new ProductReviewsFormConfirmationView({
                    model: self.model,
                    product: self.product,
                    application: self.options.application
                });
                preview_review.showContent();
            });
        },
        // @method getContext @returns {ProductReviews.FormPreview.View.Context}
        getContext: function () {
            // @class ProductReviews.FormPreview.View.Context
            return {
                // @property {String} header
                header: this.page_header,
                // @property {String} itemUrl
                itemUrl: this.item.get('_url')
            };
        }
    });
});

//# sourceMappingURL=ProductReviews.FormPreview.View.js.map
