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
define(["require", "exports", "../../Common/SearchRecord/Search", "../../Common/SearchRecord/SearchFilter", "../../Common/SearchRecord/SearchOperator", "../../Common/Schema/SchemaColumn", "../Transaction/Transaction.Handler", "./RecordAccess/ReturnAuthorization.Dao", "../../Common/Format/Format", "../StoreItem/StoreItem", "../../Common/Schema/SchemaField", "../../Common/HttpClient/HttpClient", "../Transaction/RecordAccess/Transaction.Dao"], function (require, exports, Search_1, SearchFilter_1, SearchOperator_1, SchemaColumn_1, Transaction_Handler_1, ReturnAuthorization_Dao_1, Format_1, StoreItem_1, SchemaField_1, HttpClient_1, Transaction_Dao_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReturnAuthorizationHandler = /** @class */ (function (_super) {
        __extends(ReturnAuthorizationHandler, _super);
        function ReturnAuthorizationHandler() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.customColumnsKey = 'ReturnAuthorization';
            _this.dao = new ReturnAuthorization_Dao_1.ReturnAuthorizationDao();
            _this.schema = _this.dao.getSchema();
            _this.format = Format_1.Format.getInstance();
            return _this;
        }
        ReturnAuthorizationHandler.prototype.getFilters = function (options) {
            var transactionDao = new Transaction_Dao_1.TransactionDao();
            var filterMap = _super.prototype.getFilters.call(this, options);
            var _a = this.dao.getSchema(), filters = _a.filters, joins = _a.joins;
            if (options.getLines) {
                filterMap.mainline = new SearchFilter_1.SearchFilter(filters.shipping, SearchOperator_1.SearchOperator.String.IS, '*');
                filterMap.shippingOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.shipping = new SearchFilter_1.SearchFilter(filters.shipping, SearchOperator_1.SearchOperator.String.IS, 'F');
                filterMap.taxlineOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.taxline = new SearchFilter_1.SearchFilter(filters.taxline, SearchOperator_1.SearchOperator.String.IS, 'F');
                filterMap.quantityOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.quantity = new SearchFilter_1.SearchFilter(filters.quantity, SearchOperator_1.SearchOperator.Number.NOTEQUALTO, 0);
                filterMap.cogsOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.cogs = new SearchFilter_1.SearchFilter(filters.cogs, SearchOperator_1.SearchOperator.String.IS, 'F');
                filterMap.transactiondiscountOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.transactiondiscount = new SearchFilter_1.SearchFilter(filters.transactiondiscount, SearchOperator_1.SearchOperator.String.IS, 'F');
                filterMap.typeOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.type = new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, [
                    'RtnAuth'
                ]);
            }
            if (this.isSCISIntegrationEnabled) {
                filterMap.scisrecordsOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.scisrecords = [
                    [
                        new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, ['CustCred']),
                        SearchOperator_1.SearchOperator.Logical.AND,
                        new SearchFilter_1.SearchFilter(joins.location.filters.locationtype, SearchOperator_1.SearchOperator.String.IS, this.configuration.get('locationTypeMapping.store.internalid')),
                        SearchOperator_1.SearchOperator.Logical.AND,
                        new SearchFilter_1.SearchFilter(filters.source, SearchOperator_1.SearchOperator.String.IS, '@NONE@')
                    ],
                    SearchOperator_1.SearchOperator.Logical.OR,
                    new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, ['RtnAuth'])
                ];
            }
            else {
                filterMap.typeOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.type = new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, [
                    'RtnAuth'
                ]);
            }
            if (options.createdfrom) {
                filterMap.createdfromOperator = SearchOperator_1.SearchOperator.Logical.OR;
                options.createdfrom = Array.isArray(options.createdfrom)
                    ? options.createdfrom
                    : options.createdfrom.split(',');
                var creatredFromFilters = [
                    [
                        new SearchFilter_1.SearchFilter(filters.createdfrom, SearchOperator_1.SearchOperator.Array.ANYOF, options.createdfrom),
                        SearchOperator_1.SearchOperator.Logical.AND,
                        new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, ['RtnAuth'])
                    ]
                ];
                if (this.isSCISIntegrationEnabled) {
                    creatredFromFilters.push(SearchOperator_1.SearchOperator.Logical.OR);
                    creatredFromFilters.push([
                        new SearchFilter_1.SearchFilter(new SchemaColumn_1.SchemaColumn('custbody_ns_pos_created_from'), SearchOperator_1.SearchOperator.Array.ANYOF, options.createdfrom),
                        SearchOperator_1.SearchOperator.Logical.AND,
                        [
                            new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, ['CustCred']),
                            SearchOperator_1.SearchOperator.Logical.AND,
                            new SearchFilter_1.SearchFilter(joins.location.filters.locationtype, SearchOperator_1.SearchOperator.String.IS, this.configuration.get('locationTypeMapping.store.internalid')),
                            SearchOperator_1.SearchOperator.Logical.AND,
                            new SearchFilter_1.SearchFilter(filters.source, SearchOperator_1.SearchOperator.String.IS, '@NONE@')
                        ]
                    ]);
                    filterMap.createdfrom = creatredFromFilters;
                }
                var search = transactionDao.createSearch();
                search.setFilters(_.values(filterMap));
                search.addColumn(this.transactionSchema.columns.internalid);
                var internalIds = _(search.getAll()).pluck('internalid');
                if (options.ids && options.ids.length) {
                    internalIds = _.intersection(internalIds, options.ids);
                }
                filterMap.internalidOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.internalid = new SearchFilter_1.SearchFilter(filters.internalid, SearchOperator_1.SearchOperator.Array.ANYOF, internalIds.length ? internalIds : [0]);
            }
            return filterMap;
        };
        ReturnAuthorizationHandler.prototype.addColumns = function (searchOptions) {
            var _this = this;
            _super.prototype.addColumns.call(this, searchOptions);
            this.query.addColumn(this.schema.columns.mainline);
            if (searchOptions.getLines) {
                var item = this.schema.joins.item;
                this.query.sortBy('lines');
                this.query.addColumn(this.schema.columns.rate);
                this.query.addColumn(this.schema.columns.total);
                this.query.addColumn(this.schema.columns.options);
                this.query.addColumn(this.schema.columns.line);
                this.query.addColumn(this.schema.columns.quantity);
                this.query.addColumn(this.schema.columns.options);
                this.query.addColumn(this.schema.columns.amount);
                this.query.addColumn(this.schema.columns.taxtotal, {
                    tax_amount: function (value) {
                        return _this.format.toFloat(_this.format.toCurrencyValue(Math.abs(Number(value))));
                    }
                });
                this.query.addColumn(item.columns.internalid, { internalid: this.format.toValue });
                this.query.addColumn(item.columns.type, { type: this.format.toValue });
                this.query.addColumn(item.columns.parent, { parent: this.format.toValue });
                this.query.addColumn(item.columns.displayname, { displayname: this.format.toValue });
                this.query.addColumn(item.columns.itemid, { itemid: this.format.toValue });
                this.query.addColumn(item.columns.storedisplayname, {
                    storedisplayname: this.format.toValue
                });
            }
        };
        ReturnAuthorizationHandler.prototype.search = function (options) {
            var _this = this;
            var searchPaginatedResult = _super.prototype.search.call(this, options);
            var results = searchPaginatedResult.records;
            var transactionDao = new Transaction_Dao_1.TransactionDao();
            if (options.getLines) {
                results.forEach(function (result) {
                    var lines = result.lines || [];
                    if (result.type) {
                        var line = {
                            internalid: result.internalid + "_" + result.line,
                            quantity: Math.abs(result.quantity),
                            rate: _this.format.toFloat(_this.format.toCurrencyValue(result.rate)),
                            rate_formatted: "" + _this.currencySymbol + result.rate,
                            tax_amount: _this.format.toFloat(_this.format.toCurrencyValue(result.tax_amount)),
                            tax_amount_formatted: "" + _this.currencySymbol + result.tax_amount,
                            amount: _this.format.toFloat(_this.format.toCurrencyValue(Math.abs(result.amount))),
                            amount_formatted: "" + _this.currencySymbol + Math.abs(result.amount),
                            options: _this.getOptions(String(result.options))
                        };
                        // preloadItems
                        if (result.internalid && line.internalid) {
                            var preloadedItem = StoreItem_1.StoreItem.getInstance().get(result.internalid, result.type);
                            var item = preloadedItem && preloadedItem.itemid
                                ? preloadedItem
                                : {
                                    internalid: Number(result.internalid),
                                    type: result.type,
                                    parent: result.parent,
                                    displayname: result.displayname,
                                    storedisplayname: result.storedisplayname,
                                    itemid: result.itemid
                                };
                            item.storedisplayname2 =
                                item.storedisplayname2 || item.storedisplayname;
                            item.pricelevel1 = line.rate;
                            item.pricelevel1_formatted = line.rate_formatted;
                            // If itemimages_detail is not present frontend
                            // throws an error that prevent the page to load
                            // itemimages_detail field is not accesible in SS2.
                            // TODO: Remove this when we can close this issue
                            // Issue 570967
                            if (!(item.itemimages_detail &&
                                item.itemimages_detail.media &&
                                item.itemimages_detail.media.urls &&
                                item.itemimages_detail.media.urls[0] &&
                                item.itemimages_detail.media.urls[0].url)) {
                                item.itemimages_detail = {
                                    media: {
                                        urls: [
                                            {
                                                altimagetext: 'alt image text',
                                                url: ''
                                            }
                                        ]
                                    }
                                };
                            }
                            // Issue 570967
                            line.item = item;
                            lines.push(line);
                        }
                        result.lines = lines;
                    }
                });
            }
            else if (searchPaginatedResult.records && searchPaginatedResult.records.length) {
                var filters = this.schema.filters;
                var quantityQuery = transactionDao.createSearch();
                quantityQuery.addColumn(this.schema.columns.internalidgroup);
                quantityQuery.addColumn(this.schema.columns.quantitysum);
                quantityQuery.setFilters([
                    new SearchFilter_1.SearchFilter(this.schema.filters.internalid, SearchOperator_1.SearchOperator.Array.ANYOF, _.pluck(searchPaginatedResult.records, 'internalid')),
                    SearchOperator_1.SearchOperator.Logical.AND,
                    new SearchFilter_1.SearchFilter(filters.mainline, SearchOperator_1.SearchOperator.String.IS, 'F'),
                    SearchOperator_1.SearchOperator.Logical.AND,
                    new SearchFilter_1.SearchFilter(filters.shipping, SearchOperator_1.SearchOperator.String.IS, 'F'),
                    SearchOperator_1.SearchOperator.Logical.AND,
                    new SearchFilter_1.SearchFilter(filters.shipping, SearchOperator_1.SearchOperator.String.IS, 'F'),
                    SearchOperator_1.SearchOperator.Logical.AND,
                    new SearchFilter_1.SearchFilter(filters.taxline, SearchOperator_1.SearchOperator.String.IS, 'F'),
                    SearchOperator_1.SearchOperator.Logical.AND,
                    new SearchFilter_1.SearchFilter(filters.cogs, SearchOperator_1.SearchOperator.String.IS, 'F')
                ]);
                var quantityResults_1 = quantityQuery.getAll();
                searchPaginatedResult.records.forEach(function (record) {
                    var quantityResult = _.find(quantityResults_1, {
                        internalid: record.internalid
                    });
                    record.quantity =
                        (quantityResult && Math.abs(Number(quantityResult.quantity))) || 0;
                });
            }
            searchPaginatedResult.records = _.filter(results, function (result) { return !!result.internalid; });
            return searchPaginatedResult;
        };
        ReturnAuthorizationHandler.prototype.get = function (id, options) {
            var result = _super.prototype.get.call(this, id, options);
            var _a = this.schema, fields = _a.fields, sublists = _a.sublists;
            result.isCancelable =
                result.recordtype === 'returnauthorization' &&
                    result.status.internalid === 'pendingApproval';
            var amountremaining = this.format.toCurrencyValue(this.currentLoadedRecord.getValue(fields.amountremaining));
            var amountpaid = this.format.toCurrencyValue(this.currentLoadedRecord.getValue(fields.amountpaid));
            if (this.isSCISIntegrationEnabled && result.recordtype === 'creditmemo') {
                result.amountpaid = Number(amountpaid);
                result.amountpaid_formatted = "" + this.currencySymbol + amountpaid;
                result.amountremaining = Number(amountremaining);
                result.amountremaining_formatted = "" + this.currencySymbol + amountremaining;
                var ids_1 = [];
                result.applies = [];
                var returnApplies_1 = {};
                var apply = sublists.apply.fields;
                for (var i = 1; i <= this.currentLoadedRecord.getLineCount(sublists.apply); i++) {
                    if (this.currentLoadedRecord.getSublistValue(apply.apply, i) === 'T') {
                        var internalid = this.currentLoadedRecord.getSublistValue(apply.internalid, i);
                        ids_1.push(parseInt(internalid, 10));
                        var amount = Math.abs(this.currentLoadedRecord.getSublistValue(apply.amount, i));
                        returnApplies_1[internalid] = {
                            line: i,
                            internalid: internalid,
                            tranid: this.currentLoadedRecord.getSublistValue(apply.refnum, i),
                            applydate: this.currentLoadedRecord.getSublistValue(apply.applydate, i),
                            recordtype: this.currentLoadedRecord.getSublistValue(apply.type, i),
                            currency: this.currentLoadedRecord.getSublistValue(apply.currency, i),
                            amount: amount,
                            amount_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(amount)
                        };
                    }
                }
                ids_1.map(this.getTransactionTypeFromId).forEach(function (type, index) {
                    returnApplies_1[ids_1[index]].recordtype = type;
                });
                // avoid duplicates
                result.applies = _.values(returnApplies_1);
            }
            result.lines = _.reject(result.lines, function (line) {
                return line.quantity === 0;
            });
            return result;
        };
        ReturnAuthorizationHandler.prototype.getRecordCreatedFrom = function () {
            var createdFromInternalid;
            var createdFromName;
            var custField = new SchemaField_1.SchemaField('custbody_ns_pos_created_from');
            if (this.isSCISIntegrationEnabled && this.currentRecordResult.recordtype === 'creditmemo') {
                createdFromInternalid = this.currentLoadedRecord.getValue(custField);
                createdFromName = this.currentLoadedRecord.getText(custField);
            }
            else {
                var createdFromResult = Search_1.Search.lookupFields([this.schema.columns.createdfrom], this.currentRecordResult.recordtype, Number(this.currentRecordResult.internalid));
                createdFromInternalid = createdFromResult && createdFromResult.internalid.value;
                createdFromName = createdFromResult && createdFromResult.internalid.text;
            }
            var type = createdFromInternalid
                ? this.getTransactionTypeFromId(Number(createdFromInternalid))
                : '';
            var tranidResult = type &&
                Search_1.Search.lookupFields([this.schema.columns.tranid], type, Number(createdFromInternalid));
            var tranid = tranidResult ? tranidResult.tranid.value : '';
            return {
                internalid: createdFromInternalid,
                name: createdFromName,
                recordtype: type,
                tranid: tranid
            };
        };
        ReturnAuthorizationHandler.prototype.create = function (data) {
            var _this = this;
            var _a = this.schema, filters = _a.filters, columns = _a.columns, sublists = _a.sublists;
            var returnAuthorization = this.dao.transformRecord({
                fromSchema: { type: data.type },
                id: Number(data.id)
            });
            var search = this.dao.createSearch();
            var searchFilters = [
                new SearchFilter_1.SearchFilter(filters.mainline, SearchOperator_1.SearchOperator.String.IS, 'F'),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(filters.internalid, SearchOperator_1.SearchOperator.String.IS, data.id)
            ];
            search.addColumn(columns.line, {
                line: function (value) { return "" + data.id + _this.format.toValue(value); }
            });
            search.addColumn(columns.rate);
            search.setFilters(searchFilters);
            var transactionLines = search.getAll();
            var lineCount = returnAuthorization.getLineCount(sublists.item);
            var i = 0;
            while (i < lineCount) {
                var lineItemValue = returnAuthorization.getSublistValue(sublists.item.fields.id, i);
                var addLine = _.findWhere(data.lines, {
                    id: lineItemValue
                });
                if (addLine) {
                    var transactionLine = _.findWhere(transactionLines, {
                        line: lineItemValue
                    });
                    returnAuthorization.selectLine(sublists.item, i);
                    if (transactionLine) {
                        returnAuthorization.setCurrentSublistValue(sublists.item.fields.rate, transactionLine.rate);
                    }
                    returnAuthorization.setCurrentSublistValue(sublists.item.fields.quantity, addLine.quantity);
                    returnAuthorization.setCurrentSublistValue(sublists.item.fields.description, addLine.reason);
                    returnAuthorization.commitLine(sublists.item);
                    i++;
                }
                else {
                    var itemType = returnAuthorization.getSublistValue(sublists.item.fields.itemtype, i);
                    if (itemType === 'GiftCert') {
                        returnAuthorization.removeLine(sublists.item, i);
                        lineCount--;
                    }
                    else {
                        returnAuthorization.selectLine(sublists.item, i);
                        returnAuthorization.setCurrentSublistValue(sublists.item.fields.quantity, 0);
                        returnAuthorization.commitLine(sublists.item);
                        i++;
                    }
                }
            }
            returnAuthorization.setValue(this.schema.fields.memo, data.comments);
            return returnAuthorization.save();
        };
        ReturnAuthorizationHandler.prototype.updateStatus = function (id, status, headers) {
            if (status === 'cancelled') {
                var url = "https://" + this.runtime.getHost() + "/app/accounting/transactions/returnauthmanager.nl?type=cancel&id=" + id;
                new HttpClient_1.HttpClient().get(url, headers);
            }
        };
        return ReturnAuthorizationHandler;
    }(Transaction_Handler_1.TransactionHandler));
    exports.ReturnAuthorizationHandler = ReturnAuthorizationHandler;
});
