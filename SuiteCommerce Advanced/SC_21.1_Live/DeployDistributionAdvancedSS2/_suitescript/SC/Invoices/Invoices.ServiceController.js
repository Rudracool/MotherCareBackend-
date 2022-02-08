/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
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
define(["require", "exports", "../Libraries/Controller/SCAServiceController"], function (require, exports, SCAServiceController_1) {
    "use strict";
    var InvoiceServiceController = /** @class */ (function (_super) {
        __extends(InvoiceServiceController, _super);
        function InvoiceServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'InvoiceServiceController ';
            return _this;
        }
        return InvoiceServiceController;
    }(SCAServiceController_1.SCAServiceController));
    return {
        service: function (ctx) {
            new InvoiceServiceController(ctx).initialize();
        }
    };
});
