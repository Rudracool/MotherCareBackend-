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
define(["require", "exports", "../../../Common/Controller/ServiceController", "../Configuration/Configuration", "../Auth/Auth", "../../../Common/Controller/RequestErrors", "../../../Common/Environment/Environment"], function (require, exports, ServiceController_1, Configuration_1, Auth_1, RequestErrors_1, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SCAServiceController = /** @class */ (function (_super) {
        __extends(SCAServiceController, _super);
        function SCAServiceController(context) {
            var _this = _super.call(this, context) || this;
            var siteId = Number(_this.request.parameters.n);
            var domain = _this.request.parameters.domain || Environment_1.Environment.getInstance().getHost();
            Configuration_1.Configuration.getInstance().setSiteAndDomain(siteId, domain, _this.request.url);
            return _this;
        }
        SCAServiceController.prototype.handle = function () {
            var serviceAction = this.getServiceAction();
            if (!Auth_1.default.validateLogin(serviceAction)) {
                return this.sendError(RequestErrors_1.unauthorizedError);
            }
            if (!Auth_1.default.validatePermissions(serviceAction)) {
                return this.sendError(RequestErrors_1.forbiddenError);
            }
            return _super.prototype.handle.call(this);
        };
        return SCAServiceController;
    }(ServiceController_1.ServiceController));
    exports.SCAServiceController = SCAServiceController;
});
