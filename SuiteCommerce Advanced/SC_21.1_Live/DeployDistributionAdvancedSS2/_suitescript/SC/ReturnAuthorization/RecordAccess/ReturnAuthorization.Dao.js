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
define(["require", "exports", "./ReturnAuthorization.Schema", "../../Transaction/RecordAccess/Transaction.Dao"], function (require, exports, ReturnAuthorization_Schema_1, Transaction_Dao_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReturnAuthorizationDao = /** @class */ (function (_super) {
        __extends(ReturnAuthorizationDao, _super);
        function ReturnAuthorizationDao() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.schema = ReturnAuthorization_Schema_1.ReturnAuthorizationSchema.getInstance();
            return _this;
        }
        return ReturnAuthorizationDao;
    }(Transaction_Dao_1.TransactionDao));
    exports.ReturnAuthorizationDao = ReturnAuthorizationDao;
});
