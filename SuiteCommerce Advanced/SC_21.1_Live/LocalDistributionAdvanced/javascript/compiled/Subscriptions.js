/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions", ["require", "exports", "Utils", "Subscriptions.List.View", "Subscriptions.Details.View", "Subscriptions.AddOn.List.View", "Subscriptions.AddOn.Details.View", "Subscriptions.AddOn.Review.View"], function (require, exports, Utils, SubscriptionsListView, SubscriptionsDetailsView, SubscriptionsAddOnCollectionView, SubscriptionsAddOnDetailsView, SubscriptionsAddOnReviewView) {
    "use strict";
    // @class Subscriptions @extends ApplicationModule
    var Subscriptions = {
        // @property {MenuItem} MenuItems
        MenuItems: [
            function (application) {
                if (this.showFeature()) {
                    return {
                        id: 'subscriptions',
                        name: Utils.translate('Subscriptions'),
                        url: 'subscriptions-list',
                        index: 0
                    };
                }
            }
        ],
        // @method showFeature
        showFeature: function () {
            return (SC &&
                SC.ENVIRONMENT &&
                SC.ENVIRONMENT.subscriptions &&
                SC.ENVIRONMENT.permissions.lists.listSubscriptions !== 0);
        },
        // @method mountToApp
        mountToApp: function (application) {
            if (!this.showFeature()) {
                return;
            }
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'Subscription',
                routes: ['subscriptions-list'],
                view: SubscriptionsListView,
                defaultTemplate: {
                    name: 'subscriptions_list.tpl',
                    displayName: 'Subscriptions',
                    thumbnail: Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
                }
            });
            pageType.registerPageType({
                name: 'SubscriptionDetail',
                routes: ['subscription/:id'],
                view: SubscriptionsDetailsView,
                defaultTemplate: {
                    name: 'subscriptions_details.tpl',
                    displayName: 'Subscription details default',
                    thumbnail: Utils.getAbsoluteUrl('img/default-layout-purchase-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'SubscriptionsAddOnsMarketPlace',
                routes: ['subscription/:id/addons'],
                view: SubscriptionsAddOnCollectionView,
                defaultTemplate: {
                    name: 'subscriptions_addons.tpl',
                    displayName: 'Add-Ons MarketPlace',
                    thumbnail: Utils.getAbsoluteUrl('img/default-layout-purchase-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'SubscriptionAdOnDetail',
                routes: ['subscription-addon-details/:subscriptionid/:subscriptionlineid'],
                view: SubscriptionsAddOnDetailsView,
                defaultTemplate: {
                    name: 'subscriptions_addon_details.tpl',
                    displayName: 'Subscription details default',
                    thumbnail: Utils.getAbsoluteUrl('img/default-layout-purchase-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'SubscriptionAdOnReview',
                routes: ['subscription-addon-details-review/:subscriptionid/:subscriptionlineid'],
                view: SubscriptionsAddOnReviewView,
                defaultTemplate: {
                    name: 'subscriptions_addon_review.tpl',
                    displayName: 'Subscription AddOn Review',
                    thumbnail: Utils.getAbsoluteUrl('img/default-layout-purchase-detail.png')
                }
            });
        }
    };
    return Subscriptions;
});

//# sourceMappingURL=Subscriptions.js.map
