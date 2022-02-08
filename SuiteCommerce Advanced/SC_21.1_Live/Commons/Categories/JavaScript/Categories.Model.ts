/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Categories.Model"/>
// @Typescript-partial

import * as _ from 'underscore';
import * as CategoriesUtils from './Categories.Utils';

import { Model } from '../../Core/JavaScript/Model';
import {
    CategoryTree,
    FullCategory,
    Category
} from '../../../ServiceContract/SC/Category/Category';

import { Configuration } from '../../Utilities/JavaScript/Configuration';

import BackboneCachedModel = require('../../BackboneExtras/JavaScript/Backbone.CachedModel');

interface CategoryURL {
    fullurl?: string;
}

export interface Options {
    cache?: boolean;
    data?: CategoryURL;
    killerId?: any;
}

// Connects to the search api to get all the items and the facets
// A Model Contains a Collection of items and the list of facet groups with its values
export class CategoriesModel extends Model<FullCategory | Category, CategoryTree> {
    // TODO: We should extend of CachedModel once available

    private readonly config = Configuration.get().categories;

    private readonly options: Options = { cache: true };

    private readonly ignoreCache: boolean = true;

    // TODO: Once this extends of CachedModel the access to the prototype fetch won't be needed
    private readonly originalFetch = BackboneCachedModel.prototype.fetch;

    public urlRoot = () => this.getServiceURL();

    public constructor(options?: Options) {
        super();

        this.options = options;
    }

    // Overrides fetch so we make sure that the cache is set to true, so we wrap it
    public fetch(options) {
        options = _.extend(options || {}, this.options);

        options.cache = !this.ignoreCache;

        return this.originalFetch.apply(this, arguments);
    }

    private getColumns(element: string): string {
        return _.union(
            CategoriesUtils.getCategoryColumns()[element].fields,
            this.config[element].fields || this.config[element].additionalFields
        ).join();
    }

    private getNavigationItemOptionalFields(): string {
        return `&bread_crumb_fields=${this.getColumns(
            'breadcrumb'
        )}&category_fields=${this.getColumns('category')}&side_menu_fields=${this.getColumns(
            'sideMenu'
        )}&subcategory_fields=${this.getColumns('subCategories')}`;
    }

    private getServiceURL(): string {
        const CATEGORY_TREE_ENDPOINT = '/api/navigation/v1/categorynavitems?';
        const baseUrl = CategoriesUtils.getBaseUrl();
        const params = CategoriesUtils.getSMTEndpointParameters(
            'full_url',
            this.options.data.fullurl,
            this.getNavigationItemOptionalFields(),
            'F',
            null,
            null
        );
        const url = baseUrl + CATEGORY_TREE_ENDPOINT + params;

        return url;
    }

    protected parse(category: CategoryTree): FullCategory {
        // The category is always at the first position. SMT send the data in that way
        const categoryData = <FullCategory>category.data[0];
        categoryData.categories = <Category[]>(
            CategoriesUtils.sortingBy(categoryData.categories, CategoriesUtils.getSortBy('menu'))
        );

        return categoryData;
    }
}
