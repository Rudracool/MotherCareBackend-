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
define(["require", "exports", "../Transaction/Transaction.Handler", "../Transaction/RecordAccess/Transaction.Dao"], function (require, exports, Transaction_Handler_1, Transaction_Dao_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TransactionHistoryHandler = /** @class */ (function (_super) {
        __extends(TransactionHistoryHandler, _super);
        function TransactionHistoryHandler() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.dao = new Transaction_Dao_1.TransactionDao();
            _this.customColumnsKey = 'TransactionHistory';
            return _this;
        }
        return TransactionHistoryHandler;
    }(Transaction_Handler_1.TransactionHandler));
    exports.TransactionHistoryHandler = TransactionHistoryHandler;
});
