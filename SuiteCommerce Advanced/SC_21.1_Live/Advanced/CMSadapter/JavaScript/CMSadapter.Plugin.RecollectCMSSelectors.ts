/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CMSadapter.Plugin.RecollectCMSSelectors"/>

import * as _ from 'underscore';

import { scBaseComponentPluginRecollectCMSSelectorsGenerator } from '../../../Commons/SC/JavaScript/SC.BaseComponent.Plugin.RecollectCMSSelectors';

/*
	Loads the recollectCMSSelectors plugin that iterates through all the tags
	that contains data-cms in the template string.
*/

export function CMSadapterPluginRecollectCMSSelectorsGenerator(application) {
    return {
        name: 'recollectCMSSelectors',
        priority: 20,
        execute: scBaseComponentPluginRecollectCMSSelectorsGenerator
    };
}
