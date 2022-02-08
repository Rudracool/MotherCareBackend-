/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GlobalViews.ShowingCurrent.View", ["require", "exports", "global_views_showing_current.tpl", "Utils", "Backbone.View", "Backbone"], function (require, exports, global_views_showing_current_tpl, Utils, BackboneView, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @class GlobalViews.ShowingCurrent.View @extends Backbone.View
    exports.GlobalViewsShowingCurrentView = BackboneView.extend({
        template: global_views_showing_current_tpl,
        _getCurrentPage: function () {
            var BackboneHistory = Backbone.History;
            var url_options = Utils.parseUrlOptions(BackboneHistory.fragment);
            return this._getPageFromUrl(url_options.page);
        },
        // @method getPageFromUrl @param {String} url_value @returns {Number}
        _getPageFromUrl: function (url_value) {
            var page_number = parseInt(url_value, 10);
            return !isNaN(page_number) && page_number > 0 ? page_number : 1;
        },
        // @method getContext @return GlobalViews.ShowingCurrent.View.Content
        getContext: function () {
            this.options.current_page = this._getCurrentPage();
            var lastItem = this.options.current_page * this.options.items_per_page;
            // @class GlobalViews.ShowingCurrent.View.Content
            return {
                // @property {String} orderText
                orderText: this.options.order_id
                    ? " " + Utils.translate('for <a href="/ordershistory/view/$(0)">  Order Number: #$(1)</a>', this.options.order_id, this.options.order_number)
                    : '',
                // @property {String} extraClass
                extraClass: this.options.extraClass,
                // @property {Number} firstItem
                firstItem: (this.options.current_page - 1) * this.options.items_per_page + 1,
                // @property {Number} lastItem
                lastItem: lastItem > this.options.total_items ? this.options.total_items : lastItem,
                // @property {Number} totalItems
                totalItems: this.options.total_items
            };
        }
    });
});

//# sourceMappingURL=GlobalViews.ShowingCurrent.View.js.map
