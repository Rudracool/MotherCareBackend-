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
define("SC.Checkout.Layout", ["require", "exports", "checkout_layout.tpl", "Utils", "ApplicationOnlineLayout"], function (require, exports, checkout_layout_tpl, Utils, ApplicationOnlineLayout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CheckoutLayout = /** @class */ (function (_super) {
        __extends(CheckoutLayout, _super);
        function CheckoutLayout() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.template = checkout_layout_tpl;
            _this.className = 'layout-container';
            _this.breadcrumbPrefix = [
                {
                    href: '#',
                    'data-touchpoint': 'home',
                    'data-hashtag': '#',
                    text: Utils.translate('Home')
                },
                {
                    href: '#',
                    'data-touchpoint': 'checkout',
                    'data-hashtag': '#',
                    text: Utils.translate('Checkout')
                }
            ];
            return _this;
        }
        return CheckoutLayout;
    }(ApplicationOnlineLayout_1.ApplicationOnlineLayout));
    exports.CheckoutLayout = CheckoutLayout;
});

//# sourceMappingURL=SC.Checkout.Layout.js.map
