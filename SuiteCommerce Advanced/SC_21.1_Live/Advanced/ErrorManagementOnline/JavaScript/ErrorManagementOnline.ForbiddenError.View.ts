/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ErrorManagementOnline.ForbiddenError.View"/>
/// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts" />

import * as error_management_forbidden_error_tpl from 'error_management_forbidden_error.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';

import ErrorManagementView = require('../../../Commons/ErrorManagement/JavaScript/ErrorManagement.View');

const ErrorManagementForbiddenErrorView: any = ErrorManagementView.extend({
    template: error_management_forbidden_error_tpl,
    attributes: {
        id: 'forbidden-error',
        class: 'forbidden-error'
    },
    title: Utils.translate('NOT ALLOWED'),
    page_header: Utils.translate('NOT ALLOWED'),

    initialize: function() {
        const SC = Environment.getSC();
        if (SC.ENVIRONMENT.jsEnvironment === 'server') {
            nsglobal.statusCode = 403;
        }
    },

    // @method getContext @returns {ErrorManagement.ForbiddenError.View.Context}
    getContext: function() {
        // @class ErrorManagement.ForbiddenError.View.Context
        return {
            // @property {String} title
            title: this.title,
            // @property {String} pageHeader
            pageHeader: this.page_header
        };
    }
});

export = ErrorManagementForbiddenErrorView;
