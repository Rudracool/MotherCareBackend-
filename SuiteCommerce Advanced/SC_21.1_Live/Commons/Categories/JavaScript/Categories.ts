/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Categories"/>
/// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts" />

import * as _ from 'underscore';
import * as jQuery from '../../Core/JavaScript/jQuery';
import * as CategoriesUtils from './Categories.Utils';
import { ProfileModel } from '../../Profile/JavaScript/Profile.Model';

import { CategoriesCollection, CollectionOptions } from './Categories.Collection';
import { Configuration } from '../../Utilities/JavaScript/Configuration';

const Categories = {
    topLevelCategories: [],

    categoriesPromise: new (<any>jQuery).Deferred(),

    excludeFromMyAccount: true,

    makeNavigationTab(categories) {
        const result = [];
        const self = this;

        _.each(categories, function(category: any) {
            const href = category.fullurl;
            const tab = {
                href,
                text: category.name,
                data: {
                    hashtag: `#${href}`,
                    touchpoint: 'home'
                },
                class: `header-menu-level${category.level}-anchor`,
                'data-type': 'commercecategory'
            };

            (<any>tab).additionalFields = CategoriesUtils.getAdditionalFields(
                category,
                'categories.menu.fields'
            );

            if (category.categories) {
                (<any>tab).categories = self.makeNavigationTab(category.categories);
            }

            result.push(tab);
        });

        return result;
    },

    addToNavigationTabs(categories) {
        if (Configuration.get('categories.addToNavigationTabs')) {
            const self = this;
            const navigationData = Configuration.get('navigationData');
            let index = -1;

            // delete previews categories on the menu
            let lastIndex = navigationData.length;

            while (lastIndex--) {
                if (navigationData[lastIndex]['data-type'] === 'commercecategory') {
                    navigationData.splice(lastIndex, 1);
                }
            }

            for (let i = 0; i < navigationData.length; i++) {
                if (navigationData[i].placeholder === 'Categories') {
                    index = i;

                    break;
                }
            }

            if (index !== -1) {
                const tabs = self.makeNavigationTab(categories);

                // navigationData.splice(index, 1);

                _.each(tabs, function(tab, position) {
                    navigationData.splice(index + position, 0, tab);
                });
            }

            this.application.trigger('Configuration.navigationData');
        }
    },

    getTopLevelCategoriesUrlComponent() {
        return this.topLevelCategories;
    },

    setTopLevelCategoriesUrlComponents(categories) {
        const self = this;
        _.each(categories, function(category: any) {
            self.topLevelCategories.push(category.fullurl);
        });
    },

    getCategoriesPromise() {
        return this.categoriesPromise;
    },

    mountToApp(application) {
        if (Configuration.get('categories')) {
            this.application = application;
            let categories = SC.CATEGORIES;

            this.application.waitForPromise(this.categoriesPromise);

            // When PCV is enabled, and you are logged in, or you couldn't get the
            // categories from the shortcache(due to environment is not production),
            // you need to replace the cached categories with the specific categories
            // of the logged in user
            if (
                !SC.CATEGORIES || (SC.ENVIRONMENT.siteSettings.isPersonalizedCatalogViewsEnabled &&
                !ProfileModel.getInstance().isAnnonymous())
            ) {
                const options: CollectionOptions = {
                    level: Configuration.get('categories.menuLevel'),
                    preventDefault: true
                };

                const categoriesFetch = new CategoriesCollection(options).fetch();

                return categoriesFetch
                    .then(model => {
                        const categories = (model && model.data) || [];
                        SC.CATEGORIES = categories;
                        this.setTopLevelCategoriesUrlComponents(categories);
                        this.addToNavigationTabs(categories);
                    })
                    .catch(() => {
                        console.log('Failed to get Dynamic Categories for logged in user');
                    })
                    .always(() => {
                        this.categoriesPromise.resolve();
                    });
            }

            categories = CategoriesUtils.sortingBy(categories, CategoriesUtils.getSortBy('menu'));
            this.setTopLevelCategoriesUrlComponents(categories);
            this.addToNavigationTabs(categories);
            this.categoriesPromise.resolve();
        }
    }
};

export = Categories;
