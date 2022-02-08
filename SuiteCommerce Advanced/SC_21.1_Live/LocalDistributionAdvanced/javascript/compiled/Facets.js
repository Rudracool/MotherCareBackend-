/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets", ["require", "exports", "underscore", "Utils", "Configuration", "ProductListPage.Component", "Facets.Translator", "Facets.Model", "Facets.Router", "Categories", "facets_item_cell_grid.tpl", "facets_item_cell_table.tpl", "facets_item_cell_list.tpl", "facets_faceted_navigation_item.tpl", "facets_faceted_navigation_item_color.tpl", "facets_faceted_navigation_item_range.tpl"], function (require, exports, _, Utils, Configuration_1, ProductListPage_Component_1, Translator, Model, Router, Categories) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Translator = Translator;
    exports.Model = Model;
    exports.Router = Router;
    // @module Facets AKA Item List.
    function prepareRouter(application, router) {
        // we are constructing this regexp like:
        // /^\b(toplevelcategory1|toplevelcategory2|facetname1|facetname2|defaulturl)\b\/(.*?)$/
        // and adding it as a route
        var facets_to_include = new Translator().getFacetsToInclude();
        // Here we generate an array with:
        // * The default url
        // * The Names of the facets that are in the siteSettings.facetfield config
        // * And the url of the top level categories
        var components = _.compact(_.union([application.translatorConfig.fallbackUrl], facets_to_include || []));
        router.addUrl(components, 'facetLoading');
        var categories_promise = Categories.getCategoriesPromise();
        categories_promise.then(function () {
            var categoriesTopLevelUrl = Categories.getTopLevelCategoriesUrlComponent();
            router.addUrl(categoriesTopLevelUrl, 'categoryLoading');
        });
    }
    exports.prepareRouter = prepareRouter;
    function setTranslatorConfig(application) {
        var _a = application.getConfig(), defaultSearchUrl = _a.defaultSearchUrl, resultsPerPage = _a.resultsPerPage, sortOptions = _a.sortOptions, itemsDisplayOptions = _a.itemsDisplayOptions, facets = _a.facets, facetsAsUrlParameters = _a.facetsAsUrlParameters, facetDelimiters = _a.facetDelimiters, facetsSeoLimits = _a.facetsSeoLimits;
        // Formats a configuration object in the way the translator is expecting it
        application.translatorConfig = {
            fallbackUrl: defaultSearchUrl,
            defaultShow: _.result(_.find(resultsPerPage, function (show) {
                return show.isDefault;
            }) || resultsPerPage[0], 'items'),
            defaultOrder: _.result(_.find(sortOptions, function (sort) {
                return sort.isDefault;
            }) || sortOptions[0], 'id'),
            defaultDisplay: _.result(_.find(itemsDisplayOptions, function (display) {
                return display.isDefault;
            }) || itemsDisplayOptions[0], 'id'),
            facets: facets,
            facetsAsUrlParameters: facetsAsUrlParameters,
            facetDelimiters: facetDelimiters,
            facetsSeoLimits: facetsSeoLimits
        };
    }
    exports.setTranslatorConfig = setTranslatorConfig;
    function prepareItemDisplayOptions() {
        /* ---------------------------
        itemsDisplayOptions is set when the user loads the page with the current width of the screen device, NOT the width of the browser.
        This option is NOT responsive, so if the user loads the page with the desktop resolution, even if he resize the browser, he will still see the view of the desktop.
    
        Display type and columns supported by screen resolution:
    
        Mobile
        Display types -> List, Table
            List -> columns  [1, 2]
            Table -> columns [1, 2]
    
        Tablet
        Display types  -> List, Table
            List -> columns [1, 2, 3, 4, 6, 12]
            Table -> columns [1, 2, 3, 4, 6, 12]
    
        Desktop
        Display types	->
            List -> columns [1, 2, 3, 4, 6, 12]
            Table -> columns [1, 2, 3, 4, 6, 12]
            Grid -> columns [1, 2, 3, 4, 6, 12]
        --------------------------*/
        if (!Utils.isPageGenerator()) {
            var screenType = Utils.getDeviceType();
            // Phone Specific
            if (screenType === 'phone') {
                _.extend(Configuration_1.Configuration.itemsDisplayOptions, Configuration_1.Configuration.itemsDisplayOptionsPhone);
                _.extend(Configuration_1.Configuration.sortOptions, Configuration_1.Configuration.sortOptionsPhone);
                _.extend(Configuration_1.Configuration.defaultPaginationSettings, Configuration_1.Configuration.defaultPaginationSettingsPhone);
            }
            // Tablet Specific
            else if (screenType === 'tablet') {
                _.extend(Configuration_1.Configuration.itemsDisplayOptions, Configuration_1.Configuration.itemsDisplayOptionsTablet);
                _.extend(Configuration_1.Configuration.sortOptions, Configuration_1.Configuration.sortOptionsTablet);
                _.extend(Configuration_1.Configuration.defaultPaginationSettings, Configuration_1.Configuration.defaultPaginationSettingsTablet);
            }
        }
    }
    var facetConfigParsers = {
        currency: function (value) {
            return Utils.formatCurrency(value);
        },
        quantity: function (value) {
            return Utils.formatQuantity(value);
        },
        default: function (value) {
            return value;
        }
    };
    exports.facetConfigParsers = facetConfigParsers;
    function mountToApp(application) {
        // Post-process the configuration
        prepareItemDisplayOptions();
        var facets = application.getConfig().facets || [];
        facets = _.sortBy(facets, function (facet1, facet2) {
            return facet1.priority > facet2.priority ? 0 : 1;
        });
        _.each(facets, function (facet) {
            facet.colors = application.getLayout().getColorPalette(facet.colors);
        });
        setTranslatorConfig(application);
        var routerInstance = new Router(application);
        prepareRouter(application, routerInstance);
        // set up facet configuration parsers
        var self = this;
        _.each(facets, function (facet) {
            if (facet.parser) {
                facet.parser = self.facetConfigParsers[facet.parser];
            }
            if (!facet.parser) {
                facet.parser = self.facetConfigParsers.default;
            }
        });
        return ProductListPage_Component_1.ProductListPageComponent(application);
    }
    exports.mountToApp = mountToApp;
    var excludeFromMyAccount = true;
    exports.excludeFromMyAccount = excludeFromMyAccount;
});

//# sourceMappingURL=Facets.js.map
