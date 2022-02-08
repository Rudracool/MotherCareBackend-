/**
* @NApiVersion 2.x
* @NModuleScope Public
*/
define(["require", "exports", "../_suitescript/SC/CMSAdapter/WebSiteConfiguration.ServiceController"], function (require, exports, ServiceController) {
    "use strict";
    return { service: function (ctx) { return ServiceController.service(ctx); } };
});
