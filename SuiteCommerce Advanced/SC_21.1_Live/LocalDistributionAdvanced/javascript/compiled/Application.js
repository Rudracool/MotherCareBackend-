/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Application", ["require", "exports", "underscore", "jQuery", "BackboneExtras", "EventEmitter", "ComponentContainer", "Utils", "Environment", "Generic.LayoutComponent"], function (require, exports, _, jQuery, Backbone, EventEmitter_1, ComponentContainer_1, Utils_1, Environment_1, GenericLayoutComponent) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Application = /** @class */ (function () {
        function Application() {
            var _this = this;
            this.modulesMountToAppResult = [];
            this.appPromises = [];
            this.emitter = new EventEmitter_1.DefaultEventEmitter();
            // This is to avoid a circular dependency with Backbone.View.
            // getCurrent should be used instead.
            var SC = Environment_1.Environment.getSC();
            SC.Application = this;
            jQuery(window).on('hashchange', function () { return _this.controlValidNavigation(); });
        }
        Application.prototype.getConfig = function () {
            return this.configuration;
        };
        /**
         * @deprecated
         */
        Application.prototype.setConfig = function (key, value) {
            Utils_1.setPathFromObject(this.configuration, key, value);
        };
        Application.prototype.getLayout = function () {
            return this.layout;
        };
        Application.prototype.waitForPromise = function (promise) {
            this.appPromises.push(promise);
        };
        /**
         * @deprecated
         */
        Application.prototype.trigger = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this.emitter).emit.apply(_a, [event].concat(args));
        };
        /**
         * @deprecated
         */
        Application.prototype.on = function (event, listner) {
            this.emitter.on(event, listner);
        };
        /**
         * @deprecated
         */
        Application.prototype.once = function (event, listner) {
            this.emitter.once(event, listner);
        };
        /**
         * @deprecated
         */
        Application.prototype.off = function (event, listner) {
            this.emitter.off(event, listner);
        };
        Application.prototype.getEmitter = function () {
            return this.emitter;
        };
        Application.prototype.start = function (modules, done) {
            var _this = this;
            this.emitter.emit('beforeStart', this);
            this.modules = modules;
            this.registerComponent(GenericLayoutComponent(this));
            // we mount each module to our application
            _.each(this.modules, function (module) {
                if (module && _.isFunction(module.mountToApp)) {
                    try {
                        var mountToAppResult = module.mountToApp(_this);
                        if (mountToAppResult && mountToAppResult.componentName) {
                            _this.registerComponent(mountToAppResult);
                        }
                        else {
                            _this.modulesMountToAppResult.push(mountToAppResult);
                        }
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            });
            // This checks if you have registered modules
            if (!Backbone.history) {
                throw new Error('No Backbone.Router has been initialized (Hint: Are your modules properly set?).');
            }
            // @event afterModulesLoaded triggered after all modules have been loaded
            this.emitter.emit('afterModulesLoaded', this);
            jQuery.when.apply(jQuery, this.appPromises).then(function () {
                if (done) {
                    done(_this);
                }
                // @event afterStart triggered after the application
                // finish starting and after the start() callback is called.
                _this.emitter.emit('afterStart', _this);
                _this.controlValidNavigation();
            });
        };
        Application.prototype.controlValidNavigation = function () {
            // find a router for the current fragment
            if (!Backbone.history.started) {
                return;
            }
            var fragment = Backbone.history.getFragment();
            var match = _(Backbone.history.handlers).some(function (handler) {
                return handler.callback && handler.route.exec(fragment);
            });
            // if not found a router for the current fragment the page not found is displayed.
            if (!match) {
                this.layout.notFound();
            }
        };
        Application.prototype.registerComponent = function (component) {
            var componentContainer = ComponentContainer_1.ComponentContainer.getInstance();
            componentContainer.registerComponent(component);
        };
        Application.prototype.getComponent = function (componentName) {
            var componentContainer = ComponentContainer_1.ComponentContainer.getInstance();
            return componentContainer.getComponent(componentName);
        };
        Application.prototype.isStandalone = function () {
            return false;
        };
        Application.prototype.isReorderEnabled = function () {
            return true;
        };
        return Application;
    }());
    exports.Application = Application;
});

//# sourceMappingURL=Application.js.map
