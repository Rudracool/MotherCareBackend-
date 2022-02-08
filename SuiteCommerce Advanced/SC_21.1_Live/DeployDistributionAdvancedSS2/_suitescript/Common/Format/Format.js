/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/format", "../Environment/Environment", "../../third_parties/underscore.js"], function (require, exports, Nformat, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Format = /** @class */ (function () {
        function Format() {
            this.dummyDate = new Date();
        }
        Format.getInstance = function () {
            if (!this.instance) {
                this.instance = new Format();
            }
            return this.instance;
        };
        Format.prototype.format = function (value, type) {
            var result = null;
            if (value === 0 || value) {
                result = Nformat.format({
                    value: value,
                    type: type
                });
            }
            return result;
        };
        Format.prototype.toDate = function (value) {
            return new Date(Nformat.parse({
                value: this.toValue(value),
                type: Nformat.Type.DATE
            }));
        };
        Format.prototype.toDateString = function (value) {
            var date = this.toDate(value) || this.dummyDate;
            return this.format(date, Nformat.Type.DATE);
        };
        Format.prototype.toTimeOfDay = function (value) {
            var date = this.toDate(value) || this.dummyDate;
            return this.format(date, Nformat.Type.TIMEOFDAY);
        };
        Format.prototype.toCurrency = function (value) {
            return (Environment_1.Environment.getInstance()
                .getCurrentWebsite()
                .getCurrency().displaysymbol + this.toCurrencyValue(value));
        };
        Format.prototype.toCurrencyValue = function (value) {
            // TODO: test if N/format check for siteSettings format delimiters ["," - ".", "(", ")"]
            return this.format(this.toValue(value) || 0, Nformat.Type.CURRENCY);
        };
        Format.prototype.toFloat = function (value) {
            return parseFloat(this.toValue(value)) || 0;
        };
        Format.prototype.sanitizeHTML = function (value) {
            return this.toValue(value)
                .replace(/<br>/g, '\n')
                .replace(/</g, '&lt;')
                .replace(/\>/g, '&gt;');
        };
        Format.prototype.stripHTML = function (value) {
            return this.toValue(value)
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<(?:.|\n)*?>/gm, '');
        };
        Format.prototype.toCamelCase = function (value, text) {
            return this.toValue(value)
                .toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) { return chr.toUpperCase(); });
        };
        Format.prototype.toValue = function (value, text) {
            return String(value || '');
        };
        Format.prototype.toText = function (value, text) {
            return String(text || '');
        };
        return Format;
    }());
    exports.Format = Format;
});
