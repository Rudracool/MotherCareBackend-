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
define("PageTypeFormView", ["require", "exports", "PageTypeView", "FormView"], function (require, exports, PageTypeView_1, FormView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            });
        });
    }
    /** @deprecated
     * This is deprecated because for new solutions
     * you should have View that extends from PageTypeView
     * and on it a child view that extend from FormView
     **/
    var PageTypeFormView = /** @class */ (function (_super) {
        __extends(PageTypeFormView, _super);
        function PageTypeFormView(options, formModel) {
            var _this = _super.call(this, options) || this;
            FormView_1.FormView.prototype.constructor.call(_this, formModel);
            return _this;
        }
        return PageTypeFormView;
    }(PageTypeView_1.PageTypeView));
    exports.PageTypeFormView = PageTypeFormView;
    applyMixins(PageTypeFormView, [FormView_1.FormView]);
});

//# sourceMappingURL=PageTypeFormView.js.map
