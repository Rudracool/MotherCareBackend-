/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductReviews", ["require", "exports", "Utils", "ProductReviews.Form.View"], function (require, exports, Utils, ProductReviewsFormView) {
    "use strict";
    // Defines the ProductReviews module (Model, Collection, Views)
    // Mount to App also handles rendering of the reviews
    // if the current view has any placeholder for them
    // @class ProductReviews @extends ApplicationModule
    var ProductReviewsModule = {
        excludeFromMyAccount: true,
        mountToApp: function (application) {
            if (SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled) {
                var pageType = application.getComponent('PageType');
                pageType.registerPageType({
                    name: 'product-review-form',
                    routes: [':product/:id/newReview', ':url/newReview'],
                    view: ProductReviewsFormView,
                    defaultTemplate: {
                        name: 'product_reviews_form.tpl',
                        displayName: 'Product review form default',
                        thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-product-review-form.png')
                    }
                });
            }
        }
    };
    return ProductReviewsModule;
});

//# sourceMappingURL=ProductReviews.js.map
