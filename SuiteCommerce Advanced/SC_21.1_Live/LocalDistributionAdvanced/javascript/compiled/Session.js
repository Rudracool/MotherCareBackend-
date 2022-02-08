/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Session", ["require", "exports", "Utils"], function (require, exports, Utils) {
    "use strict";
    var Session = {
        get: function (path, default_value) {
            var session_info = (SC && SC.getSessionInfo && SC.getSessionInfo()) || {};
            return Utils.getPathFromObject(session_info, path, default_value);
        },
        set: function (path, value) {
            var session_info = (SC && SC.getSessionInfo && SC.getSessionInfo()) || {};
            session_info[path] = value;
        },
        getSearchApiParams: function () {
            var search_api_params = {};
            var locale = this.get('language.locale', '');
            var language = '';
            var country = '';
            var currency = this.get('currency.code', '')
                ? this.get('currency.code', '')
                : this.get('currency', '');
            if (~locale.indexOf('_')) {
                var locale_tokens = locale.split('_');
                language = locale_tokens[0];
                country = locale_tokens[1];
            }
            else {
                language = locale;
            }
            // SET API PARAMS
            if (language) {
                search_api_params.language = language;
            }
            if (country) {
                search_api_params.country = country;
            }
            // Currency
            if (currency) {
                search_api_params.currency = currency;
            }
            // Price Level
            search_api_params.pricelevel = this.get('priceLevel', '');
            // No cache
            if (Utils.parseUrlOptions(location.search).nocache === 'T') {
                search_api_params.nocache = 'T';
            }
            // Use PCV
            search_api_params.use_pcv =
                SC &&
                    SC.ENVIRONMENT &&
                    SC.ENVIRONMENT.siteSettings &&
                    SC.ENVIRONMENT.siteSettings.isPersonalizedCatalogViewsEnabled
                    ? 'T'
                    : 'F';
            if (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.pcvGroups) {
                search_api_params.pcv_groups = SC.ENVIRONMENT.pcvGroups;
            }
            if (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.pcvAllItems) {
                search_api_params.pcv_all_items = SC.ENVIRONMENT.pcvAllItems;
            }
            return search_api_params;
        }
    };
    return Session;
});

//# sourceMappingURL=Session.js.map
