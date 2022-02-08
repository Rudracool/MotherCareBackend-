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
define(["require", "exports", "../../../Common/Environment/Environment", "./Transaction.Schema", "../../../Common/Dao/Dao", "../../../Common/Schema/SchemaColumn", "../../Libraries/Configuration/Configuration"], function (require, exports, Environment_1, Transaction_Schema_1, Dao_1, SchemaColumn_1, Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TransactionDao = /** @class */ (function (_super) {
        __extends(TransactionDao, _super);
        function TransactionDao() {
            var _this = _super.call(this) || this;
            _this.transactionSchema = Transaction_Schema_1.TransactionSchema.getInstance();
            _this.schema = _this.transactionSchema;
            _this.configuration = Configuration_1.Configuration.getInstance();
            if (Environment_1.Environment.getInstance().isFeatureInEffect('MULTICURRENCY')) {
                _this.getSchema().filters.amount = new SchemaColumn_1.SchemaColumn('fxamount');
                _this.getSchema().filters.appliedtolinkamount = new SchemaColumn_1.SchemaColumn('appliedtoforeignamount');
                _this.getSchema().columns.amount = new SchemaColumn_1.SchemaColumn('fxamount');
                _this.getSchema().columns.appliedtolinkamount = new SchemaColumn_1.SchemaColumn('appliedtoforeignamount');
            }
            return _this;
        }
        TransactionDao.prototype.getCustomColumns = function (name) {
            var _this = this;
            var customColumns = [];
            var configColumns = this.configuration.get('transactionListColumns');
            if (name && configColumns && configColumns['enable' + name]) {
                var lowerCaseName = name[0].toLowerCase() + name.substring(1);
                _.each(configColumns[lowerCaseName], function (column) {
                    if (!_.find(_this.getSchema().columns, function (schColumn) { return schColumn.columnName === column.id; })) {
                        customColumns.push(new SchemaColumn_1.SchemaColumn(column.id));
                    }
                });
            }
            return customColumns;
        };
        return TransactionDao;
    }(Dao_1.Dao));
    exports.TransactionDao = TransactionDao;
});
