/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ProductListOnline"/>

import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { ProductListUtils } from './ProductList.Utils';
import { ProfileModel } from '../../../Commons/Profile/JavaScript/Profile.Model';

import ProductListDetailsView = require('./ProductList.Details.View');
import ProductListListsView = require('./ProductList.Lists.View');

// @class ProductListModule @extends ApplicationModule Encapsulate all product list elements into
// a single module to be mounted to the application
// Update: Keep the application reference within the function once its mounted into the application
const ProductListModule = (function() {
    return {
        excludeFromMyAccount: true,
        mountToApp: function(application) {
            const pageType = application.getComponent('PageType');

            // Application.ProductListModule - reference to this module
            application.ProductListModule = ProductListModule;
            application.ProductListModule.Utils = new ProductListUtils(application);

            ProfileModel.getPromise().done(() =>
                application.ProductListModule.Utils.profileModelPromiseDone()
            );

            pageType.registerPageType({
                name: 'WishlistList',
                routes: ['wishlist', 'wishlist/?*options'],
                view: ProductListListsView,
                defaultTemplate: {
                    name: 'product_list_lists.tpl',
                    displayName: 'Wishlist',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources(
                        'img/default-layout-wishlist.png'
                    )
                }
            });

            pageType.registerPageType({
                name: 'WishlistDetail',
                routes: ['wishlist/:id', 'wishlist/:id/?*options'],
                view: ProductListDetailsView,
                defaultTemplate: {
                    name: 'product_list_details_tpl',
                    displayName: 'Wishlist Detail',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources(
                        'img/default-layout-wishlist-detail.png'
                    )
                }
            });
        }
    };
})();

// @class ProductList instantiate the router @extends ApplicationModule
export = ProductListModule;
