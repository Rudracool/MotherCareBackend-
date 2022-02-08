/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.MyAccount.Starter", ["require", "exports", "Utils", "jQuery", "SC.MyAccount", "Environment", "SC.MyAccount.Starter.Dependencies", "Backbone", "SC.Extensions"], function (require, exports, Utils, jQuery, SC_MyAccount_1, Environment_1, SC_MyAccount_Starter_Dependencies_1, Backbone, extensionsPromise) {
    "use strict";
    var MyAccountStarter = /** @class */ (function () {
        function MyAccountStarter() {
            this.myAccount = SC_MyAccount_1.MyAccount.getInstance();
            var self = this;
            jQuery(function () {
                extensionsPromise.then(function () {
                    var entryPointExtensionsModules = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        entryPointExtensionsModules[_i] = arguments[_i];
                    }
                    return self.init(SC_MyAccount_Starter_Dependencies_1.entryPointModules.concat(entryPointExtensionsModules));
                });
            });
        }
        MyAccountStarter.prototype.init = function (allModules) {
            var _this = this;
            this.myAccount.start(allModules, function () {
                _this.checkForErrors();
                _this.myAccount.getLayout().appendToDom();
            });
        };
        MyAccountStarter.prototype.checkForErrors = function () {
            var SC = Environment_1.Environment.getSC();
            if (SC.ENVIRONMENT.contextError) {
                this.myAccount
                    .getLayout()
                    .$('#site-header')
                    .hide();
                this.myAccount
                    .getLayout()
                    .$('#site-footer')
                    .hide();
                this.myAccount
                    .getLayout()
                    .internalError(SC.ENVIRONMENT.contextError.errorMessage, "Error " + SC.ENVIRONMENT.contextError.errorStatusCode + ": " + SC.ENVIRONMENT.contextError.errorCode);
            }
            else {
                var fragment = Utils.parseUrlOptions(location.search).fragment;
                if (fragment && !location.hash) {
                    location.hash = decodeURIComponent(fragment.toString());
                }
                Backbone.history.start();
            }
        };
        return MyAccountStarter;
    }());
    return new MyAccountStarter();
});

//# sourceMappingURL=SC.MyAccount.Starter.js.map
