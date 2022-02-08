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
define("WebSiteConfiguration.Model", ["require", "exports", "Utils", "Model"], function (require, exports, Utils, Model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // TODO: We should extend of CachedModel once available
    var WebSiteConfigurationModel = /** @class */ (function (_super) {
        __extends(WebSiteConfigurationModel, _super);
        function WebSiteConfigurationModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.urlRoot = function () { return Utils.getAbsoluteUrl('services/WebSiteConfiguration.ss', true); };
            return _this;
        }
        return WebSiteConfigurationModel;
    }(Model_1.Model));
    exports.WebSiteConfigurationModel = WebSiteConfigurationModel;
});

//# sourceMappingURL=WebSiteConfiguration.Model.js.map
