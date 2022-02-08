/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.BaseComponent.ChildViewsComponent"/>

import * as _ from 'underscore';
import BackboneView = require('../../BackboneExtras/JavaScript/Backbone.View');
import {
    View,
    EventsHash,
    StaticChildViews,
    ChildViewInstances,
    ChildViewGenerator,
    ContextData,
    ContextDataMethod,
    ExtraContextProperty
} from '../../Core/JavaScript/View';
import { JSONObject } from '../../Utilities/JavaScript/Utils.Interfaces';

interface ComponentMap {
    [viewId: string]: (() => void)[];
}

interface ComponentContextDataMap {
    [viewId: string]: ((context: ContextData) => void)[];
}

interface ComponentContextPropertyMap {
    [viewId: string]: ((extraContext: ExtraContextProperty) => void)[];
}

interface ComponentEventHandlerMap {
    [viewId: string]: ((extraContext: EventsHash) => void)[];
}

interface ComponentJsonLdMap {
    [viewId: string]: ((jsonLdResult: JSONObject) => JQuery.Deferred<JSONObject>)[];
}

export interface Selector {
    [key: string]: string;
}

interface Placeholder {
    selector: Selector;
    views: View<object, object>[] | (typeof BackboneView)[];
}

interface PlaceholderViews {
    [placeholder: string]: Placeholder;
}

interface ViewsToRender {
    [templateName: string]: ChildViewGeneratorFunction;
}

interface ChildViewGeneratorFunction {
    [conteainerName: string]: {
        [viewName: string]: (
            view: View<object, object> | typeof BackboneView
        ) => ChildViewGenerator<object, object>;
    };
}

export class SCBaseComponentChildViewsComponent {
    private static rootComponentMap: ComponentMap = {};

    private static rootContextDataMap: ComponentContextDataMap = {};

    private static rootContextPropertyMap: ComponentContextPropertyMap = {};

    private static rootEventHandlerMap: ComponentEventHandlerMap = {};

    private static rootJsonLdMap: ComponentJsonLdMap = {};

    public static viewsToRerender: ViewsToRender = {};

    public static placeholderViews: PlaceholderViews = {};

    public static resetPlaceholderViews() {
        this.placeholderViews = {};
    }

    public static getPlaceholder(selector: Selector): Selector | null {
        const selectorData = _.find(this.placeholderViews, function(placeholder) {
            return _.isEqual(selector, placeholder.selector);
        });

        if (selectorData) {
            return selectorData.selector;
        } else {
            return null;
        }
    }

    public static registerViewForPlaceholder(
        selectors: Selector[],
        view: View<object, object> | typeof BackboneView
    ) {
        _.each(selectors, selector => {
            const existentSelector = this.getPlaceholder(selector);

            if (existentSelector) {
                const keyExistent = this.selectorToString(existentSelector);

                if (_.indexOf(this.placeholderViews[keyExistent].views, view) < 0) {
                    this.placeholderViews[keyExistent].views.push(view);
                }
            } else {
                const key = this.selectorToString(selector);

                this.placeholderViews[key] = {
                    selector: selector,
                    views: [view]
                };
            }
        });
    }

    public static unregisterViewForPlaceholders(view: View<object, object> | typeof BackboneView) {
        _.each(this.placeholderViews, (placeholder, key, selectorViewsContext) => {
            selectorViewsContext[key].views = _.without(placeholder.views, view);
        });
    }

    public static getPlaceholderViews(placeholder: string): Placeholder | null {
        return this.placeholderViews[placeholder] || null;
    }

    public static selectorToString(selector: Selector): string {
        let str = '';

        _.each(selector, (value, key) => {
            str += '[' + key + '="' + value + '"]';
        });

        return str;
    }

    public static resetViewsToRerender() {
        this.viewsToRerender = {};
    }

    public static getViewsToRerender(
        view: View<object, object> | typeof BackboneView
    ): ChildViewGeneratorFunction {
        const templateName = view.getTemplateName();

        if (templateName) {
            const generators = this.viewsToRerender[templateName];

            return generators || {};
        }

        return {};
    }

    public static addViewsToRerender(
        view: View<object, object> | typeof BackboneView,
        childViews: ChildViewGeneratorFunction
    ) {
        const templateName = view.getTemplateName();

        if (templateName) {
            if (!this.viewsToRerender[templateName]) {
                this.viewsToRerender[templateName] = {};
            }

            _.each(childViews, (childViewInstance, containerName) => {
                if (!this.viewsToRerender[templateName][containerName]) {
                    this.viewsToRerender[templateName][containerName] = {};
                }

                _.each(childViewInstance, (generatorFunction, viewName) => {
                    if (!this.viewsToRerender[templateName][containerName][viewName]) {
                        this.viewsToRerender[templateName][containerName][
                            viewName
                        ] = generatorFunction;
                    }
                });
            });
        }
    }

