/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="RowView"/>
// @Typescript-full

import * as row_view_tpl from 'row_view.tpl';

import { View } from './View';

interface RowViewOptions {
    template?: unknown | string;
}

export class RowView extends View<{}> {
    protected template = row_view_tpl;

    public constructor(options: RowViewOptions) {
        super();

        if (options.template) {
            this.template = options.template;
        }
    }

    public getContext(): {} {
        return {};
    }
}
