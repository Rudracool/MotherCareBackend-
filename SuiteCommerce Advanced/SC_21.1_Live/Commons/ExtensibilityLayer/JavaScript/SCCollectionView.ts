/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SCCollectionView"/>
// @Typescript-full
import { CollectionView } from '../../Core/JavaScript/CollectionView';

export abstract class SCCollectionView<
    TCollectionElement,
    TContext extends object,
    TEvent extends object = {}
> extends CollectionView<TCollectionElement, TContext, TEvent> {}
