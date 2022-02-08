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
define(["require", "exports", "../Libraries/Auth/Auth", "../Libraries/Controller/SCAServiceController", "../../Common/Controller/HttpResponse", "./TransactionHistory.Handler"], function (require, exports, Auth_1, SCAServiceController_1, HttpResponse_1, TransactionHistory_Handler_1) {
    "use strict";
    var _a, _b;
    var transaction = Auth_1.default.getPermissions().transaction;
    var TransactionHistoryServiceController = /** @class */ (function (_super) {
        __extends(TransactionHistoryServiceController, _super);
        function TransactionHistoryServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'TransactionHistory.ServiceController2';
            _this.transactionHistoryHandler = new TransactionHistory_Handler_1.TransactionHistoryHandler();
            return _this;
        }
        TransactionHistoryServiceController.prototype.get = function (parameters) {
            return new HttpResponse_1.HttpResponse(this.transactionHistoryHandler.search(parameters));
        };
        TransactionHistoryServiceController = __decorate([
            Auth_1.requireLogin(),
            Auth_1.requirePermissions((_a = {}, _a[Auth_1.Permission.EDIT] = [transaction.tranFind], _a)),
            Auth_1.requireAtLeastOnePermission((_b = {},
                _b[Auth_1.Permission.VIEW] = [
                    transaction.tranCustInvc,
                    transaction.tranCustCred,
                    transaction.tranCustPymt,
                    transaction.tranCustDep,
                    transaction.tranDepAppl
                ],
                _b))
        ], TransactionHistoryServiceController);
        return TransactionHistoryServiceController;
    }(SCAServiceController_1.SCAServiceController));
    return {
        service: function (ctx) {
            new TransactionHistoryServiceController(ctx).initialize();
        }
    };
});
