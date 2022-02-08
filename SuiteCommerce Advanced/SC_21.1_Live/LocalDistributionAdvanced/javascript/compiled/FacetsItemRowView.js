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
define("FacetsItemRowView", ["require", "exports", "facets_items_collection_view_row.tpl", "View"], function (require, exports, facets_items_collection_view_row_tpl, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FacetsItemRowView = /** @class */ (function (_super) {
        __extends(FacetsItemRowView, _super);
        function FacetsItemRowView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.template = facets_items_collection_view_row_tpl;
            return _this;
        }
        FacetsItemRowView.prototype.getContext = function () {
            return {};
        };
        return FacetsItemRowView;
    }(View_1.View));
    exports.FacetsItemRowView = FacetsItemRowView;
});

//# sourceMappingURL=FacetsItemRowView.js.map
