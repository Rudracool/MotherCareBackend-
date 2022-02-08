/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="MyAccountListView"/>
// @Typescript-full

import { PageTypeView, PageTypeViewOptions } from '../../../Commons/Core/JavaScript/PageTypeView';
import { Collection } from '../../../Commons/Core/JavaScript/Collection';
import { Model } from '../../../Commons/Core/JavaScript/Model';

export interface SortOptions {
    value: string;
    name: string;
    selected?: boolean;
}

export interface FilterOptions {
    value: string;
    name: string;
    selected?: boolean;
}

export abstract class MyAccountListView<
    TCollection extends Collection<Model<{}, {}, {}>, {}, {}>,
    TContext extends object = {},
    TEvents extends object = {}
> extends PageTypeView<TContext, TEvents> {
    protected abstract pageHeader: string;
    protected abstract collection: TCollection;
    protected constructor(options: PageTypeViewOptions) {
        super(options);
    }

    protected abstract getSelectedMenu(): string;
}
