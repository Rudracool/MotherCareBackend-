/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SCCollection"/>
// @Typescript-full

import { Collection } from '../../Core/JavaScript/Collection';
import { Model } from '../../Core/JavaScript/Model';
import {
    InferModelEntity,
    InferModelEvents,
    InferModelServiceContract
} from '../../Core/JavaScript/backbone/backbone';

export abstract class SCCollection<
    TModel extends Model<
        InferModelEntity<TModel>,
        InferModelServiceContract<TModel>,
        InferModelEvents<TModel>
    >,
    TServiceContract = InferModelServiceContract<TModel>[],
    TEvents extends object = {}
> extends Collection<TModel, TServiceContract, TEvents> {}
