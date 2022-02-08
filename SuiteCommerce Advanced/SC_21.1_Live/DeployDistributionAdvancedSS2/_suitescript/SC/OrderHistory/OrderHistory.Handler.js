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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports", "../../Common/SearchRecord/Search", "../ReturnAuthorization/ReturnAuthorization.Handler", "../Transaction/Transaction.Handler", "../Transaction/RecordAccess/Transaction.Dao"], function (require, exports, Search_1, ReturnAuthorization_Handler_1, Transaction_Handler_1, Transaction_Dao_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OrderHistoryHandler = /** @class */ (function (_super) {
        __extends(OrderHistoryHandler, _super);
        function OrderHistoryHandler() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.customColumnsKey = 'OrderHistory';
            _this.dao = new Transaction_Dao_1.TransactionDao();
            _this.schema = _this.dao.getSchema();
            return _this;
        }
        OrderHistoryHandler.prototype.getReturnAuthorizations = function (transaction, options) {
            var createdFrom = _(transaction.receipts || []).pluck('internalid');
            createdFrom.push(transaction.internalid);
            return new ReturnAuthorization_Handler_1.ReturnAuthorizationHandler().search(__assign({}, options, { createdfrom: createdFrom, getLines: true })).records;
        };
        OrderHistoryHandler.prototype.isSCISSource = function (source) {
            return !source || source === 'SCIS';
        };
        OrderHistoryHandler.prototype.getOrigin = function (record, recordType, internalId) {
            var origin = 0;
            var source = record.getValue(this.schema.fields.source);
            var locationResult = Search_1.Search.lookupFields([this.schema.joins.location.columns.locationtype], recordType, Number(internalId));
            if (this.isSCISIntegrationEnabled &&
                this.isSCISSource(source) &&
                record.getValue(this.schema.fields.location) &&
                locationResult.locationtype &&
                locationResult.locationtype.value ===
                    this.configuration.get('locationTypeMapping.store.internalid')) {
                origin = 1; // store
            }
            else if (source) {
                origin = 2; // online
            }
            return origin;
        };
        OrderHistoryHandler.prototype.get = function (id, options) {
            this.currentRecordId = Number(id);
            var fields = this.schema.fields;
            var transaction = _super.prototype.get.call(this, id, options);
            var transactionCommons = __assign({}, transaction, { returnauthorizations: this.getReturnAuthorizations(transaction, options), origin: this.getOrigin(this.currentLoadedRecord, this.schema.type.toString(), transaction.internalid), ismultishipto: this.currentLoadedRecord.getValue(fields.ismultishipto), receipts: _super.prototype.search.call(this, {
                    createdfrom: transaction.internalid,
                    filter: 'CustInvc,CashSale',
                    order: 0,
                    sort: null,
                    from: null,
                    to: null,
                    page: null
                }).records, isReturnable: true, paymentevent: this.currentLoadedRecord.getValue(fields.paymethtype) === 'external_checkout'
                    ? {
                        holdreason: this.currentLoadedRecord.getValue(fields.paymenteventholdreason),
                        redirecturl: this.generateUrl(transaction.internalid, this.schema.type.toString())
                    }
                    : {}, recordtype: transaction.recordtype
                    ? transaction.recordtype
                    : this.schema.type.toString() });
            return transactionCommons;
        };
        OrderHistoryHandler.prototype.getRecordTerms = function () {
            var fields = Search_1.Search.lookupFields([this.schema.columns.terms], this.schema.type, this.currentRecordId);
            return (fields.terms &&
                fields.terms &&
                fields.terms.value && {
                internalid: fields.terms.value,
                name: fields.terms.text
            });
        };
        return OrderHistoryHandler;
    }(Transaction_Handler_1.TransactionHandler));
    exports.OrderHistoryHandler = OrderHistoryHandler;
});
