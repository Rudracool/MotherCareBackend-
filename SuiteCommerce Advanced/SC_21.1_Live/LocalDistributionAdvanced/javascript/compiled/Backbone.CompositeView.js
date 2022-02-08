/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
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
define("Backbone.CompositeView", ["require", "exports", "underscore", "Utils", "jQuery", "Configuration", "SC.BaseComponent.ChildViewsComponent", "Backbone.View", "PluginContainer"], function (require, exports, _, Utils, jQuery, Configuration_1, SC_BaseComponent_ChildViewsComponent_1, BackboneView, PluginContainer) {
    "use strict";
    var compositeView = {
        // @method destroyCompositeView Destroy all the child view instancesƒ
        destroyCompositeView: function destroyCompositeView() {
            var self = this;
            _(this.childViewInstances).each(function (container, container_name) {
                _.each(container, function (generator, view_name) {
                    self.removeChildViewInstance(container_name, view_name);
                });
            });
        },
        // @method renderChild Creates and render a childView
        // @param {DOM|String}elementOrViewName The DOM element or the name of the childView
        // @return {Backbone.View}
        // @deprecated
        renderChild: function renderChild(elementOrViewName) {
            if (typeof elementOrViewName !== 'string') {
                elementOrViewName = jQuery(elementOrViewName).data('view');
            }
            if (elementOrViewName) {
                var generators = _.values(this.childViewInstances[elementOrViewName]);
                _.each(generators, function (generator) {
                    if (generator.childViewInstance) {
                        generator.childViewInstance.destroy(true);
                        generator.childViewInstance = null;
                    }
                });
                this.renderChildViewContainer(elementOrViewName, true);
            }
            return this.getChildViewInstance(elementOrViewName);
        },
        // @method renderCompositeView Creates and renders the childViews
        renderCompositeView: function renderCompositeView() {
            var _this = this;
            // @event beforeCompositeViewRender triggered just before
            // a view's children finish rendering in the DOM
            this.trigger('beforeCompositeViewRender', this);
            _.each(this.childViewInstances, function (_childViews, containerName) {
                _this.$el.find('[data-cms-area="' + containerName + '"]').html('');
            });
            this._createChildViewInstances();
            this._renderChildViewInstances();
            BackboneView.afterCompositeViewRender.executeAll(this);
            // @event afterCompositeViewRender triggered when a view's
            // children finish rendering in the DOM
            this.trigger('afterCompositeViewRender', this);
        },
        // @method _renderChildViewInstances Render the all the childViews
        // @private
        _renderChildViewInstances: function _renderChildViewInstances() {
            var self = this;
            _.each(this.childViewInstances, function (child_views, container_name) {
                self.renderChildViewContainer(container_name);
            });
        },
        // @method _renderChildViewInstance Render a childView
        // @param {Backbone.View} child_view_instance The instance of the childview
        // @param {String} placeholder Where to insert the childView
        // @param {Number} number_views The number of views of the container of the childView
        // @private
        _renderChildViewInstance: function _renderChildViewInstance(child_view_instance, placeholder, number_views, isExternal) {
            if (child_view_instance) {
                this._setCustomTemplate(child_view_instance);
                if (number_views === 1 && !isExternal) {
                    this._finishRender(child_view_instance, placeholder);
                }
                else {
                    child_view_instance.render();
                    placeholder.append(child_view_instance.$el);
                }
            }
        },
        // @method renderChildViewContainer Renders the childViews of a container
        // @param {String} container_name The name of the container
        // @param {Boolean} create_child Indicate if the childView instnace is created
        renderChildViewContainer: function renderChildViewContainer(container_name, create_child) {
            var self = this;
            var generators = _.values(this.childViewInstances[container_name]);
            generators.sort(function (a, b) {
                return a.childViewIndex - b.childViewIndex;
            });
            _.each(generators, function (generator) {
                if (create_child) {
                    self.createChildViewInstance(generator);
                }
                if (!generator.$placeholder) {
                    var placeholder = self._getPlaceholder(generator.childViewSelector);
                    generator.$placeholder = self.$(placeholder);
                }
                self._renderChildViewInstance(generator.childViewInstance, generator.$placeholder, generators.length, generator.childViewIsExternal);
            });
        },
        // @method_getPlaceholder
        // @param {Object} selector
        // @return {String}
        // @private
        _getPlaceholder: function _getPlaceholder(selector) {
            var placeholder = '';
            _.each(selector, function (value, key) {
                placeholder += '[' + key + '="' + value + '"]';
            });
            return placeholder;
        },
        // @method getViewJsonLd Gets the complete jsonLd for the view and childrens
        // @return {JQuery.Deferred<JSONObject>}
        getViewJsonLd: function getViewJsonLd() {
            var _this = this;
            if (Configuration_1.Configuration.get('structureddatamarkup.type') !== 'JSON-LD') {
                return jQuery.Deferred().resolve(null);
            }
            var promises = [];
            _.each(this.childViewInstances, function (child_views) {
                _.each(child_views, function (generator) {
                    if (generator.childViewInstance && generator.childViewInstance.getJsonLd) {
                        promises.push(generator.childViewInstance.getViewJsonLd());
                    }
                });
            });
            return jQuery.when.apply(jQuery, promises).then(function () {
                var jsonLds = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    jsonLds[_i] = arguments[_i];
                }
                var jsonLdResult = {};
                _.each(jsonLds, function (jsonld) {
                    jsonLdResult = __assign({}, jsonLdResult, Utils.deepCopy(jsonld));
                });
                var resultPromise;
                if (_this.getJsonLd) {
                    resultPromise = SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getModifiedJsonLd(_this, jsonLdResult).then(function (result) {
                        return __assign({}, result, jsonLdResult);
                    });
                }
                else {
                    resultPromise = jQuery.Deferred().resolve(jsonLdResult);
                }
                return resultPromise;
            });
        },
        // @method _createChildViewInstances Create instances of all childViews
        // @private
        _createChildViewInstances: function _createChildViewInstances() {
            var self = this;
            _.each(this.childViewInstances, function (child_views) {
                _.each(child_views, function (generator) {
                    var placeholder = self._getPlaceholder(generator.childViewSelector);
                    var $element = self.$(placeholder);
                    if ($element.length) {
                        generator.$placeholder = $element;
                        if (generator.childViewConstructor) {
                            self.createChildViewInstance(generator, $element.data());
                        }
                    }
                });
            });
        },
        // @method createChildViewInstance Create a instance of a childView
        // @param {Object} generator The generator of the childView
        // @param {Object} element_data Data of the DOM to initialize the instance
        // @return {Backbone.View} return the instance of the childView
        createChildViewInstance: function createChildViewInstance(generator, element_data) {
            element_data = element_data || {};
            var options = _.extend({}, element_data, this.options);
            if (generator.childViewInstance) {
                generator.childViewInstance.destroy();
            }
            if (generator.childViewConstructor.extend === BackboneView.extend) {
                // special case of 'Some.View': SomeView
                // generator.childViewInstance = new generator.childViewConstructor(options);
                generator.childViewInstance = generator.childViewIsExternal
                    ? new generator.childViewConstructor()
                    : new generator.childViewConstructor(options);
            }
            else {
                // common case 'Some.View': function() { ... }
                generator.childViewInstance = generator.childViewIsExternal
                    ? generator.childViewConstructor.call(null)
                    : generator.childViewConstructor.call(this, options);
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
                var context_data_request = generator.childViewInstance.getContextDataRequest();
                if (context_data_request.length) {
                    var context_data = this.getContextData(context_data_request);
                    if (generator.childViewInstance.validateContextDataRequest(context_data)) {
                        generator.childViewInstance.setContextData(context_data);
                    }
                    else {
                        console.error('Requested context data is not valid for this child view instance.');
                        generator.childViewInstance = null;
                        return null;
                    }
                }
                generator.childViewInstance.placeholderData = element_data || {};
                generator.childViewInstance._originalTemplate = generator.childViewInstance.template;
                if (!(generator.childViewInstance.attributes &&
                    generator.childViewInstance.attributes['data-root-component-id'])) {
                    generator.childViewInstance.attributes =
                        generator.childViewInstance.attributes || {};
                    generator.childViewInstance.attributes['data-root-component-id'] =
                        (this.attributes && this.attributes['data-root-component-id']) || '';
                }
                this._setCustomTemplate(generator.childViewInstance);
            }
            return generator.childViewInstance;
        },
        // @method addChildViewInstances Add childViews to this View
        // @param {Object} child_views The view to be added
        // @param {Boolean} render Indicates if the childViews needs to be rendered
        addChildViewInstances: function addChildViewInstances(child_views, render) {
            var self = this;
            _.each(child_views, function (child_view, child_view_container) {
                var isCMS = child_view_container.indexOf('cms:') === 0;
                child_view_container = child_view_container.replace('cms:', '');
                if (!self.childViewInstances[child_view_container]) {
                    self.childViewInstances[child_view_container] = {};
                }
                var childViewSelector = isCMS
                    ? { 'data-cms-area': child_view_container }
                    : { 'data-view': child_view_container };
                if (_.isFunction(child_view)) {
                    // console.warn('This --- will be deprecated, please use the follow format ---');
                    var generator = self.childViewInstances[child_view_container][child_view_container];
                    if (generator && generator.childViewInstance) {
                        generator.childViewInstance.destroy();
                    }
                    self.childViewInstances[child_view_container][child_view_container] = {
                        childViewIndex: 10,
                        childViewConstructor: child_view,
                        childViewInstance: null,
                        childViewSelector: childViewSelector
                    };
                }
                else {
                    _.each(child_view, function (child_view_generator, child_view_name) {
                        var generator = self.childViewInstances[child_view_container][child_view_name];
                        if (generator && generator.childViewInstance) {
                            generator.childViewInstance.destroy();
                        }
                        self.childViewInstances[child_view_container][child_view_name] = {
                            childViewIndex: child_view_generator.childViewIndex || 10,
                            childViewConstructor: child_view_generator.childViewConstructor,
                            childViewInstance: child_view_generator.childViewInstance,
                            childViewSelector: child_view_generator.childViewSelector || childViewSelector,
                            childViewIsExternal: child_view_generator.childViewIsExternal
                        };
                        if (child_view_generator.childViewInstance) {
                            var placeholder = self._getPlaceholder(child_view_generator.childViewSelector);
                            if (!child_view_generator.childViewIsExternal ||
                                child_view_generator.childViewInstance.parentView) {
                                child_view_generator.childViewInstance.parentView = child_view_generator.childViewIsExternal
                                    ? self
                                    : child_view_generator.childViewInstance.parentView || self;
                                child_view_generator.childViewInstance.hasParent = true;
                            }
                            child_view_generator.childViewInstance.placeholderData =
                                self.$(placeholder).data() || {};
                            child_view_generator.childViewInstance._originalTemplate =
                                child_view_generator.childViewInstance.template;
                            if (!(child_view_generator.childViewInstance.attributes &&
                                child_view_generator.childViewInstance.attributes['data-root-component-id'])) {
                                child_view_generator.childViewInstance.attributes =
                                    child_view_generator.childViewInstance.attributes || {};
                                child_view_generator.childViewInstance.attributes['data-root-component-id'] =
                                    (self.attributes && self.attributes['data-root-component-id']) ||
                                        '';
                            }
                            self._setCustomTemplate(child_view_generator.childViewInstance);
                        }
                    });
                }
                if (render) {
                    self.renderChildViewContainer(child_view_container);
                }
            });
        },
        getChildViews: function getChildViews() {
            return this.childViews;
        },
        // @method getChildViewInstance Get a particular childView
        // @param {String} container_name The name of the container_name
        // @param {String} child_view_name The name of the view
        // @return {Backbone.View}
        getChildViewInstance: function getChildViewInstance(container_name, child_view_name) {
            child_view_name = child_view_name || container_name;
            return (this.childViewInstances[container_name] &&
                this.childViewInstances[container_name][child_view_name] &&
                this.childViewInstances[container_name][child_view_name].childViewInstance);
        },
        // @method getChildViewInstances Returns an Array of all the childViews instances
        // @param {String|null} container_name The name of the container (Optional)
        // @return {Array<Backbone.View>}
        getChildViewInstances: function getChildViewInstances(container_name) {
            var all_child_views = [];
            if (container_name) {
                _.each(this.childViewInstances[container_name], function (child_view_generator) {
                    if (child_view_generator.childViewInstance) {
                        all_child_views.push(child_view_generator.childViewInstance);
                    }
                });
            }
            else {
                _.each(this.childViewInstances, function (child_views) {
                    _.each(child_views, function (child_view_generator) {
                        if (child_view_generator.childViewInstance) {
                            all_child_views.push(child_view_generator.childViewInstance);
                        }
                    });
                });
            }
            return all_child_views;
        },
        // @method updateChildViewInstances updates the render settings or the selector
        // @param {String} selector Where the child view will be inserted
        // @param {Backbone.View} child_instance Child View to be added
        // @param {Backbone.CompositeView.AddChildView.Settings} render_settings Indicate how the insertion must be done. Information like where the child view will be placed
        // @return {Void}
        updateChildViewInstances: function updateChildViewInstances(child_views, render) {
            var self = this;
            var promises = [];
            _.each(child_views, function (child_view, container_name) {
                _.each(child_view, function (generator, child_view_name) {
                    promises.push(self.removeChildViewInstance(container_name, child_view_name));
                });
            });
            return jQuery.when(promises).then(function () {
                self.addChildViewInstances(child_views, render);
            });
        },
        // @method removeChildViewInstance Removes a child view instance from the current view. Optionally destroy the child view
        // @param {Backbone.View} child_instance Instance to be removed
        // @param {Boolean} destroy Indicate if the child view will be also destroyed.
        // @return {jQuery.Deferred|undefined}
        removeChildViewInstance: function removeChildViewInstance(container_name, child_view_name, destroy) {
            if (this.childViewInstances[container_name] &&
                this.childViewInstances[container_name][child_view_name]) {
                var child_view_instance = this.childViewInstances[container_name][child_view_name]
                    .childViewInstance;
                destroy && delete this.childViewInstances[container_name][child_view_name];
                if (child_view_instance) {
                    child_view_instance.$el.detach();
                    return child_view_instance.destroy(!destroy);
                }
            }
        },
        _getCustomTemplatePrefix: function _getCustomTemplatePrefix() {
            return ['cell-', 'row-', 'child-', ''];
        },
        // @method _setCustomTemplate Select the best templated based on the current view port with and set it to the child view
        // @param {Backbone.View} child_view Instance of the child view to be inserted
        _setCustomTemplate: function _setCustomTemplate(child_view) {
            var template_prefix = this._getCustomTemplatePrefix();
            _.each(template_prefix, function (prefix) {
                var template_name = child_view.placeholderData[prefix + 'template'];
                // if (template_name)
                // {
                var definitive_template_name = Utils.selectByViewportWidth({
                    phone: child_view.placeholderData[prefix + 'phoneTemplate'],
                    tablet: child_view.placeholderData[prefix + 'tabletTemplate'],
                    desktop: template_name
                }, template_name);
                if (definitive_template_name) {
                    // IMPORTANT: we are require()ing the template dynamically! In order to this to work, the template should
                    // be ALREADY loaded and this is automatically handled at build time by gulp template
                    child_view[prefix ? prefix + 'Template' : 'template'] = Utils.requireModules(definitive_template_name + '.tpl');
                }
                else {
                    child_view[prefix ? prefix + 'Template' : 'template'] =
                        child_view._originalTemplate;
                }
            });
        },
        getTemplateName: function getTemplateName() {
            return (this.template && this.template.Name) || '';
        },
        // @method _finishRender Render the child view and insert its result into the placeholder
        // @param {Backbone.View} child_view Instance of the view to be inserted
        // @param {jQuery} $placeholder Element container of the child. This is the div that contains the tag data-view="..."
        _finishRender: function _finishRender(child_view, $placeholder) {
            // HEADS UP! we use the placeholder as the children view's container element ($el)
            child_view.$el = $placeholder;
            // keep the placeholder classes
            var placeholder_class = $placeholder.attr('class');
            child_view.className = (child_view.className || '') + ' ' + (placeholder_class || '');
            child_view.render();
        },
        setChildViewIndex: function setChildViewIndex(container_name, view_name, index, render) {
            if (this.childViewInstances[container_name] &&
                this.childViewInstances[container_name][view_name]) {
                this.childViewInstances[container_name][view_name].childViewIndex = index;
                if (render) {
                    this.render();
                }
            }
        },
        contextData: {},
        // ie: contexts = ['item', 'order']
        getContextData: function (contexts) {
            if (contexts) {
                var contextData = {};
                var i = contexts.length;
                while (i--) {
                    var selfContextData = _.extend({}, SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getModifiedContext(this), this.contextData, this.constructor.contextData);
                    if (selfContextData[contexts[i]]) {
                        contextData[contexts[i]] = _.bind(selfContextData[contexts[i]], this);
                        contexts.splice(i, 1);
                    }
                }
                if (contexts.length && this.parentView) {
                    return _.extend(this.parentView.getContextData(contexts), contextData);
                }
                return contextData;
            }
            return this.contextData;
        },
        setContextData: function (contextData) {
            this.contextData = __assign({}, contextData, this.contextData);
        }
    };
    _.extend(BackboneView.prototype, compositeView);
    // @module Backbone @class Backbone.View
    // @property {PluginContainer} afterCompositeViewRender Plugins registered here will be called when
    // a composite view finish rendering it self and all its children.
    BackboneView.afterCompositeViewRender = new PluginContainer();
    // @method addExtraChildrenViews Allows adding extra child view to any view.
    // This property will be read by the class Backbone.CompositeView when initializing a view
    // @param {ExtraChildView} option_views
    // @return {Void}
    // @static
    BackboneView.addExtraChildrenViews = function addExtraChildrenViews(option_views) {
        console.warn('DEPRECATED: "Backbone.View.addExtraChildrenViews(params)" is deprecated. Use "Backbone.CompositeView.addChildViews(params)" instead');
        this.addChildViews(option_views);
    };
    /*
            childViews = {
                'Other.View': {
                    'Id1': {
                        'childViewIndex': 10
                    ,	'childViewConstructor': function() {}
                    }
                    'Id2': {
                        'childViewIndex': 20
                    ,	'childViewConstructor': function() {}
                    }
                }
            }
        */
    // @method setChildViewIndex Allows to change the position of a Child View in a container
    // @param {String} container_name The name of the container
    // @param {String} view_name The name of the Child View
    // @param {Number} index The new index to position the Child View in the container
    // @return {Void}
    // @static
    BackboneView.setChildViewIndex = function setChildViewIndex(container_name, view_name, index) {
        if (this.childViews[container_name]) {
            if (_.isFunction(this.childViews[container_name])) {
                this._normalizeChildView(container_name);
            }
            if (this.childViews[container_name][view_name]) {
                this.childViews[container_name][view_name].childViewIndex = index;
            }
        }
    };
    // @method _normalizeChildView Change the format of the childView into the new format
    // @param {String} container_name The name of the container
    // @return {Void}
    // @static
    // @private
    BackboneView._normalizeChildView = function _normalizeChildView(container_name) {
        var childViewConstructor = this.childViews[container_name];
        this.childViews[container_name] = {};
        this.childViews[container_name][container_name] = {
            childViewIndex: 10,
            childViewConstructor: childViewConstructor
        };
    };
    // @method addChildViews adds children views to the current view
    // @param {ChildViews} child_views
    // @return {Void}
    // @static
    BackboneView.addChildViews = function addChildViews(child_views) {
        var self = this;
        this.childViews = _.extend({}, this.prototype.childViews, this.childViews);
        _.each(child_views, function (child_view, child_view_container) {
            if (self.childViews[child_view_container]) {
                if (_.isFunction(self.childViews[child_view_container])) {
                    self._normalizeChildView(child_view_container);
                }
            }
            else {
                self.childViews[child_view_container] = {};
            }
            if (_.isFunction(child_view)) {
                self.childViews[child_view_container][child_view_container] = {
                    childViewIndex: 10,
                    childViewConstructor: child_view
                };
            }
            else {
                _.each(child_view, function (child_view_generator, child_view_name) {
                    self.childViews[child_view_container][child_view_name] = child_view_generator;
                });
            }
        });
    };
    // @method removeChildView removes a particular childView
    // @param {String} container_name
    // @param {String} child_view_name
    // @return {Void}
    // @static
    BackboneView.removeChildView = function removeChildView(container_name, child_view_name) {
        if (_.isFunction(this.childViews[container_name])) {
            delete this.childViews[container_name];
        }
        else if (this.childViews[container_name] &&
            this.childViews[container_name][child_view_name]) {
            delete this.childViews[container_name][child_view_name];
        }
    };
    BackboneView.beforeInitialize.install({
        name: 'compositeView',
        priority: 1,
        execute: function () {
            var childViews = _.extend({}, this.getChildViews(), this.constructor.childViews);
            this.childViewInstances = {};
            this.addChildViewInstances(childViews);
            if (this.options) {
                if (this.options.extraChildViews) {
                    console.warn('DEPRECATED: "options.extraChildViews" is deprecated. Use "options.childViews" instead');
                    // Add extra child views from view's initialization options
                    this.addChildViewInstances(this.options.extraChildViews);
                }
                if (this.options.childViews) {
                    // Add extra child views from view's initialization options
                    this.addChildViewInstances(this.options.childViews);
                }
            }
        }
    });
    BackboneView.contextData = {};
    BackboneView.getContextData = function getContextData() {
        return this.contextData;
    };
    BackboneView.setContextData = function setContextData(contextData) {
        this.contextData = __assign({}, contextData, this.contextData);
    };
    var result = {
        add: jQuery.noop // Just for backwards compatibility
    };
    return result;
});
// @class ChildViews This class defines the type used on each childView property on composite views
// Each property on this object will be related with a child view and the its value must a function that when evaluated returns the instance
// of a Backbone View, or the constructor of a Backbone.View
// Example
//
// ,	childView: {
//		'PromoCodeContainer':
//		{
//			'PromoCodeForm':
//			{
//				childViewIndex: 10
//			,	childViewConstructor: function ()
//				{
//					return new PromocodeFormView({});
//				}
//			}
//		}
//	}
//
// @class addChildViews This class define the type used to add external children views into a view by specifying them on the view options when
// creating a new composite view (this is a common scenario when creating components), and by specifying external child views statically using
// the addChildViews method present in all Backbone Views when the Backbone.CompositeView module is loaded
// Example
//
//	SomeView.addChildViews({
//		'ChildViewContainer':
//		{
//			'ChildViewName': function ()
//			{
//				return new ExtraChildView({model: some_view_model});
//			};
//		}
//	});
//

//# sourceMappingURL=Backbone.CompositeView.js.map
