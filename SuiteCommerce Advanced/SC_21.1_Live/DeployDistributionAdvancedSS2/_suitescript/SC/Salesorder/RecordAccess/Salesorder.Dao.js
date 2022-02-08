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
define(["require", "exports", "./Salesorder.Schema", "../../Transaction/RecordAccess/Transaction.Dao", "../../Libraries/Configuration/Configuration"], function (require, exports, Salesorder_Schema_1, Transaction_Dao_1, Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SalesOrderDao = /** @class */ (function (_super) {
        __extends(SalesOrderDao, _super);
        function SalesOrderDao() {
            var _this = _super.call(this) || this;
            _this.schema = Salesorder_Schema_1.SalesOrderSchema.getInstance();
            _this.getSchema().columns.formulatext.formula = "case when LENGTH({source})>0\n         then 2 else (case when {location.locationtype.id} =\n            " + Configuration_1.Configuration.getInstance().get('locationTypeMapping.store.internalid') + "\n            then 1 else 0 end) end";
            return _this;
        }
        return SalesOrderDao;
    }(Transaction_Dao_1.TransactionDao));
    exports.SalesOrderDao = SalesOrderDao;
});
