/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/http", "N/https"], function (require, exports, Nhttp, Nhttps) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HttpClient = /** @class */ (function () {
        function HttpClient() {
        }
        HttpClient.prototype.get = function (url, headers) {
            return this.getConnectionModule(url).get({
                url: url,
                headers: headers
            });
        };
        HttpClient.prototype.getConnectionModule = function (url) {
            return /^https:/.test(url) ? Nhttps : Nhttp;
        };
        return HttpClient;
    }());
    exports.HttpClient = HttpClient;
});
