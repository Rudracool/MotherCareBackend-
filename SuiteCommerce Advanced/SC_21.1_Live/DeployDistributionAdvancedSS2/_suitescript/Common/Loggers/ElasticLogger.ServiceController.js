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
define(["require", "exports", "N/internal/elasticLogger", "../Controller/ServiceController", "../Controller/HttpResponse"], function (require, exports, loggerFactory, ServiceController_1, HttpResponse_1) {
    "use strict";
    var ElasticLoggerServiceController = /** @class */ (function (_super) {
        __extends(ElasticLoggerServiceController, _super);
        function ElasticLoggerServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'ElasaticLogger.ServiceController2';
            return _this;
        }
        ElasticLoggerServiceController.prototype.checkOriginRequest = function () {
            return false;
        };
        ElasticLoggerServiceController.prototype.post = function (body) {
            var result = { success: true, error: null };
            var response = new HttpResponse_1.HttpResponse(result);
            try {
                if (!body) {
                    throw new Error('No data on body request');
                }
                ElasticLoggerServiceController.logData(body);
            }
            catch (e) {
                result.success = false;
                result.error = e.message;
                response = new HttpResponse_1.HttpResponse(result, { customStatus: 500 });
            }
            return response;
        };
        ElasticLoggerServiceController.logData = function (data) {
            var application_type;
            if (data.type === 'SCA') {
                application_type = loggerFactory.Type.SCA;
            }
            else if (data.type === 'SCS') {
                application_type = loggerFactory.Type.SCS;
            }
            else {
                application_type = loggerFactory.Type.SCIS;
            }
            var logger = loggerFactory.create({
                type: application_type
            });
            if (data.info) {
                for (var i = 0; i < data.info.length; i++) {
                    logger.info(data.info[i]);
                }
            }
            if (data.error) {
                for (var i = 0; i < data.error.length; i++) {
                    logger.error(data.error[i]);
                }
            }
        };
        return ElasticLoggerServiceController;
    }(ServiceController_1.ServiceController));
    return {
        service: function (ctx) {
            new ElasticLoggerServiceController(ctx).initialize();
        }
    };
});
