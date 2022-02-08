/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Quote", ["require", "exports", "Utils", "Quote.List.View", "Quote.Details.View"], function (require, exports, Utils, QuoteListView, Quote_Details_View_1) {
    "use strict";
    var QuoteModule = (function () {
        // @method mountToApp
        // @param {ApplicationSkeleton} application
        // @return {QuoteRouter} Returns an instance of the quote router used by the current module
        var mountToApp = function (application) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'QuotesHistory',
                routes: ['quotes', 'quotes?:options'],
                view: QuoteListView,
                defaultTemplate: {
                    name: 'quote_list.tpl',
                    displayName: 'Quotes default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-list.png')
                }
            });
            pageType.registerPageType({
                name: 'QuotesDetail',
                routes: ['quotes/:id'],
                view: Quote_Details_View_1.QuoteDetailsView,
                defaultTemplate: {
                    name: 'quote_details.tpl',
                    displayName: 'Quotes details default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-quote-details.png')
                }
            });
        };
        return {
            mountToApp: mountToApp
        };
    })();
    return QuoteModule;
});

//# sourceMappingURL=Quote.js.map