    private static normalizeChildViews(childViews: StaticChildViews): ChildViewInstances {
        const normalizeChild: ChildViewInstances = {};

        _.each(childViews, function(viewNames, containerName) {
            normalizeChild[containerName] = {};

            if (_.isFunction(viewNames)) {
                const childViewConstructor = viewNames;

                normalizeChild[containerName][containerName] = {
                    childViewIndex: 10,
                    childViewIsExternal: true,
                    childViewConstructor: childViewConstructor
                };
            } else {
                _.each(viewNames, function(generator, viewName) {
                    normalizeChild[containerName][viewName] = generator;
                    normalizeChild[containerName][viewName].childViewIsExternal = true;
                });
            }
        });

        return normalizeChild;
    }

    public static addChildViews(viewId: string, childViews: StaticChildViews) {
        this.rootComponentMap[viewId] = this.rootComponentMap[viewId] || [];

        const childViewInstances = this.normalizeChildViews(childViews || {});

        this.rootComponentMap[viewId].push(
            (function(childViewInstances) {
                return function(this: View<object, object> | typeof BackboneView) {
                    this.addChildViewInstances(childViewInstances, false);
                };
            })(childViewInstances)
        );
    }

    public static removeChildView(viewId: string, containerName: string, viewName: string) {
        this.rootComponentMap[viewId] = this.rootComponentMap[viewId] || [];

        this.rootComponentMap[viewId].push(
            (function(dataView, childViewId) {
                return function(this: View<object, object> | typeof BackboneView) {
                    this.removeChildViewInstance(dataView, childViewId, true);
                };
            })(containerName, viewName)
        );
    }

    public static setChildViewIndex(
        viewId: string,
        containerName: string,
        viewName: string,
        index: number
    ) {
        this.rootComponentMap[viewId] = this.rootComponentMap[viewId] || [];

        this.rootComponentMap[viewId].push(
            (function(dataView, childViewId, childViewIndex) {
                return function(this: View<object, object> | typeof BackboneView) {
                    this.setChildViewIndex(dataView, childViewId, childViewIndex, false);
                };
            })(containerName, viewName, index)
        );
    }

    public static addContextData(viewId: string, propertyName: string, func: ContextDataMethod) {
        if (!this.rootContextDataMap[viewId]) {
            this.rootContextDataMap[viewId] = [];
        }

        this.rootContextDataMap[viewId].push(
            (function(propertyName, func) {
                return function(
                    this: View<object, object> | typeof BackboneView,
                    context: ContextData
                ) {
                    context[propertyName] = func;
                };
            })(propertyName, func)
        );
    }

    public static addToViewContextDefinition(
        viewId: string,
        propertyName: string,
        type: string,
        callback: (safeContext: any) => any
    ) {
        if (!this.rootContextPropertyMap[viewId]) {
            this.rootContextPropertyMap[viewId] = [];
        }

        this.rootContextPropertyMap[viewId].push(
            (function(propertyName, type, callback) {
                return function(
                    this: View<object, object> | typeof BackboneView,
                    extraContext: ExtraContextProperty
                ) {
                    extraContext[propertyName] = {
                        type: type,
                        fn: callback
                    };
                };
            })(propertyName, type, callback)
        );
    }

    public static removeToViewContextDefinition(viewId: string, propertyName: string) {
        if (!this.rootContextPropertyMap[viewId]) {
            this.rootContextPropertyMap[viewId] = [];
        }

        this.rootContextPropertyMap[viewId].push(
            (function(propertyName) {
                return function(
                    this: View<object, object> | typeof BackboneView,
                    extraContext: ExtraContextProperty
                ) {
                    delete extraContext[propertyName];
                };
            })(propertyName)
        );
    }

    public static addToViewEventsDefinition(
        viewId: string,
        eventSelector: string,
        callback: (safeContext: any) => any
    ) {
        if (!this.rootEventHandlerMap[viewId]) {
            this.rootEventHandlerMap[viewId] = [];
        }

        this.rootEventHandlerMap[viewId].push(
            (function(eventSelector, callback) {
                return function(
                    this: View<object, object> | typeof BackboneView,
                    extraEventHandler: EventsHash
                ) {
                    extraEventHandler[eventSelector] = _.bind(callback, null);
                };
            })(eventSelector, callback)
        );
    }

