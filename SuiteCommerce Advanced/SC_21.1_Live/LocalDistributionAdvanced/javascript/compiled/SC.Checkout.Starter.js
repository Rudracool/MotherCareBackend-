/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.Checkout.Starter", ["require", "exports", "Utils", "jQuery", "SC.Checkout", "Environment", "SC.Checkout.Starter.Dependencies", "Backbone", "SC.Extensions"], function (require, exports, Utils, jQuery, SC_Checkout_1, Environment_1, SC_Checkout_Starter_Dependencies_1, Backbone, extensionsPromise) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var application = SC_Checkout_1.Checkout.getInstance();
    jQuery(function () {
        extensionsPromise.then(function () {
            var entryPointExtensionsModules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                entryPointExtensionsModules[_i] = arguments[_i];
            }
            var SC = Environment_1.Environment.getSC();
            // At starting time all the modules Array is initialized
            var extendedEntryPointModules = SC_Checkout_Starter_Dependencies_1.entryPointModules.concat(entryPointExtensionsModules);
            application.start(extendedEntryPointModules, function () {
                // Checks for errors in the context
                if (SC.ENVIRONMENT.contextError) {
                    // Shows the error.
                    if (SC.ENVIRONMENT.contextError.errorCode === 'ERR_WS_EXPIRED_LINK') {
                        application.getLayout().expiredLink(SC.ENVIRONMENT.contextError.errorMessage);
                    }
                    else {
                        application
                            .getLayout()
                            .internalError(SC.ENVIRONMENT.contextError.errorMessage, "Error " + SC.ENVIRONMENT.contextError.errorStatusCode + ": " + SC.ENVIRONMENT.contextError.errorCode);
                    }
                }
                else {
                    var fragment = Utils.parseUrlOptions(location.search).fragment;
                    if (fragment && !location.hash) {
                        location.hash = decodeURIComponent(fragment.toString());
                    }
                    Backbone.history.start();
                }
                application.getLayout().appendToDom();
            });
        });
    });
});

//# sourceMappingURL=SC.Checkout.Starter.js.map
