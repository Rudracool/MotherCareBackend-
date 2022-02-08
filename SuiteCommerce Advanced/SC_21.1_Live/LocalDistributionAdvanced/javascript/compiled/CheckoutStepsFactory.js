/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CheckoutStepsFactory", ["require", "exports", "Utils", "jQuerySCAExtras", "Environment", "SC.Checkout.Configuration.Steps.Standard", "SC.Checkout.Configuration.Steps.OPC", "SC.Checkout.Configuration.Steps.BillingFirst"], function (require, exports, Utils_1, jQuerySCAExtras_1, Environment_1, SC_Checkout_Configuration_Steps_Standard_1, SC_Checkout_Configuration_Steps_OPC_1, SC_Checkout_Configuration_Steps_BillingFirst_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CheckoutStepsFactory = /** @class */ (function () {
        function CheckoutStepsFactory() {
            this.implementationsMap = {
                Standard: SC_Checkout_Configuration_Steps_Standard_1.Standard,
                'One Page': SC_Checkout_Configuration_Steps_OPC_1.OPC,
                'Billing First': SC_Checkout_Configuration_Steps_BillingFirst_1.BillingFirst
            };
            var Application = Environment_1.Environment.getApplication();
            var checkoutApp = Application.getConfig().checkoutApp;
            this.checkoutName = checkoutApp.checkoutSteps;
        }
        CheckoutStepsFactory.prototype.getCheckoutSteps = function () {
            return this.implementationsMap[this.checkoutName];
        };
        CheckoutStepsFactory.prototype.loadCheckoutSteps = function () {
            var _this = this;
            var promise = jQuerySCAExtras_1.jQuery.Deferred();
            var implementation = this.getCheckoutSteps();
            if (implementation) {
                promise.resolve(implementation);
            }
            else {
                Utils_1.requireModules([this.checkoutName], promise.resolve, promise.reject);
            }
            return promise.then(function (checkoutSteps) {
                _this.implementationsMap[_this.checkoutName] = checkoutSteps;
            });
        };
        CheckoutStepsFactory.getInstance = function () {
            this.instance = this.instance || new CheckoutStepsFactory();
            return this.instance;
        };
        return CheckoutStepsFactory;
    }());
    exports.CheckoutStepsFactory = CheckoutStepsFactory;
});

//# sourceMappingURL=CheckoutStepsFactory.js.map
