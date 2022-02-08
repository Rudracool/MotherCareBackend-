/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory", ["require", "exports", "Utils", "Configuration", "OrderHistory.List.View", "OrderHistory.Details.View"], function (require, exports, Utils, Configuration_1, OrderHistoryListView, OrderHistoryDetailsView) {
    "use strict";
    // @class OrderHistory @extends ApplicationModule
    var OrderHistory = {
        // @method mountToApp
        mountToApp: function (application) {
            var pageType = application.getComponent('PageType');
            var routes = [
                'purchases',
                'purchases?:options',
                'open-purchases',
                'open-purchases?:options'
            ];
            if (Configuration_1.Configuration.get('siteSettings.isSCISIntegrationEnabled', false)) {
                routes.push('instore-purchases');
                routes.push('instore-purchases?:options');
            }
            pageType.registerPageType({
                name: 'PurchaseHistory',
                routes: routes,
                view: OrderHistoryListView,
                defaultTemplate: {
                    name: 'order_history_list.tpl',
                    displayName: 'Purchase history default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-list.png')
                }
            });
            pageType.registerPageType({
                name: 'PurchaseDetail',
                routes: ['purchases/view/:recordtype/:id'],
                view: OrderHistoryDetailsView,
                defaultTemplate: {
                    name: 'order_history_details.tpl',
                    displayName: 'Purchase history details default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-purchase-detail.png')
                }
            });
        }
    };
    return OrderHistory;
});

//# sourceMappingURL=OrderHistory.js.map
