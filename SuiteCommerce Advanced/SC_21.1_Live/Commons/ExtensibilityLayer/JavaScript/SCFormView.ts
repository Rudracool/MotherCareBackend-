/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SCFormView"/>
// @Typescript-full
import { FormView } from '../../Core/JavaScript/FormView';
import { Model } from '../../Core/JavaScript/Model';
import {
    InferModelEntity,
    InferModelServiceContract
} from '../../Core/JavaScript/backbone/backbone';

export abstract class SCFormView<
    TModel extends Model<InferModelEntity<TModel>, InferModelServiceContract<TModel>, {}>,
    TContext extends object,
    TEvents extends object = {}
> extends FormView<TModel, TContext, TEvents> {}
