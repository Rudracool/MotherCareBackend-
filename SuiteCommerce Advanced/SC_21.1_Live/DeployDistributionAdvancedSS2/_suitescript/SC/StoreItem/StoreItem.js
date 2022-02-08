/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/commerce/recordView", "N/log", "../Libraries/Configuration/Configuration", "../../Common/Controller/RequestErrors", "../../third_parties/underscore.js"], function (require, exports, NrecordView, log, Configuration_1, RequestErrors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StoreItem = /** @class */ (function () {
        function StoreItem() {
            this.items = {};
            this.configuration = Configuration_1.Configuration.getInstance();
            this.fields = this.configuration.get('fieldKeys.itemsFieldsStandardKeys') || [];
        }
        StoreItem.getInstance = function () {
            if (!this.instance) {
                this.instance = new StoreItem();
            }
            return this.instance;
        };
        StoreItem.prototype.addItem = function (id, item, fields) {
            this.items[this.getItemKey(id, fields)] = item;
        };
        StoreItem.prototype.getItem = function (id, fields) {
            return this.items[this.getItemKey(id, fields)];
        };
        // eslint-disable-next-line class-methods-use-this
        StoreItem.prototype.getItemKey = function (id, fields) {
            return id + "--" + (fields || []).sort().join('--');
        };
        StoreItem.prototype.getItemFieldValues = function (items, fields) {
            var itemsIds = _.pluck(_.values(items), 'internalid');
            var fieldValues = {};
            try {
                fieldValues = this.viewItems(itemsIds.map(Number));
            }
            catch (e) {
                throw RequestErrors_1.invalidItemsFieldsAdvancedName;
            }
            return _.values(fieldValues);
        };
        // eslint-disable-next-line class-methods-use-this
        StoreItem.prototype.viewItems = function (ids, fieldsArray) {
            var _this = this;
            // TODO: test this in SCS
            var fields = _.flatten((fieldsArray || this.fields).map(function (field) { return _this.fields[field] || [field]; }));
            if (!fieldsArray) {
                fields = _.union(fields, [
                    'isbackorderable',
                    'isdisplayable',
                    'isdisplayable_detail',
                    'ispricevisible',
                    'ispricevisible_detail',
                    'isfulfillable',
                    'isinactive',
                    'itemimages_detail',
                    'isonline',
                    'isstorepickupallowed',
                    'quantityavailableforstorepickup_detail',
                    'urlcomponent'
                ]);
            }
            var items;
            ids = ids.filter(function (id) { return id >= 0; });
            try {
                items = ids.length ? NrecordView.viewItems({ ids: ids, fields: fields }) || {} : {};
            }
            catch (e) {
                // try again if there are unsopported fields:
                var invalidFields = e.message && e.message.match(/\[[^\]]+/);
                log.debug('Error: invalid item fields', invalidFields);
                if (invalidFields[0]) {
                    var invalidFieldsArray_1 = invalidFields[0]
                        .slice(1)
                        .replace(/\s+/g, '')
                        .split(',');
                    try {
                        items =
                            NrecordView.viewItems({
                                ids: ids,
                                fields: fields.filter(function (el) { return invalidFieldsArray_1.indexOf(el) < 0; })
                            }) || {};
                    }
                    catch (ex) {
                        log.debug('Error getting item', ex);
                    }
                }
            }
            // There is something weird with the keys of NrecordView.viewItems returned object.
            // Object is inaccesible in some cases unless we use JSON.stringify
            return items && JSON.parse(JSON.stringify(items));
        };
        StoreItem.prototype.get = function (id, type, fields) {
            if (type && !this.getItem(id, fields)) {
                this.preloadItems([
                    {
                        internalid: id,
                        itemtype: type
                    }
                ], fields);
            }
            return this.getItem(id, fields);
        };
        StoreItem.prototype.preloadItems = function (items, fields) {
            var _this = this;
            if (items === void 0) { items = []; }
            if (!this.fields.length && !fields) {
                return;
            }
            var itemsById = {};
            var parentItemsById = {};
            items.forEach(function (item) {
                if (!isNaN(Number(item.internalid)) &&
                    ['Discount', 'OthCharge', 'Markup'].indexOf(item.itemtype) === -1 &&
                    !_this.getItem(item.internalid, fields)) {
                    itemsById[item.internalid] = {
                        internalid: String(item.internalid),
                        itemtype: item.itemtype,
                        itemfields: _this.fields || fields
                    };
                }
            });
            if (_.size(itemsById)) {
                this.getItemFieldValues(itemsById, fields).forEach(function (item) {
                    if (item && typeof item.itemid !== 'undefined') {
                        if (item.itemoptions_detail &&
                            item.itemoptions_detail.matrixtype === 'child') {
                            parentItemsById[item.itemoptions_detail.parentid] = {
                                internalid: String(item.itemoptions_detail.parentid),
                                itemtype: item.itemtype,
                                itemfields: _this.fields || fields
                            };
                        }
                        _this.addItem(item.internalid, item, fields);
                    }
                });
                this.getItemFieldValues(parentItemsById, fields).forEach(function (item) {
                    if (item && typeof item.itemid !== 'undefined') {
                        _this.addItem(item.internalid, item, fields);
                    }
                });
                this.items = _.mapObject(this.items, function (item) {
                    var mappedItem = item;
                    if (item.itemoptions_detail && item.itemoptions_detail.matrixtype === 'child') {
                        mappedItem.matrix_parent = _this.getItem(item.itemoptions_detail.parentid, fields);
                    }
                    return item;
                });
            }
        };
        return StoreItem;
    }());
    exports.StoreItem = StoreItem;
});
