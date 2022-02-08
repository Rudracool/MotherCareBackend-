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
    var LocationSchema = /** @class */ (function () {
        function LocationSchema() {
            this.type = ActiveRecord_1.Type.LOCATION;
            this.fields = {};
            this.columns = {
                locationtype: new SchemaColumn_1.SchemaColumn('locationtype')
            };
            this.filters = {
                locationtype: new SchemaColumn_1.SchemaColumn('locationtype')
            };
            this.joins = {};
            this.sublists = {};
            this.transformDefaults = {};
            this.initializeDefaults = {};
        }
        LocationSchema.getInstance = function () {
            if (!this.instance) {
                this.instance = new LocationSchema();
            }
            return this.instance;
        };
        return LocationSchema;
    }());
    exports.LocationSchema = LocationSchema;
});
