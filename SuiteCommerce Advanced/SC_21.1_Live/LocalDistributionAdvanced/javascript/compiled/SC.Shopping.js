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
define("SC.Shopping", ["require", "exports", "Utils", "jQuerySCAExtras", "ApplicationOnline", "SC.Shopping.Layout", "Environment", "SC.Shopping.Configuration", "Backbone.Model", "Backbone.Sync", "BackboneExtras", "Backbone.View", "Backbone.View.render", "Backbone.View.saveForm", "Backbone.View.toggleReset", "Bootstrap.Rate", "Bootstrap.Slider", "jQuery.scPush", "String.format"], function (require, exports, Utils, jQuerySCAExtras_1, ApplicationOnline_1, SC_Shopping_Layout_1, Environment_1, Configuration) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shopping = /** @class */ (function (_super) {
        __extends(Shopping, _super);
        function Shopping() {
            var _this = _super.call(this) || this;
            _this.layout = new SC_Shopping_Layout_1.ShoppingLayout(_this);
            _this.configuration = Configuration.get();
            // This is only to avoid break extensions in 20.2 release. Should be deleted asap
            _this.Configuration = _this.configuration;
            // Setup global cache for this application
            jQuerySCAExtras_1.jQuery.ajaxSetup({ cache: true });
            jQuerySCAExtras_1.jQuery.ajaxPrefilter(_this.ajaxPrefilter);
            return _this;
        }
        Shopping.prototype.ajaxPrefilter = function (options) {
            var SC = Environment_1.Environment.getSC();
            if (options.url) {
                if (options.type === 'GET' && options.data) {
                    var join_string = ~options.url.indexOf('?') ? '&' : '?';
                    options.url = options.url + join_string + options.data;
                    options.data = '';
                }
                options.url = Utils.reorderUrlParams(options.url);
            }
            if (options.pageGeneratorPreload && SC.ENVIRONMENT.jsEnvironment === 'server') {
                jQuerySCAExtras_1.jQuery('<img />', { src: options.url, alt: '', style: 'display: none;' }).prependTo('body');
            }
        };
        Shopping.getInstance = function () {
            this.instance = this.instance || new Shopping();
            return this.instance;
        };
        Shopping.prototype.getName = function () {
            return 'Shopping';
        };
        return Shopping;
    }(ApplicationOnline_1.ApplicationOnline));
    exports.Shopping = Shopping;
});

//# sourceMappingURL=SC.Shopping.js.map
