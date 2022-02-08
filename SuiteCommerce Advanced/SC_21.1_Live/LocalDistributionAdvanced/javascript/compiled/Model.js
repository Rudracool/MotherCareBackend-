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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("Model", ["require", "exports", "BackboneExtras", "Collection", "Validator"], function (require, exports, Backbone, Collection_1, Validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Model = /** @class */ (function (_super) {
        __extends(Model, _super);
        function Model() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.operationIds = [];
            _this.url = function () {
                var base = _this.urlRoot();
                if (!base && _this.collection instanceof Collection_1.Collection) {
                    base = _this.collection.url();
                }
                if (_this.isNew()) {
                    return base;
                }
                var sep = base.indexOf('?') === -1 ? '?' : '&';
                return base + sep + "internalid=" + encodeURIComponent(_this.id);
            };
            _this.urlRoot = function () { return ''; };
            // @method url SCA Overrides @?property Backbone.Model.idAttribute
            // to add model's 'internalid' as parameter @return {String}
            _this.idAttribute = 'internalid';
            return _this;
        }
        Model.prototype.deepCopy = function () {
            return this.attributes;
        };
        Model.prototype.sync = function (method, model, options) {
            var _this = this;
            return Backbone.sync.call(this, method, model, options).always(function (body, status, xhr) {
                try {
                    if (xhr.getResponseHeader) {
                        _this.addOperationId(xhr.getResponseHeader('x-n-operationid'));
                    }
                }
                catch (e) {
                    console.error('Error fetching Operation Id from header.');
                }
            });
        };
        Model.prototype.addOperationId = function (ids) {
            if (Array.isArray(ids)) {
                this.operationIds = this.operationIds.concat(ids);
            }
            else {
                this.operationIds.push(ids);
            }
        };
        Model.prototype.getOperationIds = function () {
            return this.operationIds;
        };
        Model.prototype.set = function (attributeName, value, options) {
            if (attributeName == null)
                return this;
            // Handle both `"key", value` and `{key: value}` -style arguments,
            // required by extensibility layer (SCModel supported this)
            var attrs;
            var opts = options;
            if (typeof attributeName === 'object') {
                attrs = attributeName;
                opts = value;
            }
            else {
                attrs = {};
                attrs[attributeName] = value;
            }
            return _super.prototype.set.call(this, attrs, __assign({ validate: true }, opts));
        };
        Model.prototype.getLatestOperationIds = function (lastOperationIdIndex) {
            return this.getOperationIds().slice(lastOperationIdIndex);
        };
        Model.prototype.validate = function (attributes) {
            if (typeof attributes !== 'undefined') {
                var validator = new Validator_1.Validator(this.getValidationRules());
                return validator.validate(attributes);
            }
            return null;
        };
        // this method overrides the _validate method of Backbone
        Model.prototype._validate = function (attributes) {
            this.validationError = this.validate(attributes);
            return !this.validationError;
        };
        Model.prototype.getValidationRules = function () {
            return {};
        };
        Model.prototype.getValidationErrors = function () {
            return this.validationError;
        };
        return Model;
    }(Backbone.Model));
    exports.Model = Model;
});

//# sourceMappingURL=Model.js.map
