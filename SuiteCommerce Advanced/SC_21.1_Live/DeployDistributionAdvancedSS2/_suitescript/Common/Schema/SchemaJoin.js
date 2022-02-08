/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "../../third_parties/underscore.js"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SchemaJoin = /** @class */ (function () {
        function SchemaJoin(id, schema) {
            this.joinId = id;
            this.columns = schema.columns;
            this.filters = schema.filters;
            this.overrideGetter(this.columns);
            this.overrideGetter(this.filters);
        }
        SchemaJoin.prototype.overrideGetter = function (prop) {
            var _this = this;
            // TODO: this can be a decorator
            _.each(prop, function (column, key) {
                Object.defineProperty(prop, key, {
                    configurable: true,
                    get: function () {
                        column.columnName = _this.joinId + "." + column.columnName
                            .split('.')
                            .slice(-1);
                        return column;
                    }
                });
            });
        };
        return SchemaJoin;
    }());
    exports.SchemaJoin = SchemaJoin;
});
