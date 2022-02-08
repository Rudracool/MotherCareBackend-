/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.Shopping.Starter", ["require", "exports", "Utils", "jQuery", "SC.Shopping", "Environment", "SC.Shopping.Starter.Dependencies", "Backbone", "SC.Extensions", "String.format"], function (require, exports, Utils, jQuery, SC_Shopping_1, Environment_1, SC_Shopping_Starter_Dependencies_1, Backbone, extensionsPromise) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var shoppingApp = SC_Shopping_1.Shopping.getInstance();
    var allEntryPointModules = [];
    function startShopping() {
        var SC = Environment_1.Environment.getSC();
        // we don't want to start the application if it is served externally,
        // like in google cached pages.
        if (SC.isCrossOrigin()) {
            // an user seeing the page in cache.google with js enabled won't
            // see the images unless we unwrap it:
            jQuery('noscript').each(function () {
                jQuery(this)
                    .parent()
                    .append(jQuery(this).text());
            });
            return;
        }
        // The page generator needs to run in sync in order to work properly
        if (SC.isPageGenerator()) {
            jQuery.ajaxSetup({ async: false });
        }
        jQuery.fn.modal.Constructor.BACKDROP_TRANSITION_DURATION = 0; // This is in order to prevent Quick View redrawing issues
        // When the document is ready we call the application.start,
        // and once that's done we bootstrap and start backbone
        shoppingApp.start(allEntryPointModules, function () {
            // Checks for errors in the context
            if (SC.ENVIRONMENT.contextError) {
                // Hide the header and footer.
                shoppingApp
                    .getLayout()
                    .$('#site-header')
                    .hide();
                shoppingApp
                    .getLayout()
                    .$('#site-footer')
                    .hide();
                // Shows the error.
                shoppingApp
                    .getLayout()
                    .internalError(SC.ENVIRONMENT.contextError.errorMessage, "Error " + SC.ENVIRONMENT.contextError.errorStatusCode + ": " + SC.ENVIRONMENT.contextError.errorCode);
            }
            else {
                var fragment = Utils.parseUrlOptions(location.search).fragment;
                if (fragment && !location.hash) {
                    location.hash = decodeURIComponent(fragment.toString());
                }
                if (shoppingApp.getUser) {
                    shoppingApp.getUser().done(function () {
                        // Only do push state client side.
                        Backbone.history.start({
                            pushState: !SC.isDevelopment && SC.ENVIRONMENT.jsEnvironment === 'browser'
                        });
                    });
                }
                else {
                    // Only do push state client side.
                    Backbone.history.start({
                        pushState: !SC.isDevelopment && SC.ENVIRONMENT.jsEnvironment === 'browser'
                    });
                }
            }
            shoppingApp.getLayout().appendToDom();
        });
    }
    // If the UA is google and main div is not empty (was pre-rendered) then avoid the starter execution
    if (!navigator.userAgent.match(/googlebot/i) ||
        !jQuery('#main') ||
        !String(jQuery('#main').html()).trim()) {
        jQuery(document).ready(function () {
            extensionsPromise.then(function () {
                var entryPointExtensionsModules = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    entryPointExtensionsModules[_i] = arguments[_i];
                }
                // At starting time all the modules Array is initialized
                allEntryPointModules = SC_Shopping_Starter_Dependencies_1.entryPointModules.concat(entryPointExtensionsModules);
                startShopping();
            });
        });
    }
});

//# sourceMappingURL=SC.Shopping.Starter.js.map
