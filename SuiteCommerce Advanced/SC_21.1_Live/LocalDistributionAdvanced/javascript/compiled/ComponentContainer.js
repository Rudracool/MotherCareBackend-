/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ComponentContainer", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ComponentContainer = /** @class */ (function () {
        function ComponentContainer() {
            this.components = {};
        }
        ComponentContainer.prototype.registerComponent = function (component) {
            if (component && component.componentName) {
                this.components[component.componentName] = this.sealComponent(component, component.componentName);
                return;
            }
            var error = new Error('Invalid component parameter, make sure you specify a componentName property and getProxy method');
            error.name = 'INVALID_PARAM';
            throw error;
        };
        ComponentContainer.prototype.getComponent = function (component_name) {
            return this.components[component_name] || null;
        };
        ComponentContainer.prototype.sealComponent = function (component, component_name) {
            try {
                _.each(component, function (value, prop) {
                    Object.defineProperty(component, prop, {
                        get: function () {
                            return value;
                        },
                        set: function () {
                            throw new Error("You cannot override property " + prop + " of component " + component_name);
                        }
                    });
                });
            }
            catch (e) {
                console.error(e);
            }
            return component;
        };
        ComponentContainer.getInstance = function () {
            this.instance = this.instance || new ComponentContainer();
            return this.instance;
        };
        return ComponentContainer;
    }());
    exports.ComponentContainer = ComponentContainer;
});

//# sourceMappingURL=ComponentContainer.js.map
