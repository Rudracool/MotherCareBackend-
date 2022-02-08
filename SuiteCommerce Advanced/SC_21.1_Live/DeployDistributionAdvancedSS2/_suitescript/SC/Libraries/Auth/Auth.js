/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/runtime", "./User", "../../../third_parties/underscore.js"], function (require, exports, runtime, User_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Permission = runtime.Permission;
    var Auth = /** @class */ (function () {
        function Auth() {
            this.permissions = {
                transaction: {
                    tranCashSale: ['TRAN_CASHSALE'],
                    tranCustCred: ['TRAN_CUSTCRED'],
                    tranCustDep: ['TRAN_CUSTDEP'],
                    tranCustPymt: ['TRAN_CUSTPYMT'],
                    tranStatement: ['TRAN_STATEMENT'],
                    tranCustInvc: ['TRAN_CUSTINVC'],
                    tranItemShip: ['TRAN_ITEMSHIP'],
                    tranSalesOrd: ['TRAN_SALESORD'],
                    tranEstimate: ['TRAN_ESTIMATE'],
                    tranRtnAuth: ['TRAN_RTNAUTH'],
                    tranDepAppl: ['TRAN_DEPAPPL'],
                    tranSalesOrdFulfill: ['TRAN_SALESORDFULFILL'],
                    tranFind: ['TRAN_FIND'],
                    tranPurchases: ['TRAN_SALESORD', 'TRAN_CUSTINVC', 'TRAN_CASHSALE'],
                    tranPurchasesReturns: ['TRAN_RTNAUTH', 'TRAN_CUSTCRED']
                },
                lists: {
                    regtAcctRec: ['REGT_ACCTREC'],
                    regtNonPosting: ['REGT_NONPOSTING'],
                    listCase: ['LIST_CASE'],
                    listContact: ['LIST_CONTACT'],
                    listCustJob: ['LIST_CUSTJOB'],
                    listCompany: ['LIST_COMPANY'],
                    listIssue: ['LIST_ISSUE'],
                    listCustProfile: ['LIST_CUSTPROFILE'],
                    listExport: ['LIST_EXPORT'],
                    listFind: ['LIST_FIND'],
                    listCrmMessage: ['LIST_CRMMESSAGE']
                }
            };
            this.permissionRules = { construct: {} };
            this.partialPermissionRules = { construct: {} };
            this.loginRules = { construct: false };
            this.user = User_1.User.getInstance();
        }
        Auth.prototype.addPartialPermissionRules = function (rule, propertyKey) {
            if (propertyKey === void 0) { propertyKey = 'construct'; }
            this.partialPermissionRules[propertyKey] = rule;
        };
        Auth.prototype.addPermissionRules = function (rule, propertyKey) {
            if (propertyKey === void 0) { propertyKey = 'construct'; }
            this.permissionRules[propertyKey] = rule;
        };
        Auth.prototype.addLoginRules = function (propertyKey) {
            if (propertyKey === void 0) { propertyKey = 'construct'; }
            this.loginRules[propertyKey] = true;
        };
        Auth.prototype.validatePermissions = function (propertyKey) {
            var evaluationsPartial = this.evaluate([
                this.partialPermissionRules[propertyKey],
                this.partialPermissionRules.construct
            ]);
            var evaluations = this.evaluate([
                this.permissionRules[propertyKey],
                this.permissionRules.construct
            ]);
            return (evaluations.every(function (evaluation) { return evaluation; }) &&
                (!evaluationsPartial.length ||
                    evaluationsPartial.some(function (evaluation) { return evaluation; })));
        };
        // eslint-disable-next-line class-methods-use-this
        Auth.prototype.evaluate = function (rules) {
            var _this = this;
            return _.flatten(rules.map(function (rule) {
                return _.map(rule, function (permissionsArray, permissionLevel) {
                    // Check if all permissions in permissionsArray
                    // match the permissionLevel (for the
                    // propertyKey and the constructor)
                    return permissionsArray.map(function (permission) {
                        return (_this.user.getPermission(permission) >=
                            Number(permissionLevel));
                    });
                });
            }));
        };
        Auth.prototype.validateLogin = function (propertyKey) {
            var required = !!this.loginRules[propertyKey] || !!this.loginRules.construct;
            return required ? this.user.isLoggedIn() : true;
        };
        Auth.prototype.getPermissions = function () {
            return this.permissions;
        };
        return Auth;
    }());
    var auth = new Auth();
    // permission decorator
    function requirePermissions(rule) {
        return function (constructor, propertyKey, descriptor) {
            auth.addPermissionRules(rule, propertyKey);
        };
    }
    exports.requirePermissions = requirePermissions;
    // permission decorator
    function requireAtLeastOnePermission(rule) {
        return function (constructor, propertyKey, descriptor) {
            auth.addPartialPermissionRules(rule, propertyKey);
        };
    }
    exports.requireAtLeastOnePermission = requireAtLeastOnePermission;
    // login decorator
    function requireLogin() {
        return function (constructor, propertyKey, descriptor) {
            auth.addLoginRules(propertyKey);
        };
    }
    exports.requireLogin = requireLogin;
    exports.default = auth;
});
