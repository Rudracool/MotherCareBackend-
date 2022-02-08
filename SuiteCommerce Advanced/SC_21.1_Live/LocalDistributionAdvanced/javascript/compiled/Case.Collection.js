/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
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
define("Case.Collection", ["require", "exports", "underscore", "Case.Model", "Utils", "Collection"], function (require, exports, _, Case_Model_1, Utils, Collection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CaseCollection = /** @class */ (function (_super) {
        __extends(CaseCollection, _super);
        function CaseCollection(models, options) {
            if (models === void 0) { models = []; }
            var _this = _super.call(this, models, options) || this;
            _this.url = function () { return Utils.getAbsoluteUrl('services/Case.ss', true); };
            _this.totalRecordsFound = 0;
            _this.recordsPerPage = 0;
            _this.model = Case_Model_1.CaseModel;
            _this.original = null;
            return _this;
        }
        CaseCollection.prototype.sync = function (method, model, options) {
            var _this = this;
            return _super.prototype.sync.call(this, method, model, options).always(function () {
                try {
                    if (!_this.original) {
                        _this.original = _super.prototype.clone.call(_this);
                    }
                }
                catch (e) {
                    console.error('Error cloning collection.');
                }
            });
        };
        CaseCollection.prototype.reset = function (models, options) {
            if (!this.original && (_.isArray(models) && models.length > 0)) {
                this.original = _super.prototype.clone.call(this);
            }
            return _super.prototype.reset.call(this, models, options);
        };
        CaseCollection.prototype.parse = function (response) {
            this.totalRecordsFound = response.totalRecordsFound;
            this.recordsPerPage = response.recordsPerPage;
            return response.records;
        };
        CaseCollection.prototype.update = function (options) {
            var filter = options.filter && options.filter.value ? options.filter.value : undefined;
            _super.prototype.fetch.call(this, {
                data: {
                    filter: filter,
                    sort: options.sort.value,
                    order: options.order,
                    page: options.page
                },
                reset: true,
                killerId: options.killerId
            });
        };
        return CaseCollection;
    }(Collection_1.Collection));
    exports.CaseCollection = CaseCollection;
});

//# sourceMappingURL=Case.Collection.js.map
