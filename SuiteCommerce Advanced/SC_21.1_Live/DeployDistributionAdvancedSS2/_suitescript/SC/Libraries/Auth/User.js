/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/runtime"], function (require, exports, runtime) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var User = /** @class */ (function () {
        function User() {
            this.currentUser = runtime.getCurrentUser();
        }
        User.getInstance = function () {
            if (!this.instance) {
                this.instance = new User();
            }
            return this.instance;
        };
        User.prototype.getPermission = function (permissions) {
            var _this = this;
            return Math.max.apply(Math, permissions.map(function (permission) {
                return _this.currentUser.getPermission({ name: permission });
            }));
        };
        User.prototype.isLoggedIn = function () {
            return this.currentUser.id > 0 && this.currentUser.role !== 17;
        };
        User.prototype.getId = function () {
            return this.currentUser.id;
        };
        User.prototype.getEmail = function () {
            return this.currentUser.email;
        };
        return User;
    }());
    exports.User = User;
});
