/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.Extensions", ["require", "exports", "underscore", "Utils", "jQuery", "Backbone.View", "Backbone.View.render"], function (require, exports, _, Utils, jQuery) {
    "use strict";
    var ext_promise = jQuery.Deferred().resolve();
    if (SC && SC.extensionModules) {
        ext_promise = jQuery.when.apply(jQuery, _.map(SC.extensionModules, function (appModuleName) {
            var promise = jQuery.Deferred();
            try {
                Utils.requireModules([appModuleName], promise.resolve, function (error) {
                    console.error(error);
                    promise.resolve();
                });
            }
            catch (error) {
                console.error(error);
                promise.resolve();
            }
            return promise;
        }));
    }
    return ext_promise;
});

//# sourceMappingURL=SC.Extensions.js.map
