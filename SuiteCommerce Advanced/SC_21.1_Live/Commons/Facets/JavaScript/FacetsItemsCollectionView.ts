/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="FacetsItemsCollectionView"/>
import * as facets_items_collection_tpl from 'facets_items_collection.tpl';
import * as facets_items_collection_view_cell_tpl from 'facets_items_collection_view_cell.tpl';
import * as facets_items_collection_view_row_tpl from 'facets_items_collection_view_row.tpl';
import { CollectionView } from '../../Core/JavaScript/CollectionView';
import { View } from '../../Core/JavaScript/View';
import { RowView } from '../../Core/JavaScript/RowView';
import { Application } from '../../ApplicationSkeleton/JavaScript/Application';

import FacetsItemCellView = require('./Facets.ItemCell.View');

interface FacetsItemsCollectionViewContext {
    keywords: string;
}

interface FacetsItemsCollectionViewOptions {
    keywords: string;
    viewsPerRow: number;
    collection: any;
    cellViewTemplate: string;
    application: Application;
}

export class FacetsItemsCollectionView extends CollectionView<
    any,
    FacetsItemsCollectionViewContext
> {
    protected template = facets_items_collection_tpl;
    protected cellTemplate = facets_items_collection_view_cell_tpl;
    private readonly viewsPerRow: number = 1;
    private readonly keywords: string;
    private readonly cellViewTemplate: string;
    private readonly application: Application;

    public constructor(options: FacetsItemsCollectionViewOptions) {
        super(options.collection);
        this.viewsPerRow = options.viewsPerRow;
        this.keywords = options.keywords;
        this.cellViewTemplate = options.cellViewTemplate;
        this.application = options.application;
    }
    public getContext(): FacetsItemsCollectionViewContext {
        return {
            keywords: this.keywords
        };
    }
    protected getCellViewsPerRow(): number {
        return this.viewsPerRow;
    }

    protected getCellViewInstance<TCellViewContext extends object, TCellViewEvent extends object>(
        element: any,
        index: number
    ): View<TCellViewContext, TCellViewEvent> {
        return new FacetsItemCellView({
            application: this.application,
            template: this.cellViewTemplate,
            model: element
        });
    }

    protected getRowViewInstance(index: number): View<object, object> | null {
        return new RowView({ template: facets_items_collection_view_row_tpl });
    }
}
