/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.MyAccount.Configuration", ["require", "exports", "underscore", "Utils", "Configuration"], function (require, exports, _, Utils, Configuration_1) {
    "use strict";
    // Configuration.js
    // ----------------
    // All of the applications configurable defaults
    // Each section is comented with a title, please continue reading
    var Configuration = {
        // depending on the application we are configuring, used by the NavigationHelper.js
        currentTouchpoint: 'customercenter',
        modulesConfig: {
            Cart: { startRouter: false },
            Address: { startRouter: SC.ENVIRONMENT.siteSettings.is_logged_in },
            CreditCard: { startRouter: SC.ENVIRONMENT.siteSettings.is_logged_in }
        },
        // External Payment configuration.
        // You need to set the url (fragment) to redirect the customer after returns
        // from external payment gateway.
        externalPayment: {
            SALESORDER: {
                // record type
                doneFragment: 'quotetosalesorder-confirmation',
                failFragment: 'quotetosalesorder-review'
            },
            CUSTOMERPAYMENT: {
                doneFragment: 'payment-confirmation',
                failFragment: 'review-payment'
            }
        },
        sca: {
            collapseElements: false
        }
    };
    // window.screen = false;
    // Calculates the width of the device, it will try to use the real screen size.
    var screen_width = Utils.getViewportWidth();
    // Phone Specific
    if (screen_width < 768) {
        Configuration.sca.collapseElements = true;
        Configuration_1.Configuration.defaultPaginationSettings = Configuration_1.Configuration.defaultPaginationSettingsPhone;
    }
    // Tablet Specific
    else if (screen_width >= 768 && screen_width <= 978) {
        Configuration.sca.collapseElements = true;
        Configuration_1.Configuration.defaultPaginationSettings = Configuration_1.Configuration.defaultPaginationSettingsTablet;
    }
    _.extend(Configuration_1.Configuration, Configuration);
    return Configuration_1.Configuration;
});

//# sourceMappingURL=SC.MyAccount.Configuration.js.map
