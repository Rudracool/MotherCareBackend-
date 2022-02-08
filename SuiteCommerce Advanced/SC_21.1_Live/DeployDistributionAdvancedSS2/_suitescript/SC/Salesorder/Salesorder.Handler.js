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
define(["require", "exports", "../../Common/SearchRecord/Search", "./RecordAccess/Salesorder.Dao", "../../third_parties/bignumber", "../Libraries/Address/Address", "../../Common/SearchRecord/SearchFilter", "../../Common/SearchRecord/SearchOperator", "../../Common/HttpClient/HttpClient", "../../Common/Website/Website", "../OrderHistory/OrderHistory.Handler", "../../Common/Format/Format"], function (require, exports, Search_1, Salesorder_Dao_1, bignumber_1, Address_1, SearchFilter_1, SearchOperator_1, HttpClient_1, Website_1, OrderHistory_Handler_1, Format_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FulfillmentChoices;
    (function (FulfillmentChoices) {
        FulfillmentChoices["SHIP"] = "1";
        FulfillmentChoices["PICKUP"] = "2";
        FulfillmentChoices["SHIPTEXT"] = "ship";
        FulfillmentChoices["PICKUPTEXT"] = "pickup";
    })(FulfillmentChoices || (FulfillmentChoices = {}));
    var SalesOrderHandler = /** @class */ (function (_super) {
        __extends(SalesOrderHandler, _super);
        function SalesOrderHandler() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.customColumnsKey = 'orderHistory';
            _this.dao = new Salesorder_Dao_1.SalesOrderDao();
            _this.query = _this.dao.createSearch();
            _this.schema = _this.dao.getSchema();
            _this.pickPackShipIsEnabled = _this.runtime.isFeatureInEffect('PICKPACKSHIP');
            _this.isPickupInStoreEnabled = _this.configuration.get('isPickupInStoreEnabled') &&
                _this.runtime.isFeatureInEffect('STOREPICKUP');
            _this.format = Format_1.Format.getInstance();
            return _this;
        }
        SalesOrderHandler.prototype.addColumns = function () {
            _super.prototype.addColumns.call(this);
            this.query.addColumn(this.schema.columns.trackingnumbers, {
                trackingnumbers: function (value) { return value && value.split('<BR>'); }
            });
            if (this.isSCISIntegrationEnabled) {
                this.query.addColumn(this.schema.columns.formulatext, { origin: Number });
            }
        };
        SalesOrderHandler.prototype.getFilters = function (options) {
            var filterMap = _super.prototype.getFilters.call(this, options);
            var filters = this.schema.filters;
            var filter = (options.filter || [null])[0];
            if (filter === 'status:open') {
                filterMap.typeOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.type = new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, [
                    'SalesOrd'
                ]);
                filterMap.statusOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.status = new SearchFilter_1.SearchFilter(filters.status, SearchOperator_1.SearchOperator.Array.ANYOF, [
                    'SalesOrd:A',
                    'SalesOrd:B',
                    'SalesOrd:D',
                    'SalesOrd:E',
                    'SalesOrd:F'
                ]);
            }
            else if (this.isSCISIntegrationEnabled) {
                var scisFilter = [
                    SearchOperator_1.SearchOperator.Logical.AND,
                    new SearchFilter_1.SearchFilter(filters.createdfromtype, SearchOperator_1.SearchOperator.Array.NONEOF, [
                        'SalesOrd'
                    ]),
                    SearchOperator_1.SearchOperator.Logical.AND,
                    new SearchFilter_1.SearchFilter(this.schema.joins.location.filters.locationtype, SearchOperator_1.SearchOperator.String.IS, this.configuration.get('locationTypeMapping.store.internalid')),
                    SearchOperator_1.SearchOperator.Logical.AND,
                    new SearchFilter_1.SearchFilter(filters.source, SearchOperator_1.SearchOperator.Array.ANYOF, ['@NONE@', 'SCIS'])
                ];
                if (filter === 'origin:instore') {
                    // SCIS Integration enabled, only In Store
                    // records (Including Sales Orders from SCIS)
                    filterMap.scisrecordsOperator = SearchOperator_1.SearchOperator.Logical.AND;
                    scisFilter.unshift(new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, [
                        'CashSale',
                        'CustInvc',
                        'SalesOrd'
                    ]));
                    filterMap.scisrecords = scisFilter;
                }
                else {
                    // SCIS Integration enabled, all records
                    delete filterMap.typeOperator;
                    delete filterMap.type;
                    filterMap.scisrecordsOperator = SearchOperator_1.SearchOperator.Logical.AND;
                    scisFilter.unshift(new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, [
                        'CashSale',
                        'CustInvc'
                    ]));
                    filterMap.scisrecords = [
                        scisFilter,
                        SearchOperator_1.SearchOperator.Logical.OR,
                        new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, ['SalesOrd'])
                    ];
                }
            }
            else {
                // SCIS Integration is disabled, show all the Sales Orders
                filterMap.typeOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.type = new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, [
                    'SalesOrd'
                ]);
            }
            var email = this.user.getEmail();
            var siteSettings = this.runtime
                .getCurrentWebsite()
                .getSiteSettings([Website_1.WebsiteSetting.cartsharingmode]);
            if (siteSettings && siteSettings.cartsharingmode === 'PER_CONTACT' && email) {
                filterMap.emailOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.email = new SearchFilter_1.SearchFilter(filters.email, SearchOperator_1.SearchOperator.String.IS, email);
            }
            return filterMap;
        };
        SalesOrderHandler.prototype.removePrices = function (line) {
            delete line.item.onlinecustomerprice_detail;
            delete line.item.pricelevel1;
            delete line.item.pricelevel2;
            delete line.item.pricelevel3;
            delete line.item.pricelevel4;
            delete line.item.pricelevel5;
            delete line.item.pricelevel1_formatted;
            delete line.item.pricelevel2_formatted;
            delete line.item.pricelevel3_formatted;
            delete line.item.pricelevel4_formatted;
            delete line.item.pricelevel5_formatted;
            return line;
        };
        SalesOrderHandler.prototype.getSalesOrder = function (id, options) {
            var transactionCommons = _super.prototype.get.call(this, id, options);
            var statusId = this.currentLoadedRecord.getValue(this.schema.fields.statusRef);
            var salesOrder = __assign({}, transactionCommons, { fulfillments: [], isCancelable: transactionCommons.status.internalid === 'pendingApproval', isReturnable: statusId !== 'pendingFulfillment' &&
                    statusId !== 'pendingApproval' &&
                    statusId !== 'closed' &&
                    statusId !== 'cancelled' });
            salesOrder.fulfillments = this.getSalesOrderFulfillments(salesOrder);
            var itemSublist = this.schema.sublists.item;
            for (var i = 0; i < salesOrder.lines.length; i++) {
                var lineGroupId = '';
                var item_fulfillment_choice = this.currentLoadedRecord.getSublistValue(itemSublist.fields.itemfulfillmentchoice, salesOrder.lines[i].index - 1);
                salesOrder.lines[i].location = this.currentLoadedRecord.getSublistValue(itemSublist.fields.location, salesOrder.lines[i].index - 1);
                if (item_fulfillment_choice) {
                    if (item_fulfillment_choice === FulfillmentChoices.SHIP) {
                        salesOrder.lines[i].fulfillmentChoice = FulfillmentChoices.SHIPTEXT;
                    }
                    else if (item_fulfillment_choice === FulfillmentChoices.PICKUP) {
                        salesOrder.lines[i].fulfillmentChoice = FulfillmentChoices.PICKUPTEXT;
                    }
                }
                if ((this.isPickupInStoreEnabled &&
                    salesOrder.lines[i].fulfillmentChoice === FulfillmentChoices.PICKUPTEXT) ||
                    (!salesOrder.ismultishipto &&
                        (!salesOrder.lines[i].isfulfillable || !salesOrder.shipaddress)) ||
                    (salesOrder.ismultishipto &&
                        (!salesOrder.lines[i].shipaddress || !salesOrder.lines[i].shipmethod))) {
                    lineGroupId =
                        (this.isSCISIntegrationEnabled && salesOrder.origin === 1) ||
                            (this.isPickupInStoreEnabled &&
                                salesOrder.lines[i].fulfillmentChoice === FulfillmentChoices.PICKUPTEXT)
                            ? 'instore'
                            : 'nonshippable';
                }
                else {
                    lineGroupId = 'shippable';
                }
                if (!salesOrder.lines[i].item.ispricevisible) {
                    salesOrder.lines[i] = this.removePrices(salesOrder.lines[i]);
                }
                salesOrder.lines[i].linegroup = lineGroupId;
            }
            var appliedToTransaction = _(_.where(salesOrder.receipts || [], { recordtype: 'invoice' })).pluck('internalid');
            if (appliedToTransaction && appliedToTransaction.length) {
                salesOrder.adjustments = this.getRecordAdjustments({
                    paymentMethodInformation: true,
                    appliedToTransaction: appliedToTransaction
                }, salesOrder.internalid);
            }
            return salesOrder;
        };
        SalesOrderHandler.prototype.getFulfillments = function (id) {
            var _a = this.schema, filters = _a.filters, columns = _a.columns, joins = _a.joins;
            var search = this.dao.createSearch();
            search.setFilters([
                new SearchFilter_1.SearchFilter(filters.internalid, SearchOperator_1.SearchOperator.String.IS, id),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(filters.mainline, SearchOperator_1.SearchOperator.String.IS, 'F'),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(filters.shipping, SearchOperator_1.SearchOperator.String.IS, 'F'),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(filters.taxline, SearchOperator_1.SearchOperator.String.IS, 'F')
            ]);
            var fulfilling = joins.fulfillingtransaction.columns;
            search.addColumn(columns.line);
            search.addColumn(columns.fulfillingtransaction, { internalid: this.format.toValue });
            search.addColumn(columns.quantityshiprecv);
            search.addColumn(columns.actualshipdate, { date: this.format.toValue });
            search.addColumn(columns.quantity, { quantity: Number });
            search.addColumn(fulfilling.item, { item: this.format.toValue });
            search.addColumn(fulfilling.shipmethod, { shipmethod: this.format.toValue });
            search.addColumn(fulfilling.shipto, { shipto: this.format.toValue });
            search.addColumn(fulfilling.trackingnumbers, {
                trackingnumbers: function (value) { return (value ? value.split('<BR>') : null); }
            });
            search.addColumn(fulfilling.trandate, { trandate: this.format.toValue });
            search.addColumn(fulfilling.status, { status: this.toTransactionField });
            search.addColumn(fulfilling.shipaddress, { shipaddress: this.format.toValue });
            search.addColumn(fulfilling.shipaddress1, { shipaddress1: this.format.toValue });
            search.addColumn(fulfilling.shipaddress2, { shipaddress2: this.format.toValue });
            search.addColumn(fulfilling.shipaddressee, { shipaddressee: this.format.toValue });
            search.addColumn(fulfilling.shipattention, { shipattention: this.format.toValue });
            search.addColumn(fulfilling.shipcity, { shipcity: this.format.toValue });
            search.addColumn(fulfilling.shipcountry, { shipcountry: this.format.toValue });
            search.addColumn(fulfilling.shipstate, { shipstate: this.format.toValue });
            search.addColumn(fulfilling.shipzip, { shipzip: this.format.toValue });
            if (this.pickPackShipIsEnabled) {
                search.addColumn(columns.quantitypicked);
                search.addColumn(columns.quantitypacked);
            }
            if (this.runtime.isFeatureInEffect('UNITSOFMEASURE')) {
                search.addColumn(columns.quantityuom);
            }
            var results = search.getAll();
            results.forEach(function (result) {
                var fulfillmentAddress = new Address_1.Address({
                    country: result.shipcountry,
                    state: result.shipstate,
                    city: result.shipcity,
                    zip: result.shipzip,
                    addr1: result.shipaddress1,
                    addr2: result.shipaddress2,
                    attention: result.shipattention,
                    addressee: result.shipaddressee
                });
                result.shipaddress = fulfillmentAddress.getId();
            });
            return results;
        };
        SalesOrderHandler.prototype.getSalesOrderFulfillments = function (salesOrder) {
            var _this = this;
            var fulfillments = this.getFulfillments(Number(salesOrder.internalid));
            fulfillments.forEach(function (fulfillment) {
                var lineId = salesOrder.internalid + "_" + fulfillment.line;
                var quantity = new bignumber_1.default(fulfillment.quantity);
                var zero = new bignumber_1.default(0);
                var fulfillmentId = fulfillment.internalid;
                if (fulfillmentId) {
                    var addr = new Address_1.Address({
                        country: fulfillment.shipcountry,
                        state: fulfillment.shipstate,
                        city: fulfillment.shipcity,
                        zip: fulfillment.shipzip,
                        addr1: fulfillment.shipaddress1,
                        addr2: fulfillment.shipaddress2,
                        attention: fulfillment.shipaddressee,
                        addressee: fulfillment.shipaddressee
                    });
                    if (addr.getId()) {
                        salesOrder.addresses.push(addr.getAddressBook());
                    }
                    var existingFullfilment = _.findWhere(fulfillments, { internalid: fulfillment.internalid });
                    if (existingFullfilment) {
                        existingFullfilment.lines = existingFullfilment.lines || [];
                        existingFullfilment.lines.push({
                            internalid: lineId,
                            quantity: Number(quantity)
                        });
                    }
                    if (!salesOrder.fulfillments[fulfillmentId]) {
                        var newFulfillment = {
                            internalid: fulfillmentId,
                            date: fulfillment.date,
                            lines: fulfillment.lines,
                            shipaddress: fulfillment.shipaddress,
                            shipmethod: fulfillment.shipmethod,
                            status: fulfillment.status,
                            trackingnumbers: fulfillment.trackingnumbers
                        };
                        salesOrder.fulfillments[fulfillmentId] = newFulfillment;
                    }
                }
                var existingLine = _.findWhere(salesOrder.lines, {
                    internalid: lineId
                });
                if (existingLine) {
                    var quantityUom = fulfillment.quantityuom
                        ? new bignumber_1.default(fulfillment.quantityuom)
                        : new bignumber_1.default(0);
                    var quantityFulfilled = new bignumber_1.default(fulfillment.quantityshiprecv);
                    var quantityPicked = new bignumber_1.default(fulfillment.quantitypicked);
                    var quantityPacked = new bignumber_1.default(fulfillment.quantitypacked);
                    var conversionUnits = quantity.gt(zero) && quantityUom.gt(zero)
                        ? quantity.dividedBy(quantityUom)
                        : new bignumber_1.default(1);
                    existingLine.quantityfulfilled = quantityFulfilled;
                    var existingLineQuantityPacked = void 0;
                    var existingLineQuantityPicked = void 0;
                    var existingLineQuantitybackordered = void 0;
                    if (existingLine.fulfillmentChoice &&
                        existingLine.fulfillmentChoice === 'pickup') {
                        existingLineQuantityPicked = _this.pickPackShipIsEnabled
                            ? quantityPicked.minus(quantityFulfilled)
                            : zero;
                        existingLineQuantitybackordered = quantity
                            .minus(quantityFulfilled)
                            .minus(existingLineQuantityPicked);
                    }
                    else {
                        existingLineQuantityPacked = _this.pickPackShipIsEnabled
                            ? quantityPacked.minus(quantityFulfilled)
                            : zero;
                        existingLineQuantityPicked = _this.pickPackShipIsEnabled
                            ? quantityPicked
                                .minus(existingLineQuantityPacked)
                                .minus(quantityFulfilled)
                            : zero;
                        existingLineQuantitybackordered = quantity
                            .minus(quantityFulfilled)
                            .minus(existingLineQuantityPacked)
                            .minus(existingLineQuantityPicked);
                        existingLineQuantityPacked = existingLineQuantitybackordered
                            .dividedBy(conversionUnits)
                            .toNumber();
                    }
                    existingLine.quantityfulfilled = quantityFulfilled
                        .dividedBy(conversionUnits)
                        .toNumber();
                    existingLine.quantitypicked = existingLineQuantityPicked
                        .dividedBy(conversionUnits)
                        .toNumber();
                    existingLine.quantitybackordered = existingLineQuantitybackordered
                        .dividedBy(conversionUnits)
                        .toNumber(); // Add big number type here
                }
            });
            return _.values(salesOrder.fulfillments);
        };
        SalesOrderHandler.prototype.updateStatus = function (id, status, headers) {
            var result = 'OK';
            if (status === 'cancelled') {
                var url = "https://" + this.runtime.getHost() + "/app/accounting/transactions/salesordermanager.nl?type=cancel&xml=T&id=" + id;
                var cancelResponse = new HttpClient_1.HttpClient().get(url, headers);
                if (cancelResponse.code === 206) {
                    var fields = Search_1.Search.lookupFields([this.schema.columns.statusRef], this.schema.type, id);
                    result =
                        fields.statusRef && fields.statusRef.value !== 'cancelled'
                            ? 'ERR_ALREADY_APPROVED_STATUS'
                            : 'ERR_ALREADY_CANCELLED_STATUS';
                }
            }
            return result;
        };
        return SalesOrderHandler;
    }(OrderHistory_Handler_1.OrderHistoryHandler));
    exports.SalesOrderHandler = SalesOrderHandler;
});
