/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.BaseComponent.ChildViewsComponent", ["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SCBaseComponentChildViewsComponent = /** @class */ (function () {
        function SCBaseComponentChildViewsComponent() {
        }
        SCBaseComponentChildViewsComponent.resetPlaceholderViews = function () {
            this.placeholderViews = {};
        };
        SCBaseComponentChildViewsComponent.getPlaceholder = function (selector) {
            var selectorData = _.find(this.placeholderViews, function (placeholder) {
                return _.isEqual(selector, placeholder.selector);
            });
            if (selectorData) {
                return selectorData.selector;
            }
            else {
                return null;
            }
        };
        SCBaseComponentChildViewsComponent.registerViewForPlaceholder = function (selectors, view) {
            var _this = this;
            _.each(selectors, function (selector) {
                var existentSelector = _this.getPlaceholder(selector);
                if (existentSelector) {
                    var keyExistent = _this.selectorToString(existentSelector);
                    if (_.indexOf(_this.placeholderViews[keyExistent].views, view) < 0) {
                        _this.placeholderViews[keyExistent].views.push(view);
                    }
                }
                else {
                    var key = _this.selectorToString(selector);
                    _this.placeholderViews[key] = {
                        selector: selector,
                        views: [view]
                    };
                }
            });
        };
        SCBaseComponentChildViewsComponent.unregisterViewForPlaceholders = function (view) {
            _.each(this.placeholderViews, function (placeholder, key, selectorViewsContext) {
                selectorViewsContext[key].views = _.without(placeholder.views, view);
            });
        };
        SCBaseComponentChildViewsComponent.getPlaceholderViews = function (placeholder) {
            return this.placeholderViews[placeholder] || null;
        };
        SCBaseComponentChildViewsComponent.selectorToString = function (selector) {
            var str = '';
            _.each(selector, function (value, key) {
                str += '[' + key + '="' + value + '"]';
            });
            return str;
        };
        SCBaseComponentChildViewsComponent.resetViewsToRerender = function () {
            this.viewsToRerender = {};
        };
        SCBaseComponentChildViewsComponent.getViewsToRerender = function (view) {
            var templateName = view.getTemplateName();
            if (templateName) {
                var generators = this.viewsToRerender[templateName];
                return generators || {};
            }
            return {};
        };
        SCBaseComponentChildViewsComponent.addViewsToRerender = function (view, childViews) {
            var _this = this;
            var templateName = view.getTemplateName();
            if (templateName) {
                if (!this.viewsToRerender[templateName]) {
                    this.viewsToRerender[templateName] = {};
                }
                _.each(childViews, function (childViewInstance, containerName) {
                    if (!_this.viewsToRerender[templateName][containerName]) {
                        _this.viewsToRerender[templateName][containerName] = {};
                    }
                    _.each(childViewInstance, function (generatorFunction, viewName) {
                        if (!_this.viewsToRerender[templateName][containerName][viewName]) {
                            _this.viewsToRerender[templateName][containerName][viewName] = generatorFunction;
                        }
                    });
                });
            }
        };
        SCBaseComponentChildViewsComponent.normalizeChildViews = function (childViews) {
            var normalizeChild = {};
            _.each(childViews, function (viewNames, containerName) {
                normalizeChild[containerName] = {};
                if (_.isFunction(viewNames)) {
                    var childViewConstructor = viewNames;
                    normalizeChild[containerName][containerName] = {
                        childViewIndex: 10,
                        childViewIsExternal: true,
                        childViewConstructor: childViewConstructor
                    };
                }
                else {
                    _.each(viewNames, function (generator, viewName) {
                        normalizeChild[containerName][viewName] = generator;
                        normalizeChild[containerName][viewName].childViewIsExternal = true;
                    });
                }
            });
            return normalizeChild;
        };
        SCBaseComponentChildViewsComponent.addChildViews = function (viewId, childViews) {
            this.rootComponentMap[viewId] = this.rootComponentMap[viewId] || [];
            var childViewInstances = this.normalizeChildViews(childViews || {});
            this.rootComponentMap[viewId].push((function (childViewInstances) {
                return function () {
                    this.addChildViewInstances(childViewInstances, false);
                };
            })(childViewInstances));
        };
        SCBaseComponentChildViewsComponent.removeChildView = function (viewId, containerName, viewName) {
            this.rootComponentMap[viewId] = this.rootComponentMap[viewId] || [];
            this.rootComponentMap[viewId].push((function (dataView, childViewId) {
                return function () {
                    this.removeChildViewInstance(dataView, childViewId, true);
                };
            })(containerName, viewName));
        };
        SCBaseComponentChildViewsComponent.setChildViewIndex = function (viewId, containerName, viewName, index) {
            this.rootComponentMap[viewId] = this.rootComponentMap[viewId] || [];
            this.rootComponentMap[viewId].push((function (dataView, childViewId, childViewIndex) {
                return function () {
                    this.setChildViewIndex(dataView, childViewId, childViewIndex, false);
                };
            })(containerName, viewName, index));
        };
        SCBaseComponentChildViewsComponent.addContextData = function (viewId, propertyName, func) {
            if (!this.rootContextDataMap[viewId]) {
                this.rootContextDataMap[viewId] = [];
            }
            this.rootContextDataMap[viewId].push((function (propertyName, func) {
                return function (context) {
                    context[propertyName] = func;
                };
            })(propertyName, func));
        };
        SCBaseComponentChildViewsComponent.addToViewContextDefinition = function (viewId, propertyName, type, callback) {
            if (!this.rootContextPropertyMap[viewId]) {
                this.rootContextPropertyMap[viewId] = [];
            }
            this.rootContextPropertyMap[viewId].push((function (propertyName, type, callback) {
                return function (extraContext) {
                    extraContext[propertyName] = {
                        type: type,
                        fn: callback
                    };
                };
            })(propertyName, type, callback));
        };
        SCBaseComponentChildViewsComponent.removeToViewContextDefinition = function (viewId, propertyName) {
            if (!this.rootContextPropertyMap[viewId]) {
                this.rootContextPropertyMap[viewId] = [];
            }
            this.rootContextPropertyMap[viewId].push((function (propertyName) {
                return function (extraContext) {
                    delete extraContext[propertyName];
                };
            })(propertyName));
        };
        SCBaseComponentChildViewsComponent.addToViewEventsDefinition = function (viewId, eventSelector, callback) {
            if (!this.rootEventHandlerMap[viewId]) {
                this.rootEventHandlerMap[viewId] = [];
            }
            this.rootEventHandlerMap[viewId].push((function (eventSelector, callback) {
                return function (extraEventHandler) {
                    extraEventHandler[eventSelector] = _.bind(callback, null);
                };
            })(eventSelector, callback));
        };
        SCBaseComponentChildViewsComponent.removeToViewEventsDefinition = function (viewId, eventSelector) {
            if (!this.rootEventHandlerMap[viewId]) {
                this.rootEventHandlerMap[viewId] = [];
            }
            this.rootEventHandlerMap[viewId].push((function (eventSelector) {
                return function (extraEventHandler) {
                    delete extraEventHandler[eventSelector];
                };
            })(eventSelector));
        };
        SCBaseComponentChildViewsComponent.modifyViewJsonLd = function (viewId, callback) {
            if (!this.rootJsonLdMap[viewId]) {
                this.rootJsonLdMap[viewId] = [];
            }
            this.rootJsonLdMap[viewId].push((function (callback) {
                return function (jsonLdResult) {
                    var nextPromise = jQuery.Deferred();
                    try {
                        callback.call(this, jsonLdResult).then(function (nextJson) {
                            nextPromise.resolve(nextJson);
                        });
                    }
                    catch (_a) {
                        nextPromise.resolve(jsonLdResult);
                    }
                    return nextPromise;
                };
            })(callback));
        };
        SCBaseComponentChildViewsComponent.applyModifiedChildViews = function (view) {
            var _this = this;
            var rootComponentId = (view.attributes && view.attributes['data-root-component-id']) || '';
            var components = ['Backbone.View', rootComponentId].concat(view.constructor._AMDModuleName);
            _.each(components, function (component) {
                if (component) {
                    var actions = _this.rootComponentMap[component] || [];
                    _.each(actions, function (action) {
                        action.call(view);
                    });
                }
            });
        };
        SCBaseComponentChildViewsComponent.getModifiedContextProperty = function (view) {
            var _this = this;
            var properties = {};
            var components = ['Backbone.View'].concat(view.constructor._AMDModuleName);
            _.each(components, function (component) {
                _.each(_this.rootContextPropertyMap[component], function (fn) {
                    fn.call(view, properties);
                });
            });
            return properties;
        };
        SCBaseComponentChildViewsComponent.getModifiedEvents = function (view) {
            var _this = this;
            var events = {};
            var components = ['Backbone.View'].concat(view.constructor._AMDModuleName);
            _.each(components, function (component) {
                _.each(_this.rootEventHandlerMap[component], function (fn) {
                    fn.call(view, events);
                });
            });
            var delegateEventSplitter = /^(\S+)\s*(.*)$/;
            _.each(events, function (_event, key) {
                var match = key.match(delegateEventSplitter);
                if (match && match.length > 1 && !view.$el.find(match[2]).length) {
                    delete events[key];
                }
            });
            return events;
        };
        SCBaseComponentChildViewsComponent.getModifiedContext = function (view) {
            var _this = this;
            var contextData = {};
            var components = ['Backbone.View'].concat(view.constructor._AMDModuleName);
            _.each(components, function (component) {
                _.each(_this.rootContextDataMap[component], function (fn) {
                    fn.call(view, contextData);
                });
            });
            return contextData;
        };
        SCBaseComponentChildViewsComponent.getModifiedJsonLd = function (view, jsonLdResult) {
            var _this = this;
            var components = ['Backbone.View'].concat(view.constructor._AMDModuleName);
            var currentGetJsonLd = view.getJsonLd;
            _.each(components, function (component) {
                _.each(_this.rootJsonLdMap[component], function (fn) {
                    var newGetJsonLd = (function (currentView, getJsonLd, callback) {
                        return function (previousJson) {
                            var nextPromise = jQuery.Deferred();
                            try {
                                getJsonLd.call(currentView, previousJson).then(function (currentJson) {
                                    callback.call(currentView, currentJson).then(function (nextJson) {
                                        nextPromise.resolve(nextJson);
                                    });
                                });
                            }
                            catch (_a) {
                                nextPromise.resolve(previousJson);
                            }
                            return nextPromise;
                        };
                    })(view, currentGetJsonLd, fn);
                    currentGetJsonLd = newGetJsonLd;
                });
            });
            return currentGetJsonLd.call(view, jsonLdResult);
        };
        SCBaseComponentChildViewsComponent.rootComponentMap = {};
        SCBaseComponentChildViewsComponent.rootContextDataMap = {};
        SCBaseComponentChildViewsComponent.rootContextPropertyMap = {};
        SCBaseComponentChildViewsComponent.rootEventHandlerMap = {};
        SCBaseComponentChildViewsComponent.rootJsonLdMap = {};
        SCBaseComponentChildViewsComponent.viewsToRerender = {};
        SCBaseComponentChildViewsComponent.placeholderViews = {};
        return SCBaseComponentChildViewsComponent;
    }());
    exports.SCBaseComponentChildViewsComponent = SCBaseComponentChildViewsComponent;
});

//# sourceMappingURL=SC.BaseComponent.ChildViewsComponent.js.map
