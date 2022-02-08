/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocator.Model", ["require", "exports", "Utils", "Location.Model"], function (require, exports, Utils, LocationModel) {
    "use strict";
    var StoreLocatorModel = LocationModel.extend({
        // @property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl('services/StoreLocator.Service.ss')
    });
    return StoreLocatorModel;
});

//# sourceMappingURL=StoreLocator.Model.js.map
