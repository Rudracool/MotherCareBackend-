/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Header.Menu.MyAccount.View", ["require", "exports", "underscore", "header_menu_myaccount.tpl", "Utils", "MyAccountMenu", "jQuery", "Configuration", "ProductList.Utils", "Backbone.View"], function (require, exports, _, header_menu_myaccount_tpl, Utils, MyAccountMenu_1, jQuery, Configuration_1, ProductList_Utils_1, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: header_menu_myaccount_tpl,
        initialize: function () {
            this.productListModule = new ProductList_Utils_1.ProductListUtils(this.options.application);
            this.isProductListEnabled = this.productListModule.isProductListEnabled();
            this.debounced_render = _.debounce(_.bind(this.render, this), 250);
            if (this.isProductListEnabled) {
                this.productListsPromise = this.productListModule.getProductListsPromise();
            }
            else {
                this.productListsPromise = jQuery.Deferred();
            }
            MyAccountMenu_1.MyAccountMenu.getInstance()
                .getEmitter()
                .on('entriesChanged', this.debounced_render);
        },
        render: function () {
            this._render();
            if (this.$('.header-menu-myaccount-level3-orders').children().length === 1) {
                // All children menu of the order section have been removed (lack of permissions)
                // and only the back options is present
                this.$('.header-menu-myaccount-level2-orders').remove();
            }
        },
        destroy: function () {
            MyAccountMenu_1.MyAccountMenu.getInstance()
                .getEmitter()
                .off('entriesChanged', this.debounced_render);
            this._destroy();
        },
        getContext: function () {
            var product_list_collection = [];
            if (this.isProductListEnabled) {
                product_list_collection = this.productListModule.getProductLists();
                product_list_collection.each(function (product_list) {
                    var url = 'wishlist/' +
                        (product_list.get('internalid') || 'tmpl_' + product_list.get('templateId'));
                    product_list.set('url', url, { silent: true });
                });
            }
            var isSCISIntegrationEnabled = Configuration_1.Configuration.get('siteSettings.isSCISIntegrationEnabled', false);
            // @class Header.Profile.View.Context
            return {
                // @property {Boolean} isProductListsEnabled
                isProductListsEnabled: !!this.isProductListEnabled,
                // @property {Boolean} isSingleList
                isSingleList: !!this.productListModule.isSingleList(),
                // @property {Boolean} isCaseModuleEnabled
                isCaseModuleEnabled: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.casesManagementEnabled,
                // @property {Boolean} productListsReady
                productListsReady: this.productListsPromise.state() === 'resolved',
                // @property {ProductList.Collection|Array} productLists
                productLists: product_list_collection,
                // @property {Boolean} purchasesPermissions
                purchasesPermissions: isSCISIntegrationEnabled
                    ? 'transactions.tranFind.1,transactions.tranPurchases.1'
                    : 'transactions.tranFind.1,transactions.tranSalesOrd.1',
                // @property {Boolean} returnsPermissions
                returnsPermissions: isSCISIntegrationEnabled
                    ? 'transactions.tranFind.1,transactions.tranPurchasesReturns.1'
                    : 'transactions.tranFind.1,transactions.tranRtnAuth.1',
                entries: MyAccountMenu_1.MyAccountMenu.getInstance().getEntries(),
                // @property {Boolean} showMyAccountMenu
                showMyAccountMenu: !(this.options.application.isStandalone() &&
                    Configuration_1.Configuration.currentTouchpoint === 'customercenter' &&
                    !Utils.isPhoneDevice())
            };
        }
    });
});

//# sourceMappingURL=Header.Menu.MyAccount.View.js.map
