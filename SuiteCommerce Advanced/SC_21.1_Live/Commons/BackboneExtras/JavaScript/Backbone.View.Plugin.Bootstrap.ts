/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.Plugin.Bootstrap"/>

import * as _ from 'underscore';
import { backboneViewBootstrap } from './Backbone.View.Bootstrap';

import BackboneView = require('./Backbone.View.render');

export const BackboneViewPluginBootstrap = {
    mountToApp: function() {
        if (!_.result(SC, 'isPageGenerator')) {
            BackboneView.postRender.install({
                name: 'HTMLBootstrap',
                priority: 10,
                // Fix all HTML bootstrap tooltips
                execute: backboneViewBootstrap
            });
        }
    }
};
