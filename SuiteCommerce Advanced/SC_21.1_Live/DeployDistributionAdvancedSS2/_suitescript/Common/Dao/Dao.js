/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/record", "../ActiveRecord/ActiveRecord", "../SearchRecord/Search"], function (require, exports, Nrecord, ActiveRecord_1, Search_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dao = /** @class */ (function () {
        function Dao() {
        }
        Dao.prototype.getSchema = function () {
            return this.schema;
        };
        Dao.prototype.createRecord = function (options) {
            return new ActiveRecord_1.ActiveRecord({
                schema: this.schema,
                isDynamic: options && options.isDynamic,
                defaultValues: options && options.defaultValues
            });
        };
        Dao.prototype.loadRecord = function (id, options) {
            return new ActiveRecord_1.ActiveRecord({
                schema: this.schema,
                recordtype: options && options.recordtype,
                isDynamic: options && options.isDynamic,
                defaultValues: options && options.defaultValues,
                id: id
            });
        };
        Dao.prototype.transformRecord = function (options) {
            return new ActiveRecord_1.ActiveRecord({
                schema: this.schema,
                isDynamic: options.isDynamic,
                defaultValues: options.defaultValues,
                id: options.id,
                fromSchema: options.fromSchema
            });
        };
        Dao.prototype.createSearch = function () {
            return new Search_1.Search(this.schema.type);
        };
        Dao.prototype.deleteRecord = function (id) {
            Nrecord.delete({ type: this.schema.type, id: id });
        };
        Dao.prototype.submitFields = function (fields, id, options) {
            if (options === void 0) { options = { enablesourcing: true, ignoreMandatoryFields: false }; }
            return Nrecord.submitFields({
                type: this.schema.type,
                id: id,
                values: fields,
                options: {
                    enableSourcing: options.enablesourcing,
                    ignoreMandatoryFields: options.ignoreMandatoryFields
                }
            });
        };
        return Dao;
    }());
    exports.Dao = Dao;
});
