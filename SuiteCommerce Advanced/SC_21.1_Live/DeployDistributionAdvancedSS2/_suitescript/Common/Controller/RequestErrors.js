/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.badRequestError = {
        status: 400,
        name: 'ERR_BAD_REQUEST',
        message: 'Bad Request'
    };
    exports.invalidOriginError = {
        status: 400,
        name: 'ERR_INVALID_ORIGIN',
        message: 'Invalid request origin'
    };
    exports.unauthorizedError = {
        status: 401,
        name: 'ERR_USER_NOT_LOGGED_IN',
        message: 'Not logged In'
    };
    exports.sessionTimedOutError = {
        status: 401,
        name: 'ERR_USER_SESSION_TIMED_OUT',
        message: 'User session timed out'
    };
    exports.forbiddenError = {
        status: 403,
        name: 'ERR_INSUFFICIENT_PERMISSIONS',
        message: 'Insufficient permissions'
    };
    exports.notFoundError = {
        status: 404,
        name: 'ERR_RECORD_NOT_FOUND',
        message: 'Not found'
    };
    exports.missingWebsiteIdParameter = {
        status: 405,
        name: 'ERR_MISSING_WEBSITE_ID_PARAMETER',
        message: 'Missing website id parameter.'
    };
    exports.methodNotAllowedError = {
        status: 405,
        name: 'ERR_METHOD_NOT_ALLOWED',
        message: 'Sorry, you are not allowed to perform this action.'
    };
    exports.invalidItemsFieldsAdvancedName = {
        status: 500,
        name: 'ERR_INVALID_ITEMS_FIELDS_ADVANCED_NAME',
        message: 'Please check if the fieldset is created.'
    };
});
