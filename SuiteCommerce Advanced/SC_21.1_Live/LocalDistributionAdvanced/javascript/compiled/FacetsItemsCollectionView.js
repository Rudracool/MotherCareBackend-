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
define("FacetsItemsCollectionView", ["require", "exports", "facets_items_collection.tpl", "facets_items_collection_view_cell.tpl", "facets_items_collection_view_row.tpl", "CollectionView", "RowView", "Facets.ItemCell.View"], function (require, exports, facets_items_collection_tpl, facets_items_collection_view_cell_tpl, facets_items_collection_view_row_tpl, CollectionView_1, RowView_1, FacetsItemCellView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FacetsItemsCollectionView = /** @class */ (function (_super) {
        __extends(FacetsItemsCollectionView, _super);
        function FacetsItemsCollectionView(options) {
            var _this = _super.call(this, options.collection) || this;
            _this.template = facets_items_collection_tpl;
            _this.cellTemplate = facets_items_collection_view_cell_tpl;
            _this.viewsPerRow = 1;
            _this.viewsPerRow = options.viewsPerRow;
            _this.keywords = options.keywords;
            _this.cellViewTemplate = options.cellViewTemplate;
            _this.application = options.application;
            return _this;
        }
        FacetsItemsCollectionView.prototype.getContext = function () {
            return {
                keywords: this.keywords
            };
        };
        FacetsItemsCollectionView.prototype.getCellViewsPerRow = function () {
            return this.viewsPerRow;
        };
        FacetsItemsCollectionView.prototype.getCellViewInstance = function (element, index) {
            return new FacetsItemCellView({
                application: this.application,
                template: this.cellViewTemplate,
                model: element
            });
        };
        FacetsItemsCollectionView.prototype.getRowViewInstance = function (index) {
            return new RowView_1.RowView({ template: facets_items_collection_view_row_tpl });
        };
        return FacetsItemsCollectionView;
    }(CollectionView_1.CollectionView));
    exports.FacetsItemsCollectionView = FacetsItemsCollectionView;
});

//# sourceMappingURL=FacetsItemsCollectionView.js.map
