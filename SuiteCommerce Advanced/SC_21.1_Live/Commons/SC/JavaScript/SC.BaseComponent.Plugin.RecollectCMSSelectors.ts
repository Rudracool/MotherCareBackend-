/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.BaseComponent.Plugin.RecollectCMSSelectors"/>

import * as _ from 'underscore';

import {
    SCBaseComponentChildViewsComponent,
    Selector
} from './SC.BaseComponent.ChildViewsComponent';
import { View } from '../../Core/JavaScript/View';

export function scBaseComponentPluginRecollectCMSSelectorsGenerator(
    tmplStr: string,
    view: View<object, object>
): string {
    const regex = /<[^>]*(data-cms-area)=\"([^"\s]+)\"[^>]*>/g;
    let match = regex.exec(tmplStr);
    const selectorsOnUi: Selector[] = [];
    let selector: Selector;
    const isEqual = function(obj: Selector) {
        return _.isEqual(obj, selector);
    };

    SCBaseComponentChildViewsComponent.unregisterViewForPlaceholders(view);

    while (match !== null) {
        selector = {
            'data-cms-area': match[2]
        };

        if (!_.find(selectorsOnUi, isEqual)) {
            selectorsOnUi.push(selector);
        } else {
            console.warn(
                `Repeated selector ${SCBaseComponentChildViewsComponent.selectorToString(
                    selector
                )} in template ${view.getTemplateName()}`
            );
        }

        match = regex.exec(tmplStr);
    }

    if (selectorsOnUi.length > 0) {
        SCBaseComponentChildViewsComponent.registerViewForPlaceholder(selectorsOnUi, view);
    }

    return tmplStr;
}
