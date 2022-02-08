/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Categories.Collection"/>
// @Typescript-partial
import * as _ from 'underscore';
import * as CategoriesUtils from './Categories.Utils';

import { CategoriesModel } from './Categories.Model';
import { Collection } from '../../Core/JavaScript/Collection';
import {
    Category,
    CategoryTree,
    FullCategory
} from '../../../ServiceContract/SC/Category/Category';
import { Configuration } from '../../Utilities/JavaScript/Configuration';

import JQueryXHR = JQuery.jqXHR;

export interface CollectionOptions {
    dataType?: string;
    jsonp?: string;
    preventDefault?: boolean;
    backendAccountDomain?: string;
    pcvGroups?: string;
    pcvAllItems?: string;
    level: string;
    effectiveDate?: string;
    cache?: boolean;
}

export class CategoriesCollection extends Collection<CategoriesModel, CategoryTree> {
    private readonly options: CollectionOptions;

    public model: typeof CategoriesModel = CategoriesModel;

    private readonly config = Configuration.get().categories;

    public url = () => this.getServiceURL();

    public constructor(options?: CollectionOptions) {
        super();

        this.options = options;
    }

    private getServiceURL(): string {
        const CATEGORY_TREE_ENDPOINT = '/api/navigation/v1/categorynavitems/tree?';
        const baseUrl = CategoriesUtils.getBaseUrl(this.options.backendAccountDomain);
        const params = CategoriesUtils.getSMTEndpointParameters(
            'max_level',
            this.options.level,
            this.getCategoryTreeOptionalFields(),
            this.options.pcvAllItems,
            this.options.pcvGroups,
            this.options.effectiveDate
        );
        const url = baseUrl + CATEGORY_TREE_ENDPOINT + params;

        return url;
    }

    private getColumns(element) {
        return _.union(
            CategoriesUtils.getCategoryColumns()[element].fields,
            this.config[element].fields || this.config[element].additionalFields
        ).join();
    }

    private getCategoryTreeOptionalFields(): string {
        return `&menu_fields=${this.getColumns('menu')}`;
    }

    protected parse(categories: CategoryTree): (FullCategory | Category)[] {
        return CategoriesUtils.sortingBy(categories.data, CategoriesUtils.getSortBy('menu'));
    }

    public fetch(): JQueryXHR {
        interface FetchOptions {
            xhrFields?: {
                withCredentials: boolean;
            };
            crossDomain?: boolean;
        }

        const options: FetchOptions = {
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        };

        // The 'true' value prevents jQuery ajax from sending
        // the 'X-SC-Touchpoint' header, it's not supported by CORS
        SC.dontSetRequestHeaderTouchpoint = true;
        const fetchResult = super.fetch(options);
        SC.dontSetRequestHeaderTouchpoint = false;

        return fetchResult;
    }
}
