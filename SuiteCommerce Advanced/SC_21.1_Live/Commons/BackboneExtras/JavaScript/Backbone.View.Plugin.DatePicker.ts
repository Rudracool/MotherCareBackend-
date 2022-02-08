/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.Plugin.DatePicker"/>

import * as _ from 'underscore';
import '../../Utilities/JavaScript/bootstrap-datepicker';
import { backboneViewDatePicker } from './Backbone.View.DatePicker';

import BackboneView = require('./Backbone.View.render');

/*
@module BackboneExtras
#Backbone.View.Plugins
Define the default plugins to execute by Backbone.View.render method. These plugins hook into the Backobne.view
render() life cycle and modify the view's output somehow, for example removing marked nodes that current user
has not permission to see, installing bootstrap widgets after a view is rendered, etc.
*/

export const BackboneViewPluginDatePicker = {
    mountToApp: function() {
        if (!_.result(SC, 'isPageGenerator')) {
            BackboneView.postRender.install({
                name: 'datePicker',
                priority: 10,
                execute: backboneViewDatePicker
            });
        }
    }
};
