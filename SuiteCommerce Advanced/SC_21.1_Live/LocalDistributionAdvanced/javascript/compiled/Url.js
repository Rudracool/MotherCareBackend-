/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Url", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Url = /** @class */ (function () {
        function Url(url) {
            var match;
            var parametersRegex = /([^;]*)(;(.*))*/;
            var queryRegex = /([^?]*)(\?(.*))*/;
            var netLocRegex = /^\/\/([^\/]*)(.*)/;
            var squemaNameRegex = /^([a-zA-Z+\-.]+):(.+)/;
            var fragmentRegex = /([^#]*)(#(.*))*/;
            var netLocComponentsRegex = /(([^:@]*)(:([^@]*))?@)*([\d\w.-]+)$/;
            this.strUrl = url;
            // Parse Fragment
            match = url.match(fragmentRegex);
            if (match) {
                this.fragment = match[3];
                url = match[1];
            }
            // Parse Schema
            match = url.match(squemaNameRegex);
            if (match) {
                this.schema = match[1];
                url = match[2];
            }
            // Parse NetLoc
            match = url.match(netLocRegex);
            if (match) {
                this.netLoc = match[1];
                url = match[2];
            }
            // Parse Query
            match = url.match(queryRegex);
            if (match) {
                this.query = match[3];
                url = match[1];
            }
            // Parse Parameters
            match = url.match(parametersRegex);
            if (match) {
                this.parameters = match[3];
                url = match[1];
            }
            // Set Path
            this.path = url;
            // Parse NetLocComponents
            // todo: implement parsing validations
            if (this.netLoc) {
                match = this.netLoc.match(netLocComponentsRegex);
                var user = void 0;
                var password = void 0;
                var domain = void 0;
                var port = void 0;
                if (match) {
                    if (match[2] !== undefined) {
                        user = match[2];
                        // password can only be considered if a user was provided
                        if (match[4] !== undefined) {
                            password = match[4];
                        }
                    }
                    if (match[5] !== undefined) {
                        domain = match[5];
                        if (match[7] !== undefined) {
                            port = match[7];
                        }
                    }
                }
                this.netLocComponet = { user: user, password: password, domain: domain, port: port };
            }
        }
        Url.prototype.toString = function () {
            var url = '';
            if (this.schema) {
                url += this.schema + ":";
            }
            if (this.netLoc) {
                url += "//" + this.netLoc;
            }
            if (this.path) {
                url += this.path;
            }
            if (this.parameters) {
                url += ";" + this.parameters;
            }
            if (this.query) {
                url += "?" + this.query;
            }
            if (this.fragment) {
                url += "#" + this.fragment;
            }
            return url;
        };
        Url.prototype.resolve = function (baseUrlStr) {
            var baseUrl = new Url(baseUrlStr);
            // step 1
            if (!baseUrl.strUrl) {
                return this;
            }
            // step 2 - a
            if (!this.strUrl) {
                return baseUrl;
            }
            var absoluteUrl = new Url(this.strUrl);
            // step 2 - b
            if (this.schema) {
                return this;
            }
            // step 2 - c
            absoluteUrl.schema = baseUrl.schema;
            // step 3
            if (!this.netLoc) {
                absoluteUrl.netLoc = baseUrl.netLoc;
                // step 4
                if (this.path.indexOf('/') !== 0) {
                    // step 5
                    if (!this.path) {
                        absoluteUrl.path = baseUrl.path;
                        // step 5 - a
                        if (!this.parameters) {
                            absoluteUrl.parameters = baseUrl.parameters;
                            if (!this.query) {
                                absoluteUrl.query = baseUrl.query;
                            }
                        }
                    }
                    else {
                        // step 6
                        var basePath = baseUrl.path.substr(0, baseUrl.path.lastIndexOf('/'));
                        absoluteUrl.path = basePath + '/' + this.path;
                        // step 6 - a,b
                        absoluteUrl.path = absoluteUrl.path.replace(/(\/\.\/)|(\/\.$)/g, '/');
                        // step 6 - c
                        var tmpPath = '';
                        while (tmpPath !== absoluteUrl.path) {
                            tmpPath = absoluteUrl.path;
                            absoluteUrl.path = absoluteUrl.path.replace(/\/*[^./]+\/\.\.\//, '/');
                        }
                        // step 6 - d
                        absoluteUrl.path = absoluteUrl.path.replace(/\/*[^./]+\/\.\.$/, '/');
                    }
                }
            }
            return absoluteUrl;
        };
        Url.prototype.getNetLocComponets = function () {
            return this.netLocComponet;
        };
        return Url;
    }());
    exports.Url = Url;
});

//# sourceMappingURL=Url.js.map
