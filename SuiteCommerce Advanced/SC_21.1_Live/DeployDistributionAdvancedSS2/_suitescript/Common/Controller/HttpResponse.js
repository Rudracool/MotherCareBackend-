/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HttpResponse = /** @class */ (function () {
        function HttpResponse(body, options) {
            if (options === void 0) { options = {}; }
            this.body = body;
            this.customStatus = options.customStatus || 200;
            this.cache = options.cache;
            this.jsonpCallback = options.jsonpCallback;
            this.contentType =
                options.contentType || this.jsonpCallback
                    ? 'application/x-javascript'
                    : 'application/json';
        }
        HttpResponse.prototype.getBodyString = function () {
            var bodyString = JSON.stringify(this.body || {});
            return this.jsonpCallback ? this.jsonpCallback + "(" + bodyString + ")" : bodyString;
        };
        HttpResponse.prototype.getCustomStatus = function () {
            return this.customStatus;
        };
        HttpResponse.prototype.getContentType = function () {
            return this.contentType;
        };
        HttpResponse.prototype.getCache = function () {
            return this.cache;
        };
        HttpResponse.prototype.setCustomStatus = function (statusCode) {
            this.customStatus = statusCode;
        };
        HttpResponse.prototype.setBody = function (body) {
            this.body = body;
        };
        return HttpResponse;
    }());
    exports.HttpResponse = HttpResponse;
});
