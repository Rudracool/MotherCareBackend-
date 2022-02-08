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
define("SC.MyAccount", ["require", "exports", "jQuerySCAExtras", "SC.MyAccount.Layout", "ApplicationOnline", "SC.MyAccount.Configuration", "Backbone", "Backbone.Model", "Backbone.Sync", "BackboneExtras", "Backbone.View", "Backbone.View.render", "Backbone.View.saveForm", "Backbone.View.toggleReset", "Bootstrap.Rate", "Bootstrap.Slider", "String.format"], function (require, exports, jQuerySCAExtras_1, SC_MyAccount_Layout_1, ApplicationOnline_1, Configuration) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MyAccount = /** @class */ (function (_super) {
        __extends(MyAccount, _super);
        function MyAccount() {
            var _this = _super.call(this) || this;
            _this.configuration = Configuration.get();
            // This is only to avoid break extensions in 20.2 release. Should be deleted asap
            _this.Configuration = _this.configuration;
            _this.layout = new SC_MyAccount_Layout_1.MyAccountLayout(_this);
            jQuerySCAExtras_1.jQuery.ajaxSetup({ cache: false });
            return _this;
        }
        MyAccount.getInstance = function () {
            this.instance = this.instance || new MyAccount();
            return this.instance;
        };
        MyAccount.prototype.getName = function () {
            return 'MyAccount';
        };
        return MyAccount;
    }(ApplicationOnline_1.ApplicationOnline));
    exports.MyAccount = MyAccount;
});

//# sourceMappingURL=SC.MyAccount.js.map
