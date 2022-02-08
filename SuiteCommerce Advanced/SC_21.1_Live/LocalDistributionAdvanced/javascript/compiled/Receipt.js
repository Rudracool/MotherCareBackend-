/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Receipt", ["require", "exports", "Utils", "Receipt.Details.View"], function (require, exports, Utils, ReceiptDetailsView) {
    "use strict";
    // Receipt.js
    // -----------------
    // Defines the Receipt module (Model, Collection, Views, Router)
    var Receipt = {
        mountToApp: function (application) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'OrderDetail',
                routes: ['receiptshistory/view/:id'],
                view: ReceiptDetailsView,
                defaultTemplate: {
                    name: 'receipt_details.tpl',
                    displayName: 'Order Detail Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-order-detail.png')
                }
            });
        }
    };
    return Receipt;
});

//# sourceMappingURL=Receipt.js.map
