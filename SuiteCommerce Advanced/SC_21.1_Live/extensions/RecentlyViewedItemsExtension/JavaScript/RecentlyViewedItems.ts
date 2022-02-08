/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="RecentlyViewedItems"/>

import RecentlyViewedItemsView = require('../../../Commons/RecentlyViewedItems/JavaScript/RecentlyViewedItems.View');
import CartDetailedView = require('../../../Commons/Cart/JavaScript/Cart.Detailed.View');
import ProductDetailsFullView = require('../../../Advanced/ProductDetails/JavaScript/ProductDetails.Full.View');

const RecentlyViewedItems: any = {
    excludeFromMyAccount: true,
    // @method mountToApp
    // @param {ApplicationSkeleton} application
    // @return {Void}
    mountToApp: function(application) {
        CartDetailedView.addChildViews({
            'RecentlyViewed.Items': function wrapperFunction() {
                return function() {
                    return new RecentlyViewedItemsView({
                        application: application
                    });
                };
            }
        });
        ProductDetailsFullView.addChildViews({
            'RecentlyViewed.Items': function wrapperFunction() {
                return function() {
                    return new RecentlyViewedItemsView({
                        application: application
                    });
                };
            }
        })
    }
};

export = RecentlyViewedItems;
