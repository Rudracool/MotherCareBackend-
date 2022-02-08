/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.Plugin.DebugTemplateName"/>

import * as _ from 'underscore';
import { backboneViewDebugTemplateName } from './Backbone.View.DebugTemplateName';

import BackboneView = require('./Backbone.View.render');

export const BackboneViewPluginDebugTemplateName = {
    mountToApp: function() {
        if (!_.result(SC, 'isPageGenerator')) {
            BackboneView.postCompile.install({
                name: 'debugTemplateName',
                priority: 10,
                execute: backboneViewDebugTemplateName
            });
        }
    }
};
