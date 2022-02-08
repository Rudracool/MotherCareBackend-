/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="FacetsItemRowView"/>

import * as facets_items_collection_view_row_tpl from 'facets_items_collection_view_row.tpl';

import { View } from '../../Core/JavaScript/View';

interface FacetsItemRowViewContext {}

export class FacetsItemRowView extends View<FacetsItemRowViewContext> {
    protected template = facets_items_collection_view_row_tpl;

    public getContext(): FacetsItemRowViewContext {
        return {};
    }
}
