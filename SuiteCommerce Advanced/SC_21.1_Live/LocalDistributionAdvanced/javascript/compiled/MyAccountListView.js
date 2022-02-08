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
define("MyAccountListView", ["require", "exports", "PageTypeView"], function (require, exports, PageTypeView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MyAccountListView = /** @class */ (function (_super) {
        __extends(MyAccountListView, _super);
        function MyAccountListView(options) {
            return _super.call(this, options) || this;
        }
        return MyAccountListView;
    }(PageTypeView_1.PageTypeView));
    exports.MyAccountListView = MyAccountListView;
});

//# sourceMappingURL=MyAccountListView.js.map
