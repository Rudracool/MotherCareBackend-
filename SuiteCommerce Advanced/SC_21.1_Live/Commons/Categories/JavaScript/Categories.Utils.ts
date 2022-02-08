/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Categories.Utils"/>
// @Typescript-partial

import * as _ from 'underscore';

import * as Utils from '../../Utilities/JavaScript/Utils';
import { FullCategory, Category } from '../../../ServiceContract/SC/Category/Category';
import { Configuration } from '../../Utilities/JavaScript/Configuration';

// Categories.Utils.ts
// -------------
// Utility Class for Categories

export function getAdditionalFields(source, config_path) {
    const additionalFields = {};
    const fields = Configuration.get(config_path, []);

    _.each(fields, function(field: any) {
        additionalFields[field] = source[field];
    });

    return additionalFields;
}

export function getBaseUrl(backendAccountDomain?: string): string {
    const baseUrl =
        backendAccountDomain ||
        (Utils.isHttpsSupported()
            ? `https://${SC.ENVIRONMENT.shoppingDomain}`
            : Utils.isCheckoutSupported()
            ? SC.ENVIRONMENT.checkoutUrl
            : `http://${SC.ENVIRONMENT.shoppingDomain}`);

    return baseUrl;
}

export function getCategoryColumns() {
    const categoryColumns = {
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

                'idpath', // needed for breadcrumb
                'fullurl', // needed for canonical path
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

export function getSortBy(element: string): string {
    const config = Configuration.get().categories;
    const categoryColumns = getCategoryColumns();
    return config[element].sortBy || categoryColumns[element].sortBy;
}

export function sortingBy(
    categories: (Category | FullCategory)[],
    property?: string
): (Category | FullCategory)[] {
    if (categories) {
        property = property || 'sequencenumber';

        _.each(categories, (category: Category) => {
            this.sortingBy(category.categories, property);
        });

        categories.sort(function(a, b) {
            // This works with Strings, Numbers, and Numbers as Strings. ie:
            // ['a', 'b', 'c'] OR [1, 3, 20] OR ['1', '3', '20']
            const numberA = Number(a[property]);
            const numberB = Number(b[property]);

            if (!isNaN(numberA) && !isNaN(numberB)) {
                return numberA - numberB;
            }

            return `${a[property]}`.localeCompare(b[property]);
        });
    }

    return categories;
}

export function getSMTEndpointParameters(
    field: string,
    value: string,
    optionalFields: string,
    pcvAllItems: string,
    pcvGroups: string,
    effectiveDate: string
) {
    const locale = (
        SC &&
        SC.ENVIRONMENT &&
        SC.ENVIRONMENT.currentLanguage &&
        SC.ENVIRONMENT.currentLanguage.locale
    ).split('_');
    const currency = SC && SC.SESSION && SC.SESSION.currency && SC.SESSION.currency.code;
    const use_pcv =
        SC &&
        SC.ENVIRONMENT &&
        SC.ENVIRONMENT.siteSettings &&
        SC.ENVIRONMENT.siteSettings.isPersonalizedCatalogViewsEnabled
            ? 'T'
            : 'F';

    let parameters = `currency=${currency}&site_id=${SC.ENVIRONMENT.siteSettings.siteid}`;

    parameters += `&c=${SC.ENVIRONMENT.companyId}&exclude_empty=${Configuration.get(
        'categories.excludeEmptyCategories'
    )}&use_pcv=${use_pcv}&pcv_all_items=${pcvAllItems}&language=${locale[0]}&country=${locale[1] ||
        ''}&${field}=${value}${optionalFields}`;

    // Only in case of SMT call
    if (effectiveDate) {
        parameters += `&as_of_date=${effectiveDate}`;
    }
    if (pcvGroups) {
        parameters += `&pcv_groups=${pcvGroups}`;
    }

    return parameters;
}
