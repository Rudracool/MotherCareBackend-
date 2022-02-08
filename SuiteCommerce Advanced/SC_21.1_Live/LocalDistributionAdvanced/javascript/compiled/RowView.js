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
define("RowView", ["require", "exports", "row_view.tpl", "View"], function (require, exports, row_view_tpl, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RowView = /** @class */ (function (_super) {
        __extends(RowView, _super);
        function RowView(options) {
            var _this = _super.call(this) || this;
            _this.template = row_view_tpl;
            if (options.template) {
                _this.template = options.template;
            }
            return _this;
        }
        RowView.prototype.getContext = function () {
            return {};
        };
        return RowView;
    }(View_1.View));
    exports.RowView = RowView;
});

//# sourceMappingURL=RowView.js.map
