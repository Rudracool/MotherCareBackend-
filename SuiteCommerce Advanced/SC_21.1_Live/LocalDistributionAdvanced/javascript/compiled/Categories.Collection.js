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
define("Categories.Collection", ["require", "exports", "underscore", "Categories.Utils", "Categories.Model", "Collection", "Configuration"], function (require, exports, _, CategoriesUtils, Categories_Model_1, Collection_1, Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CategoriesCollection = /** @class */ (function (_super) {
        __extends(CategoriesCollection, _super);
        function CategoriesCollection(options) {
            var _this = _super.call(this) || this;
            _this.model = Categories_Model_1.CategoriesModel;
            _this.config = Configuration_1.Configuration.get().categories;
            _this.url = function () { return _this.getServiceURL(); };
            _this.options = options;
            return _this;
        }
        CategoriesCollection.prototype.getServiceURL = function () {
            var CATEGORY_TREE_ENDPOINT = '/api/navigation/v1/categorynavitems/tree?';
            var baseUrl = CategoriesUtils.getBaseUrl(this.options.backendAccountDomain);
            var params = CategoriesUtils.getSMTEndpointParameters('max_level', this.options.level, this.getCategoryTreeOptionalFields(), this.options.pcvAllItems, this.options.pcvGroups, this.options.effectiveDate);
            var url = baseUrl + CATEGORY_TREE_ENDPOINT + params;
            return url;
        };
        CategoriesCollection.prototype.getColumns = function (element) {
            return _.union(CategoriesUtils.getCategoryColumns()[element].fields, this.config[element].fields || this.config[element].additionalFields).join();
        };
        CategoriesCollection.prototype.getCategoryTreeOptionalFields = function () {
            return "&menu_fields=" + this.getColumns('menu');
        };
        CategoriesCollection.prototype.parse = function (categories) {
            return CategoriesUtils.sortingBy(categories.data, CategoriesUtils.getSortBy('menu'));
        };
        CategoriesCollection.prototype.fetch = function () {
            var options = {
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true
            };
            // The 'true' value prevents jQuery ajax from sending
            // the 'X-SC-Touchpoint' header, it's not supported by CORS
            SC.dontSetRequestHeaderTouchpoint = true;
            var fetchResult = _super.prototype.fetch.call(this, options);
            SC.dontSetRequestHeaderTouchpoint = false;
            return fetchResult;
        };
        return CategoriesCollection;
    }(Collection_1.Collection));
    exports.CategoriesCollection = CategoriesCollection;
});

//# sourceMappingURL=Categories.Collection.js.map
