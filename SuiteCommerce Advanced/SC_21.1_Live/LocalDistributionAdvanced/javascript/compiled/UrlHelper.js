/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("UrlHelper", ["require", "exports", "underscore", "Utils"], function (require, exports, _, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @class UrlHelper Keeps track of the URL, triggering custom events to specific parameters.
    // Provides methods to add, get and remove parameters from the url.
    // Extends Utils and add this methods to underscore.
    // As an application module, when mounted to the application will listen to onAfterAppendView
    // and will update itself with the new url @extends ApplicationModule
    var UrlBaseHelper = {
        // @property {String} url
        url: '',
        // @property {Object} listeners
        listeners: {},
        // @property {Object} parameters
        parameters: {},
        // @method setUrl @param {String} url
        setUrl: function (url) {
            var _this = this;
            this.url = url;
            this.parameters = {};
            // for each of the listeners
            _.each(this.listeners, function (fn, token) {
                var parameter_value = _this.getParameterValue(token);
                // if the key (token) is in the url
                if (parameter_value) {
                    // we trigger the function
                    var value = _.isFunction(fn) ? fn(parameter_value) : fn;
                    // if there is a value, we store it in our parameters object
                    if (value) {
                        if (_.isBoolean(value)) {
                            _this.parameters[token] = parameter_value;
                        }
                        else {
                            _this.parameters[token] = value;
                        }
                    }
                }
            });
        },
        // @method addTokenListener @param {String} token @param {Function} fn
        addTokenListener: function (token, fn) {
            this.listeners[token] = fn;
        },
        // @method getParameters @return {Object}
        getParameters: function () {
            return this.parameters;
        },
        // @method getParameterValue @param {String} parameter @return {String}
        getParameterValue: function (parameter) {
            var value = this.url.match(parameter + '{1}\\={1}(.*?[^&#]*)');
            if (value && value[1]) {
                return value[1];
            }
            return '';
        },
        // @method clearValues
        clearValues: function () {
            this.url = '';
            this.listeners = {};
            this.parameters = {};
        },
        // @module Utils @class Utils
        // @method fixUrl added by UrlHelper @param {String} url
        fixUrl: function (url) {
            if (!new RegExp('^http').test(url)) {
                var parameters_1 = exports.UrlHelper.getParameters();
                var charValue_1 = '';
                var value_1;
                // for each of the parameters in the helper
                _.each(parameters_1, function (i, parameter) {
                    value_1 = url.match(new RegExp(parameter + '{1}\\={1}(.*?[^&]*)'));
                    // if the parameter is not in the url
                    if (!value_1) {
                        charValue_1 = ~url.indexOf('?') ? '&' : '?';
                        // we append it
                        url += charValue_1 + parameter + '=' + parameters_1[parameter];
                    }
                });
            }
            return url;
        },
        // @method setUrlParameter changes the value of a parameter in the url
        // @param {String} url @param {String} parameter @param {String} new_value
        setUrlParameter: function (url, parameter, new_value) {
            var value;
            if (parameter) {
                value = url.match(new RegExp(parameter + '{1}\\={1}(.*?[^(&|#)]*)'));
            }
            var charValue = '';
            if (value) {
                return url.replace(value[0], parameter + '=' + new_value);
            }
            charValue = ~url.indexOf('?') ? '&' : '?';
            return url + charValue + parameter + '=' + new_value;
        },
        // @method removeUrlParameter @param {String} url @param {String} parameter
        removeUrlParameter: function (url, parameter) {
            var base_url = url.split('?')[0];
            var param;
            var parameters_list = [];
            var query = url.indexOf('?') !== -1 ? url.split('?')[1] : '';
            if (query) {
                parameters_list = query.split('&');
                for (var i = parameters_list.length - 1; i >= 0; i -= 1) {
                    param = parameters_list[i].split('=')[0];
                    if (param === parameter) {
                        parameters_list.splice(i, 1);
                    }
                }
                base_url = base_url + '?' + parameters_list.join('&');
            }
            return base_url;
        },
        removeUrlParameters: function (url, parameters) {
            var _this = this;
            _.each(parameters, function (parameter) {
                url = _this.removeUrlParameter(url, parameter);
            });
            return url;
        }
    };
    _.mixin(Utils);
    exports.UrlHelper = _.extend(UrlBaseHelper, {
        mountToApp: function (Application) {
            var _this = this;
            Application.getLayout().on('afterAppendView', function () {
                // Every time afterAppendView is called, we set the url to the helper
                _this.setUrl(window.location.href);
            });
        }
    });
});

//# sourceMappingURL=UrlHelper.js.map
