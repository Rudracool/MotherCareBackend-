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
define("Case.Fields.Model", ["require", "exports", "Utils", "Model"], function (require, exports, Utils, Model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CaseFieldsModel = /** @class */ (function (_super) {
        __extends(CaseFieldsModel, _super);
        function CaseFieldsModel(attributes, options) {
            if (attributes === void 0) { attributes = {
                categories: [],
                origins: [],
                statuses: [],
                priorities: []
            }; }
            var _this = _super.call(this, attributes, options) || this;
            _this.urlRoot = function () { return Utils.getAbsoluteUrl('services/Case.Fields.ss', true); };
            return _this;
        }
        return CaseFieldsModel;
    }(Model_1.Model));
    exports.CaseFieldsModel = CaseFieldsModel;
});

//# sourceMappingURL=Case.Fields.Model.js.map
