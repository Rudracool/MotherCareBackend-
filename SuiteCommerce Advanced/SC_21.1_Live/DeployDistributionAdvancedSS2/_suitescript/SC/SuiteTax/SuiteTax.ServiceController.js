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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../Libraries/Auth/Auth", "../Libraries/Controller/SCAServiceController", "../../Common/Controller/HttpResponse", "./SuiteTax.Handler"], function (require, exports, Auth_1, SCAServiceController_1, HttpResponse_1, SuiteTax_Handler_1) {
    "use strict";
    var SuiteTaxServiceController = /** @class */ (function (_super) {
        __extends(SuiteTaxServiceController, _super);
        function SuiteTaxServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'SuiteTax.ServiceController2';
            _this.suiteTaxHandler = new SuiteTax_Handler_1.SuiteTaxHandler();
            return _this;
        }
        SuiteTaxServiceController.prototype.getById = function (internalid) {
            return new HttpResponse_1.HttpResponse(this.suiteTaxHandler.getTaxesFromId(Number(internalid)));
        };
        SuiteTaxServiceController = __decorate([
            Auth_1.requireLogin()
        ], SuiteTaxServiceController);
        return SuiteTaxServiceController;
    }(SCAServiceController_1.SCAServiceController));
    return {
        service: function (ctx) {
            new SuiteTaxServiceController(ctx).initialize();
        },
        SuiteTaxServiceController: SuiteTaxServiceController
    };
});
