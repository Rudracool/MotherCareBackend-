/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CaseListItemsCollectionView"/>
// @Typescript-full

import { CollectionView } from '../../../Commons/Core/JavaScript/CollectionView';
import { RecordViewsView } from '../../RecordViews/JavaScript/RecordViews.View';

interface CaseListItemElementColumn {
    label: string;
    type: string;
    name: string;
    value: string;
}

export interface CaseListItemElement {
    title: string;
    detailsURL: string;
    columns: CaseListItemElementColumn[];
    internalid: string;
}

export class CaseListItemsCollectionView extends CollectionView<CaseListItemElement, {}, {}> {
    public constructor(collection: CaseListItemElement[]) {
        super(collection);
    }

    public getCellViewsPerRow(): number {
        return 1;
    }

    public getCellViewInstance(element: CaseListItemElement): RecordViewsView {
        return new RecordViewsView({
            record: element
        });
    }

    public getContext(): {} {
        return {};
    }
}
