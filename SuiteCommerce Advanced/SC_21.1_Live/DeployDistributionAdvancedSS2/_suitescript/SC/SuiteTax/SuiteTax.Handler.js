/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/log", "../Salesorder/RecordAccess/Salesorder.Dao", "../../Common/Format/Format", "underscore"], function (require, exports, log, Salesorder_Dao_1, Format_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SuiteTaxHandler = /** @class */ (function () {
        function SuiteTaxHandler() {
            this.format = Format_1.Format.getInstance();
        }
        SuiteTaxHandler.prototype.getSummaryTaxTotals = function (record) {
            var _this = this;
            var result;
            try {
                var taxTotals = record.executeMacro('getSummaryTaxTotals');
                result = [];
                if (taxTotals && taxTotals.response) {
                    result = _.map(taxTotals.response.taxTotals, function (tax) {
                        tax.taxTotal = _this.format.toCurrency(tax.taxTotal);
                        return tax;
                    });
                }
            }
            catch (error) {
                log.error({
                    title: 'Load Record Error',
                    details: "You may need to enable Suite Tax Feature. " + error
                });
                result = null;
            }
            return result;
        };
        SuiteTaxHandler.prototype.getTaxesFromId = function (id) {
            var dao = new Salesorder_Dao_1.SalesOrderDao();
            var objRecord = dao.loadRecord(id, {
                isDynamic: true
            });
            return this.getSummaryTaxTotals(objRecord);
        };
        SuiteTaxHandler.prototype.getTaxesFromRecord = function (record) {
            return this.getSummaryTaxTotals(record);
        };
        return SuiteTaxHandler;
    }());
    exports.SuiteTaxHandler = SuiteTaxHandler;
});
