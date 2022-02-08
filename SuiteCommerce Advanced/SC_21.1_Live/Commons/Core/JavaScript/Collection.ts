/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Collection"/>
// @Typescript-full

import { InferModelEntity, InferModelEvents, InferModelServiceContract } from './backbone/backbone';
import * as Backbone from './backbone/BackboneExtras';
import { Model } from './Model';

export interface CollectionEventsDefinition<TCollection, TServiceContract> {
    update: (collection: TCollection) => void;
    reset: (collection: TCollection) => void;
    sort: (collection: TCollection) => void;
    sync: (model: TCollection, resp: TServiceContract) => void;
    request: (model: TCollection) => void;
}

export abstract class Collection<
    TModel extends Model<
        InferModelEntity<TModel>,
        InferModelServiceContract<TModel>,
        InferModelEvents<TModel>
    >,
    TServiceContract = InferModelServiceContract<TModel>[],
    TEvents extends object = {}
> extends Backbone.Collection<TModel, TServiceContract, TEvents> {
    public url = (): string => '';
}
