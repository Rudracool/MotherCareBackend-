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
define("SC.Shopping.Layout", ["require", "exports", "shopping_layout.tpl", "Utils", "BackboneExtras", "ApplicationOnlineLayout"], function (require, exports, shopping_layout_tpl, Utils, Backbone, ApplicationOnlineLayout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShoppingLayout = /** @class */ (function (_super) {
        __extends(ShoppingLayout, _super);
        function ShoppingLayout(application) {
            var _this = _super.call(this, application) || this;
            _this.template = shopping_layout_tpl;
            _this.className = 'layout-container';
            _this.breadcrumbPrefix = [
                {
                    href: '/',
                    'data-touchpoint': 'home',
                    'data-hashtag': '#',
                    text: Utils.translate('Home')
                }
            ];
            _this.events['change select[data-type="navigator"]'] = 'changeUrl';
            return _this;
        }
        ShoppingLayout.prototype.changeUrl = function (e) {
            // Disable other navigation links before redirection
            this.$('select[data-type="navigator"], .pagination-links a').attr('disabled', 'disabled');
            // Get the value of the select and navigate to it
            // http://backbonejs.org/#Router-navigate
            Backbone.history.navigate(this.$(e.target).val(), { trigger: true });
        };
        return ShoppingLayout;
    }(ApplicationOnlineLayout_1.ApplicationOnlineLayout));
    exports.ShoppingLayout = ShoppingLayout;
});

//# sourceMappingURL=SC.Shopping.Layout.js.map
