/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "../../../Common/ActiveRecord/ActiveRecord", "../../../Common/Schema/SchemaColumn", "../../../Common/Schema/SchemaField", "../../../Common/Schema/SchemaJoin", "./Message.Schema"], function (require, exports, ActiveRecord_1, SchemaColumn_1, SchemaField_1, SchemaJoin_1, Message_Schema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CaseSchema = /** @class */ (function () {
        function CaseSchema() {
            this.sublists = {};
            this.initializeDefaults = {};
            this.transformDefaults = {};
            this.type = ActiveRecord_1.Type.SUPPORT_CASE;
            this.fields = {
                internalid: new SchemaField_1.SchemaField('internalid'),
                casenumber: new SchemaField_1.SchemaField('casenumber'),
                title: new SchemaField_1.SchemaField('title'),
                status: new SchemaField_1.SchemaField('status'),
                origin: new SchemaField_1.SchemaField('origin'),
                category: new SchemaField_1.SchemaField('category'),
                company: new SchemaField_1.SchemaField('company'),
                priority: new SchemaField_1.SchemaField('priority'),
                createddate: new SchemaField_1.SchemaField('createddate'),
                lastmessagedate: new SchemaField_1.SchemaField('lastmessagedate'),
                incomingmessage: new SchemaField_1.SchemaField('incomingmessage'),
                email: new SchemaField_1.SchemaField('email')
            };
            this.columns = {
                internalid: new SchemaColumn_1.SchemaColumn('internalid'),
                casenumber: new SchemaColumn_1.SchemaColumn('casenumber'),
                title: new SchemaColumn_1.SchemaColumn('title'),
                status: new SchemaColumn_1.SchemaColumn('status'),
                origin: new SchemaColumn_1.SchemaColumn('origin'),
                category: new SchemaColumn_1.SchemaColumn('category'),
                company: new SchemaColumn_1.SchemaColumn('company'),
                priority: new SchemaColumn_1.SchemaColumn('priority'),
                createddate: new SchemaColumn_1.SchemaColumn('createddate'),
                lastmessagedate: new SchemaColumn_1.SchemaColumn('lastmessagedate'),
                email: new SchemaColumn_1.SchemaColumn('email')
            };
            this.filters = {
                internalid: new SchemaColumn_1.SchemaColumn('internalid'),
                status: new SchemaColumn_1.SchemaColumn('status'),
                isinactive: new SchemaColumn_1.SchemaColumn('isinactive')
            };
            this.joins = {
                messages: new SchemaJoin_1.SchemaJoin('messages', Message_Schema_1.default)
            };
        }
        return CaseSchema;
    }());
    exports.default = new CaseSchema();
});
