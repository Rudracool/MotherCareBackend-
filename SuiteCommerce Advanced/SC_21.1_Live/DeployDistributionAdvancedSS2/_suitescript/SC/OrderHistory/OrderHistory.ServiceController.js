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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../Libraries/Controller/SCAServiceController", "../Libraries/Auth/Auth", "../../Common/Controller/HttpResponse", "../Salesorder/Salesorder.Handler", "../Invoices/Invoices.Handler", "../Salesorder/RecordAccess/Salesorder.Schema", "../Invoices/RecordAccess/Invoice.Schema"], function (require, exports, SCAServiceController_1, Auth_1, HttpResponse_1, Salesorder_Handler_1, Invoices_Handler_1, Salesorder_Schema_1, Invoice_Schema_1) {
    "use strict";
    var _a;
    var OrderHistoryServiceController = /** @class */ (function (_super) {
        __extends(OrderHistoryServiceController, _super);
        function OrderHistoryServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'OrderHistory.ServiceController2';
            _this.salesOrderHandler = new Salesorder_Handler_1.SalesOrderHandler();
            return _this;
        }
        OrderHistoryServiceController.prototype.get = function (parameters) {
            return new HttpResponse_1.HttpResponse(this.salesOrderHandler.search(parameters));
        };
        OrderHistoryServiceController.prototype.getById = function (internalid, parameters) {
            var result;
            if (parameters.recordtype === Salesorder_Schema_1.SalesOrderSchema.getInstance().type) {
                result = this.salesOrderHandler.getSalesOrder(internalid, parameters);
            }
            else if (parameters.recordtype === Invoice_Schema_1.InvoiceSchema.getInstance().type) {
                var invoiceHandler = new Invoices_Handler_1.InvoicesHandler();
                result = invoiceHandler.getInvoiceOrder(internalid, parameters);
            }
            return new HttpResponse_1.HttpResponse(result);
        };
        OrderHistoryServiceController.prototype.put = function (body, parameters) {
            var cancelResult = this.salesOrderHandler.updateStatus(Number(parameters.internalid), body.status, this.request.headers);
            var salesOrder = this.salesOrderHandler.getSalesOrder(parameters.internalid, parameters);
            var record = __assign({}, salesOrder, { cancel_response: cancelResult });
            return new HttpResponse_1.HttpResponse(record);
        };
        OrderHistoryServiceController = __decorate([
            Auth_1.requireLogin(),
            Auth_1.requirePermissions((_a = {},
                _a[Auth_1.Permission.EDIT] = [
                    Auth_1.default.getPermissions().transaction.tranFind,
                    Auth_1.default.getPermissions().transaction.tranSalesOrd
                ],
                _a))
        ], OrderHistoryServiceController);
        return OrderHistoryServiceController;
    }(SCAServiceController_1.SCAServiceController));
    return {
        service: function (ctx) {
            new OrderHistoryServiceController(ctx).initialize();
        }
    };
});
