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
define(["require", "exports", "./Invoice.Schema", "../../Transaction/RecordAccess/Transaction.Dao"], function (require, exports, Invoice_Schema_1, Transaction_Dao_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InvoicesDao = /** @class */ (function (_super) {
        __extends(InvoicesDao, _super);
        function InvoicesDao() {
            var _this = _super.call(this) || this;
            _this.schema = Invoice_Schema_1.InvoiceSchema.getInstance();
            _this.getSchema().columns.formulanumeric.formula = '{amountremaining} / {exchangerate}';
            return _this;
        }
        return InvoicesDao;
    }(Transaction_Dao_1.TransactionDao));
    exports.InvoicesDao = InvoicesDao;
});
