/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PageTypeFormView"/>
// @Typescript-partial

import { PageTypeView, PageTypeViewOptions } from './PageTypeView';
import { FormView } from './FormView';
import { InferModelEntity, InferModelServiceContract } from './backbone/backbone';
import { Model } from './Model';

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
            );
        });
    });
}

/** @deprecated
 * This is deprecated because for new solutions
 * you should have View that extends from PageTypeView
 * and on it a child view that extend from FormView
 **/
export abstract class PageTypeFormView<
    TModel extends Model<InferModelEntity<TModel>, InferModelServiceContract<TModel>, {}>,
    TContext extends object,
    TEvents extends object = {}
> extends PageTypeView<TContext, TEvents> implements FormView<TModel, TContext, TEvents> {
    protected formView: PageTypeFormView<TModel, TContext, TEvents>;
    protected constructor(options: PageTypeViewOptions, formModel: TModel) {
        super(options);
        FormView.prototype.constructor.call(this, formModel);
    }
}

// @deprecated
export interface PageTypeFormView<
    TModel extends Model<InferModelEntity<TModel>, InferModelServiceContract<TModel>, {}>,
    TContext extends object,
    TEvents extends object = {}
> extends FormView<TModel, TContext, TEvents>, PageTypeView<TContext, TEvents> {}

applyMixins(PageTypeFormView, [FormView]);
