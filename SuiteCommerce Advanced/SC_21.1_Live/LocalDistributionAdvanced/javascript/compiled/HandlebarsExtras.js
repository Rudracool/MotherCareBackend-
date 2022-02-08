/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("HandlebarsExtras", ["require", "exports", "underscore", "Utils", "jQuery", "Configuration", "Handlebars", "Backbone"], function (require, exports, _, Utils, jQuery, Configuration_1, Handlebars, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Handlebars.registerHelper('getThemeAssetsPathWithDefault', function (img_path, default_img_path) {
        if (img_path && img_path === Utils.getAbsoluteUrlOfNonManagedResources('')) {
            img_path = null;
        }
        // If the theme path provided by the template's context is an url
        // (and not a relative path) I'll use it as it's
        // This is used for the local devtool in order to serve the assets locally
        if (Utils.isUrlAbsolute(this._theme_path) && !img_path) {
            return this._theme_path + default_img_path;
        }
        return Utils.getThemeAbsoluteUrlOfNonManagedResources(default_img_path, img_path);
    });
    Handlebars.registerHelper('getThemeAssetsPath', function (default_img_path) {
        return Handlebars.helpers.getThemeAssetsPathWithDefault.apply(this, [null, default_img_path]);
    });
    Handlebars.registerHelper('getExtensionAssetsPathWithDefault', function (img_path, default_img_path) {
        if (img_path && img_path !== Utils.getAbsoluteUrl()) {
            return img_path;
        }
        // If the extension path provided by the template's context is an url (and not a relative path) I'll use it as it's
        // This is used for the local devtool in order to serve the assets locally
        if (Utils.isUrlAbsolute(this._extension_path)) {
            return this._extension_path + default_img_path;
        }
        img_path = (this._extension_path || '') + default_img_path;
        return Utils.getAbsoluteUrl(img_path);
    });
    Handlebars.registerHelper('getExtensionAssetsPath', function (default_img_path) {
        return Handlebars.helpers.getExtensionAssetsPathWithDefault.apply(this, [
            null,
            default_img_path
        ]);
    });
    Handlebars.registerHelper('translate', function () {
        // NOTE: translate returns a safe string
        return new Handlebars.SafeString(Utils.translate.apply(_, arguments));
    });
    Handlebars.registerHelper('highlightKeyword', function (text, keyword) {
        // NOTE: highlightKeyword returns a safe string
        return new Handlebars.SafeString(Utils.highlightKeyword(text, keyword));
    });
    var objectToAttributesFn = function () {
        // Note: object to attributes
        return new Handlebars.SafeString(Utils.objectToAtrributes(this, ''));
    };
    Handlebars.registerHelper('objectToAtrributes', objectToAttributesFn);
    Handlebars.registerHelper('objectToAttributes', objectToAttributesFn);
    // define our own each helper with support for backbone collections
    Handlebars.registerHelper('each', function (context, options) {
        var ret = '';
        var iterable = context instanceof Backbone.Collection ? context.models : context;
        var length = (iterable && iterable.length) || 0;
        for (var i = 0, j = length; i < j; i++) {
            ret += options.fn(iterable[i], {
                data: {
                    first: i === 0,
                    last: i === iterable.length - 1,
                    index: i,
                    indexPlusOne: i + 1
                }
            });
        }
        if (!length) {
            ret = options.inverse(this);
        }
        return ret;
    });
    Handlebars.registerHelper('resizeImage', function (url, size) {
        url =
            url ||
                Utils.getThemeAbsoluteUrlOfNonManagedResources('img/no_image_available.jpeg', Configuration_1.Configuration.get('imageNotAvailable'));
        var mapped_size = Configuration_1.Configuration['imageSizeMapping.' + size] || size;
        return Utils.resizeImage(SC.ENVIRONMENT.siteSettings.imagesizes || [], url, mapped_size);
    });
    Handlebars.registerHelper('trimHtml', function (htmlString, length) {
        var htmlStringSelector;
        try {
            htmlStringSelector = jQuery(htmlString);
        }
        catch (e) { }
        var trimmedString = htmlStringSelector && htmlStringSelector.length > 0
            ? String(htmlStringSelector.text()).trim()
            : String(htmlString).trim();
        var moreContent = '';
        if (trimmedString.length > length) {
            moreContent = '...';
        }
        return trimmedString.substring(0, length) + moreContent;
    });
    // Helper 'breaklines' places <br/> tags instead of the newlines provided by backend
    // Used in messages in Quotes, Return, Case, Review.
    Handlebars.registerHelper('breaklines', function (text) {
        text = Handlebars.Utils.escapeExpression(text || '');
        text = text.replace(/(\r\n|\n|\r|\u0005)/gm, '<br/>');
        return new Handlebars.SafeString(text);
    });
    // Helper 'ifEqual' works like if (v1 == v2) {} else {}
    Handlebars.registerHelper('ifEquals', function (v1, v2, options) {
        /* jslint eqeq: true*/
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    // Helper 'unlessEqual' works like if (v1 != v2) {} else {}
    Handlebars.registerHelper('unlessEquals', function (v1, v2, options) {
        /* jslint eqeq: false*/
        if (v1 != v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('formatCurrency', function (amount, symbol) {
        // Handlebars sets an object as the last arguement.
        // If formatCurrency was called with one argument, second argument won't be the expected string symbol
        if (typeof symbol === 'string') {
            return Utils.formatCurrency(amount, symbol);
        }
        return Utils.formatCurrency(amount);
    });
    Handlebars.registerHelper('if_even', function (conditional, options) {
        if (conditional % 2 === 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('if_odd', function (conditional, options) {
        return conditional % 2 !== 0 ? options.fn(this) : options.inverse(this);
    });
});

//# sourceMappingURL=HandlebarsExtras.js.map
