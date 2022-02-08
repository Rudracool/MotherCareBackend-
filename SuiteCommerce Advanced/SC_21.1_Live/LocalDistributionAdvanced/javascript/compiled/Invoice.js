/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Invoice", ["require", "exports", "Utils", "Invoice.Details.View", "Invoice.OpenList.View", "Invoice.PaidList.View"], function (require, exports, Utils, InvoiceDetailsView, InvoiceOpenListView, InvoicePaidListView) {
    "use strict";
    var Invoice = {
        mountToApp: function (application) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'InvoiceDetail',
                routes: ['invoices/:id', 'invoices/:id/:referrer'],
                view: InvoiceDetailsView,
                defaultTemplate: {
                    name: 'invoice_details.tpl',
                    displayName: 'Invoice Detail Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-invoice-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'OpenInvoicesHistory',
                routes: ['invoices', 'invoices?*options'],
                view: InvoiceOpenListView,
                defaultTemplate: {
                    name: 'invoice_open_list.tpl',
                    displayName: 'Open Invoices History Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-list.png')
                }
            });
            pageType.registerPageType({
                name: 'PaidInvoicesHistory',
                routes: ['paid-invoices', 'paid-invoices?*options'],
                view: InvoicePaidListView,
                defaultTemplate: {
                    name: 'invoice_paid_list.tpl',
                    displayName: 'Paid Invoices History Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-list.png')
                }
            });
        }
    };
    return Invoice;
});

//# sourceMappingURL=Invoice.js.map
