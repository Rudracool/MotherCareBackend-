/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("SC.Checkout", ["require", "exports", "underscore", "jQuerySCAExtras", "Utils", "ApplicationOnline", "SC.Checkout.Layout", "CheckoutStepsFactory", "SC.Checkout.Configuration", "Session", "Backbone.Model", "Backbone.Sync", "BackboneExtras", "Backbone.View", "Backbone.View.render", "Backbone.View.saveForm", "Backbone.View.toggleReset", "Bootstrap.Slider", "String.format"], function (require, exports, _, jQuerySCAExtras_1, Utils, ApplicationOnline_1, SC_Checkout_Layout_1, CheckoutStepsFactory_1, Configuration, Session) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* !
     * Description: SuiteCommerce Reference Checkout
     *
     * @copyright (c) 2000-2013, NetSuite Inc.
     * @version 1.0
     */
    // Application.js
    // --------------
    // Extends the application with Checkout specific core methods
    var Checkout = /** @class */ (function (_super) {
        __extends(Checkout, _super);
        function Checkout() {
            var _this = _super.call(this) || this;
            _this.appPromise = jQuerySCAExtras_1.jQuery.Deferred();
            _this.layout = new SC_Checkout_Layout_1.CheckoutLayout(_this);
            _this.configuration = Configuration.get();
            // This is only to avoid break extensions in 20.2 release. Should be deleted asap
            _this.Configuration = _this.configuration;
            // This makes that Promo codes and GC travel to different servers (secure and unsecure)
            _this.on('afterStart', function () { return _this.afterStart(); });
            // Setup global cache for this application
            jQuerySCAExtras_1.jQuery.ajaxSetup({ cache: false });
            return _this;
        }
        Checkout.prototype.start = function (modules, done) {
            var _this = this;
            var checkoutPromise = CheckoutStepsFactory_1.CheckoutStepsFactory.getInstance().loadCheckoutSteps();
            checkoutPromise.then(function () { return _super.prototype.start.call(_this, modules, done); });
        };
        Checkout.getInstance = function () {
            this.instance = this.instance || new Checkout();
            return this.instance;
        };
        Checkout.prototype.afterStart = function () {
            // Fix sitebuilder links, Examines the event target to check if its a touchpoint
            // and replaces it with the new version ot the touchpoint
            // As this fixCrossDomainNavigation only alters the href of the a we can append it
            // to the mouse down event, and not to the click thing will make us work a lot more :)
            jQuerySCAExtras_1.jQuery(document.body).on('mousedown', 'a', this.fixCrossDomainNavigation);
            jQuerySCAExtras_1.jQuery(document.body).on('touchstart', 'a', this.fixCrossDomainNavigation);
        };
        Checkout.prototype.fixCrossDomainNavigation = function (e) {
            var $element = jQuerySCAExtras_1.jQuery(e.target).closest('a');
            if (!$element.closest('#main').length) {
                var href = e.target.href;
                var url_prefix_1 = href && href.split('?')[0];
                // get the value of the "is" url parameter
                var href_parameter_value_is_1 = Utils.getParameterByName(href, 'is');
                var touchpoints = Session.get('touchpoints');
                _.each(touchpoints, function (touchpoint) {
                    var touchpoint_parameter_value_is = Utils.getParameterByName(touchpoint, 'is');
                    // If the href of the link is equal to the current touchpoint
                    // then update the link with the
                    // parameters of the touchpoint. To check if are equals is been used the url without
                    // parameters and the parameter "is"
                    if (url_prefix_1 && ~touchpoint.indexOf(url_prefix_1)) {
                        // If the "is" parameter exist in the link, then must exist in the
                        // touchpoint and his values need to be equals.
                        if (!(href_parameter_value_is_1 &&
                            (!touchpoint_parameter_value_is ||
                                touchpoint_parameter_value_is !== href_parameter_value_is_1))) {
                            e.target.href = touchpoint;
                        }
                    }
                });
            }
        };
        Checkout.prototype.getName = function () {
            return 'Checkout';
        };
        return Checkout;
    }(ApplicationOnline_1.ApplicationOnline));
    exports.Checkout = Checkout;
});

//# sourceMappingURL=SC.Checkout.js.map
