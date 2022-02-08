/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Balance", ["require", "exports", "Utils", "Balance.View"], function (require, exports, Utils, BalanceView) {
    "use strict";
    var Balance = {
        mountToApp: function (application) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'AccountBalance',
                routes: ['balance', 'balance?*params'],
                view: BalanceView,
                defaultTemplate: {
                    name: 'balance.tpl',
                    displayName: 'Account Balance Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-account-balance.png')
                }
            });
        }
    };
    return Balance;
});

//# sourceMappingURL=Balance.js.map
