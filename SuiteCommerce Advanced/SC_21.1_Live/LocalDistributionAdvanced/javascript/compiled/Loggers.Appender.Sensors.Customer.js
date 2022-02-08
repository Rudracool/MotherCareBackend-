/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Sensors.Customer", ["require", "exports", "Profile.Model"], function (require, exports, Profile_Model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function customer() {
        var profile_model = Profile_Model_1.ProfileModel.getInstance();
        var isGuest = profile_model.get('isGuest') === 'T';
        var isLoggedIn = !isGuest && profile_model.get('isLoggedIn') === 'T';
        var isRecognized = !isGuest && profile_model.get('isRecognized') === 'T';
        var isReturning = !isGuest && isLoggedIn;
        var isNew = !isGuest && !isRecognized && !isLoggedIn;
        var customerSessionStatus = '';
        if (isNew) {
            customerSessionStatus = 'New';
        }
        else if (isReturning) {
            customerSessionStatus = 'Returning';
        }
        else if (isGuest) {
            customerSessionStatus = 'Guest';
        }
        else if (isRecognized) {
            customerSessionStatus = 'Recognized';
        }
        return { customerSessionStatus: customerSessionStatus };
    }
    exports.customer = customer;
});

//# sourceMappingURL=Loggers.Appender.Sensors.Customer.js.map
