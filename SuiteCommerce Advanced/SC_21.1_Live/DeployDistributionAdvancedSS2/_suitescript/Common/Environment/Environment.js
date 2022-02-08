/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/runtime"], function (require, exports, Nruntime) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Environment = /** @class */ (function () {
        function Environment() {
        }
        Environment.getInstance = function () {
            if (!this.instance) {
                this.instance = new Environment();
            }
            return this.instance;
        };
        Environment.prototype.getCurrentScript = function () {
            return Nruntime.getCurrentScript();
        };
        Environment.prototype.isFeatureInEffect = function (name) {
            return Nruntime.isFeatureInEffect({ feature: name });
        };
        Environment.prototype.setCurrentUrl = function (currentUrl) {
            this.currentUrl = currentUrl;
            this.host = this.currentUrl.replace(/^https?:\/\/([^/?#:]+).*$/, '$1');
        };
        Environment.prototype.getCurrentUrl = function () {
            return this.currentUrl;
        };
        Environment.prototype.getHost = function () {
            return this.host;
        };
        Environment.prototype.getCurrentWebsite = function () {
            return this.currentWebsite;
        };
        Environment.prototype.setCurrentWebsite = function (website) {
            this.currentWebsite = website;
        };
        Environment.prototype.getAbsoluteUrl = function (path) {
            var match = this.currentUrl.match(/https?[^$#]+/);
            var absoluteUrl = this.currentUrl;
            if (match && match[0]) {
                var urlArray = match[0].split('/');
                urlArray.pop();
                absoluteUrl = urlArray.join('/');
            }
            if (path[0] !== '/') {
                path = '/' + path;
            }
            return absoluteUrl + path;
        };
        return Environment;
    }());
    exports.Environment = Environment;
});
