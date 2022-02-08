/**
* @NApiVersion 2.x
* @NModuleScope Public
*/
define(["require", "exports", "../_suitescript/Common/Loggers/ElasticLogger.ServiceController"], function (require, exports, ServiceController) {
    "use strict";
    return { service: function (ctx) { return ServiceController.service(ctx); } };
});
