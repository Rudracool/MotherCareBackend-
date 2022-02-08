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
    var MessageSchema = /** @class */ (function () {
        function MessageSchema() {
            this.sublists = {};
            this.initializeDefaults = {};
            this.transformDefaults = {};
            this.type = ActiveRecord_1.Type.SUPPORT_CASE;
            this.fields = {};
            this.columns = {
                message: new SchemaColumn_1.SchemaColumn('message'),
                messagedate: new SchemaColumn_1.SchemaColumn('messagedate'),
                author: new SchemaColumn_1.SchemaColumn('author'),
                internalid: new SchemaColumn_1.SchemaColumn('internalid')
            };
            this.filters = {
                internalonly: new SchemaColumn_1.SchemaColumn('internalonly')
            };
            this.joins = {};
        }
        return MessageSchema;
    }());
    exports.default = new MessageSchema();
});
