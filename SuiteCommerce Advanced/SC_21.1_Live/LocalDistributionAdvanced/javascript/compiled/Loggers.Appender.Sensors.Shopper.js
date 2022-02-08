/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Sensors.Shopper", ["require", "exports", "Profile.Model", "Session"], function (require, exports, Profile_Model_1, Session) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function shopper() {
        var data = { shopperInternalId: '', currencyCode: '' };
        var profile_instance = Profile_Model_1.ProfileModel.getInstance();
        var shopper_id = profile_instance.get('internalid');
        if (shopper_id && shopper_id !== '0') {
            data.shopperInternalId = shopper_id;
        }
        data.currencyCode = Session.get('currency.code') || '';
        return data;
    }
    exports.shopper = shopper;
});

//# sourceMappingURL=Loggers.Appender.Sensors.Shopper.js.map
