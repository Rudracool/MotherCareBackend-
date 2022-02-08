/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "../../Common/Environment/Environment", "./RecordAccess/Transaction.Dao", "../../Common/SearchRecord/Search", "../../Common/Format/Format", "../../Common/SearchRecord/SearchFilter", "../../Common/SearchRecord/SearchOperator", "../Libraries/Auth/User", "../Libraries/Configuration/Configuration", "../StoreItem/StoreItem", "../Salesorder/RecordAccess/Salesorder.Dao", "../../Common/Schema/SchemaField", "../../Common/Schema/SchemaColumn", "../Libraries/Address/Address", "../../Common/Schema/SchemaSublistField", "../../Common/Controller/RequestErrors", "../SuiteTax/SuiteTax.Handler"], function (require, exports, Environment_1, Transaction_Dao_1, Search_1, Format_1, SearchFilter_1, SearchOperator_1, User_1, Configuration_1, StoreItem_1, Salesorder_Dao_1, SchemaField_1, SchemaColumn_1, Address_1, SchemaSublistField_1, RequestErrors_1, SuiteTax_Handler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TransactionHandler = /** @class */ (function () {
        function TransactionHandler() {
            this.dao = new Transaction_Dao_1.TransactionDao();
            this.transactionSchema = this.dao.getSchema();
            this.query = this.dao.createSearch();
            this.runtime = Environment_1.Environment.getInstance();
            this.configuration = Configuration_1.Configuration.getInstance();
            this.format = Format_1.Format.getInstance();
            this.isMultiCurrency = this.runtime.isFeatureInEffect('MULTICURRENCY');
            this.isMultiSite = this.runtime.isFeatureInEffect('MULTISITE');
            this.isSCISIntegrationEnabled = this.configuration.get('isSCISIntegrationEnabled') &&
                !!Search_1.Search.lookupFields([new SchemaColumn_1.SchemaColumn('custbody_ns_pos_transaction_status')], new Salesorder_Dao_1.SalesOrderDao().getSchema().type);
            this.currencySymbol = this.runtime.getCurrentWebsite().getCurrency().displaysymbol;
            this.user = User_1.User.getInstance();
            this.transactionFields = this.transactionSchema.fields;
        }
        TransactionHandler.prototype.getFilters = function (options) {
            var filters = this.transactionSchema.filters;
            var filterMap = {};
            filterMap.entity = new SearchFilter_1.SearchFilter(filters.entity, SearchOperator_1.SearchOperator.String.IS, this.user.getId());
            filterMap.mainlineOperator = SearchOperator_1.SearchOperator.Logical.AND;
            filterMap.mainline = new SearchFilter_1.SearchFilter(filters.mainline, SearchOperator_1.SearchOperator.String.IS, 'T');
            filterMap.memorizedOperator = SearchOperator_1.SearchOperator.Logical.AND;
            filterMap.memorized = new SearchFilter_1.SearchFilter(filters.memorized, SearchOperator_1.SearchOperator.String.IS, 'F');
            if (options.from || options.to) {
                filterMap.dateOperator = SearchOperator_1.SearchOperator.Logical.AND;
            }
            if (options.from && options.to) {
                filterMap.date = new SearchFilter_1.SearchFilter(filters.trandate, SearchOperator_1.SearchOperator.Date.WITHIN, options.from, options.to);
            }
            else if (options.from) {
                filterMap.date = new SearchFilter_1.SearchFilter(filters.trandate, SearchOperator_1.SearchOperator.Date.ONORAFTER, options.from);
            }
            else if (options.to) {
                filterMap.date = new SearchFilter_1.SearchFilter(filters.trandate, SearchOperator_1.SearchOperator.Date.ONORBEFORE, options.to);
            }
            if (options.createdfrom) {
                filterMap.createdfromOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.createdfrom = new SearchFilter_1.SearchFilter(filters.createdfrom, SearchOperator_1.SearchOperator.String.IS, options.createdfrom);
            }
            if (options.filter) {
                filterMap.typeOperator = SearchOperator_1.SearchOperator.Logical.AND;
                filterMap.type = new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, options.filter);
            }
            if (this.isMultiSite) {
                var siteId = String(this.runtime.getCurrentWebsite().getId());
                var siteIds = [];
                var filterSite = this.configuration.get('filterSite') || this.configuration.get('filter_site');
                if (filterSite === 'current') {
                    siteIds.push(siteId);
                    siteIds.push('@NONE@');
                }
                else if (Array.isArray(filterSite)) {
                    siteIds.push.apply(siteIds, filterSite);
                    siteIds.push('@NONE@');
                }
                else if (filterSite && typeof filterSite === 'object' && filterSite.option) {
                    switch (filterSite.option) {
                        case 'siteIds':
                            siteIds.push.apply(siteIds, filterSite.ids);
                            break;
                        default:
                            // case 'current' (current site) is configuration default
                            siteIds.push(siteId);
                            siteIds.push('@NONE@');
                    }
                }
                if (siteIds.length) {
                    filterMap.siteOperator = SearchOperator_1.SearchOperator.Logical.AND;
                    filterMap.site = new SearchFilter_1.SearchFilter(filters.website, SearchOperator_1.SearchOperator.Array.ANYOF, _.uniq(siteIds));
                }
            }
            return filterMap;
        };
        TransactionHandler.prototype.toTransactionField = function (value, text) {
            return {
                internalid: value,
                name: text
            };
        };
        TransactionHandler.prototype.addColumns = function (searchOptions) {
            var _this = this;
            var columns = this.transactionSchema.columns;
            if (this.isMultiCurrency) {
                this.query.addColumn(columns.currency, { currency: this.toTransactionField });
            }
            this.query.addColumn(columns.internalid);
            this.query.addColumn(columns.tranid);
            this.query.addColumn(columns.trandate, { trandate: this.format.toDateString });
            this.query.addColumn(columns.amount, {
                amount_formatted: function (value) {
                    return _this.format.toCurrencyValue(Math.abs(value));
                },
                amount: Math.abs
            });
            this.query.addColumn(columns.status, {
                status: function (value, text) {
                    return _this.toTransactionField(_this.format.toCamelCase(value), text);
                },
                recordtype: function (value, text, type) { return type; }
            });
            this.dao.getCustomColumns(this.customColumnsKey).forEach(function (column) {
                _this.query.addColumn(column);
            });
        };
        TransactionHandler.prototype.search = function (options) {
            var _this = this;
            var from = options.from && options.from.split('-');
            var to = options.to && options.to.split('-');
            var filter = options.filter && options.filter.split(',');
            var sort = options.sort && options.sort.split(',');
            var searchOptions = {
                to: to && this.format.toDateString(to.join('/')),
                from: from && this.format.toDateString(from.join('/')),
                filter: filter,
                order: options.order,
                sort: sort || [],
                page: String(options.page),
                createdfrom: options.createdfrom,
                ids: options.ids,
                getLines: options.getLines
            };
            // add columns to search
            this.addColumns(searchOptions);
            // add filters to search
            this.query.setFilters(_.values(this.getFilters(searchOptions)));
            // search sort
            searchOptions.sort.forEach(function (sortKey) {
                _this.query.sortBy(sortKey, options.order > 0 ? Search_1.SearchColumnSort.DESC : Search_1.SearchColumnSort.ASC);
            });
            // fetch the result
            var result = this.query.getPaginated(options.page, options.results_per_page || this.configuration.get('suitescriptResultsPerPage'));
            // add currency symbol here (because of multicurrency)
            result.records.forEach(function (record) {
                record.amount_formatted = "" + _this.runtime
                    .getCurrentWebsite()
                    .getCurrency(record.currency ? Number(record.currency.internalid) : null)
                    .displaysymbol + record.amount_formatted;
            });
            return result;
        };
        TransactionHandler.prototype.getAddressHelper = function (record, addresses) {
            var address = new Address_1.Address({
                country: record.getValue(this.transactionSchema.fields.country),
                state: record.getValue(this.transactionSchema.fields.state),
                city: record.getValue(this.transactionSchema.fields.city),
                zip: record.getValue(this.transactionSchema.fields.zip),
                addr1: record.getValue(this.transactionSchema.fields.addr1),
                addr2: record.getValue(this.transactionSchema.fields.addr2),
                phone: record.getValue(this.transactionSchema.fields.addrphone),
                attention: record.getValue(this.transactionSchema.fields.attention),
                addressee: record.getValue(this.transactionSchema.fields.addressee)
            });
            if (address.getId()) {
                addresses.push(address.getAddressBook());
            }
            return address.getId();
        };
        TransactionHandler.prototype.getPurchaseNumber = function () {
            var otherrefnum = this.currentLoadedRecord.getValue(this.transactionSchema.fields.otherrefnum);
            return otherrefnum === 'undefined' ? undefined : Number(otherrefnum) || null;
        };
        TransactionHandler.prototype.getAddresses = function () {
            var addresses = [];
            var billSubrecord = this.currentLoadedRecord.getSubrecord(this.transactionSchema.fields.billingaddress);
            var shipSubrecord = this.currentLoadedRecord.getSubrecord(this.transactionSchema.fields.shippingaddress);
            var billAddress = this.getAddressHelper(billSubrecord, addresses);
            var shipAddress = this.getAddressHelper(shipSubrecord, addresses);
            return { billaddress: billAddress, shipaddress: shipAddress, addresses: addresses };
        };
        TransactionHandler.prototype.get = function (id, options) {
            var _this = this;
            var fields = this.transactionSchema.fields;
            this.currentLoadedRecord = this.dao.loadRecord(Number(id), {
                recordtype: options && options.recordtype
            });
            if (!id) {
                throw RequestErrors_1.notFoundError;
            }
            var currency = !this.isMultiCurrency
                ? this.runtime.getCurrentWebsite().getCurrency()
                : this.runtime
                    .getCurrentWebsite()
                    .getCurrency(Number(this.currentLoadedRecord.getValue(fields.currency)));
            this.currencySymbol = currency.displaysymbol;
            var address = this.getAddresses();
            var shipMethods = [];
            if (this.currentRecordResult && this.currentRecordResult.shipmethods.length > 0) {
                shipMethods = this.currentRecordResult.shipmethods;
            }
            this.currentRecordResult = {
                internalid: id,
                tranid: this.currentLoadedRecord.getValue(fields.tranid),
                trandate: this.format.toDateString(this.currentLoadedRecord.getValue(fields.trandate)),
                memo: this.currentLoadedRecord.getValue(fields.memo),
                addresses: address.addresses,
                lines: [],
                createdfrom: this.getRecordCreatedFrom(),
                status: this.getRecordStatus(),
                summary: this.getRecordSummary(),
                paymentmethods: this.getRecordPaymentMethods(),
                promocodes: this.getRecordPromoCodes(),
                purchasenumber: this.getPurchaseNumber(),
                billaddress: address.billaddress,
                shipaddress: address.shipaddress,
                shipmethods: shipMethods,
                shipmethod: this.currentLoadedRecord.getValue(fields.shipmethod) || null,
                options: _.mapObject(this.getRecordCustomFieldIds(), function (field) { return _this.currentLoadedRecord.getValue(new SchemaField_1.SchemaField(field)); })
            };
            if (this.isMultiCurrency) {
                this.currentRecordResult.currency = {
                    internalid: this.currentLoadedRecord.getValue(fields.currency),
                    name: this.currentLoadedRecord.getValue(fields.currencyname)
                };
                this.currentRecordResult.selected_currency = {
                    internalid: String(currency.currency),
                    symbol: currency.displaysymbol,
                    code: currency.symbol,
                    name: currency.name,
                    currencyname: currency.name,
                    isdefault: currency.isdefault ? 'T' : 'F',
                    symbolplacement: currency.symbolplacement
                };
            }
            if (this.runtime.isFeatureInEffect('tax_overhauling')) {
                var suiteTaxHandler = new SuiteTax_Handler_1.SuiteTaxHandler();
                this.currentRecordResult.taxesPerType = suiteTaxHandler.getTaxesFromRecord(this.currentLoadedRecord);
            }
            var shipSublist = this.transactionSchema.sublists.shipgroup;
            var shipLineCount = this.currentLoadedRecord.getLineCount(shipSublist);
            var uniqueIdFlag = [];
            if (shipLineCount <= 0) {
                var shippingRate = this.currentLoadedRecord.getValue(fields.shipping_rate);
                var shipid = this.currentLoadedRecord.getValue(fields.shipmethod);
                if (uniqueIdFlag.indexOf(shipid) < 0) {
                    this.currentRecordResult.shipmethods.push({
                        internalid: shipid,
                        name: this.currentLoadedRecord.getText(fields.shipmethod),
                        rate: Number(shippingRate || 0),
                        rate_formatted: "" + this.format.toCurrency(shippingRate),
                        shipcarrier: this.currentLoadedRecord.getValue(fields.carrier)
                    });
                }
                uniqueIdFlag.push(shipid);
            }
            for (var i = 0; i < shipLineCount; i++) {
                var shippingRate = this.currentLoadedRecord.getSublistValue(shipSublist.fields.shippingrate, i);
                var shipid = String(this.currentLoadedRecord.getSublistValue(shipSublist.fields.shippingmethodref, i));
                if (uniqueIdFlag.indexOf(shipid) < 0) {
                    this.currentRecordResult.shipmethods.push({
                        internalid: shipid,
                        name: String(this.currentLoadedRecord.getSublistValue(shipSublist.fields.shippingmethod, i)),
                        rate: Number(shippingRate),
                        rate_formatted: "" + this.format.toCurrency(shippingRate),
                        shipcarrier: String(this.currentLoadedRecord.getSublistValue(shipSublist.fields.shippingcarrier, i))
                    });
                }
                uniqueIdFlag.push(shipid);
            }
            // getLines
            this.currentRecordResult.lines = this.getRecordLines();
            // Transaction Custom Fields:
            this.currentRecordResult.options = _.mapObject(this.getRecordCustomFieldIds(), function (field) { return _this.currentLoadedRecord.getValue(new SchemaField_1.SchemaField(field)); });
            this.currentRecordResult.addresses = _.uniq(this.currentRecordResult.addresses, 'internalid');
            if (options && options.recordtype && !this.currentRecordResult.recordtype) {
                this.currentRecordResult.recordtype = options.recordtype;
            }
            return this.currentRecordResult;
        };
        TransactionHandler.prototype.getTransactionTypeFromId = function (id) {
            var type = null;
            var fields = Search_1.Search.lookupFields([this.transactionSchema.columns.recordtype], this.transactionSchema.type, id);
            if (fields && fields[0]) {
                type = String(fields[0]);
            }
            return type;
        };
        TransactionHandler.prototype.getRecordCreatedFrom = function () {
            var createdFromId = this.currentLoadedRecord.getValue(this.transactionFields.createdfrom);
            return {
                internalid: String(createdFromId || ''),
                name: this.currentLoadedRecord.getText(this.transactionFields.createdfrom) || '',
                recordtype: this.getTransactionTypeFromId(Number(createdFromId)) || ''
            };
        };
        TransactionHandler.prototype.getRecordStatus = function () {
            return {
                internalid: this.format.toCamelCase(this.currentLoadedRecord.getValue(this.transactionFields.status)),
                name: this.currentLoadedRecord.getText(this.transactionFields.status)
            };
        };
        TransactionHandler.prototype.getRecordSummary = function () {
            var subtotal = this.currentLoadedRecord.getValue(this.transactionFields.subtotal);
            var taxtotal = this.currentLoadedRecord.getValue(this.transactionFields.taxtotal);
            var tax2total = this.currentLoadedRecord.getValue(this.transactionFields.tax2total);
            var shippingcost = this.currentLoadedRecord.getValue(this.transactionFields.shippingcost);
            var handlingcost = this.currentLoadedRecord.getValue(this.transactionFields.handlingcost);
            var discounttotal = this.currentLoadedRecord.getValue(this.transactionFields.discounttotal);
            var discountrate = this.currentLoadedRecord.getValue(this.transactionFields.discountrate);
            var giftcertapplied = this.currentLoadedRecord.getValue(this.transactionFields.giftcertapplied);
            var total = this.currentLoadedRecord.getValue(this.transactionFields.total);
            return {
                subtotal: this.format.toFloat(subtotal),
                subtotal_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(subtotal),
                taxtotal: this.format.toFloat(taxtotal),
                taxtotal_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(taxtotal),
                tax2total: this.format.toFloat(tax2total),
                tax2total_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(tax2total),
                shippingcost: this.format.toFloat(shippingcost),
                shippingcost_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(shippingcost),
                handlingcost: this.format.toFloat(handlingcost),
                handlingcost_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(handlingcost),
                estimatedshipping: 0,
                estimatedshipping_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(0),
                taxonshipping: 0,
                taxonshipping_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(0),
                discounttotal: this.format.toFloat(discounttotal),
                discounttotal_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(discounttotal),
                taxondiscount: 0,
                taxondiscount_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(0),
                discountrate: this.format.toFloat(discountrate),
                discountrate_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(0),
                discountedsubtotal: 0,
                discountedsubtotal_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(0),
                giftcertapplied: this.format.toFloat(giftcertapplied),
                giftcertapplied_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(giftcertapplied),
                total: this.format.toFloat(total),
                total_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(total)
            };
        };
        TransactionHandler.prototype.getRecordPromoCodes = function () {
            var promocodes = [];
            var promocode = this.currentLoadedRecord.getValue(this.transactionFields.promocode);
            // If legacy behavior is present & a promocode is applied this IF will be true
            // In case stackable promotions are enable this.record.getFieldValue('promocode')
            // returns null
            if (promocode) {
                promocodes.push({
                    internalid: String(promocode),
                    code: this.currentLoadedRecord.getText(this.transactionFields.couponcode),
                    isvalid: true,
                    discountrate_formatted: ''
                });
            }
            // otherwise we change for the list of stackable promotions. If it is the legacy
            // (not stackable promotions) code, the
            // this.record.getLineItemCount('promotions') will return 0
            var promoSublist = this.transactionSchema.sublists.promotions;
            for (var i = 0; i < this.currentLoadedRecord.getLineCount(promoSublist); i++) {
                if (this.currentLoadedRecord.getSublistValue(promoSublist.fields.applicabilitystatus, i) !== 'NOT_APPLIED') {
                    promocodes.push({
                        internalid: String(this.currentLoadedRecord.getSublistValue(promoSublist.fields.couponcode, i)),
                        code: String(this.currentLoadedRecord.getSublistValue(promoSublist.fields.couponcode_display, i)),
                        isvalid: this.currentLoadedRecord.getSublistValue(promoSublist.fields.promotionisvalid, i) === 'T',
                        discountrate_formatted: ''
                    });
                }
            }
            return promocodes;
        };
        TransactionHandler.prototype.getRecordPaymentMethods = function () {
            var paymentMethod = {
                type: this.currentLoadedRecord.getValue(this.transactionFields.paymentmethod),
                primary: true,
                name: this.currentLoadedRecord.getText(this.transactionFields.paymentmethod)
            };
            var terms = this.getRecordTerms();
            var ccnumber = this.currentLoadedRecord.getValue(this.transactionFields.ccnumber);
            var paymentOptions = this.currentLoadedRecord.getValue(this.transactionFields.paymentoption);
            if (ccnumber) {
                paymentMethod.type = 'creditcard';
                paymentMethod.creditcard = {
                    ccnumber: ccnumber,
                    ccexpiredate: this.currentLoadedRecord.getValue(this.transactionFields.ccexpiredate),
                    ccname: this.currentLoadedRecord.getValue(this.transactionFields.ccname),
                    internalid: this.currentLoadedRecord.getValue(this.transactionFields.creditcard),
                    paymentmethod: {
                        ispaypal: 'F',
                        name: this.currentLoadedRecord.getText(this.transactionFields.paymentmethod),
                        creditcard: 'T',
                        internalid: this.currentLoadedRecord.getValue(this.transactionFields.paymentmethod)
                    }
                };
            }
            if (terms) {
                paymentMethod.type = 'invoice';
                paymentMethod.paymentterms = terms;
            }
            return paymentMethod.type ? [paymentMethod] : [];
        };
        // eslint-disable-next-line class-methods-use-this
        TransactionHandler.prototype.getOptions = function (stringOptions) {
            var options = [];
            if (stringOptions && stringOptions !== '- None -') {
                stringOptions.split(String.fromCharCode(4)).forEach(function (optionLine) {
                    var lineArray = optionLine.split(String.fromCharCode(3));
                    options.push({
                        cartOptionId: lineArray[0].toLowerCase(),
                        label: lineArray[2],
                        value: {
                            label: lineArray[4],
                            internalid: lineArray[3]
                        },
                        ismandatory: lineArray[1] === 'T'
                    });
                });
            }
            return options;
        };
        TransactionHandler.prototype.getRecordTerms = function () {
            var termsValue = this.currentLoadedRecord.getValue(this.transactionFields.terms);
            return (termsValue && {
                internalid: termsValue,
                name: this.currentLoadedRecord.getText(this.transactionFields.terms)
            });
        };
        TransactionHandler.prototype.getSublistAddress = function (record) {
            var recordAddressses = [];
            var addrSublist = this.transactionSchema.sublists.iladdrbook;
            for (var i = 0; i < record.getLineCount(addrSublist); i++) {
                // Adds all the addresses in the address book
                var shipaddr = record.getSublistValue(addrSublist.fields.shipaddr, i);
                var address = new Address_1.Address({
                    country: record.getSublistValue(addrSublist.fields.shipcountry, i),
                    state: record.getSublistValue(addrSublist.fields.shipstate, i),
                    city: record.getSublistValue(addrSublist.fields.shipcity, i),
                    zip: record.getSublistValue(addrSublist.fields.shipzip, i),
                    addr1: record.getSublistValue(addrSublist.fields.shipaddr1, i),
                    addr2: record.getSublistValue(addrSublist.fields.shipaddr2, i),
                    phone: record.getSublistValue(addrSublist.fields.shipphone, i),
                    attention: record.getSublistValue(addrSublist.fields.shipattention, i),
                    addressee: record.getSublistValue(addrSublist.fields.shipaddressee, i)
                });
                this.currentRecordResult.addresses.push(address.getAddressBook());
                recordAddressses[String(shipaddr)] = address.getId();
            }
            return recordAddressses;
        };
        TransactionHandler.prototype.getRecordLines = function () {
            var record = this.currentLoadedRecord;
            var recordAddresses = this.getSublistAddress(record);
            var item = this.transactionSchema.sublists.item;
            var lines = {};
            var preloadedItems = [];
            var itemsToQuery = [];
            var numberId = Number(this.currentRecordResult.internalid);
            for (var i = 0; i < record.getLineCount(item); i++) {
                var itemtype = record.getSublistValue(item.fields.itemtype, i);
                var discline = record.getSublistValue(item.fields.discline, i);
                var amount = record.getSublistValue(item.fields.amount, i);
                var itemdisplay = record.getSublistValue(item.fields.itemdisplay, i);
                var lineItem = String(record.getSublistValue(item.fields.item, i));
                var lineId = String(record.getSublistValue(item.fields.id, i));
                if (itemtype === 'Discount' && discline) {
                    lineId = this.currentRecordResult.internalid + "_" + discline;
                    var parsedAmount = Math.abs(parseFloat(amount));
                    lines[lineId] = lines[lineId] || {};
                    lines[lineId].discount = lines[lineId].discount
                        ? lines[lineId].discount + parsedAmount
                        : parsedAmount;
                    lines[lineId].total =
                        lines[lineId].amount + lines[lineId].tax_amount - lines[lineId].discount;
                    lines[lineId].discount_name = String(itemdisplay);
                }
                else {
                    var rate = record.getSublistValue(item.fields.rate, i);
                    var tax1amt = record.getSublistValue(item.fields.tax1amt, i);
                    var quantity = record.getSublistValue(item.fields.quantity, i);
                    var taxrate1 = record.getSublistValue(item.fields.taxrate1, i);
                    var fulfillable = record.getSublistValue(item.fields.fulfillable, i);
                    var location_1 = record.getSublistValue(item.fields.location, i);
                    var options = record.getSublistValue(item.fields.options, i);
                    var shipaddress = record.getSublistValue(item.fields.shipaddress, i);
                    var shipmethod = record.getSublistValue(item.fields.shipmethod, i);
                    var freegift = record.getSublistValue(item.fields.freegiftpromotion, i);
                    var taxcodedisplay = record.getSublistValue(item.fields.taxcodedisplay, i);
                    var amountValue = this.format.toFloat(Math.abs(Number(amount)));
                    var taxAmountValue = this.format.toFloat(tax1amt);
                    var rateValue = this.format.toFloat(rate);
                    var totalValue = amountValue + taxAmountValue;
                    lines[lineId] = {
                        internalid: lineId,
                        quantity: parseInt(String(quantity), 10),
                        rate: rateValue,
                        rate_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(rateValue),
                        amount: amountValue,
                        amount_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(amountValue),
                        tax_amount: taxAmountValue,
                        tax_amount_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(taxAmountValue),
                        tax_rate: String(taxrate1),
                        tax_code: String(taxcodedisplay),
                        isfulfillable: Boolean(fulfillable),
                        location: location_1 && location_1 !== 'undefined' && String(location_1),
                        itemIdToPreload: lineItem,
                        discount: 0,
                        discount_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(0),
                        total: totalValue,
                        total_formatted: "" + this.currencySymbol + this.format.toCurrencyValue(totalValue),
                        type: String(itemtype),
                        options: this.getOptions(String(options)),
                        shipaddress: shipaddress ? recordAddresses[String(shipaddress)] : null,
                        shipmethod: String(shipmethod) || null,
                        index: i + 1,
                        free_gift: !!freegift
                    };
                }
                // preloadItems
                if (lineItem) {
                    var preloadedItem = StoreItem_1.StoreItem.getInstance().get(lineItem, lines[lineId].type);
                    if (!preloadedItem || !preloadedItem.itemid) {
                        itemsToQuery.push(lines[lineId]);
                    }
                    else {
                        preloadedItems.push(preloadedItem);
                    }
                }
            }
            preloadedItems.push.apply(preloadedItems, this.loadItemsWithSuiteScript(itemsToQuery || this.currentRecordResult.lines, numberId));
            _.each(lines, 
            // eslint-disable-next-line no-loop-func
            function (line) {
                var itemObj = _.find(preloadedItems, {
                    internalid: Number(line.itemIdToPreload)
                });
                itemObj.storedisplayname2 = itemObj.storedisplayname2 || itemObj.storedisplayname;
                itemObj.pricelevel1 = line.rate;
                itemObj.pricelevel1_formatted = line.rate_formatted;
                line.item = itemObj;
                delete line.itemIdToPreload;
            });
            return _.values(lines);
        };
        TransactionHandler.prototype.loadItemsWithSuiteScript = function (lines, transactionId) {
            var transactionDao = new Transaction_Dao_1.TransactionDao();
            var search = transactionDao.createSearch();
            var schema = transactionDao.getSchema();
            search.setFilters([
                new SearchFilter_1.SearchFilter(schema.filters.entity, SearchOperator_1.SearchOperator.String.IS, this.user.getId()),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(schema.filters.internalid, SearchOperator_1.SearchOperator.String.IS, transactionId),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(schema.joins.item.filters.internalid, SearchOperator_1.SearchOperator.Array.ANYOF, _.pluck(lines, 'internalid'))
            ]);
            search.addColumn(schema.joins.item.columns.type, { itemtype: this.format.toValue });
            search.addColumn(schema.joins.item.columns.displayname, {
                displayname: this.format.toValue
            });
            search.addColumn(schema.joins.item.columns.storedisplayname, {
                storedisplayname2: this.format.toValue
            });
            search.addColumn(schema.joins.item.columns.internalid, { internalid: Number });
            search.addColumn(schema.joins.item.columns.itemid, { itemid: this.format.toValue });
            return search.getAll();
        };
        TransactionHandler.prototype.getRecordAdjustments = function (options, internalid) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var appliedToTransaction = options.appliedToTransaction || [internalid];
            var types = options.types && options.types.length
                ? options.types
                : ['CustCred', 'DepAppl', 'CustPymt'];
            var ids = [];
            var adjustments = {}; // it's an object because we need to handle duplicates.
            var _a = this.transactionSchema, filters = _a.filters, columns = _a.columns;
            var transactionDao = new Transaction_Dao_1.TransactionDao();
            var search = transactionDao.createSearch();
            search.setFilters([
                new SearchFilter_1.SearchFilter(filters.appliedtotransaction, SearchOperator_1.SearchOperator.Array.ANYOF, appliedToTransaction),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(filters.appliedtolinkamount, SearchOperator_1.SearchOperator.Number.ISNOTEMPTY, null),
                SearchOperator_1.SearchOperator.Logical.AND,
                new SearchFilter_1.SearchFilter(filters.type, SearchOperator_1.SearchOperator.Array.ANYOF, types)
            ]);
            search.sortBy('trandate');
            search.addColumn(columns.total);
            search.addColumn(columns.internalid);
            search.addColumn(columns.ccnumber);
            search.addColumn(columns.ccexpdate);
            search.addColumn(columns.ccholdername);
            search.addColumn(columns.paymentmethod, { paymentmethodstring: this.format.toText });
            search.addColumn(columns.tranid);
            search.addColumn(columns.trandate);
            search.addColumn(columns.type);
            search.addColumn(columns.appliedtolinkamount, {
                amount: this.format.toCurrencyValue,
                recordtype: function (value, text, type) { return type; },
                amount_formatted: function (value) {
                    return "" + _this.currencySymbol + _this.format.toCurrencyValue(value);
                }
            });
            var results = search.getAll();
            results.forEach(function (result) {
                var duplicatedAdjustment = adjustments[result.internalid];
                if (options.paymentMethodInformation) {
                    ids.push(result.internalid);
                }
                if (!duplicatedAdjustment) {
                    adjustments[result.internalid] = result;
                }
                else {
                    duplicatedAdjustment.amount += result.amount;
                    duplicatedAdjustment.amount_formatted = "" + _this.currencySymbol + duplicatedAdjustment.amount;
                }
                if (result.ccnumber && duplicatedAdjustment) {
                    duplicatedAdjustment.paymentmethod = {
                        internalid: result.tranid,
                        name: result.paymentmethodstring,
                        type: 'creditcard',
                        creditcard: {
                            ccnumber: result.ccnumber,
                            ccexpiredate: result.ccexpdate,
                            ccname: result.ccholdername,
                            paymentmethod: {
                                ispaypal: 'F',
                                name: result.paymentmethodstring,
                                creditcard: 'T',
                                internalid: result.tranid
                            }
                        }
                    };
                }
            });
            return _.values(adjustments);
        };
        TransactionHandler.prototype.setRecordPaymentMethods = function (paymentmethods) {
            var _this = this;
            paymentmethods.forEach(function (paymentMethod) {
                switch (paymentMethod.type.toUpperCase()) {
                    case 'INVOICE':
                        _this.currentLoadedRecord.setValue(_this.transactionFields.terms, paymentMethod.terms.internalid);
                        _this.currentLoadedRecord.setValue(_this.transactionFields.otherrefnum, paymentMethod.purchasenumber);
                        break;
                    case 'CREDITCARD':
                        if (_this.runtime.isFeatureInEffect('PAYMENTINSTRUMENTS')) {
                            _this.currentLoadedRecord.setValue(_this.transactionFields.paymentoption, paymentMethod.creditcard.internalid);
                        }
                        else {
                            _this.currentLoadedRecord.setValue(_this.transactionFields.creditcard, paymentMethod.creditcard.internalid);
                            _this.currentLoadedRecord.setValue(_this.transactionFields.paymentmethod, paymentMethod.creditcard.paymentmethod.internalid);
                            _this.currentLoadedRecord.setValue(_this.transactionFields.creditcardprocessor, paymentMethod.creditcard.paymentmethod.merchantid);
                        }
                        if (paymentMethod.creditcard.ccsecuritycode) {
                            _this.currentLoadedRecord.setValue(_this.transactionFields.ccsecuritycode, paymentMethod.creditcard.ccsecuritycode);
                        }
                        break;
                    case 'EXTERNAL':
                        _this.currentLoadedRecord.setValue(_this.transactionFields.paymentmethod, paymentMethod.internalid);
                        _this.currentLoadedRecord.setValue(_this.transactionFields.creditcardprocessor, paymentMethod.merchantid);
                        _this.currentLoadedRecord.setValue(_this.transactionFields.returnurl, paymentMethod.returnurl);
                        _this.currentLoadedRecord.setValue(_this.transactionFields.getauth, 'T');
                        break;
                    default:
                        break;
                }
            });
        };
        TransactionHandler.prototype.setLines = function (lines) {
            var _this = this;
            var sublist = this.transactionSchema.sublists.item;
            for (var i = 0; i < this.currentLoadedRecord.getLineCount(sublist); i++) {
                this.currentLoadedRecord.removeLine(sublist, i);
            }
            if (lines) {
                lines.forEach(function (line) {
                    _this.currentLoadedRecord.selectNewLine(sublist);
                    _this.currentLoadedRecord.setCurrentSublistValue(sublist.fields.item, line.item.internalid);
                    _this.currentLoadedRecord.setCurrentSublistValue(sublist.fields.quantity, line.quantity);
                    _this.currentLoadedRecord.setCurrentSublistValue(sublist.fields.itemtype, line.item.type);
                    _this.currentLoadedRecord.setCurrentSublistValue(sublist.fields.id, line.internalid);
                    _.each(line.options, function (option) {
                        if (option.cartOptionId && option.value && option.value.internalid) {
                            _this.currentLoadedRecord.setCurrentSublistValue(new SchemaSublistField_1.SchemaSublistField(option.cartOptionId), option.value.internalid);
                        }
                    });
                    _this.currentLoadedRecord.commitLine(sublist);
                });
            }
        };
        TransactionHandler.prototype.getRecordCustomFieldIds = function () {
            return (this.configuration.get('customFields') || [])[String(this.dao.getSchema().type)];
        };
        TransactionHandler.prototype.update = function (id, data) {
            var _this = this;
            this.currentLoadedRecord = this.dao.loadRecord(Number(id), { isDynamic: true });
            this.currentLoadedRecord.setValue(this.transactionFields.paymentterms, null);
            this.currentLoadedRecord.setValue(this.transactionFields.paymentmethod, null);
            this.currentLoadedRecord.setValue(this.transactionFields.thankyouurl, null);
            this.currentLoadedRecord.setValue(this.transactionFields.errorurl, null);
            this.currentLoadedRecord.setValue(this.transactionFields.returnurl, null);
            this.currentLoadedRecord.setValue(this.transactionFields.terms, null);
            this.currentLoadedRecord.setValue(this.transactionFields.otherrefnum, null);
            this.currentLoadedRecord.setValue(this.transactionFields.creditcard, null);
            if (data.paymentmethods) {
                this.setRecordPaymentMethods(data.paymentmethods);
            }
            // We need to migrate this.setAddress address method for the next services
            // this.setAddress('ship', this.data.shipaddress, 'billaddress');
            // this.setAddress('bill', this.data.billaddress, 'shipaddress');
            this.setLines(data.lines);
            // Set Memo
            this.currentLoadedRecord.setValue(this.transactionFields.memo, null);
            if (data.memo) {
                this.currentLoadedRecord.setValue(this.transactionFields.memo, data.memo);
            }
            // Set custom fields
            _.each(data.options, function (value, optionsId) {
                // only set a custom field to the model if was exposed in the configuration
                if (_.find(_this.getRecordCustomFieldIds(), function (configFieldId) {
                    return optionsId === configFieldId;
                })) {
                    _this.currentLoadedRecord.setValue(new SchemaField_1.SchemaField(optionsId), value);
                }
            });
        };
        TransactionHandler.prototype.generateUrl = function (id, recordTypeName) {
            var parameters = [
                "nltranid=" + id,
                "orderId=" + id,
                "n=" + this.runtime.getCurrentWebsite().getId(),
                "recordType=" + recordTypeName,
                'goToExternalPayment=T'
            ];
            return this.runtime.getAbsoluteUrl("/external_payment.ssp?" + parameters.join('&'));
        };
        return TransactionHandler;
    }());
    exports.TransactionHandler = TransactionHandler;
});
