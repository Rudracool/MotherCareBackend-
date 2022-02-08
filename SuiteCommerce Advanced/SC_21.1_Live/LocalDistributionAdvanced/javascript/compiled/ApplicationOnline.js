/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("ApplicationOnline", ["require", "exports", "Application", "Utils", "jQuerySCAExtras", "Profile.Model", "Item.KeyMapping", "underscore"], function (require, exports, Application_1, Utils, jQuerySCAExtras_1, Profile_Model_1, ItemKeyMapping, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplicationOnline = /** @class */ (function (_super) {
        __extends(ApplicationOnline, _super);
        function ApplicationOnline() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ApplicationOnline.prototype.resizeImage = function (url, size) {
            url =
                url ||
                    Utils.getThemeAbsoluteUrlOfNonManagedResources('img/no_image_available.jpeg', this.getConfig().imageNotAvailable);
            var configuration = this.getConfig();
            var sizeMapping = configuration.imageSizeMapping || {};
            var mappedSize = sizeMapping.size || size;
            var siteSettings = configuration.siteSettings || {};
            return Utils.resizeImage(siteSettings.imagesizes || [], url, mappedSize);
        };
        ApplicationOnline.prototype.getUser = function () {
            var profilePromise = jQuerySCAExtras_1.jQuery.Deferred();
            Profile_Model_1.ProfileModel.getPromise()
                .done(function () {
                profilePromise.resolve(Profile_Model_1.ProfileModel.getInstance());
            })
                .fail(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                profilePromise.reject.apply(this, args);
            });
            return profilePromise;
        };
        ApplicationOnline.prototype.isStandalone = function () {
            return SC.ENVIRONMENT.standalone;
        };
        ApplicationOnline.prototype.isReorderEnabled = function () {
            var config = this.getConfig();
            return (!this.isStandalone() ||
                (config.myAccountPreferences && config.myAccountPreferences.reorderEnabled));
        };
        ApplicationOnline.prototype.start = function (modules, done) {
            var loadedModules = this.modulesToLoad(modules);
            _super.prototype.start.call(this, loadedModules, done);
        };
        ApplicationOnline.prototype.modulesToLoad = function (entryPointModules) {
            var modules = entryPointModules;
            if (this.isStandalone()) {
                modules = _.filter(entryPointModules, function (module) { return module && !module.excludeFromMyAccount; });
            }
            return modules;
        };
        ApplicationOnline.prototype.getKeyMapping = function () {
            return _.defaults(this.getConfig().itemKeyMapping || {}, ItemKeyMapping.getKeyMapping(this.getConfig()));
        };
        return ApplicationOnline;
    }(Application_1.Application));
    exports.ApplicationOnline = ApplicationOnline;
});

//# sourceMappingURL=ApplicationOnline.js.map
