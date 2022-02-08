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
define(["require", "exports", "N/http", "../Libraries/Controller/SCAServiceController", "../../Common/Controller/HttpResponse", "./WebSiteConfiguration.Handler"], function (require, exports, http_1, SCAServiceController_1, HttpResponse_1, WebSiteConfiguration_Handler_1) {
    "use strict";
    var WebSiteConfigurationServiceController = /** @class */ (function (_super) {
        __extends(WebSiteConfigurationServiceController, _super);
        function WebSiteConfigurationServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'WebSiteConfiguration.ServiceController2';
            return _this;
        }
        WebSiteConfigurationServiceController.prototype.get = function () {
            var smtDomains = WebSiteConfiguration_Handler_1.getConfiguredDomains();
            return new HttpResponse_1.HttpResponse(smtDomains, {
                cache: http_1.CacheDuration.SHORT
            });
        };
        return WebSiteConfigurationServiceController;
    }(SCAServiceController_1.SCAServiceController));
    return {
        service: function (ctx) {
            new WebSiteConfigurationServiceController(ctx).initialize();
        }
    };
});
