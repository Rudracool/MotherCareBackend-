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
define(["require", "exports", "N/url", "../../Common/Controller/ServiceController", "../../Common/Controller/HttpResponse"], function (require, exports, url, ServiceController_1, HttpResponse_1) {
    "use strict";
    var NSSCEnvironmentServiceController = /** @class */ (function (_super) {
        __extends(NSSCEnvironmentServiceController, _super);
        function NSSCEnvironmentServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'NS_SC_Environment.ServiceController2';
            return _this;
        }
        // eslint-disable-next-line class-methods-use-this
        NSSCEnvironmentServiceController.prototype.get = function () {
            var domain = url.resolveDomain({
                hostType: url.HostType.APPLICATION
            });
            return new HttpResponse_1.HttpResponse({ backendAccountDomain: domain });
        };
        return NSSCEnvironmentServiceController;
    }(ServiceController_1.ServiceController));
    return {
        service: function (ctx) {
            new NSSCEnvironmentServiceController(ctx).initialize();
        }
    };
});
