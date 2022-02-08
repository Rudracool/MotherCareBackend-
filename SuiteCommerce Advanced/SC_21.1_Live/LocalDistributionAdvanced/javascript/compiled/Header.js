/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Header", ["require", "exports", "MyAccountMenu", "Utils", "Configuration", "ProductList.Utils"], function (require, exports, MyAccountMenu_1, Utils, Configuration_1, ProductList_Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mountToApp(application) {
        var myAccountMenu = MyAccountMenu_1.MyAccountMenu.getInstance();
        var siteSettings = application.getConfig().siteSettings;
        // Overview
        if ((!Utils.isPhoneDevice() && siteSettings.sitetype === 'STANDARD') ||
            siteSettings.sitetype !== 'STANDARD') {
            myAccountMenu.addEntry({
                id: 'home',
                name: Utils.translate('Overview'),
                url: 'overview',
                index: 0
            });
        }
        if (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.subscriptions) {
            myAccountMenu.addEntry({
                id: 'subscriptions',
                name: Utils.translate('Subscriptions'),
                url: 'subscriptions-list',
                index: 1,
                permission: 'lists.listSubscriptions.1'
            });
        }
        // Balance
        myAccountMenu.addEntry({
            name: Utils.translate('Billing'),
            id: 'billing',
            index: 3
        });
        myAccountMenu.addSubEntry({
            entryId: 'billing',
            id: 'balance',
            name: Utils.translate('Account Balance'),
            url: 'balance',
            index: 1
        });
        myAccountMenu.addSubEntry({
            entryId: 'billing',
            id: 'invoices',
            name: Utils.translate('Invoices'),
            url: 'invoices',
            index: 2,
            permission: 'transactions.tranCustInvc.1'
        });
        myAccountMenu.addSubEntry({
            entryId: 'billing',
            id: 'transactionhistory',
            name: Utils.translate('Transaction History'),
            url: 'transactionhistory',
            permissionOperator: 'OR',
            permission: 'transactions.tranCustInvc.1, transactions.tranCustCred.1, transactions.tranCustPymt.1, transactions.tranCustDep.1, transactions.tranDepAppl.1',
            index: 3
        });
        myAccountMenu.addSubEntry({
            entryId: 'billing',
            id: 'printstatement',
            name: Utils.translate('Print a Statement'),
            url: 'printstatement',
            index: 4,
            permission: 'transactions.tranStatement.2'
        });
        // Cases
        if (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.casesManagementEnabled) {
            myAccountMenu.addEntry({
                id: 'cases',
                name: Utils.translate('Cases'),
                index: 6,
                permission: 'lists.listCase.2'
            });
            myAccountMenu.addSubEntry({
                entryId: 'cases',
                id: 'cases_all',
                name: Utils.translate('Support Cases'),
                url: 'cases',
                index: 1
            });
            myAccountMenu.addSubEntry({
                entryId: 'cases',
                id: 'newcase',
                name: Utils.translate('Submit New Case'),
                url: 'newcase',
                index: 2
            });
        }
        var isSCISIntegrationEnabled = Configuration_1.Configuration.get('siteSettings.isSCISIntegrationEnabled', false);
        // Purchases
        myAccountMenu.addEntry({
            id: 'orders',
            name: Utils.translate('Purchases'),
            index: 2,
            permission: isSCISIntegrationEnabled
                ? 'transactions.tranPurchases.1,transactions.tranEstimate.1,transactions.tranPurchasesReturns.1'
                : 'transactions.tranSalesOrd.1,transactions.tranEstimate.1,transactions.tranRtnAuth.1',
            permissionOperator: 'OR'
        });
        myAccountMenu.addSubEntry({
            entryId: 'orders',
            id: 'purchases',
            name: Utils.translate('Purchase History'),
            url: 'purchases',
            index: 1,
            permission: isSCISIntegrationEnabled
                ? 'transactions.tranFind.1,transactions.tranPurchases.1'
                : 'transactions.tranFind.1,transactions.tranSalesOrd.1'
        });
        myAccountMenu.addSubEntry({
            entryId: 'orders',
            id: 'returns',
            name: Utils.translate('Returns'),
            url: 'returns',
            index: 2,
            permission: isSCISIntegrationEnabled
                ? 'transactions.tranFind.1,transactions.tranPurchasesReturns.1'
                : 'transactions.tranFind.1,transactions.tranRtnAuth.1'
        });
        var isStandalone = SC && SC.ENVIRONMENT && SC.ENVIRONMENT.standalone;
        if (!isStandalone || (isStandalone && application.isReorderEnabled())) {
            myAccountMenu.addSubEntry({
                entryId: 'orders',
                id: 'reorderitems',
                name: Utils.translate('Reorder Items'),
                url: 'reorderItems',
                index: 4,
                permission: isSCISIntegrationEnabled
                    ? 'transactions.tranFind.1,transactions.tranPurchases.1'
                    : 'transactions.tranFind.1,transactions.tranSalesOrd.1'
            });
        }
        myAccountMenu.addSubEntry({
            entryId: 'orders',
            id: 'quotes',
            name: Utils.translate('Quotes'),
            url: 'quotes',
            index: 5,
            permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
        });
        // Product list
        var productListModule = new ProductList_Utils_1.ProductListUtils(application);
        if (productListModule.isProductListEnabled()) {
            myAccountMenu.addEntry({
                id: 'product_list_dummy',
                name: productListModule.isSingleList()
                    ? Utils.translate('Loading list...')
                    : Utils.translate('Loading lists...'),
                url: '',
                index: 3
            });
        }
        // Settings
        myAccountMenu.addEntry({
            id: 'settings',
            name: Utils.translate('Settings'),
            index: 5
        });
        myAccountMenu.addSubEntry({
            entryId: 'settings',
            id: 'profileinformation',
            name: Utils.translate('Profile Information'),
            url: 'profileinformation',
            index: 1
        });
        myAccountMenu.addSubEntry({
            entryId: 'settings',
            id: 'emailpreferences',
            name: Utils.translate('Email Preferences'),
            url: 'emailpreferences',
            index: 2
        });
        myAccountMenu.addSubEntry({
            entryId: 'settings',
            id: 'addressbook',
            name: Utils.translate('Address Book'),
            url: 'addressbook',
            index: 3
        });
        myAccountMenu.addSubEntry({
            entryId: 'settings',
            id: 'paymentmethods',
            name: Utils.translate('Payment Methods'),
            url: 'paymentmethods',
            index: 4
        });
        myAccountMenu.addSubEntry({
            entryId: 'settings',
            id: 'updateyourpassword',
            name: Utils.translate('Update Your Password'),
            url: 'updateyourpassword',
            index: 5
        });
        var password_protected_site = SC.ENVIRONMENT.siteSettings.siteloginrequired === 'T';
        var isLoggedIn = SC.ENVIRONMENT.siteSettings.is_logged_in;
        if (productListModule.isProductListEnabled() && (!password_protected_site || isLoggedIn)) {
            productListModule
                .getProductListsPromise()
                .done(function () { return productListModule.updateProductListMenu(); });
        }
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=Header.js.map
