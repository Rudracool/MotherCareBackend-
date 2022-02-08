/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "../../../Common/ActiveRecord/ActiveRecord", "../../../Common/Schema/SchemaColumn"], function (require, exports, ActiveRecord_1, SchemaColumn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ItemSchema = /** @class */ (function () {
        function ItemSchema() {
            this.type = ActiveRecord_1.Type.INVENTORY_ITEM;
            this.fields = {};
            this.columns = {
                id: new SchemaColumn_1.SchemaColumn('id'),
                item: new SchemaColumn_1.SchemaColumn('item'),
                internalid: new SchemaColumn_1.SchemaColumn('internalid'),
                type: new SchemaColumn_1.SchemaColumn('type'),
                parent: new SchemaColumn_1.SchemaColumn('parent'),
                displayname: new SchemaColumn_1.SchemaColumn('displayname'),
                storedisplayname: new SchemaColumn_1.SchemaColumn('storedisplayname'),
                itemid: new SchemaColumn_1.SchemaColumn('itemid')
            };
            this.filters = {
                internalid: new SchemaColumn_1.SchemaColumn('internalid')
            };
            this.sublists = {};
            this.joins = {};
            this.transformDefaults = {};
            this.initializeDefaults = {};
        }
        ItemSchema.getInstance = function () {
            if (!this.instance) {
                this.instance = new ItemSchema();
            }
            return this.instance;
        };
        return ItemSchema;
    }());
    exports.ItemSchema = ItemSchema;
});
