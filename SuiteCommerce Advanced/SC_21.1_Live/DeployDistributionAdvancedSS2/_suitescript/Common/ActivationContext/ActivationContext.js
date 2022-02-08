/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/cache", "N/http", "N/https", "N/log", "N/util", "../SspLibraries/Utils"], function (require, exports, NCache, NHttp, NHttps, NLog, NUtil, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // This is the default implementation of this methods.
    // This code will be overriden by the activation outcome
    function getExtensionsDefaultValues(domain, requestedUrl) {
        if (requestedUrl === void 0) { requestedUrl = ''; }
        var SSP_V2_POSFIX = '_ss2/';
        var CONFIG_MANIFEST_CACHE = 'CONFIG_MANIFEST_CACHE';
        var CONFIG_MANIFEST_CACHE_KEY = CONFIG_MANIFEST_CACHE + '_KEY_';
        var splittedUrl = requestedUrl.split(SSP_V2_POSFIX);
        if (!domain || splittedUrl.length < 2) {
            NLog.debug({
                title: 'ERROR_GETTING_CONFIG_MANIFEST',
                details: "Unable to get the default values manifest with the given data.\n             domain: " + domain + " and url: " + requestedUrl
            });
            return {};
        }
        var url = splittedUrl[0] + ("/extensions/configurationManifest-" + domain + ".json");
        var configCache = NCache.getCache({
            name: CONFIG_MANIFEST_CACHE,
            scope: NCache.Scope.PRIVATE
        });
        var cachedConfig = configCache.get({
            key: CONFIG_MANIFEST_CACHE_KEY + url,
            ttl: 300,
            loader: function () {
                var httpModule = /^https/.test(url) ? NHttps : NHttp;
                var timestamp = '?t=' + Math.floor(Math.random() * 1000);
                var response = httpModule.get({ url: url + timestamp });
                if (response.code !== 200) {
                    NLog.debug({
                        title: 'ERROR_GETTING_CONFIG_MANIFEST',
                        details: "The request of " + url + " failed with " + response.code
                    });
                    return '{}';
                }
                return response.body;
            }
        });
        var defaultValues = {};
        try {
            var rawDefaultValues = JSON.parse(cachedConfig);
            NUtil.each(rawDefaultValues, function (entry) {
                NUtil.each(entry.properties, function (value, key) {
                    if (value.default !== undefined) {
                        Utils_1.setPathFromObject(defaultValues, key, value.default);
                    }
                });
            });
        }
        catch (error) {
            NLog.error({
                title: 'ERROR_LOADING_DEFAULT_VALUES',
                details: 'Error parsing extensions default values'
            });
        }
        return defaultValues;
    }
    exports.getExtensionsDefaultValues = getExtensionsDefaultValues;
    // This method is overwritten by the backend devtool task
    function getExtraData() {
        return {
            "appManifest": {
                "type": "SCA",
                "version": null,
                "application": [
                    "shopping",
                    "myaccount",
                    "checkout"
                ],
                "extensible_resources": [
                    "skins",
                    "javascript",
                    "ssp-libraries",
                    "sass",
                    "templates",
                    "services",
                    "configuration",
                    "assets",
                    "suitescript2",
                    "translations"
                ]
            },
            "ieFiles": {}
        };
    }
    function getActivationContext(unmanagedResourcesFolderName) {
        var extraData = getExtraData();
        var activationContext = {
            isExtended: false,
            embEndpointUrl: null,
            themeAssetsPath: '',
            appIncludes: {},
            appManifest: extraData.appManifest
        };
        NUtil.each(activationContext.appManifest.application || [], function (application) {
            activationContext.appIncludes[application] = {
                templates: [application + '-templates.js'],
                js: ['javascript/' + application + '.js'],
                css: ['css/' + application + '.css'],
                ie: extraData.ieFiles[application]
            };
        });
        function getNonManageResourcesPathPrefix(file) {
            if (activationContext.appManifest.type === 'SCS') {
                if (unmanagedResourcesFolderName) {
                    return "site/" + unmanagedResourcesFolderName + "/" + file;
                }
                return "default/" + file;
            }
            return file;
        }
        NUtil.each(activationContext.appIncludes, function (app) {
            app.templates = app.templates.map(getNonManageResourcesPathPrefix);
            app.css = app.css.map(getNonManageResourcesPathPrefix);
            if (unmanagedResourcesFolderName) {
                app.js.unshift('backward-compatibility-amd-unclean.js');
            }
        });
        NUtil.each(activationContext.appIncludes, function (app) {
            app.js = app.templates.concat(app.js);
        });
        return activationContext;
    }
    exports.getActivationContext = getActivationContext;
});
