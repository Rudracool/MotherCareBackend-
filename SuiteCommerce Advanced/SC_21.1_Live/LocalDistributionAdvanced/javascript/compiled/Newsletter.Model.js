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
define("Newsletter.Model", ["require", "exports", "Utils", "Model", "Validator"], function (require, exports, Utils, Model_1, Validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NewsletterModel = /** @class */ (function (_super) {
        __extends(NewsletterModel, _super);
        function NewsletterModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.urlRoot = function () { return Utils.getAbsoluteUrl('services/Newsletter.Service.ss'); };
            return _this;
        }
        NewsletterModel.prototype.getValidationRules = function () {
            return {
                email: [
                    function (val) {
                        return Validator_1.ValidationUtils.required(val, Utils.translate('Enter an email address to subscribe'));
                    },
                    function (val) {
                        return Validator_1.ValidationUtils.email(val, Utils.translate('Valid email address is required'));
                    }
                ]
            };
        };
        return NewsletterModel;
    }(Model_1.Model));
    exports.NewsletterModel = NewsletterModel;
});

//# sourceMappingURL=Newsletter.Model.js.map
