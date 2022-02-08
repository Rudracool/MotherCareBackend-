/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="View"/>
// @Typescript-partial

import * as _ from 'underscore';
import * as Backbone from './backbone/BackboneExtras';
import * as Utils from '../../Utilities/JavaScript/Utils';
import { jQuery } from './jquery/JQueryExtras';
import { backboneViewApplyPermissions } from '../../BackboneExtras/JavaScript/Backbone.View.ApplyPermissions';
import { backboneViewBootstrap } from '../../BackboneExtras/JavaScript/Backbone.View.Bootstrap';
import { backboneViewDatePicker } from '../../BackboneExtras/JavaScript/Backbone.View.DatePicker';
import { backboneViewDebugTemplateName } from '../../BackboneExtras/JavaScript/Backbone.View.DebugTemplateName';
import { backboneViewPageGeneratorImages } from '../../BackboneExtras/JavaScript/Backbone.View.PageGeneratorImages';
import { JSONObject } from '../../Utilities/JavaScript/Utils.Interfaces';
import { scBaseComponentPluginPostRender } from '../../SC/JavaScript/SC.BaseComponent.Plugin.PostRender';
import { scBaseComponentPluginRecollectCMSSelectorsGenerator } from '../../SC/JavaScript/SC.BaseComponent.Plugin.RecollectCMSSelectors';
import { SCBaseComponentChildViewsComponent } from '../../SC/JavaScript/SC.BaseComponent.ChildViewsComponent';
import { Configuration } from '../../Utilities/JavaScript/Configuration';

// @deprecated
interface CustomEventsHash {
    [selector: string]: true;
}

export interface EventsHash {
    [selector: string]: string | { (eventObject: JQuery.TriggeredEvent): void };
}

interface ChildViewSelector {
    [dataKey: string]: string;
}

type ClassView<TContext extends object, TEvents extends object> = new (...args: any[]) => View<
    TContext,
    TEvents
>;

export interface ChildViewGenerator<TContext extends object, TEvents extends object> {
    childViewIndex: number;
    childViewConstructor:
        | ((...args: any[]) => View<TContext, TEvents>)
        | ClassView<TContext, TEvents>;
    childViewInstance?: View<TContext, TEvents>;
    childViewSelector?: ChildViewSelector;
    childViewIsExternal?: boolean;
    $placeholder?: JQuery;
}

export interface ChildViewInstance {
    [instanceId: string]: ChildViewGenerator<object, object>;
}

export interface ChildViewInstances {
    [dataView: string]: ChildViewInstance;
}

export interface StaticChildViews {
    [containerName: string]:
        | ((...args: any[]) => View<object, object>)
        | ChildViewInstance
        | ClassView<object, object>;
}
export interface ChildViews {
    [containerName: string]: (tagDataAttr: { [key: string]: string }) => View<object, object>;
}

export interface ExtraContextProperty {
    [property: string]: {
        type: string | [];
        fn: (safeContext: any) => any;
    };
}

interface ElementData {
    [key: string]: string;
}

export type ContextDataMethod = () => any;

export interface ContextData {
    [key: string]: ContextDataMethod;
}

export abstract class View<
    TContext extends object,
    TEvents extends object = {}
