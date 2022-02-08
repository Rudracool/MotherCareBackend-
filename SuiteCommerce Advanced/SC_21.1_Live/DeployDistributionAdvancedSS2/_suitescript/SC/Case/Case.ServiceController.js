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
define(["require", "exports", "../Libraries/Controller/SCAServiceController", "../../Common/Controller/HttpResponse", "./Case.Handler", "../Libraries/Auth/Auth", "../../Common/Controller/RequestErrors"], function (require, exports, SCAServiceController_1, HttpResponse_1, Case_Handler_1, Auth_1, RequestErrors_1) {
    "use strict";
    var _a;
    var CaseServiceController = /** @class */ (function (_super) {
        __extends(CaseServiceController, _super);
        function CaseServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'Case.ServiceController2';
            _this.caseHandler = new Case_Handler_1.CaseHandler();
            return _this;
        }
        CaseServiceController.prototype.getById = function (id) {
            var record = this.caseHandler.get(id);
            if (!record) {
                throw RequestErrors_1.notFoundError;
            }
            return new HttpResponse_1.HttpResponse(record);
        };
        CaseServiceController.prototype.get = function (parameters) {
            var listHeaderData = {
                filter: parameters.filter,
                order: parameters.order,
                sort: parameters.sort,
                from: parameters.from,
                to: parameters.to,
                page: parameters.page
            };
            return new HttpResponse_1.HttpResponse(this.caseHandler.search(listHeaderData));
        };
        CaseServiceController.prototype.post = function (body) {
            var caseId = this.caseHandler.create({
                statusid: body.status && body.status.id,
                title: body.title,
                message: body.message,
                category: body.category,
                email: body.email
            });
            return new HttpResponse_1.HttpResponse(this.caseHandler.get(String(caseId)));
        };
        CaseServiceController.prototype.put = function (body, parameters) {
            var internalid = parameters.internalid || body.internalid;
            var caseInput = {
                id: internalid,
                statusid: body.status && body.status.id,
                reply: body.reply
            };
            if (caseInput.statusid) {
                this.caseHandler.update(caseInput);
            }
            return new HttpResponse_1.HttpResponse(this.caseHandler.get(internalid));
        };
        CaseServiceController = __decorate([
            Auth_1.requireLogin(),
            Auth_1.requirePermissions((_a = {}, _a[Auth_1.Permission.EDIT] = [Auth_1.default.getPermissions().lists.listCase], _a))
        ], CaseServiceController);
        return CaseServiceController;
    }(SCAServiceController_1.SCAServiceController));
    return {
        service: function (ctx) {
            new CaseServiceController(ctx).initialize();
        }
    };
});