    public static removeToViewEventsDefinition(viewId: string, eventSelector: string) {
        if (!this.rootEventHandlerMap[viewId]) {
            this.rootEventHandlerMap[viewId] = [];
        }

        this.rootEventHandlerMap[viewId].push(
            (function(eventSelector) {
                return function(
                    this: View<object, object> | typeof BackboneView,
                    extraEventHandler: EventsHash
                ) {
                    delete extraEventHandler[eventSelector];
                };
            })(eventSelector)
        );
    }

    public static modifyViewJsonLd(
        viewId: string,
        callback: (jsonLdResult: JSONObject) => JQuery.Deferred<JSONObject>
    ) {
        if (!this.rootJsonLdMap[viewId]) {
            this.rootJsonLdMap[viewId] = [];
        }

        this.rootJsonLdMap[viewId].push(
            (function(callback) {
                return function(
                    this: View<object, object> | typeof BackboneView,
                    jsonLdResult: JSONObject
                ): JQuery.Deferred<JSONObject> {
                    const nextPromise: JQuery.Deferred<JSONObject> = jQuery.Deferred();

                    try {
                        callback.call(this, jsonLdResult).then(
                            (nextJson: JSONObject): void => {
                                nextPromise.resolve(nextJson);
                            }
                        );
                    } catch {
                        nextPromise.resolve(jsonLdResult);
                    }

                    return nextPromise;
                };
            })(callback)
        );
    }

    public static applyModifiedChildViews(view: View<object, object> | typeof BackboneView) {
        const rootComponentId =
            (view.attributes && view.attributes['data-root-component-id']) || '';

        const components = ['Backbone.View', rootComponentId, ...view.constructor._AMDModuleName];

        _.each(components, component => {
            if (component) {
                const actions = this.rootComponentMap[component] || [];
                _.each(actions, function(action) {
                    action.call(view);
                });
            }
        });
    }

    public static getModifiedContextProperty(
        view: View<object, object> | typeof BackboneView
    ): ExtraContextProperty {
        const properties: ExtraContextProperty = {};
        const components = ['Backbone.View', ...view.constructor._AMDModuleName];

        _.each(components, component => {
            _.each(this.rootContextPropertyMap[component], fn => {
                fn.call(view, properties);
            });
        });

        return properties;
    }

    public static getModifiedEvents(view: View<object, object> | typeof BackboneView): EventsHash {
        const events: EventsHash = {};
        const components = ['Backbone.View', ...view.constructor._AMDModuleName];

        _.each(components, component => {
            _.each(this.rootEventHandlerMap[component], fn => {
                fn.call(view, events);
            });
        });

        const delegateEventSplitter = /^(\S+)\s*(.*)$/;

        _.each(events, (_event, key) => {
            const match = key.match(delegateEventSplitter);
            if (match && match.length > 1 && !view.$el.find(match[2]).length) {
                delete events[key];
            }
        });

        return events;
    }

    public static getModifiedContext(
        view: View<object, object> | typeof BackboneView
    ): ContextData {
        const contextData: ContextData = {};
        const components = ['Backbone.View', ...view.constructor._AMDModuleName];

        _.each(components, component => {
            _.each(this.rootContextDataMap[component], fn => {
                fn.call(view, contextData);
            });
        });

        return contextData;
    }

    public static getModifiedJsonLd(
        view: View<object, object> | typeof BackboneView,
        jsonLdResult: JSONObject
    ): Promise<JSONObject> {
        const components = ['Backbone.View', ...view.constructor._AMDModuleName];

        let currentGetJsonLd = view.getJsonLd;

        _.each(components, component => {
            _.each(this.rootJsonLdMap[component], fn => {
                const newGetJsonLd = ((currentView, getJsonLd, callback) => {
                    return function(previousJson: JSONObject): Promise<JSONObject> {
                        const nextPromise = jQuery.Deferred();
                        try {
                            getJsonLd.call(currentView, previousJson).then(
                                (currentJson: JSONObject): void => {
                                    callback.call(currentView, currentJson).then(
                                        (nextJson: JSONObject): void => {
                                            nextPromise.resolve(nextJson);
                                        }
                                    );
                                }
                            );
                        } catch {
                            nextPromise.resolve(previousJson);
                        }
                        return nextPromise;
                    };
                })(view, currentGetJsonLd, fn);

                currentGetJsonLd = newGetJsonLd;
            });
        });

        return currentGetJsonLd.call(view, jsonLdResult);
    }
}
