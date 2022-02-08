/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ErrorManagementOnline.ForbiddenError.View", ["require", "exports", "error_management_forbidden_error.tpl", "Utils", "Environment", "ErrorManagement.View"], function (require, exports, error_management_forbidden_error_tpl, Utils, Environment_1, ErrorManagementView) {
    "use strict";
    var ErrorManagementForbiddenErrorView = ErrorManagementView.extend({
        template: error_management_forbidden_error_tpl,
        attributes: {
            id: 'forbidden-error',
            class: 'forbidden-error'
        },
        title: Utils.translate('NOT ALLOWED'),
        page_header: Utils.translate('NOT ALLOWED'),
        initialize: function () {
            var SC = Environment_1.Environment.getSC();
            if (SC.ENVIRONMENT.jsEnvironment === 'server') {
                nsglobal.statusCode = 403;
            }
        },
        // @method getContext @returns {ErrorManagement.ForbiddenError.View.Context}
        getContext: function () {
            // @class ErrorManagement.ForbiddenError.View.Context
            return {
                // @property {String} title
                title: this.title,
                // @property {String} pageHeader
                pageHeader: this.page_header
            };
        }
    });
    return ErrorManagementForbiddenErrorView;
});

//# sourceMappingURL=ErrorManagementOnline.ForbiddenError.View.js.map
