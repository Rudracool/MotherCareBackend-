/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PageType.Base.View"/>
// @Typescript-full
import { PageTypeView } from '../../../Commons/Core/JavaScript/PageTypeView';

export abstract class PageTypeBaseView<
    TContext extends object,
    TEvents extends object = {}
> extends PageTypeView<TContext, TEvents> {
    public getContext(): TContext {
        return {} as TContext;
    }
}
