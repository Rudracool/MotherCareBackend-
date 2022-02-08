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
define("PageTypeView", ["require", "exports", "View", "Utils", "jQuery"], function (require, exports, View_1, Utils, jQuery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageTypeView = /** @class */ (function (_super) {
        __extends(PageTypeView, _super);
        function PageTypeView(options) {
            var _this = _super.call(this) || this;
            // this method is needed by core to render proper breadcrumb, it should not be overwritten
            _this.getBreadcrumbPages = function () {
                var breadCrumb = [];
                if (_this.options.pageInfo && _this.options.pageInfo.url) {
                    var pageInfo = _this.options.pageInfo;
                    var url = pageInfo.url;
                    var path = Utils.correctURL(url);
                    breadCrumb = [{ href: path, text: pageInfo.title || pageInfo.header }];
                }
                return breadCrumb;
            };
            _this.options = options;
            return _this;
        }
        PageTypeView.prototype.beforeShowContent = function () {
            return jQuery.Deferred().resolve();
        };
        PageTypeView.prototype.showContent = function () {
            var application = this.options.application || this.options.container;
            return application && application.getLayout().showContent(this);
        };
        return PageTypeView;
    }(View_1.View));
    exports.PageTypeView = PageTypeView;
});

//# sourceMappingURL=PageTypeView.js.map
