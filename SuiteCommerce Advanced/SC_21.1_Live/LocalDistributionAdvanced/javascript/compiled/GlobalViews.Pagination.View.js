/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GlobalViews.Pagination.View", ["require", "exports", "underscore", "global_views_pagination.tpl", "Utils", "Backbone", "Backbone.View", "UrlHelper"], function (require, exports, _, global_views_pagination_tpl, Utils, Backbone, BackboneView, UrlHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @class GlobalViews.Pagination.View @extends Backbone.View
    exports.GlobalViewsPaginationView = BackboneView.extend({
        template: global_views_pagination_tpl,
        initialize: function () {
            // State definition
            this.current_page;
            this.pages;
            this.pager;
            this.range_start = 1;
            this.range_end;
            this.show_page_list;
            this.precalculateValues();
        },
        // @method pager @param {String} url_value @returns {String}
        _pager: function (url_value) {
            var BackboneHistory = Backbone.history;
            var page_number = parseInt(url_value, 10);
            var url = BackboneHistory.fragment;
            return isNaN(page_number) || page_number === 1
                ? UrlHelper_1.UrlHelper.removeUrlParameter(url, 'page')
                : UrlHelper_1.UrlHelper.setUrlParameter(url, 'page', page_number);
        },
        _getCurrentPage: function () {
            var BackboneHistory = Backbone.history;
            var url_options = Utils.parseUrlOptions(BackboneHistory.fragment);
            return this._getPageFromUrl(url_options.page);
        },
        // @method getPageFromUrl @param {String} url_value @returns {Number}
        _getPageFromUrl: function (url_value) {
            var page_number = parseInt(url_value, 10);
            return !isNaN(page_number) && page_number > 0 ? page_number : 1;
        },
        // @method precalculateValues Internal method to precalculate paginator state once and being able to use it many times
        precalculateValues: function () {
            this.current_page = this._getCurrentPage();
            this.total_pages = parseInt(this.options.totalPages, 10);
            this.pager = this.options.pager || this._pager;
            this.range_end = this.total_pages + 1;
            this.show_page_list = _.isBoolean(this.options.showPageList)
                ? this.options.showPageList
                : true;
            var pages_to_show = parseInt(this.options.pagesToShow, 10) || 4;
            var padding_left = pages_to_show % 2 === 0 ? pages_to_show / 2 - 1 : pages_to_show / 2;
            if (this.show_page_list && pages_to_show < this.total_pages) {
                // if we are getting closer to the end we need to compute from the end to the beginig
                if (pages_to_show - padding_left > this.total_pages - this.current_page) {
                    this.range_start = this.total_pages + 1 - pages_to_show;
                }
                else {
                    this.range_start =
                        this.current_page - padding_left < 1
                            ? 1
                            : Math.ceil(this.current_page - padding_left);
                    this.range_end =
                        this.range_start + pages_to_show > this.total_pages
                            ? this.total_pages
                            : this.range_start + pages_to_show;
                }
            }
            var self = this;
            this.pages = _.map(_.range(this.range_start, this.range_end), function (page_index) {
                // @class GlobalViews.Pagination.View.PageItem
                return {
                    // @property {Boolean} isCurrentPageActivePage
                    isCurrentPageActivePage: page_index === self.current_page,
                    // @property {String} URL
                    URL: self.pager(page_index),
                    // @property {String} fixedURL
                    fixedURL: UrlHelper_1.UrlHelper.fixUrl(self.pager(page_index)),
                    // @property {Number} pageIndex
                    pageIndex: page_index
                };
                // @class GlobalViews.Pagination.View
            });
        },
        // @method getContext @return {GlobalViews.Pagination.View.Content}
        getContext: function () {
            // @class GlobalViews.Pagination.View
            return {
                // @property {Boolean} currentPageLowerThanTotalPagesAndCurrentPageGreaterThan0AndPagesCountGreaterThan1
                currentPageLowerThanTotalPagesAndCurrentPageGreaterThan0AndPagesCountGreaterThan1: this.total_pages >= this.current_page &&
                    this.current_page > 0 &&
                    this.pages.length > 1,
                // @property {Boolean} showPageIndicator
                showPageIndicator: !!this.options.showPageIndicator,
                // @property {String} paginatorClass
                paginatorClass: this.options.extraClass || '',
                // @property {Number} currentPage
                currentPage: this.current_page,
                // @property {Number} totalPages
                totalPages: this.total_pages,
                // @property {Boolean} isCurrentPageDifferentThan1
                isCurrentPageDifferentThan1: this.current_page !== 1,
                // @property {String} currentPageURL
                currentPageURL: UrlHelper_1.UrlHelper.fixUrl(this.pager(this.current_page)),
                // @property {String} previousPageURL
                previousPageURL: UrlHelper_1.UrlHelper.fixUrl(this.pager(this.current_page - 1)),
                // @property {String} nextPageURL
                nextPageURL: UrlHelper_1.UrlHelper.fixUrl(this.pager(this.current_page + 1)),
                // @property {Boolean} showPageList
                showPageList: this.show_page_list,
                // @property {Boolean} showPaginationLinksCompactClass
                showPaginationLinksCompactClass: !this.show_page_list,
                // @property {Boolean} isRangeStartGreaterThan1
                isRangeStartGreaterThan1: this.range_start > 1,
                // @property {Boolean} isRangeEndLowerThanTotalPages
                isRangeEndLowerThanTotalPages: this.range_end < this.total_pages,
                // @property {Boolean} isCurrentPageLast
                isCurrentPageLast: this.current_page === this.total_pages,
                // @property {Array<GlobalViews.Pagination.View.PageItem>} pages
                pages: this.pages
            };
        }
    });
});

//# sourceMappingURL=GlobalViews.Pagination.View.js.map
