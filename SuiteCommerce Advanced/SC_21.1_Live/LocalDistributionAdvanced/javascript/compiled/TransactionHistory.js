/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("TransactionHistory", ["require", "exports", "Utils", "TransactionHistory.List.View", "CreditMemo.Details.View", "DepositApplication.Details.View", "Deposit.Details.View", "CustomerPayment.Details.View", "Receipt.Details.View", "Invoice.Details.View"], function (require, exports, Utils, TransactionHistoryListView, CreditMemoDetailsView, DepositApplicationDetailsView, DepositDetailsView, CustomerPaymentDetailsView, ReceiptDetailsView, InvoiceDetailsView) {
    "use strict";
    var TransactionHistory = {
        mountToApp: function (application) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'TransactionHistory',
                routes: ['transactionhistory', 'transactionhistory?:options'],
                view: TransactionHistoryListView,
                defaultTemplate: {
                    name: 'transaction_history_list.tpl',
                    displayName: 'Transaction History Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-list.png')
                }
            });
            pageType.registerPageType({
                name: 'CreditMemoDetail',
                routes: ['transactionhistory/creditmemo/:id'],
                view: CreditMemoDetailsView,
                defaultTemplate: {
                    name: 'credit_memo_details.tpl',
                    displayName: 'Credit Memo Detail Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'DepositApplicationDetail',
                routes: ['transactionhistory/depositapplication/:id'],
                view: DepositApplicationDetailsView,
                defaultTemplate: {
                    name: 'deposit_application_details.tpl',
                    displayName: 'Deposit Application Details Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'DepositDetail',
                routes: ['transactionhistory/customerdeposit/:id'],
                view: DepositDetailsView,
                defaultTemplate: {
                    name: 'deposit_details.tpl',
                    displayName: 'Deposit Detail Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'PaymentDetail',
                routes: ['transactionhistory/customerpayment/:id'],
                view: CustomerPaymentDetailsView,
                defaultTemplate: {
                    name: 'customer_payment_details.tpl',
                    displayName: 'Payment Detail Default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-transaction-detail.png')
                }
            });
            pageType.registerPageType({
                name: 'OrderDetail',
                routes: ['transactionhistory/cashsale/:id'],
                view: ReceiptDetailsView
            });
            pageType.registerPageType({
                name: 'InvoiceDetail',
                routes: ['transactionhistory/invoices/:id'],
                view: InvoiceDetailsView
            });
        }
    };
    return TransactionHistory;
});

//# sourceMappingURL=TransactionHistory.js.map
