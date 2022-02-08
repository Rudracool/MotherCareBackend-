/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReorderItems", ["require", "exports", "Utils", "Configuration", "ReorderItems.List.View"], function (require, exports, Utils, Configuration_1, ReorderItemsListView) {
    "use strict";
    var ReorderItems = {
        excludeFromMyAccount: SC.ENVIRONMENT.standalone && !Configuration_1.Configuration.get('myAccountPreferences.reorderEnabled'),
        mountToApp: function (application) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'ReorderHistory',
                routes: ['reorderItems', 'reorderItems?:options'],
                view: ReorderItemsListView,
                defaultTemplate: {
                    name: 'reorder_items_list.tpl',
                    displayName: 'Reorder history default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-list.png')
                }
            });
        }
    };
    return ReorderItems;
});

//# sourceMappingURL=ReorderItems.js.map