> extends Backbone.View<TEvents> {
    protected static extraContextProperties: ExtraContextProperty;

    protected static childViews: StaticChildViews;

    protected static contextData: ContextData;

    private static isEventSelectorValid(eventSelector: string): boolean | null {
        const eventName = [
            'blur',
            'change',
            'click',
            'contextmenu',
            'dblclick',
            'error',
            'focus',
            'focusin',
            'focusout',
            'keydown',
            'keypress',
            'keyup',
            'load',
            'mousedown',
            'mousemove',
            'mouseout',
            'mouseover',
            'mouseup',
            'resize',
            'scroll',
            'select',
            'submit',
            'touchend',
            'touchmove',
            'touchstart',
            'unload'
        ];

        const eventSelectorStructureRe = /([a-zA-Z]+) \[data\-action="([^"]+)"\]/;
        const matches = eventSelectorStructureRe.exec(eventSelector);

        return matches && _.indexOf(eventName, matches[1]) >= 0 && !!matches[2].length;
    }

    // @deprecated
    protected static customEvents: CustomEventsHash = {};

    // @deprecated
    public static addExtraEventHandler(
        eventSelector: string,
        callback: (...args: any[]) => void
    ): void {
        let error: any = {};
        this.prototype.events = this.prototype.events || {};

        if (!this.isEventSelectorValid(eventSelector)) {
            error = new Error(
                'The specified eventSelector parameter does not respect the required format.'
            );
            error.name = 'INVALID_PARAM';
            throw error;
        }

        if (this.prototype.events[eventSelector]) {
            error = new Error('Duplicated event selector. Please specify a different one.');
            error.name = 'DUPLICATED_EVENT_SELECTOR';
            throw error;
        }

        this.prototype.events[eventSelector] = _.bind(callback, null);
        this.customEvents[eventSelector] = true;
    }

    // @deprecated
    public static removeExtraEventHandler(eventSelector: string): void {
        let error: any = {};
        this.prototype.events = this.prototype.events || {};

        if (!this.prototype.events[eventSelector] || !this.customEvents[eventSelector]) {
            error = new Error('The specified event selector does not exists or is not custom.');
            error.name = 'INVALID_PARAM';
            throw error;
        }

        delete this.prototype.events[eventSelector];
    }

    private static isDataTypeValid(dataType: string | []): boolean {
        const validDataTypes = ['number', 'string', 'object', 'array', 'boolean', 'null'];
        if (_.isString(dataType)) {
            return _.indexOf(validDataTypes, dataType) >= 0;
        }
        if (_.isArray(dataType)) {
            return !_.difference(dataType, validDataTypes).length;
        }
        return false;
    }

    // @deprecated
    public static addExtraContextProperty(
        propertyName: string,
        type: string | [],
        callback: () => any
    ): void {
        this.extraContextProperties = this.extraContextProperties || {};

        let error: Error;

        if (!this.isDataTypeValid(type)) {
            error = new Error(
                'Invalid data type. Please check the json-schema documentation for valid data types.'
            );
            error.name = 'INVALID_DATA_TYPE';
            throw error;
        }
        if (this.extraContextProperties[propertyName]) {
            error = new Error(
                'Duplicated propertyName. Trying to add more than one extra context property with the same name.'
            );
            error.name = 'DUPLICATED_CONTEXT_PROPERTY';
            throw error;
        }

        this.extraContextProperties[propertyName] = {
            type,
            fn: callback
        };
    }

    // @deprecated
    public static removeExtraContextProperty(propertyName: string): void {
        this.extraContextProperties = this.extraContextProperties || {};

        delete this.extraContextProperties[propertyName];
    }

    // @deprecated
    public static getContextData(): ContextData {
        this.contextData = this.contextData || {};

        return this.contextData;
    }

    // @deprecated
    public static setContextData(contextData: ContextData): void {
        this.contextData = { ...contextData, ...this.contextData };
    }

    private static normalizeChildView(containerName: string): void {
        const childViewConstructor = this.childViews[containerName];
        this.childViews[containerName] = {};

        this.childViews[containerName][containerName] = {
            childViewIndex: 10,
            childViewConstructor
        };
    }

    // @deprecated
    public static addChildViews(childViews: StaticChildViews): void {
        this.childViews = this.childViews || {};

        _.each(childViews, (childView, childViewContainer) => {
            if (this.childViews[childViewContainer]) {
                if (_.isFunction(this.childViews[childViewContainer])) {
                    this.normalizeChildView(childViewContainer);
                }
            } else {
                this.childViews[childViewContainer] = {};
            }

            if (_.isFunction(childView)) {
                this.childViews[childViewContainer][childViewContainer] = {
                    childViewIndex: 10,
                    childViewConstructor: childView
                };
            } else {
                _.each(childView, (childViewGenerator, childViewName) => {
                    this.childViews[childViewContainer][childViewName] = childViewGenerator;
                });
            }
        });
    }

    public constructor() {
        super();

        this.addChildViewInstances((<typeof View>this.constructor).childViews);
    }

    // @deprecated
    protected childViews: ChildViews = {};

    protected childViewInstances: ChildViewInstances = {};

    protected placehordersGlobalChildViewInstances: string[] = [];

    protected contextDataRequest: string[] = [];

    protected metaDescription: string = '';

    protected metaKeywords: string = '';

    protected addToHead: string = '';

    protected title: string = '';

    protected metaTags: string = '';

    protected contextData: ContextData = {};

    public attributes = { id: '', class: '' };

    public $containerModal: JQuery | null = null;

    public inModal: boolean = false;

    public events: EventsHash | null = null;

    public parentView: View<object, object> | null = null;

    public hasParent: boolean = false;

    public placeholderData: ElementData = {};

    protected getChildViews(): ChildViews {
        return this.childViews;
    }

    protected getEvents(): EventsHash | null {
        return this.events;
    }

    public getMetaDescription(): string {
        return this.metaDescription;
    }

    public setMetaDescription(metaDescription: string): void {
        this.metaDescription = metaDescription;
    }

    public getMetaKeywords(): string {
        return this.metaKeywords;
    }

    public setMetaKeywords(metaKeywords: string): void {
        this.metaKeywords = metaKeywords;
    }

    public getAddToHead(): string {
        return this.addToHead;
    }

    public setAddToHead(addToHead: string): void {
        this.addToHead = addToHead;
    }

    public getMetaTags(): JQuery {
        return jQuery('<head/>')
            .html(this.metaTags || '')
            .children('meta');
    }

    public setMetaTags(metaTags: string): void {
        this.metaTags = metaTags;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public getPageDescription(): string {
        return this.attributes ? this.attributes.id || this.attributes.class || '' : '';
    }

    public getCanonical(): string {
        const { history } = Backbone;
        const canonical = `${window.location.protocol}//${window.location.hostname}/${
            (<any>history).fragment
        }`;
        const indexOfQuery = canonical.indexOf('?');

        // !~ means: indexOf == -1
        return !~indexOfQuery ? canonical : canonical.substring(0, indexOfQuery);
    }

    public getRelPrev = jQuery.noop;

    public getRelNext = jQuery.noop;

    public abstract getContext(): TContext;

    public validateContextDataRequest(contextData: ContextData): boolean {
        return _.keys(contextData).length === this.contextDataRequest.length;
    }

    public getContextDataRequest(): string[] {
        return this.contextDataRequest.slice();
    }

    // @deprecated
    // only for internal use
    public setContextData(contextData: ContextData): void {
        this.contextData = { ...contextData, ...this.contextData };
    }

    public getTemplateContext(): TContext {
        const templateContext = this.getContext();

        const contextProperties = {
            ...(<typeof View>this.constructor).extraContextProperties,
            ...SCBaseComponentChildViewsComponent.getModifiedContextProperty(this)
        };

        if (!_.isEmpty(contextProperties)) {
            // Item key mapping? >> get item info using item key mapping
            // what about Model property?
            const safeContext = Utils.deepCopy(templateContext);

            _.each(contextProperties, (propertyGenerator, propertyName) => {
                templateContext[propertyName] = propertyGenerator.fn(safeContext);
            });
        }

        return templateContext;
    }

    public getTemplateName(): string {
        return (this.template && (<any>this.template).Name) || '';
    }

    private compileTemplate(): string {
        if (this.template && !_.isFunction(this.template)) {
            const templateName = `${this.template}`;
            this.template = Utils.requireModules(templateName);
        }
        if (typeof this.template === 'function') {
            const templateContext = this.getTemplateContext();
            let templateString = this.template(templateContext);
            templateString = backboneViewDebugTemplateName(templateString, this);
            templateString = backboneViewPageGeneratorImages(templateString);
            templateString = scBaseComponentPluginRecollectCMSSelectorsGenerator(
                templateString,
                this
            );
            templateString = scBaseComponentPluginPostRender(templateString, this);

            return templateString;
        }
        throw new Error('View template is not a function');
    }

    public getJsonLd(jsonLdResult: JSONObject): Promise<JSONObject> {
        return jQuery.Deferred().resolve(jsonLdResult);
    }

    public getViewJsonLd(): Promise<JSONObject> {
        if (Configuration.get('structureddatamarkup.type') !== 'JSON-LD') {
            return jQuery.Deferred().resolve(null);
        }

        const promises: Promise<JSONObject>[] = [];
        _.each(this.childViewInstances, function(child_views): void {
            _.each(child_views, function(generator): void {
                if (generator.childViewInstance) {
                    promises.push(generator.childViewInstance.getViewJsonLd());
                }
            });
        });

        return jQuery.when(...promises).then(
            (...jsonLds: JSONObject[]): Promise<JSONObject> => {
                let jsonLdResult: JSONObject = {};
                let resultPromise: Promise<JSONObject>;

                _.each(
                    jsonLds,
                    (jsonld: JSONObject): void => {
                        jsonLdResult = { ...jsonLdResult, ...Utils.deepCopy(jsonld) };
                    }
                );
                resultPromise = SCBaseComponentChildViewsComponent.getModifiedJsonLd(
                    this,
                    jsonLdResult
                ).then(
                    (result: JSONObject): JSONObject => {
                        return { ...result, ...jsonLdResult };
                    }
                );

                return resultPromise;
            }
        );
    }

    public render(): this {
        if (this.events) {
            this.undelegateEvents();
        }

        const templateString = this.compileTemplate();

        // Rendering: generating DOM from the HTML string
        const $tmpl =
            SC.ENVIRONMENT.jsEnvironment === 'server'
                ? jQuery('<div/>').append(templateString)
                : jQuery(templateString);

        this.$el.empty();

        // Appends/render the content HTML string to the view's element
        if (SC.ENVIRONMENT.jsEnvironment === 'server') {
            // If $el[0] doesn't exists it means that the ExtraChildView don't need to be shown on this page
            if (this.$el[0]) {
                // in page generator we append the content this way because of envjs bug.
                this.$el[0].innerHTML = $tmpl[0].innerHTML;
            }
        } else {
            this.$el.append($tmpl);
        }

        backboneViewApplyPermissions(this.$el);
        backboneViewBootstrap(this.$el, this);
        backboneViewDatePicker(this.$el, this);

        this.events = {
            ...SCBaseComponentChildViewsComponent.getModifiedEvents(this),
            ...this.getEvents()
        };

        this.delegateEvents();

        SCBaseComponentChildViewsComponent.applyModifiedChildViews(this);

        this.renderCompositeView();

        return this;
    }

    public destroy(softDestroy: boolean = false): void {
        SCBaseComponentChildViewsComponent.unregisterViewForPlaceholders(this);

        this.destroyCompositeView();

        if (this.$el) {
            // http://backbonejs.org/#View-undelegateEvents
            this.undelegateEvents();
        }

        this.stopListening();

        if (this.$el && softDestroy) {
            this.$el.empty();
        } else if (this.$el) {
            // http://backbonejs.org/#View-remove
            this.remove();
            // unbind all DOM events not just delegated ones
            this.$el.unbind();
        }
    }

    // COMPOSITE VIEW
    public removeChildViewInstance(
        containerName: string,
        childViewName: string,
        destroy?: boolean
    ): void {
        if (
            this.childViewInstances[containerName] &&
            this.childViewInstances[containerName][childViewName]
        ) {
            const { childViewInstance } = this.childViewInstances[containerName][childViewName];

            destroy && delete this.childViewInstances[containerName][childViewName];

            if (childViewInstance) {
                childViewInstance.$el.detach();
                childViewInstance.destroy(!destroy);
            }
        }
    }

    private destroyCompositeView(): void {
        _.each(this.childViewInstances, (container, containerName) => {
            _.each(container, (_generator, viewName) => {
                this.removeChildViewInstance(containerName, viewName);
            });
        });
    }

    public getChildViewInstance(
        containerName: string,
        childViewName?: string
    ): View<object, object> | undefined {
        childViewName = childViewName || containerName;

        return (
            this.childViewInstances[containerName] &&
            this.childViewInstances[containerName][childViewName] &&
            this.childViewInstances[containerName][childViewName].childViewInstance
        );
    }

    public getChildViewInstances(containerName: string): View<object, object>[] {
        const allChildViews: View<object, object>[] = [];

        if (containerName) {
            _.each(this.childViewInstances[containerName], childViewGenerator => {
                if (childViewGenerator.childViewInstance) {
                    allChildViews.push(childViewGenerator.childViewInstance);
                }
            });
        } else {
            _.each(this.childViewInstances, childViews => {
                _.each(childViews, childViewGenerator => {
                    if (childViewGenerator.childViewInstance) {
                        allChildViews.push(childViewGenerator.childViewInstance);
                    }
                });
            });
        }

        return allChildViews;
    }

    private setCustomTemplate(childView: View<object, object>): void {
        const templatePrefix = ['cell-', 'row-', 'child-', ''];

        _.each(templatePrefix, prefix => {
            const templateName = childView.placeholderData[`${prefix}template`];
            const originalTemplate = childView.template;

            const definitiveTemplateName = Utils.selectByViewportWidth(
                {
                    phone: childView.placeholderData[`${prefix}phoneTemplate`], // remember that data-phone-template get's converted in phoneTemplate when we use jQuery.data()
                    tablet: childView.placeholderData[`${prefix}tabletTemplate`],
                    desktop: templateName
                },
                templateName
            );

            if (definitiveTemplateName) {
                // IMPORTANT: we are require()ing the template dynamically! In order to this to work, the template should
                // be ALREADY loaded and this is automatically handled at build time by gulp template
                childView[prefix ? `${prefix}Template` : 'template'] = Utils.requireModules(
                    `${definitiveTemplateName}.tpl`
                );
            } else {
                childView[prefix ? `${prefix}Template` : 'template'] = originalTemplate;
            }
        });
    }

    private finishRender(childView: View<object, object>, $placeholder: JQuery): void {
        // HEADS UP! we use the placeholder as the children view's container element ($el)
        childView.$el = $placeholder;

        // keep the placeholder classes
        const placeholderClass = $placeholder.attr('class');
        childView.className = `${childView.className || ''} ${placeholderClass || ''}`;

        childView.render();
    }

    public setChildViewIndex(
        containerName: string,
        viewName: string,
        index: number,
        render: boolean
    ): void {
        if (
            this.childViewInstances[containerName] &&
            this.childViewInstances[containerName][viewName]
        ) {
            this.childViewInstances[containerName][viewName].childViewIndex = index;

            if (render) {
                this.render();
            }
        }
    }

    // ie: contexts = ['item', 'order']
    public getContextData(contexts?: string[]): ContextData {
        if (contexts) {
            const contextData = {};
            let i = contexts.length;

            while (i--) {
                const selfContextData: ContextData = {
                    ...SCBaseComponentChildViewsComponent.getModifiedContext(this),
                    ...this.contextData,
                    ...(<typeof View>this.constructor).contextData
                };

                if (selfContextData[contexts[i]]) {
                    contextData[contexts[i]] = _.bind(selfContextData[contexts[i]], this);
                    contexts.splice(i, 1);
                }
            }

            if (contexts.length && this.parentView) {
                return { ...this.parentView.getContextData(contexts), ...contextData };
            }

            return contextData;
        }

        return this.contextData;
    }

    private renderChildViewInstance(
        childViewInstance: View<object, object> | null,
        placeholder: JQuery,
        numberViews: number,
        isExternal: boolean
    ): void {
        if (childViewInstance) {
            this.setCustomTemplate(childViewInstance);

            if (numberViews === 1 && !isExternal) {
                this.finishRender(childViewInstance, placeholder);
            } else {
                childViewInstance.render();
                placeholder.append(childViewInstance.$el);
            }
        }
    }

    private getPlaceholder(selector?: ChildViewSelector): string {
        let placeholder = '';

        if (selector) {
            _.each(selector, (value, key) => {
                placeholder += `[${key}="${value}"]`;
            });
        }

        return placeholder;
    }

    private renderChildViewContainer(containerName: string, createChild?: boolean): void {
        const generators = _.values(this.childViewInstances[containerName]);

        generators.sort((a, b) => {
            return a.childViewIndex - b.childViewIndex;
        });

        _.each(generators, generator => {
            if (createChild) {
                this.createChildViewInstance(generator);
            }

            if (!generator.$placeholder) {
                const placeholder = this.getPlaceholder(generator.childViewSelector);

                generator.$placeholder = this.$(placeholder);
            }

            this.renderChildViewInstance(
                generator.childViewInstance || null,
                generator.$placeholder,
                generators.length,
                generator.childViewIsExternal || false
            );
        });
    }

    private createChildViewInstance(
        generator: ChildViewGenerator<object, object>,
        elementData = {}
    ): View<object, object> | undefined {
        elementData = elementData || {};

        const options = _.extend({}, elementData);

        if (generator.childViewInstance) {
            generator.childViewInstance.destroy();
        }

        if ((<any>generator.childViewConstructor).extend === (<any>View).extend) {
            // special case of 'Some.View': SomeView
            // generator.childViewInstance = new generator.childViewConstructor(options);
            const constructor = generator.childViewConstructor as ClassView<object, object>;
            generator.childViewInstance = generator.childViewIsExternal
                ? new constructor()
                : new constructor(options);
        } else {
            // common case 'Some.View': function() { ... }
            const constructor = generator.childViewConstructor as (<
                TContext extends object,
                TEvents extends object
            >(
                ...args: any[]
            ) => View<TContext, TEvents>);
            generator.childViewInstance = generator.childViewIsExternal
                ? constructor.call(null)
                : constructor.call(this, options);

            if (_.isFunction(generator.childViewInstance)) {
                generator.childViewInstance = generator.childViewInstance();
            }
        }

        if (generator.childViewInstance) {
            if (!generator.childViewIsExternal || generator.childViewInstance.parentView) {
                generator.childViewInstance.parentView = generator.childViewIsExternal
                    ? this
                    : generator.childViewInstance.parentView || this;
                generator.childViewInstance.hasParent = true;
            }

            const contextDataRequest = generator.childViewInstance.getContextDataRequest();

            let contextData = {};

            if (contextDataRequest.length) {
                contextData = this.getContextData(contextDataRequest);

                if (!generator.childViewInstance.validateContextDataRequest(contextData)) {
                    console.error(
                        'Requested context data is not valid for this child view instance.'
                    );

                    generator.childViewInstance = undefined;

                    return generator.childViewInstance;
                }
            }

            generator.childViewInstance.setContextData(contextData);
            generator.childViewInstance.placeholderData = elementData || {};

            if (
                !(
                    generator.childViewInstance.attributes &&
                    generator.childViewInstance.attributes['data-root-component-id']
                )
            ) {
                generator.childViewInstance.attributes = generator.childViewInstance.attributes || {
                    id: '',
                    class: ''
                };
                generator.childViewInstance.attributes['data-root-component-id'] =
                    (this.attributes && this.attributes['data-root-component-id']) || '';
            }

            this.setCustomTemplate(generator.childViewInstance);
        }

        return generator.childViewInstance;
    }

    // @deprecated
    public renderChild(elementOrViewName: string | HTMLElement): View<object, object> | undefined {
        let viewName: string;

        if (typeof elementOrViewName !== 'string') {
            viewName = jQuery(elementOrViewName).data('view');
        } else {
            viewName = elementOrViewName;
        }

        if (viewName) {
            _.each(this.childViewInstances[viewName], generator => {
                if (generator.childViewInstance) {
                    generator.childViewInstance.destroy(true);
                    generator.childViewInstance = null;
                }
            });

            this.renderChildViewContainer(viewName, true);
        }

        return this.getChildViewInstance(viewName);
    }

    private renderCompositeView(): void {
        _.each(this.childViewInstances, (_childViews, containerName) => {
            this.$el.find(`[data-cms-area="${containerName}"]`).html('');
        });

        this.addChildViewInstances(this.getChildViews());
        this.createChildViewInstances();
        this.renderChildViewInstances();
    }

    private createChildViewInstances(): void {
        _.each(this.childViewInstances, (childViews: ChildViewInstance) => {
            _.each(childViews, generator => {
                const placeholder = this.getPlaceholder(generator.childViewSelector);
                const $element = this.$(placeholder);

                if ($element.length) {
                    generator.$placeholder = $element;

                    if (generator.childViewConstructor) {
                        this.createChildViewInstance(generator, $element.data());
                    }
                }
            });
        });
    }

    private renderChildViewInstances(): void {
        _.each(this.childViewInstances, (_childViews, containerName) => {
            this.renderChildViewContainer(containerName);
        });
    }

    public addChildViewInstances(childViews: StaticChildViews, render: boolean = false): void {
        if (!this.childViewInstances) {
            this.childViewInstances = {};
        }

        _.each(childViews, (childView, childViewContainer) => {
            const isCMS = childViewContainer.indexOf('cms:') === 0;

            childViewContainer = childViewContainer.replace('cms:', '');

            if (!this.childViewInstances[childViewContainer]) {
                this.childViewInstances[childViewContainer] = {};
            }

            const childViewSelector: ChildViewSelector = isCMS
                ? { 'data-cms-area': childViewContainer }
                : { 'data-view': childViewContainer };

            if (_.isFunction(childView)) {
                const generator = this.childViewInstances[childViewContainer][childViewContainer];

                if (generator && generator.childViewInstance) {
                    generator.childViewInstance.destroy();
                }

                this.childViewInstances[childViewContainer][childViewContainer] = {
                    childViewIndex: 10,
                    childViewConstructor: childView,
                    childViewSelector
                };
            } else {
                _.each(childView, (childViewGenerator, childViewName) => {
                    const generator = this.childViewInstances[childViewContainer][childViewName];

                    if (generator && generator.childViewInstance) {
                        generator.childViewInstance.destroy();
                    }

                    this.childViewInstances[childViewContainer][childViewName] = {
                        childViewIndex: childViewGenerator.childViewIndex || 10,
                        childViewConstructor: childViewGenerator.childViewConstructor,
                        childViewInstance: childViewGenerator.childViewInstance,
                        childViewSelector:
                            childViewGenerator.childViewSelector || childViewSelector,
                        childViewIsExternal: childViewGenerator.childViewIsExternal
                    };

                    if (childViewGenerator.childViewInstance) {
                        const placeholder = this.getPlaceholder(
                            childViewGenerator.childViewSelector
                        );

                        if (
                            !childViewGenerator.childViewIsExternal ||
                            childViewGenerator.childViewInstance.parentView
                        ) {
                            childViewGenerator.childViewInstance.parentView = childViewGenerator.childViewIsExternal
                                ? this
                                : childViewGenerator.childViewInstance.parentView || this;
                            childViewGenerator.childViewInstance.hasParent = true;
                        }

                        childViewGenerator.childViewInstance.placeholderData =
                            this.$(placeholder).data() || {};

                        if (
                            !(
                                childViewGenerator.childViewInstance.attributes &&
                                childViewGenerator.childViewInstance.attributes[
                                    'data-root-component-id'
                                ]
                            )
                        ) {
                            childViewGenerator.childViewInstance.attributes = childViewGenerator
                                .childViewInstance.attributes || {
                                id: '',
                                class: ''
                            };
                            childViewGenerator.childViewInstance.attributes[
                                'data-root-component-id'
                            ] =
                                (this.attributes && this.attributes['data-root-component-id']) ||
                                '';
                        }

                        this.setCustomTemplate(childViewGenerator.childViewInstance);
                    }
                });
            }

            if (render) {
                this.renderChildViewContainer(childViewContainer);
            }
        });
    }

    public updateChildViewInstances(childViews: ChildViewInstances, render: boolean): void {
        _.each(childViews, (childView, containerName) => {
            _.each(childView, (_generator, childViewName) => {
                this.removeChildViewInstance(containerName, childViewName);
            });
        });

        this.addChildViewInstances(childViews, render);
    }
}
