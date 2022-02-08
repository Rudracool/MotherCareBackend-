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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("View", ["require", "exports", "underscore", "BackboneExtras", "Utils", "JQueryExtras", "Backbone.View.ApplyPermissions", "Backbone.View.Bootstrap", "Backbone.View.DatePicker", "Backbone.View.DebugTemplateName", "Backbone.View.PageGeneratorImages", "SC.BaseComponent.Plugin.PostRender", "SC.BaseComponent.Plugin.RecollectCMSSelectors", "SC.BaseComponent.ChildViewsComponent", "Configuration"], function (require, exports, _, Backbone, Utils, JQueryExtras_1, Backbone_View_ApplyPermissions_1, Backbone_View_Bootstrap_1, Backbone_View_DatePicker_1, Backbone_View_DebugTemplateName_1, Backbone_View_PageGeneratorImages_1, SC_BaseComponent_Plugin_PostRender_1, SC_BaseComponent_Plugin_RecollectCMSSelectors_1, SC_BaseComponent_ChildViewsComponent_1, Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var View = /** @class */ (function (_super) {
        __extends(View, _super);
        function View() {
            var _this = _super.call(this) || this;
            // @deprecated
            _this.childViews = {};
            _this.childViewInstances = {};
            _this.placehordersGlobalChildViewInstances = [];
            _this.contextDataRequest = [];
            _this.metaDescription = '';
            _this.metaKeywords = '';
            _this.addToHead = '';
            _this.title = '';
            _this.metaTags = '';
            _this.contextData = {};
            _this.attributes = { id: '', class: '' };
            _this.$containerModal = null;
            _this.inModal = false;
            _this.events = null;
            _this.parentView = null;
            _this.hasParent = false;
            _this.placeholderData = {};
            _this.getRelPrev = JQueryExtras_1.jQuery.noop;
            _this.getRelNext = JQueryExtras_1.jQuery.noop;
            _this.addChildViewInstances(_this.constructor.childViews);
            return _this;
        }
        View.isEventSelectorValid = function (eventSelector) {
            var eventName = [
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
            var eventSelectorStructureRe = /([a-zA-Z]+) \[data\-action="([^"]+)"\]/;
            var matches = eventSelectorStructureRe.exec(eventSelector);
            return matches && _.indexOf(eventName, matches[1]) >= 0 && !!matches[2].length;
        };
        // @deprecated
        View.addExtraEventHandler = function (eventSelector, callback) {
            var error = {};
            this.prototype.events = this.prototype.events || {};
            if (!this.isEventSelectorValid(eventSelector)) {
                error = new Error('The specified eventSelector parameter does not respect the required format.');
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
        };
        // @deprecated
        View.removeExtraEventHandler = function (eventSelector) {
            var error = {};
            this.prototype.events = this.prototype.events || {};
            if (!this.prototype.events[eventSelector] || !this.customEvents[eventSelector]) {
                error = new Error('The specified event selector does not exists or is not custom.');
                error.name = 'INVALID_PARAM';
                throw error;
            }
            delete this.prototype.events[eventSelector];
        };
        View.isDataTypeValid = function (dataType) {
            var validDataTypes = ['number', 'string', 'object', 'array', 'boolean', 'null'];
            if (_.isString(dataType)) {
                return _.indexOf(validDataTypes, dataType) >= 0;
            }
            if (_.isArray(dataType)) {
                return !_.difference(dataType, validDataTypes).length;
            }
            return false;
        };
        // @deprecated
        View.addExtraContextProperty = function (propertyName, type, callback) {
            this.extraContextProperties = this.extraContextProperties || {};
            var error;
            if (!this.isDataTypeValid(type)) {
                error = new Error('Invalid data type. Please check the json-schema documentation for valid data types.');
                error.name = 'INVALID_DATA_TYPE';
                throw error;
            }
            if (this.extraContextProperties[propertyName]) {
                error = new Error('Duplicated propertyName. Trying to add more than one extra context property with the same name.');
                error.name = 'DUPLICATED_CONTEXT_PROPERTY';
                throw error;
            }
            this.extraContextProperties[propertyName] = {
                type: type,
                fn: callback
            };
        };
        // @deprecated
        View.removeExtraContextProperty = function (propertyName) {
            this.extraContextProperties = this.extraContextProperties || {};
            delete this.extraContextProperties[propertyName];
        };
        // @deprecated
        View.getContextData = function () {
            this.contextData = this.contextData || {};
            return this.contextData;
        };
        // @deprecated
        View.setContextData = function (contextData) {
            this.contextData = __assign({}, contextData, this.contextData);
        };
        View.normalizeChildView = function (containerName) {
            var childViewConstructor = this.childViews[containerName];
            this.childViews[containerName] = {};
            this.childViews[containerName][containerName] = {
                childViewIndex: 10,
                childViewConstructor: childViewConstructor
            };
        };
        // @deprecated
        View.addChildViews = function (childViews) {
            var _this = this;
            this.childViews = this.childViews || {};
            _.each(childViews, function (childView, childViewContainer) {
                if (_this.childViews[childViewContainer]) {
                    if (_.isFunction(_this.childViews[childViewContainer])) {
                        _this.normalizeChildView(childViewContainer);
                    }
                }
                else {
                    _this.childViews[childViewContainer] = {};
                }
                if (_.isFunction(childView)) {
                    _this.childViews[childViewContainer][childViewContainer] = {
                        childViewIndex: 10,
                        childViewConstructor: childView
                    };
                }
                else {
                    _.each(childView, function (childViewGenerator, childViewName) {
                        _this.childViews[childViewContainer][childViewName] = childViewGenerator;
                    });
                }
            });
        };
        View.prototype.getChildViews = function () {
            return this.childViews;
        };
        View.prototype.getEvents = function () {
            return this.events;
        };
        View.prototype.getMetaDescription = function () {
            return this.metaDescription;
        };
        View.prototype.setMetaDescription = function (metaDescription) {
            this.metaDescription = metaDescription;
        };
        View.prototype.getMetaKeywords = function () {
            return this.metaKeywords;
        };
        View.prototype.setMetaKeywords = function (metaKeywords) {
            this.metaKeywords = metaKeywords;
        };
        View.prototype.getAddToHead = function () {
            return this.addToHead;
        };
        View.prototype.setAddToHead = function (addToHead) {
            this.addToHead = addToHead;
        };
        View.prototype.getMetaTags = function () {
            return JQueryExtras_1.jQuery('<head/>')
                .html(this.metaTags || '')
                .children('meta');
        };
        View.prototype.setMetaTags = function (metaTags) {
            this.metaTags = metaTags;
        };
        View.prototype.getTitle = function () {
            return this.title;
        };
        View.prototype.setTitle = function (title) {
            this.title = title;
        };
        View.prototype.getPageDescription = function () {
            return this.attributes ? this.attributes.id || this.attributes.class || '' : '';
        };
        View.prototype.getCanonical = function () {
            var history = Backbone.history;
            var canonical = window.location.protocol + "//" + window.location.hostname + "/" + history.fragment;
            var indexOfQuery = canonical.indexOf('?');
            // !~ means: indexOf == -1
            return !~indexOfQuery ? canonical : canonical.substring(0, indexOfQuery);
        };
        View.prototype.validateContextDataRequest = function (contextData) {
            return _.keys(contextData).length === this.contextDataRequest.length;
        };
        View.prototype.getContextDataRequest = function () {
            return this.contextDataRequest.slice();
        };
        // @deprecated
        // only for internal use
        View.prototype.setContextData = function (contextData) {
            this.contextData = __assign({}, contextData, this.contextData);
        };
        View.prototype.getTemplateContext = function () {
            var templateContext = this.getContext();
            var contextProperties = __assign({}, this.constructor.extraContextProperties, SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getModifiedContextProperty(this));
            if (!_.isEmpty(contextProperties)) {
                // Item key mapping? >> get item info using item key mapping
                // what about Model property?
                var safeContext_1 = Utils.deepCopy(templateContext);
                _.each(contextProperties, function (propertyGenerator, propertyName) {
                    templateContext[propertyName] = propertyGenerator.fn(safeContext_1);
                });
            }
            return templateContext;
        };
        View.prototype.getTemplateName = function () {
            return (this.template && this.template.Name) || '';
        };
        View.prototype.compileTemplate = function () {
            if (this.template && !_.isFunction(this.template)) {
                var templateName = "" + this.template;
                this.template = Utils.requireModules(templateName);
            }
            if (typeof this.template === 'function') {
                var templateContext = this.getTemplateContext();
                var templateString = this.template(templateContext);
                templateString = Backbone_View_DebugTemplateName_1.backboneViewDebugTemplateName(templateString, this);
                templateString = Backbone_View_PageGeneratorImages_1.backboneViewPageGeneratorImages(templateString);
                templateString = SC_BaseComponent_Plugin_RecollectCMSSelectors_1.scBaseComponentPluginRecollectCMSSelectorsGenerator(templateString, this);
                templateString = SC_BaseComponent_Plugin_PostRender_1.scBaseComponentPluginPostRender(templateString, this);
                return templateString;
            }
            throw new Error('View template is not a function');
        };
        View.prototype.getJsonLd = function (jsonLdResult) {
            return JQueryExtras_1.jQuery.Deferred().resolve(jsonLdResult);
        };
        View.prototype.getViewJsonLd = function () {
            var _this = this;
            if (Configuration_1.Configuration.get('structureddatamarkup.type') !== 'JSON-LD') {
                return JQueryExtras_1.jQuery.Deferred().resolve(null);
            }
            var promises = [];
            _.each(this.childViewInstances, function (child_views) {
                _.each(child_views, function (generator) {
                    if (generator.childViewInstance) {
                        promises.push(generator.childViewInstance.getViewJsonLd());
                    }
                });
            });
            return JQueryExtras_1.jQuery.when.apply(JQueryExtras_1.jQuery, promises).then(function () {
                var jsonLds = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    jsonLds[_i] = arguments[_i];
                }
                var jsonLdResult = {};
                var resultPromise;
                _.each(jsonLds, function (jsonld) {
                    jsonLdResult = __assign({}, jsonLdResult, Utils.deepCopy(jsonld));
                });
                resultPromise = SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getModifiedJsonLd(_this, jsonLdResult).then(function (result) {
                    return __assign({}, result, jsonLdResult);
                });
                return resultPromise;
            });
        };
        View.prototype.render = function () {
            if (this.events) {
                this.undelegateEvents();
            }
            var templateString = this.compileTemplate();
            // Rendering: generating DOM from the HTML string
            var $tmpl = SC.ENVIRONMENT.jsEnvironment === 'server'
                ? JQueryExtras_1.jQuery('<div/>').append(templateString)
                : JQueryExtras_1.jQuery(templateString);
            this.$el.empty();
            // Appends/render the content HTML string to the view's element
            if (SC.ENVIRONMENT.jsEnvironment === 'server') {
                // If $el[0] doesn't exists it means that the ExtraChildView don't need to be shown on this page
                if (this.$el[0]) {
                    // in page generator we append the content this way because of envjs bug.
                    this.$el[0].innerHTML = $tmpl[0].innerHTML;
                }
            }
            else {
                this.$el.append($tmpl);
            }
            Backbone_View_ApplyPermissions_1.backboneViewApplyPermissions(this.$el);
            Backbone_View_Bootstrap_1.backboneViewBootstrap(this.$el, this);
            Backbone_View_DatePicker_1.backboneViewDatePicker(this.$el, this);
            this.events = __assign({}, SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getModifiedEvents(this), this.getEvents());
            this.delegateEvents();
            SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.applyModifiedChildViews(this);
            this.renderCompositeView();
            return this;
        };
        View.prototype.destroy = function (softDestroy) {
            if (softDestroy === void 0) { softDestroy = false; }
            SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.unregisterViewForPlaceholders(this);
            this.destroyCompositeView();
            if (this.$el) {
                // http://backbonejs.org/#View-undelegateEvents
                this.undelegateEvents();
            }
            this.stopListening();
            if (this.$el && softDestroy) {
                this.$el.empty();
            }
            else if (this.$el) {
                // http://backbonejs.org/#View-remove
                this.remove();
                // unbind all DOM events not just delegated ones
                this.$el.unbind();
            }
        };
        // COMPOSITE VIEW
        View.prototype.removeChildViewInstance = function (containerName, childViewName, destroy) {
            if (this.childViewInstances[containerName] &&
                this.childViewInstances[containerName][childViewName]) {
                var childViewInstance = this.childViewInstances[containerName][childViewName].childViewInstance;
                destroy && delete this.childViewInstances[containerName][childViewName];
                if (childViewInstance) {
                    childViewInstance.$el.detach();
                    childViewInstance.destroy(!destroy);
                }
            }
        };
        View.prototype.destroyCompositeView = function () {
            var _this = this;
            _.each(this.childViewInstances, function (container, containerName) {
                _.each(container, function (_generator, viewName) {
                    _this.removeChildViewInstance(containerName, viewName);
                });
            });
        };
        View.prototype.getChildViewInstance = function (containerName, childViewName) {
            childViewName = childViewName || containerName;
            return (this.childViewInstances[containerName] &&
                this.childViewInstances[containerName][childViewName] &&
                this.childViewInstances[containerName][childViewName].childViewInstance);
        };
        View.prototype.getChildViewInstances = function (containerName) {
            var allChildViews = [];
            if (containerName) {
                _.each(this.childViewInstances[containerName], function (childViewGenerator) {
                    if (childViewGenerator.childViewInstance) {
                        allChildViews.push(childViewGenerator.childViewInstance);
                    }
                });
            }
            else {
                _.each(this.childViewInstances, function (childViews) {
                    _.each(childViews, function (childViewGenerator) {
                        if (childViewGenerator.childViewInstance) {
                            allChildViews.push(childViewGenerator.childViewInstance);
                        }
                    });
                });
            }
            return allChildViews;
        };
        View.prototype.setCustomTemplate = function (childView) {
            var templatePrefix = ['cell-', 'row-', 'child-', ''];
            _.each(templatePrefix, function (prefix) {
                var templateName = childView.placeholderData[prefix + "template"];
                var originalTemplate = childView.template;
                var definitiveTemplateName = Utils.selectByViewportWidth({
                    phone: childView.placeholderData[prefix + "phoneTemplate"],
                    tablet: childView.placeholderData[prefix + "tabletTemplate"],
                    desktop: templateName
                }, templateName);
                if (definitiveTemplateName) {
                    // IMPORTANT: we are require()ing the template dynamically! In order to this to work, the template should
                    // be ALREADY loaded and this is automatically handled at build time by gulp template
                    childView[prefix ? prefix + "Template" : 'template'] = Utils.requireModules(definitiveTemplateName + ".tpl");
                }
                else {
                    childView[prefix ? prefix + "Template" : 'template'] = originalTemplate;
                }
            });
        };
        View.prototype.finishRender = function (childView, $placeholder) {
            // HEADS UP! we use the placeholder as the children view's container element ($el)
            childView.$el = $placeholder;
            // keep the placeholder classes
            var placeholderClass = $placeholder.attr('class');
            childView.className = (childView.className || '') + " " + (placeholderClass || '');
            childView.render();
        };
        View.prototype.setChildViewIndex = function (containerName, viewName, index, render) {
            if (this.childViewInstances[containerName] &&
                this.childViewInstances[containerName][viewName]) {
                this.childViewInstances[containerName][viewName].childViewIndex = index;
                if (render) {
                    this.render();
                }
            }
        };
        // ie: contexts = ['item', 'order']
        View.prototype.getContextData = function (contexts) {
            if (contexts) {
                var contextData = {};
                var i = contexts.length;
                while (i--) {
                    var selfContextData = __assign({}, SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getModifiedContext(this), this.contextData, this.constructor.contextData);
                    if (selfContextData[contexts[i]]) {
                        contextData[contexts[i]] = _.bind(selfContextData[contexts[i]], this);
                        contexts.splice(i, 1);
                    }
                }
                if (contexts.length && this.parentView) {
                    return __assign({}, this.parentView.getContextData(contexts), contextData);
                }
                return contextData;
            }
            return this.contextData;
        };
        View.prototype.renderChildViewInstance = function (childViewInstance, placeholder, numberViews, isExternal) {
            if (childViewInstance) {
                this.setCustomTemplate(childViewInstance);
                if (numberViews === 1 && !isExternal) {
                    this.finishRender(childViewInstance, placeholder);
                }
                else {
                    childViewInstance.render();
                    placeholder.append(childViewInstance.$el);
                }
            }
        };
        View.prototype.getPlaceholder = function (selector) {
            var placeholder = '';
            if (selector) {
                _.each(selector, function (value, key) {
                    placeholder += "[" + key + "=\"" + value + "\"]";
                });
            }
            return placeholder;
        };
        View.prototype.renderChildViewContainer = function (containerName, createChild) {
            var _this = this;
            var generators = _.values(this.childViewInstances[containerName]);
            generators.sort(function (a, b) {
                return a.childViewIndex - b.childViewIndex;
            });
            _.each(generators, function (generator) {
                if (createChild) {
                    _this.createChildViewInstance(generator);
                }
                if (!generator.$placeholder) {
                    var placeholder = _this.getPlaceholder(generator.childViewSelector);
                    generator.$placeholder = _this.$(placeholder);
                }
                _this.renderChildViewInstance(generator.childViewInstance || null, generator.$placeholder, generators.length, generator.childViewIsExternal || false);
            });
        };
        View.prototype.createChildViewInstance = function (generator, elementData) {
            if (elementData === void 0) { elementData = {}; }
            elementData = elementData || {};
            var options = _.extend({}, elementData);
            if (generator.childViewInstance) {
                generator.childViewInstance.destroy();
            }
            if (generator.childViewConstructor.extend === View.extend) {
                // special case of 'Some.View': SomeView
                // generator.childViewInstance = new generator.childViewConstructor(options);
                var constructor = generator.childViewConstructor;
                generator.childViewInstance = generator.childViewIsExternal
                    ? new constructor()
                    : new constructor(options);
            }
            else {
                // common case 'Some.View': function() { ... }
                var constructor = generator.childViewConstructor;
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
                var contextDataRequest = generator.childViewInstance.getContextDataRequest();
                var contextData = {};
                if (contextDataRequest.length) {
                    contextData = this.getContextData(contextDataRequest);
                    if (!generator.childViewInstance.validateContextDataRequest(contextData)) {
                        console.error('Requested context data is not valid for this child view instance.');
                        generator.childViewInstance = undefined;
                        return generator.childViewInstance;
                    }
                }
                generator.childViewInstance.setContextData(contextData);
                generator.childViewInstance.placeholderData = elementData || {};
                if (!(generator.childViewInstance.attributes &&
                    generator.childViewInstance.attributes['data-root-component-id'])) {
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
        };
        // @deprecated
        View.prototype.renderChild = function (elementOrViewName) {
            var viewName;
            if (typeof elementOrViewName !== 'string') {
                viewName = JQueryExtras_1.jQuery(elementOrViewName).data('view');
            }
            else {
                viewName = elementOrViewName;
            }
            if (viewName) {
                _.each(this.childViewInstances[viewName], function (generator) {
                    if (generator.childViewInstance) {
                        generator.childViewInstance.destroy(true);
                        generator.childViewInstance = null;
                    }
                });
                this.renderChildViewContainer(viewName, true);
            }
            return this.getChildViewInstance(viewName);
        };
        View.prototype.renderCompositeView = function () {
            var _this = this;
            _.each(this.childViewInstances, function (_childViews, containerName) {
                _this.$el.find("[data-cms-area=\"" + containerName + "\"]").html('');
            });
            this.addChildViewInstances(this.getChildViews());
            this.createChildViewInstances();
            this.renderChildViewInstances();
        };
        View.prototype.createChildViewInstances = function () {
            var _this = this;
            _.each(this.childViewInstances, function (childViews) {
                _.each(childViews, function (generator) {
                    var placeholder = _this.getPlaceholder(generator.childViewSelector);
                    var $element = _this.$(placeholder);
                    if ($element.length) {
                        generator.$placeholder = $element;
                        if (generator.childViewConstructor) {
                            _this.createChildViewInstance(generator, $element.data());
                        }
                    }
                });
            });
        };
        View.prototype.renderChildViewInstances = function () {
            var _this = this;
            _.each(this.childViewInstances, function (_childViews, containerName) {
                _this.renderChildViewContainer(containerName);
            });
        };
        View.prototype.addChildViewInstances = function (childViews, render) {
            var _this = this;
            if (render === void 0) { render = false; }
            if (!this.childViewInstances) {
                this.childViewInstances = {};
            }
            _.each(childViews, function (childView, childViewContainer) {
                var isCMS = childViewContainer.indexOf('cms:') === 0;
                childViewContainer = childViewContainer.replace('cms:', '');
                if (!_this.childViewInstances[childViewContainer]) {
                    _this.childViewInstances[childViewContainer] = {};
                }
                var childViewSelector = isCMS
                    ? { 'data-cms-area': childViewContainer }
                    : { 'data-view': childViewContainer };
                if (_.isFunction(childView)) {
                    var generator = _this.childViewInstances[childViewContainer][childViewContainer];
                    if (generator && generator.childViewInstance) {
                        generator.childViewInstance.destroy();
                    }
                    _this.childViewInstances[childViewContainer][childViewContainer] = {
                        childViewIndex: 10,
                        childViewConstructor: childView,
                        childViewSelector: childViewSelector
                    };
                }
                else {
                    _.each(childView, function (childViewGenerator, childViewName) {
                        var generator = _this.childViewInstances[childViewContainer][childViewName];
                        if (generator && generator.childViewInstance) {
                            generator.childViewInstance.destroy();
                        }
                        _this.childViewInstances[childViewContainer][childViewName] = {
                            childViewIndex: childViewGenerator.childViewIndex || 10,
                            childViewConstructor: childViewGenerator.childViewConstructor,
                            childViewInstance: childViewGenerator.childViewInstance,
                            childViewSelector: childViewGenerator.childViewSelector || childViewSelector,
                            childViewIsExternal: childViewGenerator.childViewIsExternal
                        };
                        if (childViewGenerator.childViewInstance) {
                            var placeholder = _this.getPlaceholder(childViewGenerator.childViewSelector);
                            if (!childViewGenerator.childViewIsExternal ||
                                childViewGenerator.childViewInstance.parentView) {
                                childViewGenerator.childViewInstance.parentView = childViewGenerator.childViewIsExternal
                                    ? _this
                                    : childViewGenerator.childViewInstance.parentView || _this;
                                childViewGenerator.childViewInstance.hasParent = true;
                            }
                            childViewGenerator.childViewInstance.placeholderData =
                                _this.$(placeholder).data() || {};
                            if (!(childViewGenerator.childViewInstance.attributes &&
                                childViewGenerator.childViewInstance.attributes['data-root-component-id'])) {
                                childViewGenerator.childViewInstance.attributes = childViewGenerator
                                    .childViewInstance.attributes || {
                                    id: '',
                                    class: ''
                                };
                                childViewGenerator.childViewInstance.attributes['data-root-component-id'] =
                                    (_this.attributes && _this.attributes['data-root-component-id']) ||
                                        '';
                            }
                            _this.setCustomTemplate(childViewGenerator.childViewInstance);
                        }
                    });
                }
                if (render) {
                    _this.renderChildViewContainer(childViewContainer);
                }
            });
        };
        View.prototype.updateChildViewInstances = function (childViews, render) {
            var _this = this;
            _.each(childViews, function (childView, containerName) {
                _.each(childView, function (_generator, childViewName) {
                    _this.removeChildViewInstance(containerName, childViewName);
                });
            });
            this.addChildViewInstances(childViews, render);
        };
        // @deprecated
        View.customEvents = {};
        return View;
    }(Backbone.View));
    exports.View = View;
});

//# sourceMappingURL=View.js.map
