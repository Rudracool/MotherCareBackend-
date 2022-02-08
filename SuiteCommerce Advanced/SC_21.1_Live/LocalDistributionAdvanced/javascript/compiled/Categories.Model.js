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
define("Categories.Model", ["require", "exports", "underscore", "Categories.Utils", "Model", "Configuration", "Backbone.CachedModel"], function (require, exports, _, CategoriesUtils, Model_1, Configuration_1, BackboneCachedModel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Connects to the search api to get all the items and the facets
    // A Model Contains a Collection of items and the list of facet groups with its values
    var CategoriesModel = /** @class */ (function (_super) {
        __extends(CategoriesModel, _super);
        function CategoriesModel(options) {
            var _this = _super.call(this) || this;
            // TODO: We should extend of CachedModel once available
            _this.config = Configuration_1.Configuration.get().categories;
            _this.options = { cache: true };
            _this.ignoreCache = true;
            // TODO: Once this extends of CachedModel the access to the prototype fetch won't be needed
            _this.originalFetch = BackboneCachedModel.prototype.fetch;
            _this.urlRoot = function () { return _this.getServiceURL(); };
            _this.options = options;
            return _this;
        }
        // Overrides fetch so we make sure that the cache is set to true, so we wrap it
        CategoriesModel.prototype.fetch = function (options) {
            options = _.extend(options || {}, this.options);
            options.cache = !this.ignoreCache;
            return this.originalFetch.apply(this, arguments);
        };
        CategoriesModel.prototype.getColumns = function (element) {
            return _.union(CategoriesUtils.getCategoryColumns()[element].fields, this.config[element].fields || this.config[element].additionalFields).join();
        };
        CategoriesModel.prototype.getNavigationItemOptionalFields = function () {
            return "&bread_crumb_fields=" + this.getColumns('breadcrumb') + "&category_fields=" + this.getColumns('category') + "&side_menu_fields=" + this.getColumns('sideMenu') + "&subcategory_fields=" + this.getColumns('subCategories');
        };
        CategoriesModel.prototype.getServiceURL = function () {
            var CATEGORY_TREE_ENDPOINT = '/api/navigation/v1/categorynavitems?';
            var baseUrl = CategoriesUtils.getBaseUrl();
            var params = CategoriesUtils.getSMTEndpointParameters('full_url', this.options.data.fullurl, this.getNavigationItemOptionalFields(), 'F', null, null);
            var url = baseUrl + CATEGORY_TREE_ENDPOINT + params;
            return url;
        };
        CategoriesModel.prototype.parse = function (category) {
            // The category is always at the first position. SMT send the data in that way
            var categoryData = category.data[0];
            categoryData.categories = (CategoriesUtils.sortingBy(categoryData.categories, CategoriesUtils.getSortBy('menu')));
            return categoryData;
        };
        return CategoriesModel;
    }(Model_1.Model));
    exports.CategoriesModel = CategoriesModel;
});

//# sourceMappingURL=Categories.Model.js.map
