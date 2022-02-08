/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductReviews.Center.View", ["require", "exports", "underscore", "product_reviews_center.tpl", "Utils", "jQuery", "Configuration", "ListHeader.View", "GlobalViews.Pagination.View", "UrlHelper", "ProductReviews.Collection", "ProductReviews.Review.View", "GlobalViews.StarRating.View", "GlobalViews.RatingByStar.View", "Backbone", "Backbone.View", "Backbone.CollectionView", "jQuery.scPush"], function (require, exports, _, product_reviews_center, Utils, jQuery, Configuration_1, ListHeader_View_1, GlobalViews_Pagination_View_1, UrlHelper_1, ProductReviewsCollection, ProductReviewsReviewView, GlobalViewsStarRatingView, GlobalViewsRatingByStarView, Backbone, BackboneView, BackboneCollectionView) {
    "use strict";
    return BackboneView.extend({
        template: product_reviews_center,
        attributes: {
            id: 'item-product-reviews',
            class: 'item-product-reviews item-detailed-reviews'
        },
        initialize: function (options) {
            this.item = options.item;
            this.baseUrl = "product/" + options.item.get('internalid');
            this.queryOptions = Utils.parseUrlOptions(window.location.href);
            this.application = options.application;
            this.collection = new ProductReviewsCollection();
            this.collection.itemid = this.item.get('internalid');
            var self = this;
            var reviews_params = this.collection.getReviewParams(this.queryOptions);
            reviews_params.itemid = this.item.get('internalid');
            // return the fetch 'promise'
            this.reviewsPromise = jQuery.Deferred();
            this.collection
                .fetch({
                data: reviews_params,
                killerId: this.killerId
            })
                .done(function () {
                self.updateCannonicalLinks();
                // append and render the view
                // $placeholder.empty().append(this.$el);
                self.render();
                self.collection.on('reset', function () {
                    self.render();
                });
                self.reviewsPromise.resolve();
            });
        },
        render: function render() {
            this._render();
            this.$('[data-action="pushable"]').scPush();
        },
        // @method getRelPrev
        // @return {String?}
        getRelPrev: function getRelPrev() {
            var current_page = (this.queryOptions && parseInt(this.queryOptions.page, 2)) || 1;
            if (current_page > 1) {
                if (current_page === 2) {
                    return this.baseUrl;
                }
                if (current_page > 2) {
                    return this.baseUrl + "?page=" + (current_page - 1);
                }
            }
            return null;
        },
        // @method getRelNext
        // @return {String}
        getRelNext: function getRelNext() {
            var current_page = (this.queryOptions && this.queryOptions.page) || 1;
            if (current_page < this.collection.totalPages) {
                this.baseUrl += "?page=" + (current_page + 1);
                return this.baseUrl;
            }
            return null;
        },
        // @method getUrlForOption creates a new url based on a new filter or sorting options
        // @param {filter:String,sort:String} option
        getUrlForOption: function getUrlForOption(option) {
            if (option === void 0) { option = {}; }
            var options = {};
            var sort = option.sort || this.queryOptions.sort;
            var filter = option.filter || this.queryOptions.filter;
            if (filter) {
                options.filter = filter;
            }
            if (sort) {
                options.sort = sort;
            }
            return this.baseUrl + "?" + jQuery.param(options);
        },
        // @method setupListHeader @param {Backbone.Collection} collection
        setupListHeader: function setupListHeader(collection) {
            var sorts = _(Configuration_1.Configuration.get('productReviews.sortOptions')).map(function (sort) {
                sort.value = sort.id;
                return sort;
            });
            var filters = _(Configuration_1.Configuration.get('productReviews.filterOptions')).map(function (filter) {
                filter.value = filter.id;
                return filter;
            });
            return {
                view: this,
                application: this.application,
                collection: collection,
                sorts: sorts,
                filters: filters,
                avoidFirstFetch: true,
                totalCount: this.item.get('_ratingsCount'),
                customFilterHandler: this.filterOptionsHandler
            };
        },
        // @method updateCannonicalLinks
        updateCannonicalLinks: function updateCannonicalLinks() {
            var $head = jQuery('head');
            var previous_page = this.getRelPrev();
            var next_page = this.getRelNext();
            $head.find('link[rel="next"], link[rel="prev"]').remove();
            if (previous_page) {
                jQuery('<link/>', {
                    rel: 'prev',
                    href: previous_page
                }).appendTo($head);
            }
            if (next_page) {
                jQuery('<link/>', {
                    rel: 'next',
                    href: next_page
                }).appendTo($head);
            }
        },
        filterOptionsHandler: function filterOptionsHandler(element, elem_sort) {
            if (element.id !== 'all') {
                elem_sort.find('option[value="date"]').prop('selected', true);
                elem_sort.prop('disabled', true);
            }
            else {
                elem_sort.prop('disabled', false);
            }
        },
        childViews: {
            'ProductReviews.Review': function () {
                return new BackboneCollectionView({
                    collection: this.collection,
                    childView: ProductReviewsReviewView,
                    childViewOptions: _.extend({
                        showActionButtons: true,
                        collection: this.collection
                    }, Configuration_1.Configuration.get('productReviews')),
                    viewsPerRow: 1
                });
            },
            'Global.StarRating': function () {
                return new GlobalViewsStarRatingView({
                    model: this.item,
                    showRatingCount: false,
                    showValue: true
                });
            },
            'Global.RatingByStar': function () {
                return new GlobalViewsRatingByStarView({
                    model: this.item,
                    queryOptions: this.queryOptions,
                    baseUrl: this.baseUrl,
                    showPercentage: true,
                    showCount: true
                });
            },
            'GlobalViews.Pagination': function () {
                return new GlobalViews_Pagination_View_1.GlobalViewsPaginationView(_.extend({
                    currentPage: this.collection.page || 0,
                    totalPages: this.collection.totalPages || 0,
                    pager: function (page) {
                        return "/" + (page > 1
                            ? UrlHelper_1.UrlHelper.setUrlParameter(Backbone.history.fragment, 'page', page)
                            : UrlHelper_1.UrlHelper.removeUrlParameter(Backbone.history.fragment, 'page'));
                    },
                    extraClass: 'pull-right no-margin-top no-margin-bottom'
                }, Configuration_1.Configuration.get('defaultPaginationSettings')));
            },
            'ListHeader.View': function () {
                return new ListHeader_View_1.ListHeaderView(this.setupListHeader(this.collection));
            }
        },
        // @method Create JsonLd object with reviews info
        // @return {JQuery.Deferred<JsonldOffer>}
        getJsonLd: function getJsonLd() {
            var _this = this;
            if (Configuration_1.Configuration.get('structureddatamarkup.type') !== 'JSON-LD') {
                return jQuery.Deferred().resolve(null);
            }
            return this.reviewsPromise.then(function () {
                var reviewsToAdd = [];
                var ratingValue = _this.item.get('_rating') || _this.item.get('rating') || 0;
                var ratingCount = _this.item.get('_ratingsCount') || 0;
                // Get Reviews
                if (_this.collection.length > 0) {
                    _this.collection.each(function (reviewItem) {
                        var review = Utils.deepCopy(reviewItem);
                        var newReview = {
                            '@type': 'Review',
                            author: review.writer.name.toString(),
                            datePublished: review.created_on.toString(),
                            description: review.text.toString(),
                            name: review.title.toString(),
                            reviewRating: {
                                '@type': 'Rating',
                                ratingValue: review.rating.toString()
                            }
                        };
                        reviewsToAdd.push(newReview);
                    });
                    var aggregateRating = {
                        '@type': 'AggregateRating',
                        ratingValue: ratingValue.toString(),
                        reviewCount: ratingCount.toString()
                    };
                    var jsonLd = {
                        '@type': 'Offer',
                        aggregateRating: aggregateRating,
                        review: reviewsToAdd
                    };
                    return jQuery.Deferred().resolve(jsonLd);
                }
                return jQuery.Deferred().resolve({});
            });
        },
        // @method getContext
        // @returns {ProductReviews.Center.View.Context}
        getContext: function getContext() {
            // @class ProductReviews.Center.View.Context
            return {
                // @property {Number} itemCount
                itemCount: this.item.get('_ratingsCount'),
                // @property {Boolean} hasOneReview
                hasOneReview: this.item.get('_ratingsCount') === 1,
                // @property {String} itemUrl
                itemUrl: this.item.get('_url'),
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Number} totalRecords
                totalRecords: this.collection.totalRecordsFound
            };
            // @class ProductReviews.Center.View
        }
    });
});

//# sourceMappingURL=ProductReviews.Center.View.js.map
