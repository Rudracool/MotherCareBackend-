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
define(["require", "exports", "../Libraries/Auth/Auth", "../Libraries/Controller/SCAServiceController", "../../Common/Controller/HttpResponse", "./ReturnAuthorization.Handler"], function (require, exports, Auth_1, SCAServiceController_1, HttpResponse_1, ReturnAuthorization_Handler_1) {
    "use strict";
    var _a, _b, _c;
    var transaction = Auth_1.default.getPermissions().transaction;
    var ReturnAuthorizationServiceController = /** @class */ (function (_super) {
        __extends(ReturnAuthorizationServiceController, _super);
        function ReturnAuthorizationServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'ReturnAuthorization.ServiceController2';
            _this.returnAuthorizationHandler = new ReturnAuthorization_Handler_1.ReturnAuthorizationHandler();
            return _this;
        }
        ReturnAuthorizationServiceController.prototype.get = function (parameters) {
            return new HttpResponse_1.HttpResponse(this.returnAuthorizationHandler.search(parameters));
        };
        ReturnAuthorizationServiceController.prototype.getById = function (internalid, parameters) {
            return new HttpResponse_1.HttpResponse(this.returnAuthorizationHandler.get(internalid, parameters));
        };
        ReturnAuthorizationServiceController.prototype.post = function (body, parameters) {
            var id = this.returnAuthorizationHandler.create(body);
            return new HttpResponse_1.HttpResponse(this.returnAuthorizationHandler.get(String(id), parameters), {
                customStatus: 201
            });
        };
        ReturnAuthorizationServiceController.prototype.put = function (body, parameters) {
            this.returnAuthorizationHandler.updateStatus(Number(parameters.internalid), body.status, this.request.headers);
            return new HttpResponse_1.HttpResponse(this.returnAuthorizationHandler.get(parameters.internalid, parameters));
        };
        __decorate([
            Auth_1.requirePermissions((_a = {}, _a[Auth_1.Permission.CREATE] = [transaction.tranRtnAuth], _a))
        ], ReturnAuthorizationServiceController.prototype, "post", null);
        __decorate([
            Auth_1.requirePermissions((_b = {}, _b[Auth_1.Permission.CREATE] = [transaction.tranRtnAuth], _b))
        ], ReturnAuthorizationServiceController.prototype, "put", null);
        ReturnAuthorizationServiceController = __decorate([
            Auth_1.requireLogin(),
            Auth_1.requirePermissions((_c = {}, _c[Auth_1.Permission.VIEW] = [transaction.tranRtnAuth, transaction.tranFind], _c))
        ], ReturnAuthorizationServiceController);
        return ReturnAuthorizationServiceController;
    }(SCAServiceController_1.SCAServiceController));
    return {
        service: function (ctx) {
            new ReturnAuthorizationServiceController(ctx).initialize();
        }
    };
});
