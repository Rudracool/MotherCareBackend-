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
define("Case.Model", ["require", "exports", "Model", "Utils", "Validator"], function (require, exports, Model_1, Utils, Validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CaseModel = /** @class */ (function (_super) {
        __extends(CaseModel, _super);
        function CaseModel(attributes, options) {
            if (attributes === void 0) { attributes = {
                caseNumber: '',
                title: '',
                status: { id: '', name: '' },
                origin: { id: '', name: '' },
                category: { id: '', name: '' },
                company: { id: '', name: '' },
                priority: { id: '', name: '' },
                createdDate: '',
                lastMessageDate: '',
                email: '',
                messages_count: 0,
                grouped_messages: []
            }; }
            var _this = _super.call(this, attributes, options) || this;
            _this.urlRoot = function () { return Utils.getAbsoluteUrl('services/Case.ss', true); };
            _this.validation = {
                title: {
                    required: true,
                    msg: Utils.translate('Subject is required')
                },
                message: {
                    fn: _this.validateMessage
                },
                reply: {
                    fn: _this.validateReply
                },
                email: {
                    required: function (value, name, form) {
                        return !!form.include_email;
                    },
                    pattern: 'email',
                    msg: Utils.translate('Please provide a valid email')
                }
            };
            _this.isClosing = false;
            return _this;
        }
        CaseModel.prototype.getValidationRules = function () {
            var _this = this;
            return {
                title: [function (val) { return Validator_1.ValidationUtils.required(val, Utils.translate('Subject is required')); }],
                message: [function (val) { return _this.validateMessage(val, 'message'); }],
                reply: [function (val) { return _this.validateReply(val, 'reply'); }],
                email: [
                    function (val) { return Validator_1.ValidationUtils.email(val, Utils.translate('Please provide a valid email')); }
                ]
            };
        };
        CaseModel.prototype.validateReply = function (value, name) {
            if (!this.get('isNewCase') && !value && !this.isClosing) {
                return Utils.translate('$(0) is required', name);
            }
            return '';
        };
        CaseModel.prototype.validateMessage = function (value, name) {
            if (this.get('isNewCase')) {
                if (!value) {
                    return Utils.translate('$(0) is required', name);
                }
                return CaseModel.validateLength(value, name);
            }
            return '';
        };
        // Validates message length. (0 < length <= 4000)
        CaseModel.validateLength = function (value, name) {
            var max_length = 4000;
            if (value && value.length > max_length) {
                return Utils.translate('$(0) must be at most $(1) characters', name, max_length);
            }
            return '';
        };
        return CaseModel;
    }(Model_1.Model));
    exports.CaseModel = CaseModel;
});

//# sourceMappingURL=Case.Model.js.map
