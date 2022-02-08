/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CMSadapter.Plugin.PostRender"/>

import { scBaseComponentPluginPostRender } from '../../../Commons/SC/JavaScript/SC.BaseComponent.Plugin.PostRender';

/*
	Loads the cmsPostRender plugin responsible of re-rendering CCTs when views are being updated.
*/

export function CMSadapterPluginPostRender(application) {
    return {
        name: 'cmsPostRender',
        priority: 10,
        execute: scBaseComponentPluginPostRender
    };
}
