/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RecentlyViewedItems", ["require", "exports", "RecentlyViewedItems.View", "Cart.Detailed.View"], function (require, exports, RecentlyViewedItemsView, CartDetailedView) {
    "use strict";
    var RecentlyViewedItems = {
        excludeFromMyAccount: true,
        // @method mountToApp
        // @param {ApplicationSkeleton} application
        // @return {Void}
        mountToApp: function (application) {
            CartDetailedView.addChildViews({
                'RecentlyViewed.Items': function wrapperFunction() {
                    return function () {
                        return new RecentlyViewedItemsView({
                            application: application
                        });
                    };
                }
            });
        }
    };
    return RecentlyViewedItems;
});

//# sourceMappingURL=RecentlyViewedItems.js.map
