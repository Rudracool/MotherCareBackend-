/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("ServiceClient", ["require", "exports", "JQueryExtras"], function (require, exports, JQueryExtras_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServiceClient = /** @class */ (function () {
        function ServiceClient() {
        }
        ServiceClient.prototype.request = function (options) {
            var deferred = JQueryExtras_1.jQuery.Deferred();
            JQueryExtras_1.jQuery
                .ajax(options)
                .done(function (data, textStatus, jqXHR) {
                deferred.resolve({
                    data: data,
                    textStatus: textStatus,
                    response: {
                        readyState: jqXHR.readyState,
                        getResponseHeader: function (name) {
                            return jqXHR.getResponseHeader(name);
                        }
                    }
                });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                deferred.reject({
                    textStatus: textStatus,
                    errorThrown: errorThrown,
                    response: {
                        readyState: jqXHR.readyState,
                        getResponseHeader: function (name) {
                            return jqXHR.getResponseHeader(name);
                        }
                    }
                });
            });
            return deferred;
        };
        ServiceClient.prototype.defaultRequestOptions = function () {
            return {
                contentType: 'application/json',
                dataType: 'json',
                processData: false
            };
        };
        ServiceClient.prototype.putRequest = function (url, data, options) {
            if (options === void 0) { options = {}; }
            var params = __assign({}, this.defaultRequestOptions(), { url: url, method: 'PUT', data: JSON.stringify('toJSON' in data ? data.toJSON() : data) }, options);
            return this.request(params);
        };
        ServiceClient.prototype.postRequest = function (url, data, options) {
            if (options === void 0) { options = {}; }
            var params = __assign({}, this.defaultRequestOptions(), { url: url, method: 'POST', data: JSON.stringify('toJSON' in data ? data.toJSON() : data) }, options);
            return this.request(params);
        };
        ServiceClient.prototype.getRequest = function (url, data, options) {
            if (options === void 0) { options = {}; }
            var params = __assign({}, this.defaultRequestOptions(), { url: url, method: 'GET', data: data, processData: true }, options);
            return this.request(params);
        };
        return ServiceClient;
    }());
    exports.ServiceClient = ServiceClient;
});

//# sourceMappingURL=ServiceClient.js.map
