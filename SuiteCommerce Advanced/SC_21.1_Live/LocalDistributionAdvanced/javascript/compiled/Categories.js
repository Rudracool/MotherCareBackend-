/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Categories", ["require", "exports", "underscore", "jQuery", "Categories.Utils", "Profile.Model", "Categories.Collection", "Configuration"], function (require, exports, _, jQuery, CategoriesUtils, Profile_Model_1, Categories_Collection_1, Configuration_1) {
    "use strict";
    var Categories = {
        topLevelCategories: [],
        categoriesPromise: new jQuery.Deferred(),
        excludeFromMyAccount: true,
        makeNavigationTab: function (categories) {
            var result = [];
            var self = this;
            _.each(categories, function (category) {
                var href = category.fullurl;
                var tab = {
                    href: href,
                    text: category.name,
                    data: {
                        hashtag: "#" + href,
                        touchpoint: 'home'
                    },
                    class: "header-menu-level" + category.level + "-anchor",
                    'data-type': 'commercecategory'
                };
                tab.additionalFields = CategoriesUtils.getAdditionalFields(category, 'categories.menu.fields');
                if (category.categories) {
                    tab.categories = self.makeNavigationTab(category.categories);
                }
                result.push(tab);
            });
            return result;
        },
        addToNavigationTabs: function (categories) {
            if (Configuration_1.Configuration.get('categories.addToNavigationTabs')) {
                var self_1 = this;
                var navigationData_1 = Configuration_1.Configuration.get('navigationData');
                var index_1 = -1;
                // delete previews categories on the menu
                var lastIndex = navigationData_1.length;
                while (lastIndex--) {
                    if (navigationData_1[lastIndex]['data-type'] === 'commercecategory') {
                        navigationData_1.splice(lastIndex, 1);
                    }
                }
                for (var i = 0; i < navigationData_1.length; i++) {
                    if (navigationData_1[i].placeholder === 'Categories') {
                        index_1 = i;
                        break;
                    }
                }
                if (index_1 !== -1) {
                    var tabs = self_1.makeNavigationTab(categories);
                    // navigationData.splice(index, 1);
                    _.each(tabs, function (tab, position) {
                        navigationData_1.splice(index_1 + position, 0, tab);
                    });
                }
                this.application.trigger('Configuration.navigationData');
            }
        },
        getTopLevelCategoriesUrlComponent: function () {
            return this.topLevelCategories;
        },
        setTopLevelCategoriesUrlComponents: function (categories) {
            var self = this;
            _.each(categories, function (category) {
                self.topLevelCategories.push(category.fullurl);
            });
        },
        getCategoriesPromise: function () {
            return this.categoriesPromise;
        },
        mountToApp: function (application) {
            var _this = this;
            if (Configuration_1.Configuration.get('categories')) {
                this.application = application;
                var categories = SC.CATEGORIES;
                this.application.waitForPromise(this.categoriesPromise);
                // When PCV is enabled, and you are logged in, or you couldn't get the
                // categories from the shortcache(due to environment is not production),
                // you need to replace the cached categories with the specific categories
                // of the logged in user
                if (!SC.CATEGORIES || (SC.ENVIRONMENT.siteSettings.isPersonalizedCatalogViewsEnabled &&
                    !Profile_Model_1.ProfileModel.getInstance().isAnnonymous())) {
                    var options = {
                        level: Configuration_1.Configuration.get('categories.menuLevel'),
                        preventDefault: true
                    };
                    var categoriesFetch = new Categories_Collection_1.CategoriesCollection(options).fetch();
                    return categoriesFetch
                        .then(function (model) {
                        var categories = (model && model.data) || [];
                        SC.CATEGORIES = categories;
                        _this.setTopLevelCategoriesUrlComponents(categories);
                        _this.addToNavigationTabs(categories);
                    })
                        .catch(function () {
                        console.log('Failed to get Dynamic Categories for logged in user');
                    })
                        .always(function () {
                        _this.categoriesPromise.resolve();
                    });
                }
                categories = CategoriesUtils.sortingBy(categories, CategoriesUtils.getSortBy('menu'));
                this.setTopLevelCategoriesUrlComponents(categories);
                this.addToNavigationTabs(categories);
                this.categoriesPromise.resolve();
            }
        }
    };
    return Categories;
});

//# sourceMappingURL=Categories.js.map
