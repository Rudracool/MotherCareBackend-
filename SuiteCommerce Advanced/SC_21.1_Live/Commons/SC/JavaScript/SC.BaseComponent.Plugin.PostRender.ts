/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.BaseComponent.Plugin.PostRender"/>

import * as _ from 'underscore';

import { SCBaseComponentChildViewsComponent } from './SC.BaseComponent.ChildViewsComponent';
import { View } from '../../Core/JavaScript/View';

export function scBaseComponentPluginPostRender(
    tmplStr: string,
    view: View<object, object>
): string {
    const cctGenerators = SCBaseComponentChildViewsComponent.getViewsToRerender(view);

    const childViews = {};

    _.each(cctGenerators, (childViewInstance, containerName) => {
        if (!childViews[containerName]) {
            childViews[containerName] = {};
        }

        _.each(childViewInstance, (childViewGeneratorFunction, viewName) => {
            if (!childViews[containerName][viewName]) {
                childViews[containerName][viewName] = childViewGeneratorFunction(view);
            }
        });
    });

    view.addChildViewInstances(childViews, false);

    return tmplStr;
}
