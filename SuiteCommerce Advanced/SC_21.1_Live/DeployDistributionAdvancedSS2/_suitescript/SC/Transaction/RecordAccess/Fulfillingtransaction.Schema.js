/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "../../../Common/Schema/SchemaColumn"], function (require, exports, SchemaColumn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FulfillingtransactionSchema = /** @class */ (function () {
        function FulfillingtransactionSchema() {
            this.type = 'transaction';
            this.fields = {};
            this.columns = {
                item: new SchemaColumn_1.SchemaColumn('item'),
                shipmethod: new SchemaColumn_1.SchemaColumn('shipmethod'),
                shipto: new SchemaColumn_1.SchemaColumn('shipto'),
                trackingnumbers: new SchemaColumn_1.SchemaColumn('trackingnumbers'),
                trandate: new SchemaColumn_1.SchemaColumn('trandate'),
                status: new SchemaColumn_1.SchemaColumn('status'),
                shipaddress: new SchemaColumn_1.SchemaColumn('shipaddress'),
                shipaddress1: new SchemaColumn_1.SchemaColumn('shipaddress1'),
                shipaddress2: new SchemaColumn_1.SchemaColumn('shipaddress2'),
                shipaddressee: new SchemaColumn_1.SchemaColumn('shipaddressee'),
                shipattention: new SchemaColumn_1.SchemaColumn('shipattention'),
                shipcity: new SchemaColumn_1.SchemaColumn('shipcity'),
                shipcountry: new SchemaColumn_1.SchemaColumn('shipcountry'),
                shipstate: new SchemaColumn_1.SchemaColumn('shipstate'),
                shipzip: new SchemaColumn_1.SchemaColumn('shipzip')
            };
            this.filters = {};
            this.joins = {};
            this.sublists = {};
            this.transformDefaults = {};
            this.initializeDefaults = {};
        }
        FulfillingtransactionSchema.getInstance = function () {
            if (!this.instance) {
                this.instance = new FulfillingtransactionSchema();
            }
            return this.instance;
        };
        return FulfillingtransactionSchema;
    }());
    exports.FulfillingtransactionSchema = FulfillingtransactionSchema;
});
