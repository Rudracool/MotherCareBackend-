/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Categories.Utils", ["require", "exports", "underscore", "Utils", "Configuration"], function (require, exports, _, Utils, Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Categories.Utils.ts
    // -------------
    // Utility Class for Categories
    function getAdditionalFields(source, config_path) {
        var additionalFields = {};
        var fields = Configuration_1.Configuration.get(config_path, []);
        _.each(fields, function (field) {
            additionalFields[field] = source[field];
        });
        return additionalFields;
    }
    exports.getAdditionalFields = getAdditionalFields;
    function getBaseUrl(backendAccountDomain) {
        var baseUrl = backendAccountDomain ||
            (Utils.isHttpsSupported()
                ? "https://" + SC.ENVIRONMENT.shoppingDomain
                : Utils.isCheckoutSupported()
                    ? SC.ENVIRONMENT.checkoutUrl
                    : "http://" + SC.ENVIRONMENT.shoppingDomain);
        return baseUrl;
    }
    exports.getBaseUrl = getBaseUrl;
    function getCategoryColumns() {
        var categoryColumns = {
            boolean: ['displayinsite', 'isinactive', 'isprimaryurl'],
            sideMenu: {
                sortBy: 'sequencenumber',
                fields: ['name', 'internalid', 'sequencenumber', 'urlfragment', 'displayinsite']
            },
            subCategories: {
                sortBy: 'sequencenumber',
                fields: [
                    'name',
                    'description',
                    'internalid',
                    'sequencenumber',
                    'urlfragment',
                    'thumbnailurl',
                    'displayinsite'
                ]
            },
            category: {
                fields: [
                    'internalid',
                    'name',
                    'description',
                    'pagetitle',
                    'pageheading',
                    'pagebannerurl',
                    'addtohead',
                    'metakeywords',
                    'metadescription',
                    'displayinsite',
                    'urlfragment',
                    'idpath',
                    'fullurl',
                    'isprimaryurl' // needed for canonical path
                ]
            },
            breadcrumb: {
                fields: ['internalid', 'name', 'displayinsite']
            },
            menu: {
                sortBy: 'sequencenumber',
                fields: ['internalid', 'name', 'sequencenumber', 'displayinsite']
            },
            mapping: {
                internalid: 'subcatid',
                name: 'subcatnameoverride',
                description: 'subcatdescoverride',
                pagetitle: 'subcatpagetitleoverride',
                pageheading: 'subcatpageheadingoverride',
                pagebannerurl: 'subcatpagebannerurloverride',
                addtohead: 'subcataddtoheadoverride',
                metakeywords: 'subcatmetakeywordsoverride',
                metadescription: 'subcatmetadescoverride',
                displayinsite: 'subcatdisplayinsiteoverride',
                sequencenumber: 'subcatsequencenumber',
                thumbnailurl: 'subcatthumbnailurloverride',
                urlfragment: 'subcaturlfragmentoverride'
            }
        };
        return categoryColumns;
    }
    exports.getCategoryColumns = getCategoryColumns;
    function getSortBy(element) {
        var config = Configuration_1.Configuration.get().categories;
        var categoryColumns = getCategoryColumns();
        return config[element].sortBy || categoryColumns[element].sortBy;
    }
    exports.getSortBy = getSortBy;
    function sortingBy(categories, property) {
        var _this = this;
        if (categories) {
            property = property || 'sequencenumber';
            _.each(categories, function (category) {
                _this.sortingBy(category.categories, property);
            });
            categories.sort(function (a, b) {
                // This works with Strings, Numbers, and Numbers as Strings. ie:
                // ['a', 'b', 'c'] OR [1, 3, 20] OR ['1', '3', '20']
                var numberA = Number(a[property]);
                var numberB = Number(b[property]);
                if (!isNaN(numberA) && !isNaN(numberB)) {
                    return numberA - numberB;
                }
                return ("" + a[property]).localeCompare(b[property]);
            });
        }
        return categories;
    }
    exports.sortingBy = sortingBy;
    function getSMTEndpointParameters(field, value, optionalFields, pcvAllItems, pcvGroups, effectiveDate) {
        var locale = (SC &&
            SC.ENVIRONMENT &&
            SC.ENVIRONMENT.currentLanguage &&
            SC.ENVIRONMENT.currentLanguage.locale).split('_');
        var currency = SC && SC.SESSION && SC.SESSION.currency && SC.SESSION.currency.code;
        var use_pcv = SC &&
            SC.ENVIRONMENT &&
            SC.ENVIRONMENT.siteSettings &&
            SC.ENVIRONMENT.siteSettings.isPersonalizedCatalogViewsEnabled
            ? 'T'
            : 'F';
        var parameters = "currency=" + currency + "&site_id=" + SC.ENVIRONMENT.siteSettings.siteid;
        parameters += "&c=" + SC.ENVIRONMENT.companyId + "&exclude_empty=" + Configuration_1.Configuration.get('categories.excludeEmptyCategories') + "&use_pcv=" + use_pcv + "&pcv_all_items=" + pcvAllItems + "&language=" + locale[0] + "&country=" + (locale[1] ||
            '') + "&" + field + "=" + value + optionalFields;
        // Only in case of SMT call
        if (effectiveDate) {
            parameters += "&as_of_date=" + effectiveDate;
        }
        if (pcvGroups) {
            parameters += "&pcv_groups=" + pcvGroups;
        }
        return parameters;
    }
    exports.getSMTEndpointParameters = getSMTEndpointParameters;
});

//# sourceMappingURL=Categories.Utils.js.map
