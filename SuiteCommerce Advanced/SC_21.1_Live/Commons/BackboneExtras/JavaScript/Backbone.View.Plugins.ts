/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.Plugins"/>
import { BackboneViewPluginApplyPermissions } from './Backbone.View.Plugin.ApplyPermissions';
import { BackboneViewPluginBootstrap } from './Backbone.View.Plugin.Bootstrap';
import { BackboneViewPluginDatePicker } from './Backbone.View.Plugin.DatePicker';
import { BackboneViewPluginDebugTemplateName } from './Backbone.View.Plugin.DebugTemplateName';
import { BackboneViewPluginPageGeneratorImages } from './Backbone.View.Plugin.PageGeneratorImages';

/*
@module BackboneExtras
#Backbone.View.Plugins
Define the default plugins to execute by Backbone.View.render method. These plugins hook into the Backobne.view
render() life cycle and modify the view's output somehow, for example removing marked nodes that current user
has not permission to see, installing bootstrap widgets after a view is rendered, etc.
*/

const plugins = [
    BackboneViewPluginApplyPermissions,
    BackboneViewPluginBootstrap,
    BackboneViewPluginDatePicker,
    BackboneViewPluginDebugTemplateName,
    BackboneViewPluginPageGeneratorImages
];

export function mountToApp() {
    for (let i = 0; i < plugins.length; ++i) {
        plugins[i].mountToApp.apply(this, arguments);
    }
}
