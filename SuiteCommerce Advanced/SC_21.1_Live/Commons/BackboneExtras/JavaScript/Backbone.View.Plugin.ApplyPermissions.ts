/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Backbone.View.Plugin.ApplyPermissions"/>
import * as _ from 'underscore';
import { backboneViewApplyPermissions } from './Backbone.View.ApplyPermissions';

import BackboneView = require('./Backbone.View.render');

export const BackboneViewPluginApplyPermissions = {
    mountToApp: function() {
        if (!_.result(SC, 'isPageGenerator')) {
            BackboneView.postRender.install({
                name: 'applyPermissions',
                priority: 10,
                // Given a DOM template, removes the elements from the DOM that
                // do not comply with the list of permissions level
                // The permission level is specified by using the data-permissions attribute and data-permissions-operator (the latter is optional)
                // on any html tag in the following format:
                // <permission_category>.<permission_name>.<minimum_level>
                // permission_category and permission_name come from SC.ENVIRONMENT.permissions. (See commons.js)
                // e.g:
                //     <div data-permissions="transactions.tranFind.1"></div>
                //     <div data-permissions="transactions.tranCustDep.3,transactions.tranDepAppl.1 lists.tranFind.1"></div>
                // Notice several permissions can be separated by space or comma, by default (in case that data-permissions-operator is missing) all permission will be evaluates
                // as AND, otherwise data-permissions-operator should have the value OR
                // e.g:
                //     <div data-permissions="transactions.tranFind.1"></div>
                //     <div data-permissions="transactions.tranCustDep.3,transactions.tranDepAppl.1 lists.tranFind.1" data-permissions-operator="OR" ></div>
                execute: backboneViewApplyPermissions
            });
        }
    }
};
