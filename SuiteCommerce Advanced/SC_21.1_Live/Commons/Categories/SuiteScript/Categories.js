/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Category.js
// -----------
// Handles the Category tree
define('Categories', ['Application', 'Configuration', 'SiteSettings.Model', 'Utils'], function(
    Application,
    Configuration,
    SiteSettingsModel,
    Utils
) {
    const Categories = {
        getCategoryTree: function getCategoryTree() {
            try {
                SiteSettings = SiteSettingsModel.get();
                Environment = Application.getEnvironment(request);

                const CATEGORY_TREE_ENDPOINT = '/api/navigation/v1/categorynavitems/tree?';

                const level = Configuration.get('categories.menuLevel');
                const excludeEmptyCategories = Configuration.get(
                    'categories.excludeEmptyCategories'
                );
                const locale =
                    (Environment.currentLanguage && Environment.currentLanguage.locale) || '';
                const language = locale.split('_')[0];
                const country = locale.split('_')[1];
                const currency =
                    Environment && Environment.currentCurrency && Environment.currentCurrency.code;
                const usePcv = SiteSettings.isPersonalizedCatalogViewsEnabled ? 'T' : 'F';
                const baseUrl =
                    Utils.trim(Configuration.get().cms.baseUrl || '') ||
                    (Utils.isHttpsSupported() || Utils.isInCheckout()
                        ? request.getURL().match(/(^https?:\/\/[^\/]+)/i)[0]
                        : `http://${Environment.shoppingDomain}`);
                const categoriesEndpointURL = `${baseUrl +
                    CATEGORY_TREE_ENDPOINT}use_pcv=${usePcv}&site_id=${SiteSettings.siteid}&c=${
                    Environment.companyId
                }&exclude_empty=${excludeEmptyCategories}&currency=${currency}&language=${language}&country=${country}&max_level=${level}`;
                const requestHeader = {
                    Accept: 'application/json',
                    Cookie: Utils.replaceNewLineByASpace(request.getHeader('cookie'))
                };

                const enpointResponse = nlapiRequestURL(categoriesEndpointURL, null, requestHeader);

                return JSON.parse(enpointResponse.getBody()).data;
            } catch (e) {
                console.log(`Failed to get Dynamic Categories. Exception: ${JSON.stringify(e)}`);
            }
        }
    };

    return Categories;
});
