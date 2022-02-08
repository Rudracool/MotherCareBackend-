/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Subscriptions.Status.View"/>
// @Typescript-full

import * as _ from 'underscore';

import * as subscriptions_status_tpl from 'subscriptions_status.tpl';

import { View } from '../../../Commons/Core/JavaScript/View';

interface SubscriptionsStatusViewContext {
    cssClass: string;
    has_status: boolean;
    status: string;
}
interface SubscriptionsStatusViewOptions {
    status: string;
}
export class SubscriptionsStatusView extends View<SubscriptionsStatusViewContext> {
    private readonly options: SubscriptionsStatusViewOptions;

    protected template = subscriptions_status_tpl;

    public constructor(options: SubscriptionsStatusViewOptions) {
        super();
        this.options = options;
    }

    private replaceStatusLabel(whatTo: string, forTo: string): string {
        return this.options.status.toLowerCase().replace(whatTo, forTo);
    }

    public getContext(): SubscriptionsStatusViewContext {
        const has_status: boolean =
            !_.isUndefined(this.options.status) && !(this.options.status === 'NOT_INCLUDED');

        return {
            cssClass: this.replaceStatusLabel('_', ' '),
            has_status: has_status,
            status: this.replaceStatusLabel('_', '-')
        };
    }
}
