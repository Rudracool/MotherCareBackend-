/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GlobalViews.Breadcrumb.View", ["require", "exports", "underscore", "global_views_breadcrumb.tpl", "Configuration", "Backbone.View", "jQuery"], function (require, exports, _, global_views_breadcrumb_tpl, Configuration_1, BackboneView, jQuery) {
    "use strict";
    // @class GlobalViews.Breadcrumb.View @extends Backbone.View
    var GlobalViewsBreadcrumbView = BackboneView.extend({
        template: global_views_breadcrumb_tpl,
        initialize: function (options) {
            var opt_pages = options.pages;
            if (_.isUndefined(opt_pages)) {
                this.pages = [];
            }
            else if (_.isArray(opt_pages)) {
                this.pages = opt_pages;
            }
            else {
                this.pages = [opt_pages];
            }
        },
        // @method Create JsonLd object with Breadcrumb info
        // @return {JQuery.Deferred<JsonldWebPage>}
        getJsonLd: function getJsonLd() {
            if (Configuration_1.Configuration.get('structureddatamarkup.type') !== 'JSON-LD' || !this.pages.length) {
                return jQuery.Deferred().resolve(null);
            }
            var jsonLdBreadcrumb = {
                '@type': 'BreadcrumbList',
                itemListElement: []
            };
            var origin = window.location.origin;
            var jsonLditemListElement = _.map(this.pages, function (element, index) {
                return {
                    '@type': 'ListItem',
                    name: element.text.toString(),
                    position: index + 1,
                    item: origin + element.href
                };
            });
            jsonLdBreadcrumb.itemListElement = jsonLditemListElement;
            // Get WebPage
            var jsonLd = {
                '@type': 'WebPage',
                breadcrumb: jsonLdBreadcrumb
            };
            // Get Breadcrumb
            return jQuery.Deferred().resolve(jsonLd);
        },
        // @method getContext @return GlobalViews.Breadcrumb.View.Context
        getContext: function getContext() {
            _.each(this.pages, function (page) {
                if (page['data-touchpoint']) {
                    page.hasDataTouchpoint = true;
                }
                if (page['data-hashtag']) {
                    page.hasDataHashtag = true;
                }
            });
            // @class GlobalViews.Breadcrumb.View.Context
            return {
                // @property {Array<Object>} pages
                pages: this.pages
            };
        }
    });
    return GlobalViewsBreadcrumbView;
});

//# sourceMappingURL=GlobalViews.Breadcrumb.View.js.map
