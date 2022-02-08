/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Utils", ["require", "exports", "underscore", "String.format", "jQuery", "Backbone", "Backbone.Model"], function (require, exports, _, String_format_1, jQuery, Backbone, BackboneModel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ITEM_NO_LONGER_AVAILABLE = 1;
    /**
     *
     * @deprecated
     */
    // @function deepCopy Deep Copy of the object taking care of Backbone models
    // @param {Object} obj Object to be copy
    // @return {Object}
    function deepCopy(obj) {
        if (_.isFunction(obj)) {
            return null;
        }
        var copy = {};
        if (obj instanceof BackboneModel) {
            obj = obj.deepCopy();
        }
        else if (obj instanceof Backbone.Collection) {
            obj = obj.models || [];
        }
        if (_.isArray(obj)) {
            copy = [];
            _.each(obj, function (value) {
                !_.isFunction(value) && copy.push(deepCopy(value));
            });
        }
        else if (_.isObject(obj)) {
            obj = obj.deepCopy ? obj.deepCopy() : obj;
            _.each(obj, function (value, attr) {
                if (!_.isFunction(value) &&
                    !(value instanceof Backbone.View && attr === 'composite') &&
                    attr.indexOf &&
                    attr.indexOf('_') !== 0) {
                    copy[attr] = deepCopy(value);
                }
            });
        }
        else {
            copy = obj;
        }
        return copy;
    }
    exports.deepCopy = deepCopy;
    function correctURL(url) {
        // Removes the hastag if it's there remove it
        if (url === void 0) { url = ''; }
        url = url[0] === '#' ? url.substring(1) : url;
        // if it does not has a slash add it
        url = url[0] === '/' ? url : "/" + url;
        return url;
    }
    exports.correctURL = correctURL;
    /**
     *
     * @deprecated
     */
    function deepExtend(target, source) {
        if (_.isArray(target) || !_.isObject(target)) {
            return source;
        }
        _.each(source, function (value, key) {
            if (key in target) {
                target[key] = deepExtend(target[key], value);
            }
            else {
                target[key] = value;
            }
        });
        return target;
    }
    exports.deepExtend = deepExtend;
    // @method formatPhone
    // Will try to reformat a phone number for a given phone Format,
    // If no format is given, it will try to use the one in site settings.
    // @param {String} phone @param {String} format @return {String}
    function formatPhone(phone, format) {
        if (format === void 0) { format = ''; }
        // fyi: the tilde (~) its used as !== -1
        var extensionSearch = phone.search(/[A-Za-z#]/);
        var extension = extensionSearch !== -1 ? " " + phone.substring(extensionSearch) : '';
        var phoneNumber = extensionSearch !== -1 ? " " + phone.substring(0, extensionSearch) : phone;
        var phoneFormat = format || SC.ENVIRONMENT.siteSettings.phoneformat;
        if (/^[0-9()-.\s]+$/.test(phoneNumber) && phoneFormat) {
            var format_tokens = void 0;
            var phoneDigits = phoneNumber.replace(/[()-.\s]/g, '');
            switch (phoneFormat) {
                // c: country, ab: area_before, aa: area_after, d: digits
                case '(123) 456-7890':
                    format_tokens = {
                        c: ' ',
                        ab: '(',
                        aa: ') ',
                        d: '-'
                    };
                    break;
                case '123 456 7890':
                    format_tokens = {
                        c: ' ',
                        ab: '',
                        aa: ' ',
                        d: ' '
                    };
                    break;
                case '123-456-7890':
                    format_tokens = {
                        c: ' ',
                        ab: '',
                        aa: '-',
                        d: '-'
                    };
                    break;
                case '123.456.7890':
                    format_tokens = {
                        c: ' ',
                        ab: '',
                        aa: '.',
                        d: '.'
                    };
                    break;
                default:
                    return phone;
            }
            switch (phoneDigits.length) {
                case 7:
                    return (phoneDigits.substring(0, 3) +
                        format_tokens.d +
                        phoneDigits.substring(3) +
                        extension);
                case 10:
                    return (format_tokens.ab +
                        phoneDigits.substring(0, 3) +
                        format_tokens.aa +
                        phoneDigits.substring(3, 6) +
                        format_tokens.d +
                        phoneDigits.substring(6) +
                        extension);
                case 11:
                    return (phoneDigits.substring(0, 1) +
                        format_tokens.c +
                        format_tokens.ab +
                        phoneDigits.substring(1, 4) +
                        format_tokens.aa +
                        phoneDigits.substring(4, 7) +
                        format_tokens.d +
                        phoneDigits.substring(7) +
                        extension);
                default:
                    return phone;
            }
        }
        return phone;
    }
    exports.formatPhone = formatPhone;
    // @method dateToString Convert a date object to string using international format YYYY-MM-dd
    // Useful for inputs of type="date" @param {Date} date @return {String}
    function dateToString(date) {
        var month = "" + (date.getMonth() + 1);
        var day = "" + date.getDate();
        if (month.length === 1) {
            month = "0" + month;
        }
        if (day.length === 1) {
            day = "0" + day;
        }
        return date.getFullYear() + "-" + month + "-" + day;
    }
    exports.dateToString = dateToString;
    // @method addTimeToDate Add the amount of time in mmilliseconds to a date
    // @param {Date} date
    // @param {Number} offset (time in milliseconds)
    // @return {Date}
    function addTimeToDate(date, offset) {
        var date_time = new Date().getTime();
        return new Date(date_time + offset);
    }
    exports.addTimeToDate = addTimeToDate;
    // @method stringToDate parse a string date into a date object.
    // @param {String} str_date
    // @param {format:String,plusMonth:Number}
    // options.format: String format that specify the format of the input string. By Default YYYY-MM-dd.
    // options.plusMonth: Number that indicate
    // how many month offset should be applied when creating the date object.
    function stringToDate(str_date, options) {
        var dateOptions = _.extend({
            format: 'YYYY-MM-dd',
            plusMonth: -1,
            dateSplitCharacter: '-'
        }, options || {});
        // plumbing
        var date_parts = str_date ? str_date.split(dateOptions.dateSplitCharacter) : [];
        var format_parts = dateOptions.format ? dateOptions.format.split('-') : [];
        var year_index = _.indexOf(format_parts, 'YYYY') >= 0 ? _.indexOf(format_parts, 'YYYY') : 2;
        var month_index = _.indexOf(format_parts, 'MM') >= 0 ? _.indexOf(format_parts, 'MM') : 1;
        var day_index = _.indexOf(format_parts, 'dd') >= 0 ? _.indexOf(format_parts, 'dd') : 0;
        // Date parts
        var year = parseInt(date_parts[year_index], 10);
        var month = parseInt(date_parts[month_index], 10) + (dateOptions.plusMonth || 0);
        var day = parseInt(date_parts[day_index], 10);
        return new Date(year, month, day);
    }
    exports.stringToDate = stringToDate;
    function isDateValid(date) {
        if (date === null || typeof date.getTime() !== 'number') {
            // d.valueOf() could also work
            // date is not valid
            return false;
        }
        // date is valid
        // now validate the values of day, month and year
        var dtDay = date.getDate();
        var dtMonth = date.getMonth() + 1;
        var dtYear = date.getFullYear();
        var pattern = /^\d{4}$/;
        if (!pattern.test(dtYear.toString())) {
            return false;
        }
        if (dtMonth < 1 || dtMonth > 12) {
            return false;
        }
        if (dtDay < 1 || dtDay > 31) {
            return false;
        }
        if ((dtMonth === 4 || dtMonth === 6 || dtMonth === 9 || dtMonth === 11) && dtDay === 31) {
            return false;
        }
        if (dtMonth === 2) {
            var isLeap = dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0);
            if (dtDay > 29 || (dtDay === 29 && !isLeap)) {
                return false;
            }
        }
        return true;
    }
    exports.isDateValid = isDateValid;
    function getCurrencyByName(currency_name) {
        var selected_currency;
        var currencies = SC.ENVIRONMENT.availableCurrencies;
        if (currency_name && currencies) {
            selected_currency = _.find(currencies, function (currency) {
                return currency.currencyname === currency_name;
            });
        }
        return selected_currency;
    }
    exports.getCurrencyByName = getCurrencyByName;
    // @method translate
    // Used on all of the hardcoded texts in the templates.
    // Gets the translated value from SC.Translations object literal.
    // Please always use the syntax translate('string', 1, 2)
    // instead of the syntax _.translate('string', 1, 2)
    // Example: ```translate('There are $(0) apples in the tree', appleCount)```
    // @param {String} text @return {String}
    function translate(text) {
        var continuationText = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            continuationText[_i - 1] = arguments[_i];
        }
        if (!text) {
            return '';
        }
        // Turns the arguments object into an array
        var parameters = [];
        // Checks the translation table
        var result = SC.Translations && SC.Translations[text] ? SC.Translations[text] : text;
        if (continuationText && continuationText.length && result) {
            var firstParameter = continuationText[0];
            if (_.isArray(firstParameter) && firstParameter.length) {
                parameters = firstParameter;
            }
            else {
                parameters = _.map(continuationText, function (param) {
                    return _.escape(param);
                });
            }
        }
        result = String_format_1.stringFormat.apply(void 0, [result].concat(parameters));
        return result;
    }
    exports.translate = translate;
    // Returns the translated message based on the exception code
    // defined on Exceptions.ts file. If not defined a default translation is returned.
    function getTranslatedMessage(errorCode, errorMessage, parameters) {
        try {
            switch (errorCode) {
                case ITEM_NO_LONGER_AVAILABLE: {
                    return this.translate('Unfortunately this item/s is not longer available. Please <a href="#" data-touchpoint="viewcart"">go back</a> and review the cart');
                }
                default: {
                    return this.translate(errorMessage);
                }
            }
        }
        catch (e) {
            return this.translate('An error has occurred');
        }
    }
    exports.getTranslatedMessage = getTranslatedMessage;
    function validateSecurityCode(value) {
        var ccsn = String(value).trim();
        var errorMessage = '';
        if (ccsn) {
            if (!(Backbone.Validation.patterns.number.test(ccsn) &&
                (ccsn.length === 3 || ccsn.length === 4))) {
                errorMessage = translate('Security Number is invalid');
            }
        }
        else {
            errorMessage = translate('Security Number is required');
        }
        return errorMessage;
    }
    exports.validateSecurityCode = validateSecurityCode;
    function isHttpsSupported() {
        return (SC &&
            SC.ENVIRONMENT &&
            SC.ENVIRONMENT.siteSettings &&
            SC.ENVIRONMENT.siteSettings.isHttpsSupported);
    }
    exports.isHttpsSupported = isHttpsSupported;
    function isCheckoutSupported() {
        return (SC &&
            SC.ENVIRONMENT &&
            SC.ENVIRONMENT.siteSettings &&
            SC.ENVIRONMENT.siteSettings.checkoutSupported);
    }
    exports.isCheckoutSupported = isCheckoutSupported;
    // @method validatePhone @param {String} phone
    // @return {String} an error message if the passed phone is invalid or falsy if it is valid
    function validatePhone(phone) {
        var minLength = 7;
        if (_.isNumber(phone)) {
            // phone is a number so we can't ask for .length
            // we elevate 10 to (minLength - 1)
            // if the number is lower, then its invalid
            // eg: phone = 1234567890 is greater than 1000000, so its valid
            //     phone = 123456 is lower than 1000000, so its invalid
            if (phone < Math.pow(10, (minLength - 1))) {
                return translate('Phone Number is invalid');
            }
        }
        else if (phone) {
            // if its a string, we remove all the useless characters
            var value = phone.replace(/[()-.\s]/g, '');
            // we then turn the value into an integer and back to string
            // to make sure all of the characters are numeric
            // first remove leading zeros for number comparison
            while (value.length && value.substring(0, 1) === '0') {
                value = value.substring(1, value.length);
            }
            if (parseInt(value, 10).toString() !== value || value.length < minLength) {
                return translate('Phone Number is invalid');
            }
        }
        else {
            return translate('Phone is required');
        }
        return '';
    }
    exports.validatePhone = validatePhone;
    function validateState(value, valName, form) {
        var countries = SC.ENVIRONMENT.siteSettings.countries || {};
        if (countries[form.country] && countries[form.country].states && value === '') {
            return translate('State is required');
        }
        return '';
    }
    exports.validateState = validateState;
    function validateZipCode(value, valName, form) {
        var countries = SC.ENVIRONMENT.siteSettings.countries || {};
        value = String(value).trim();
        if (!value &&
            (!form.country ||
                (countries[form.country] && countries[form.country].isziprequired === 'T'))) {
            return translate('Zip Code is required');
        }
        return '';
    }
    exports.validateZipCode = validateZipCode;
    function getFullPathForElement(el) {
        var names = [];
        var c;
        var e;
        while (el !== null && el.parentNode) {
            if (el.id) {
                // if a parent element has an id, that is enough for our path
                names.unshift("#" + el.id);
                break;
            }
            else if (el === document.body) {
                names.unshift('HTML > BODY');
                break;
            }
            else if (el === (document.head || document.getElementsByTagName('head')[0])) {
                names.unshift('HTML > HEAD');
                break;
            }
            else if (el.ownerDocument !== null && el === el.ownerDocument.documentElement) {
                names.unshift(el.tagName);
                break;
            }
            else {
                e = el;
                for (c = 1; e.previousElementSibling; c++) {
                    e = e.previousElementSibling;
                }
                names.unshift(el.tagName + ":nth-child(" + c + ")");
                if (el.parentElement !== null) {
                    el = el.parentElement;
                }
            }
        }
        return names.join(' > ');
    }
    exports.getFullPathForElement = getFullPathForElement;
    // @method formatCurrency @param {String} value @param {String} symbol @return {String}
    function formatCurrency(value, symbol, noDecimalPosition) {
        // This <string>cast is needed by SCIS legacy source code, could be deleted
        // after typescript migration ends, some times the value is undefined
        var value_float = parseFloat(value);
        var negative = value_float < 0;
        var groupseparator = ',';
        var decimalseparator = '.';
        var negativeprefix = '(';
        var negativesuffix = ')';
        var thousand_string = '';
        var beforeValue = false;
        if (SC.Application.getConfig().isSCIS) {
            beforeValue = true;
        }
        var sessionInfo = SC.getSessionInfo && SC.getSessionInfo('currentCurrency');
        var currencySymbol = symbol;
        if (isNaN(value_float)) {
            return value;
        }
        value_float = parseInt("" + (Math.abs(value_float) + 0.005) * 100, 10) / 100;
        var value_string = value_float.toString();
        var settings = SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings ? SC.ENVIRONMENT.siteSettings : {};
        if (Object.prototype.hasOwnProperty.call(settings, 'groupseparator')) {
            groupseparator = settings.groupseparator;
        }
        if (Object.prototype.hasOwnProperty.call(settings, 'decimalseparator')) {
            decimalseparator = settings.decimalseparator;
        }
        if (Object.prototype.hasOwnProperty.call(settings, 'negativeprefix')) {
            negativeprefix = settings.negativeprefix;
        }
        if (Object.prototype.hasOwnProperty.call(settings, 'negativesuffix')) {
            negativesuffix = settings.negativesuffix;
        }
        value_string = value_string.replace('.', decimalseparator);
        var decimal_position = value_string.indexOf(decimalseparator);
        // if the string doesn't contains a .
        if (decimal_position === -1) {
            if (!noDecimalPosition) {
                value_string += decimalseparator + "00";
            }
            decimal_position = value_string.indexOf(decimalseparator);
        }
        // if it only contains one number after the .
        else if (value_string.indexOf(decimalseparator) === value_string.length - 2) {
            value_string += '0';
        }
        for (var i = value_string.length - 1; i >= 0; i--) {
            // If the distance to the left of the decimal separator
            // is a multiple of 3 you need to add the group separator
            thousand_string =
                (i > 0 && i < decimal_position && (decimal_position - i) % 3 === 0
                    ? groupseparator
                    : '') +
                    value_string[i] +
                    thousand_string;
        }
        if (!currencySymbol) {
            if (!sessionInfo) {
                if (settings.shopperCurrency) {
                    if (settings.shopperCurrency.beforeValue !== undefined) {
                        beforeValue = settings.shopperCurrency.beforeValue;
                    }
                    currencySymbol = settings.shopperCurrency.symbol;
                    if (!beforeValue && currencySymbol) {
                        var matchingcurrency = _.findWhere(settings.currencies, {
                            symbol: currencySymbol
                        });
                        if (matchingcurrency) {
                            beforeValue = matchingcurrency.symbolplacement === 1;
                        }
                    }
                }
            }
            else {
                if (sessionInfo.beforeValue !== undefined) {
                    beforeValue = sessionInfo.beforeValue;
                }
                currencySymbol = sessionInfo.symbol;
            }
            if (!currencySymbol) {
                currencySymbol = '$';
            }
        }
        value_string = negative ? negativeprefix + thousand_string + negativesuffix : thousand_string;
        return beforeValue || _.isUndefined(beforeValue)
            ? currencySymbol + value_string
            : value_string + currencySymbol;
    }
    exports.formatCurrency = formatCurrency;
    // @method formatQuantity Formats with commas as thousand separator (e.g. for displaying quantities)
    // @param {String} number @return {String} the formatted quantity.
    function formatQuantity(number) {
        var result = [];
        var parts = ("" + number).split('.');
        var integerPart = parts[0].split('').reverse();
        for (var i = 0; i < integerPart.length; i++) {
            if (i > 0 && i % 3 === 0 && integerPart[i] !== '-') {
                result.unshift(',');
            }
            result.unshift(integerPart[i]);
        }
        if (parts.length > 1) {
            result.push('.');
            result.push(parts[1]);
        }
        return result.join('');
    }
    exports.formatQuantity = formatQuantity;
    // @method highlightKeyword  given a string containing a
    // keyword it highlights it using html strong @param {String} text @param {String} keyword
    function highlightKeyword(text, keyword) {
        text = text || '';
        text = _.escape(text);
        if (!keyword) {
            return text;
        }
        keyword = String(keyword)
            .trim()
            .replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
        return text.replace(new RegExp("(" + keyword + ")", 'ig'), function ($1, match) {
            return "<strong>" + match + "</strong>";
        });
    }
    exports.highlightKeyword = highlightKeyword;
    // @method addParamsToUrl
    // @param {String} baseUrl
    // @param {Object} params the params mapping to add @return {String}
    // @param {Boolean} avoidDoubleRedirect If true it will modify all the url
    // parameters to be prepended with __.
    // We do this to prevent Netsuite platform to process
    // some parameters and generate a double redirect. See searchApi.ssp
    // @return {String}
    function addParamsToUrl(baseUrl, params, avoidDoubleRedirect) {
        if (avoidDoubleRedirect) {
            var new_params_1 = {};
            _.each(params, function (param_value, param_key) {
                new_params_1["__" + param_key] = param_value;
            });
            params = new_params_1;
        }
        // We get the search options from the config file
        if (baseUrl && !_.isEmpty(params)) {
            var paramString = jQuery.param(params);
            var join_string = baseUrl.indexOf('?') !== -1 ? '&' : '?';
            return baseUrl + join_string + paramString;
        }
        return baseUrl;
    }
    exports.addParamsToUrl = addParamsToUrl;
    // @method getDecodedURLParameter
    // Takes an url parameter and returns a decoded version of it,
    // if decodeURIComponent() wasn't previously called.
    // Otherwise, returns the character itself.
    // It prevents decodeURIComponent() function gets called twice over the same
    // url parameter (EX: url_parameter = 10%+%20OFF)
    // @param  {String} url_parameter
    // @return {String}
    function getDecodedURLParameter(url_parameter) {
        url_parameter = url_parameter || '';
        var position;
        var temporal;
        for (temporal = ''; (position = url_parameter.indexOf('%')) >= 0; url_parameter = url_parameter.substring(position + 3)) {
            temporal += url_parameter.substring(0, position);
            var extract = url_parameter.substring(position, position + 3);
            try {
                temporal += decodeURIComponent(extract);
            }
            catch (e) {
                temporal += extract;
            }
        }
        return temporal + url_parameter;
    }
    exports.getDecodedURLParameter = getDecodedURLParameter;
    // @method parseUrlOptions
    // Takes a url with options (or just the options part of the url) and returns an
    // object. You can do the reverse operation (object to url string) using jQuery.param()
    // @param {String} options_string
    // @return {UrlParameters}
    function parseUrlOptions(options_string) {
        var urlOption = options_string || '';
        if (urlOption && urlOption.indexOf('?') !== -1) {
            urlOption = _.last(urlOption.split('?'));
        }
        if (urlOption && urlOption.indexOf('#') !== -1) {
            urlOption = _.first(urlOption.split('#'));
        }
        // @class UrlParameters @extend Dictionary<String,String>
        // This class is used as a dictionary where each string key is
        // a parameter from the passed in string and each value
        // is the corresponding value from the string being decodeURIComponent.
        // Example
        // input: /some-item?quantity=2&custcol3=12
        // output: {quantity: decodeURIComponent(2), custcol3: decodeURIComponent(12)}
        var options = {};
        if (urlOption && urlOption.length > 0) {
            var tokens = urlOption.split(/&/g);
            var current_token = [];
            while (tokens.length > 0) {
                var firstElement = tokens.shift();
                if (firstElement) {
                    current_token = firstElement.split(/=/g);
                }
                if (current_token && current_token.length && current_token[0].length !== 0) {
                    options[current_token[0]] = getDecodedURLParameter(current_token[1]);
                }
            }
        }
        return options;
    }
    exports.parseUrlOptions = parseUrlOptions;
    // @method objectToAtrributes @param {Object} obj @param {String} prefix @return {String}
    function objectToAtrributes(obj, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var objectToAtrributesKeyMap = [
            'href',
            'id',
            'title',
            'data',
            'data-hashtag',
            'data-touchpoint',
            'data-permissions'
        ];
        var memo = '';
        Object.getOwnPropertyNames(obj).forEach(function (key) {
            var value = obj[key];
            var prefixKey = prefix + key;
            if (_.contains(objectToAtrributesKeyMap, prefixKey) === true) {
                if (_.isObject(value)) {
                    memo += objectToAtrributes(obj[key], key + "-");
                }
                if (_.isArray(value)) {
                    memo += " " + _.escape(prefixKey) + "=\"" + _.escape(value.join(' ')) + "\"";
                }
                if (!_.isObject(value)) {
                    memo += " " + _.escape(prefixKey) + "=\"" + _.escape(value) + "\"";
                }
            }
        });
        return memo;
    }
    exports.objectToAtrributes = objectToAtrributes;
    // @method isTargetActionable
    // @param {Event} event
    // @return {Boolean}
    function isTargetActionable(event) {
        // return true if the target is actionable
        var target = jQuery(event.target);
        var targetTagName = target.prop('tagName').toLowerCase();
        var targetParentTagName = target
            .parent()
            .prop('tagName')
            .toLowerCase();
        var isCheckbox = target.prop('type') === 'checkbox';
        return (targetTagName === 'a' ||
            targetParentTagName === 'a' ||
            targetTagName === 'i' ||
            targetParentTagName === 'button' ||
            targetTagName === 'button' ||
            (targetTagName === 'input' && isCheckbox === false));
    }
    exports.isTargetActionable = isTargetActionable;
    // @method resizeImage @param {Array<Object>} sizes @param {String}
    // url @param {String} size the size id @return {String}
    function resizeImage(sizes, url, size) {
        var resize = _.where(sizes, {
            name: size
        })[0];
        url = url || '';
        if (resize) {
            return url + (url.indexOf('?') !== -1 ? '&' : '?') + resize.urlsuffix;
        }
        return url;
    }
    exports.resizeImage = resizeImage;
    // @method urlIsAbsolute @param {String} url @returns {Boolean}
    function isUrlAbsolute(url) {
        return /^https?:\/\//.test(url);
    }
    exports.isUrlAbsolute = isUrlAbsolute;
    // @method getAbsoluteUrl @param {String} file @returns {String}
    function getAbsoluteUrl(file, isServices2) {
        if (file === void 0) { file = ''; }
        if (isServices2 === void 0) { isServices2 = false; }
        var base_url = (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.baseUrl) || '';
        var fileReplace = file;
        if (base_url && !isUrlAbsolute(fileReplace)) {
            return isServices2
                ? base_url.replace('/{{file}}', "_ss2/" + fileReplace)
                : base_url.replace('{{file}}', fileReplace);
        }
        return file;
    }
    exports.getAbsoluteUrl = getAbsoluteUrl;
    // @method getThemeAbsoluteUrlOfNonManagedResources @param {String} file @returns {String}
    function getThemeAbsoluteUrlOfNonManagedResources(default_value, file) {
        if (!file) {
            file = '';
            if (SC.ENVIRONMENT.isExtended) {
                file = SC.ENVIRONMENT.themeAssetsPath || '';
            }
            else if (SC.ENVIRONMENT.BuildTimeInf && SC.ENVIRONMENT.BuildTimeInf.isSCLite) {
                if (SC.CONFIGURATION.unmanagedResourcesFolderName) {
                    file = "site/" + SC.CONFIGURATION.unmanagedResourcesFolderName + "/";
                }
                else {
                    file = 'default/';
                }
            }
            file += default_value;
        }
        return getAbsoluteUrl(file);
    }
    exports.getThemeAbsoluteUrlOfNonManagedResources = getThemeAbsoluteUrlOfNonManagedResources;
    // @method getAbsoluteUrlOfNonManagedResources @param {String} file @returns {String}
    function getAbsoluteUrlOfNonManagedResources(file) {
        return getAbsoluteUrl(file);
    }
    exports.getAbsoluteUrlOfNonManagedResources = getAbsoluteUrlOfNonManagedResources;
    // @method getDownloadPdfUrl @param {Object} params @returns {String}
    function getDownloadPdfUrl(params) {
        params = params || {};
        params.n =
            (SC &&
                SC.ENVIRONMENT &&
                SC.ENVIRONMENT.siteSettings &&
                SC.ENVIRONMENT.siteSettings.siteid) ||
                '';
        return addParamsToUrl(getAbsoluteUrl('download.ssp'), params);
    }
    exports.getDownloadPdfUrl = getDownloadPdfUrl;
    function getWindow() {
        return window;
    }
    exports.getWindow = getWindow;
    // @method doPost Performs a POST operation to a specific url @param {String} url
    function doPost(url) {
        var form = jQuery("<form id=\"do-post\" method=\"POST\" action=\"" + url + "\"></form>").hide();
        // we have to append it to the dom  for browser compatibility
        // check if the form already exists
        // (user could cancel the operation before it gets to the submit)
        var do_post = jQuery('#do-post');
        if (do_post && do_post[0]) {
            do_post[0].action = url;
            do_post[0].method = 'POST';
        }
        else {
            jQuery('html').append(form);
            do_post = jQuery('#do-post');
        }
        do_post[0].submit();
    }
    exports.doPost = doPost;
    // @method getPathFromObject @param {Object} object @param {String}
    // path a path with values separated by dots @param {Any}
    // default_value value to return if nothing is found.
    /**
     *
     * @deprecated The use of this method is not secure because it is not
     * possible to make a static type check
     **/
    function getPathFromObject(object, path, default_value) {
        if (!path) {
            return object;
        }
        if (object) {
            var tokens = path.split('.');
            var prev = object;
            var n = 0;
            while (!_.isUndefined(prev) && n < tokens.length) {
                prev = prev[tokens[n++]];
            }
            if (!_.isUndefined(prev)) {
                return prev;
            }
        }
        return default_value;
    }
    exports.getPathFromObject = getPathFromObject;
    // @method setPathFromObject @param {Object} object @param {String}
    // path a path with values separated by dots @param {Any} value the value to set
    /**
     *
     * @deprecated The use of this method is not secure because
     * it is not possible to make a static type check
     **/
    function setPathFromObject(object, path, value) {
        if (!path) {
            return;
        }
        if (!object) {
            return;
        }
        var tokens = path.split('.');
        var prev = object;
        for (var token_idx = 0; token_idx < tokens.length - 1; ++token_idx) {
            var current_token = tokens[token_idx];
            if (_.isUndefined(prev[current_token])) {
                prev[current_token] = {};
            }
            prev = prev[current_token];
        }
        var index = _.last(tokens);
        prev[index] = value;
    }
    exports.setPathFromObject = setPathFromObject;
    var isScreenScrolling = false;
    function animatedScroll(element) {
        var top = jQuery(element).offset().top;
        if (!isScreenScrolling && top) {
            isScreenScrolling = true;
            jQuery('html, body').animate({ scrollTop: top }, 600, 'swing', function () {
                isScreenScrolling = false;
            });
        }
    }
    exports.animatedScroll = animatedScroll;
    // @method ellipsis creates the ellipsis animation
    // (used visually while waiting to something) @param {String} selector
    function ellipsis(selector) {
        if (!jQuery(selector).data('ellipsis')) {
            var values_1 = ['', '.', '..', '...', '..', '.'];
            var count_1 = 0;
            var element_1 = jQuery(selector);
            element_1.data('ellipsis', true);
            element_1.css('visibility', 'hidden');
            element_1.html('...');
            element_1.css('width', element_1.css('width'));
            element_1.css('display', 'inline-block');
            element_1.html('');
            element_1.css('visibility', 'visible');
            var timer_1 = setInterval(function () {
                if (jQuery(selector).length && element_1) {
                    element_1.html(values_1[count_1 % values_1.length]);
                    count_1 += 1;
                }
                else {
                    clearInterval(timer_1);
                    element_1 = null;
                }
            }, 250);
        }
    }
    exports.ellipsis = ellipsis;
    // @method reorderUrlParams
    // @param {String} url
    // @return {String} the url with reordered parameters
    function reorderUrlParams(url) {
        var params = [];
        var url_array = url.split('?');
        if (url_array.length > 1) {
            params = url_array[1].split('&');
            return url_array[0] + "?" + params.sort().join('&');
        }
        return url_array[0];
    }
    exports.reorderUrlParams = reorderUrlParams;
    // @method isShoppingDomain determines if we are in shopping domain (secure or non secure)
    // or single domain
    // @return {Boolean} true if in checkout or in single domain
    function isShoppingDomain() {
        return SC.ENVIRONMENT.siteSettings.shoppingSupported;
    }
    exports.isShoppingDomain = isShoppingDomain;
    // @method isCheckoutDomain determines if we are in a secure checkout
    // domain or in a secure single domain environment
    // @return {Boolean} true if in checkout or in single domain
    function isCheckoutDomain() {
        return SC.ENVIRONMENT.siteSettings.checkoutSupported;
    }
    exports.isCheckoutDomain = isCheckoutDomain;
    // @method isSingleDomain determines if we are in a single domain environment
    // @return {Boolean} true if single domain
    function isSingleDomain() {
        return SC.ENVIRONMENT.siteSettings.isSingleDomain;
    }
    exports.isSingleDomain = isSingleDomain;
    // @method isInShopping determines if we are in shopping ssp
    // used when there are frontend features only shown in the shopping domain
    // @return {Boolean} true if in shopping domain, false if in checkout or myaccount
    function isInShopping() {
        return (isShoppingDomain() &&
            (SC.ENVIRONMENT.SCTouchpoint === 'shopping' ||
                SC.ENVIRONMENT.siteSettings.sitetype === 'STANDARD'));
    }
    exports.isInShopping = isInShopping;
    // @method isInCheckout determines if we are in checkout or my account ssp
    // @return {Boolean} true if in checkout domain
    function isInCheckout() {
        return !isSingleDomain()
            ? isCheckoutDomain()
            : isCheckoutDomain() &&
                (SC.ENVIRONMENT.SCTouchpoint === 'checkout' ||
                    SC.ENVIRONMENT.SCTouchpoint === 'myaccount');
    }
    exports.isInCheckout = isInCheckout;
    // @method getParameterByName @param {String} url @param {String} param_name
    function getParameterByName(url, param_name) {
        param_name = param_name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp("[\\?&]" + param_name + "=([^&#]*)");
        var results = regex.exec(url);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    exports.getParameterByName = getParameterByName;
    function isPageGenerator() {
        return _.result(SC, 'isPageGenerator') || _.result(SC, 'isPageGenerator');
    }
    exports.isPageGenerator = isPageGenerator;
    // @export function Remove script tags in a html text @param {String} text
    function removeScripts(text) {
        var SCRIPT_REGEX = /<\s*script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        if (isPageGenerator() && text) {
            text = text.replace(/(<!--[\s\S]*?-->)/g, ' $1 '); // invalidates de XSS attack like <scr<!--cheat-->ipt> - keep the comment and add spaces
            while (SCRIPT_REGEX.test(text)) {
                text = text.replace(SCRIPT_REGEX, '');
            }
        }
        return text || '';
    }
    exports.removeScripts = removeScripts;
    // @export function Reduce unnecessary spaces in html texts @param {String} text
    function minifyMarkup(text) {
        return (text
            // remove spaces between tags.
            .replace(/\>\s+</g, '><')
            // remove html comments that our markup could have.
            .replace(/<!--[\s\S]*?-->/g, '')
            // replace multiple spaces with a single one.
            .replace(/\s+/g, ' '));
    }
    exports.minifyMarkup = minifyMarkup;
    function oldIE(version) {
        if (version === void 0) { version = 7; }
        var ie_version = version;
        // IE7 detection courtesy of Backbone
        // More info: http://www.glennjones.net/2006/02/getattribute-href-bug/
        var isExplorer = /msie [\w.]+/;
        var docMode = document.documentMode;
        var result = false;
        if (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= ie_version)) {
            result = true;
        }
        return result;
    }
    exports.oldIE = oldIE;
    // @method require The motive for this method is being able to call require()
    // of modules in-line without breaking amd-optimizer because we cannot use require()
    // directly passing variables as dependencies because amd-optimizer will try to parse that and fail.
    // @param {Array<String>} dependencies
    // @param {Function} fn
    function requireModules() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return srcRequire.apply(void 0, args);
    }
    exports.requireModules = requireModules;
    // we are caching window width so this won't work on window resize.
    // Same for data-templates in views.
    var viewport_width = 0;
    var viewport_height = 0;
    // @method resetViewportWidth resets viewport width explicitly to be updated on resize.
    function resetViewportWidth() {
        viewport_width = 0;
    }
    exports.resetViewportWidth = resetViewportWidth;
    // @method getViewportWidth @return {Number} the width of the viewport in pixels
    function getViewportWidth() {
        if (viewport_width !== undefined && jQuery(window).width() !== undefined) {
            viewport_width = jQuery(window).width();
        }
        return viewport_width;
    }
    exports.getViewportWidth = getViewportWidth;
    // @method getViewportHeight @return {Number} the height of the viewport in pixels
    function getViewportHeight() {
        if (viewport_height !== undefined && jQuery(window).height() !== undefined) {
            viewport_height = jQuery(window).height();
        }
        return viewport_height;
    }
    exports.getViewportHeight = getViewportHeight;
    function getDeviceType(widthToCheck) {
        var width = widthToCheck || getViewportWidth();
        if (width !== undefined && width < 768) {
            return 'phone';
        }
        if (width !== undefined && width < 992) {
            return 'tablet';
        }
        return 'desktop';
    }
    exports.getDeviceType = getDeviceType;
    function selectByViewportWidth(options, defaultValue) {
        var device = getDeviceType();
        return options[device] || defaultValue;
    }
    exports.selectByViewportWidth = selectByViewportWidth;
    function isPhoneDevice() {
        return getDeviceType() === 'phone';
    }
    exports.isPhoneDevice = isPhoneDevice;
    function isTabletDevice() {
        return getDeviceType() === 'tablet';
    }
    exports.isTabletDevice = isTabletDevice;
    function isDesktopDevice() {
        return getDeviceType() === 'desktop';
    }
    exports.isDesktopDevice = isDesktopDevice;
    function isNativeDatePickerSupported() {
        var input = document.createElement('input');
        input.setAttribute('type', 'date');
        // if special input is not supported browser will fall back to text
        return input.type !== 'text';
    }
    exports.isNativeDatePickerSupported = isNativeDatePickerSupported;
    function initBxSlider($element, options) {
        if ($element.bxSlider && !oldIE() && !SC.isPageGenerator()) {
            $element.bxSlider(options);
        }
        return $element;
    }
    exports.initBxSlider = initBxSlider;
    function getExponentialDelay(options) {
        var settings = options.settings || {
            base: 1.5,
            y: 0.8,
            retries: 2
        };
        return (Math.pow(settings.base, options.x) - settings.y) * 1000;
    }
    exports.getExponentialDelay = getExponentialDelay;
    function imageFlatten(images) {
        var result = [];
        if ('url' in images && 'altimagetext' in images) {
            return [images];
        }
        Object.getOwnPropertyNames(images).forEach(function (key) {
            if (_.isArray(images[key])) {
                result.push(images[key]);
            }
            else {
                result.push(imageFlatten(images[key]));
            }
        });
        return _.flatten(result);
    }
    exports.imageFlatten = imageFlatten;
    // @method omitParameter
    // Omit parameter from url
    // @param {String} url - Url where the parameter is ommited
    // @param {String} parameter - Parameter to be omitted
    // @param {String} site - Site where params are added
    // @return {String} Url genearated from site without the parameter
    function omitParameter(url, parameter, site) {
        var url_data = parseUrlOptions(url);
        delete url_data[parameter];
        return addParamsToUrl(site, url_data);
    }
    exports.omitParameter = omitParameter;
    // @method generateUrl
    // Generate site from url
    // @param {String} site - Ssp file name
    // @param {String} [omitSearchParameter] - Parameter to be omitted in the search
    // @return {String} Url genearated from site
    function generateUrl(site, omitSearchParameter) {
        var ssp = site + (window.location.href.indexOf('-local.ssp') !== -1 ? '-local.ssp' : '.ssp');
        var url = ssp + window.location.search;
        if (omitSearchParameter) {
            url = omitParameter(window.location.search, omitSearchParameter, ssp);
        }
        return window.location.pathname.replace(/\/c.(\w+)\/pos\/(.*)/, "/c.$1/pos/" + url);
    }
    exports.generateUrl = generateUrl;
    // Get a base64 representation of an image
    // @param {String} src - Url for the image to download
    // @param {String} callback - export function to invoke when the image is loaded and transformed
    // @param {String} outputFormat - format of the image to download (defaults to image/png)
    function getBase64Image(src, outputFormat) {
        var promise = jQuery.Deferred();
        var img = new Image();
        // img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS');
            var context = canvas.getContext('2d');
            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
            if (context) {
                context.drawImage(img, 0, 0);
            }
            var dataURL = canvas.toDataURL(outputFormat);
            promise.resolve(dataURL);
        };
        img.onerror = function () {
            promise.reject();
        };
        img.src = src;
        return promise;
    }
    exports.getBase64Image = getBase64Image;
    function isTrue(value) {
        return _.isBoolean(value) ? value : value === 'T';
    }
    exports.isTrue = isTrue;
    function isFalse(value) {
        return _.isBoolean(value) ? !value : value === 'F';
    }
    exports.isFalse = isFalse;
    function getConfigurableImages(urls) {
        var result = jQuery.Deferred();
        var def = [];
        var configurableImage = {
            mainLogo: '',
            printableLogo: '',
            loginLogo: ''
        };
        Object.getOwnPropertyNames(urls).forEach(function (key) {
            var image64 = getBase64Image(urls[key]);
            def.push(image64);
            image64.then(function (resultImage) {
                configurableImage[key] = resultImage;
            });
        });
        jQuery.when.apply(jQuery, def).then(function () {
            result.resolve(configurableImage);
        });
        return result;
    }
    exports.getConfigurableImages = getConfigurableImages;
    /**
     *
     * @deprecated
     */
    function cleanObject(json) {
        _.each(_.keys(json), function (key) {
            if ((!json[key] && json[key] !== 0 && json[key] !== false) ||
                (_.isObject(json[key]) && _.isEmpty(json[key]))) {
                delete json[key];
            }
            else {
                cleanObject(json[key]);
            }
            // Check again in case all of the inner keys were deleted
            if (_.isObject(json[key]) && _.isEmpty(json[key])) {
                delete json[key];
            }
        });
    }
    exports.cleanObject = cleanObject;
    // @method parseRichText
    // Parse core data that comes from richtext
    // @param {String} richtext - string containing partially encoded HTML
    function parseRichText(richtext) {
        var div = jQuery('<div></div>');
        div.html(richtext);
        return div.text();
    }
    exports.parseRichText = parseRichText;
    // @method addSlashToURL check if exist a slash at the beginning of the url
    // and if not exist add a slash
    // @return {string} This method return a url starting with a slash.
    function addSlashToURL(url) {
        if (!/^\//.test(url)) {
            url = "/" + url;
        }
        return url;
    }
    exports.addSlashToURL = addSlashToURL;
    /**
     * Use jQuery.trim instead
     * @deprecated
     */
    exports.trim = jQuery.trim;
});

//# sourceMappingURL=Utils.js.map
