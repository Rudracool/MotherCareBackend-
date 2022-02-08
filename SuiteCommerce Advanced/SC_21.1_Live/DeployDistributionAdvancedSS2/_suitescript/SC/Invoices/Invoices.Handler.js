/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./RecordAccess/Invoices.Dao", "../OrderHistory/OrderHistory.Handler"], function (require, exports, Invoices_Dao_1, OrderHistory_Handler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InvoicesHandler = /** @class */ (function (_super) {
        __extends(InvoicesHandler, _super);
        function InvoicesHandler() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.customColumnsKey = 'Invoices';
            _this.dao = new Invoices_Dao_1.InvoicesDao();
            _this.schema = _this.dao.getSchema();
            return _this;
        }
        InvoicesHandler.prototype.getInvoiceOrder = function (id, options) {
            var invoice = _super.prototype.get.call(this, id, options);
            var fields = this.schema.fields;
            var location = this.currentLoadedRecord.getValue(fields.location);
            invoice.lines.forEach(function (line) {
                line.quantityfulfilled = line.quantity;
                line.location = location;
                line.linegroup = 'instore';
            });
            var appliedToTransaction = [invoice.internalid];
            if (appliedToTransaction && appliedToTransaction.length) {
                invoice.adjustments = this.getRecordAdjustments({
                    paymentMethodInformation: true,
                    appliedToTransaction: appliedToTransaction
                }, invoice.internalid);
            }
            return invoice;
        };
        return InvoicesHandler;
    }(OrderHistory_Handler_1.OrderHistoryHandler));
    exports.InvoicesHandler = InvoicesHandler;
});
