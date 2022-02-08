/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.VisualComponent"/>

import '../../BackboneExtras/JavaScript/Backbone.View.render';
import * as _ from 'underscore';
import * as jQuery from '../../Core/JavaScript/jQuery';
import { SCBaseComponentChildViewsComponent } from './SC.BaseComponent.ChildViewsComponent';
import { isModuleLoaded } from '../../Core/JavaScript/ExportedModulesNames';
import { JSONObject } from '../../Utilities/JavaScript/Utils.Interfaces';
import { GlobalViewsMessageView } from '../../GlobalViews/JavaScript/GlobalViews.Message.View';
import { SCBaseComponent } from './SC.BaseComponent';

// @module SC

enum NotificationsTypes {
    ERROR = 'error',
    WARNING = 'warning',
    SUCCESS = 'success',
    INFO = 'info'
}

// @class SC.BaseComponent Base abstract class for front-end components. Use method @?method SC.SC.BaseComponent.extend to build concrete components.
// Implements helper methods for Views manipulation
// @extends SC.CancelableEvents
const visual_component = _.extend({}, SCBaseComponent, {
    // @property {String} componentName The name which identify this kind of component. This name is used both for registering a new component and
    // getting a component implementation with @?class SC.ComponentContainer
    // @extlayer

    // @property {ApplicationSkeleton} application

    // @method extend Extends the current component to generate a child one
    // @public @extlayer
    // @param {Object} child_component Any object with properties/methods that will be used to generate the SC.Component that will be returned
    // @return {SC.BaseComponent}
    extend: function extend(child_component) {
        if (
            !child_component ||
            (!child_component.componentName && !this.componentName) ||
            !child_component.application
        ) {
            return this._reportError(
                'INVALID_PARAM',
                'Invalid SC.Component. Property "componentName" and "application" are required.'
            );
        }

        this.application = child_component.application;

        const new_component = _.extend({}, this, child_component);

        new_component.application
            .getLayout()
            .getCancelableEmitter()
            .on('beforeAppendView', view => new_component._onApplicationBeforeView(view));

        new_component.application
            .getLayout()
            .on('afterAppendView', view => new_component._onApplicationAfterAppendView(view));

        return new_component;
    },

    // @method _onApplicationBeforeView Internal method used to automatically notify when views of the current component are about to be shown (BEFORE append view)
    // @private
    // @param {Backbone.View} view The view that will be shown
    // @return {jQuery.Deferred|Void}
    _onApplicationBeforeView: function _onApplicationBeforeView(view) {
        if (this._isViewFromComponent(view, true)) {
            try {
                const self = this;
                this.viewToBeRendered = view;
                // @event {Void} showContent Trigger after a PDP is rendered.
                // @public
                return this.cancelableTrigger(
                    'beforeShowContent',
                    this._getViewIdentifier(view)
                ).always(function() {
                    self.viewToBeRendered = null;
                });
            } catch (e) {
                this.viewToBeRendered = null;
                throw e;
            }
        }
    },

    // @method _onApplicationAfterAppendView Internal method used to automatically notify when views of the current component where shown (AFTER append view)
    // @private
    // @param {Backbone.View} view The view that was shown
    // @return {Void}
    _onApplicationAfterAppendView: function _onApplicationAfterAppendView(view) {
        if (this._isViewFromComponent(view, true)) {
            this.viewToBeRendered = null;
            // @event {Void} afterShowContent Trigger after a PDP is rendered.
            // @public
            this.cancelableTrigger('afterShowContent', this._getViewIdentifier(view));
        }
    },

    // @method _getViewIdentifier Given a view that belongs to the current component, returns the "type"/"kind" of view.
    // This is used to determine what view among all the view of the current component is being shown
    // @param {Backbone.View} view
    // @return {String}
    // @private
    _getViewIdentifier: function _getViewIdentifier(view): string {
        return view && view.attributes && view.attributes.id;
    },

    _isViewComponent: function _isViewComponent(viewIdentifier: string): boolean {
        const componentIdentifiers = this._getComponentIdentifiers();
        let isComponent = false;

        _.each(componentIdentifiers, componentIdentifier => {
            isComponent = isComponent || viewIdentifier === componentIdentifier;
        });

        return isComponent;
    },

    // This should be abstract in the future
    _getComponentIdentifiers: function _getComponentIdentifiers(): string[] {
        return [];
    },

    // @method _isViewFromComponent Indicate if the passed-in the View is a View of the current component.
    // The aim of this method is to be overwritten
    // @private
    // @param {Backbone.View} view Any view of the system
    // @param {Boolean} is_instance Indicate if the passed in view is an instance or a constructor function.
    // @return {Boolean} True in case the passed in View is a view of the current Component, false otherwise
    _isViewFromComponent: function _isViewFromComponent(): boolean {
        return false;
    },

    _currentAddContextProperty: {},
    _currentAddEventHandler: {},

    // @method setChildViewIndex Change the position of a Child View inside a container
    // @public @extlayer
    // @param {String} view_id The identifier of the view, of the current component, that will have the Child View to change the index
    // @param {String} placeholder_selector Identifier of the location where the view is located inside the specified View (view_id)
    // @param {String} view_name Identifier of an specific view into the placeholder
    // @param {Number} index The new index to position the Child View
    // @return {null} null if everything works as expected. An exception will be thrown otherwise.
    setChildViewIndex: function setChildViewIndex(
        view_id: string,
        placeholder_selector: string,
        view_name: string,
        // HEADS UP! we left this "any" to avoid an error in line 142 (index = view_name).
        // Should be solved once we migrate this file by using two signatures for this method
        index: any
    ) {
        if (arguments.length === 3 || arguments.length === 4) {
            if (arguments.length === 3) {
                index = view_name;
                view_name = placeholder_selector;
                placeholder_selector = view_id;
                view_id = this._getDefaultView();
            }

            if (!_.isNumber(index)) {
                return this._reportError('INVALID_PARAM', 'The specified index is not valid.');
            }

            this._setChildViewIndex(view_id, placeholder_selector, view_name, index);
        } else {
            return this._reportError('INVALID_PARAM_COUNT', 'Incorrect number of parameters');
        }
    },

    _setChildViewIndex: function _setChildViewIndex(
        viewId: string,
        placeholderSelector: string,
        viewName: string,
        index: number
    ) {
        if (isModuleLoaded(viewId)) {
            if (!this._isViewComponent(viewId)) {
                console.warn(
                    'INVALID_PARAM',
                    `Invoking the method "setChildViewIndex" with an incorrect parameter: (${viewId}).
				It will still work but it will be deprecated in the future. Please check the documentation.`
                );
            }
            SCBaseComponentChildViewsComponent.setChildViewIndex(
                viewId,
                placeholderSelector,
                viewName,
                index
            );
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    _getDefaultView: function _getDefaultView() {
        if (this.DEFAULT_VIEW) {
            return this.DEFAULT_VIEW;
        }
        return this._reportError(
            'UNDEFINED_DEFAULTVIEW',
            'The "DEFAULT_VIEW" was not defined in the Component'
        );
    },

    // @method addChildView Add a child view in the data-view 'data_view' passed as parameter in the default view of the component
    addChildView: function addChildView(data_view, view_constructor) {
        const generator = {};
        const view_id = _.uniqueId('view');

        generator[data_view] = {};
        generator[data_view][view_id] = {
            childViewConstructor: view_constructor
        };

        this.addChildViews(this._getDefaultView(), generator);

        return view_id;
    },
    // @method registerView adds a view to be used in any template within the child views hierarchy
    registerView: function registerView(dataView: string, viewConstructor) {
        const generator = {};
        generator[dataView] = {};
        generator[dataView][dataView] = {
            childViewConstructor: viewConstructor
        };
        this.addChildViews(this._getDefaultView(), generator);
    },

    // Add a new contextData to the view of the component
    // {String} (optional) viewId The id of the view to add the new contextData
    // {String} name The name of the new contextData
    // {Function} func The function that will called when requesting the new contextData
    addContextData: function(viewId: string, name: string, func: any) {
        if (arguments.length === 2) {
            func = name;
            name = viewId;
            viewId = this._getDefaultView();
        }

        if (!_.isString(name)) {
            this._reportError('INVALID_PARAM', 'The specified name is not valid.');
        }

        if (!_.isFunction(func)) {
            this._reportError('INVALID_PARAM', 'The specified function is not valid.');
        }

        if (isModuleLoaded(viewId)) {
            SCBaseComponentChildViewsComponent.addContextData(viewId, name, func);
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    // @method addChildViews Adds a child view/child views given by the child_views parameter into the specified view of the current component
    // @public @extlayer
    // @param {String} view_id The identifier of the view, of the current component, that will be extended with an extra/s child view/s
    // @param {ChildViews} child_views Identifier of the location where the new view will be located inside the specified View (view_id)
    // @return {null} null if everything works as expected. An exception will be thrown otherwise.
    addChildViews: function addChildViews(view_id: string, child_views: any) {
        return this._addChildViews(view_id, child_views);
    },

    _addChildViews: function _addChildViews(viewId: string, childViews: any) {
        if (isModuleLoaded(viewId)) {
            if (!this._isViewComponent(viewId)) {
                console.warn(
                    'INVALID_PARAM',
                    `Invoking the method "addChildViews" with an incorrect parameter: (${viewId}).
				It will still work but it will be deprecated in the future. Please check the documentation.`
                );
            }
            SCBaseComponentChildViewsComponent.addChildViews(viewId, childViews);
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    // @method removeChildView Removes a child view for a given view id
    // @public @extlayer
    // @param {String} view_id The identifier of the view, of the current component, that will be extended with an extra child view
    // @param {String} placeholder_selector Identifier of the location where the new view will be located inside the specified View (view_id)
    // @param {string} view_name Identifier of an specific view into the placeholder
    // @return {null} null if everything works as expected. An exception will be thrown otherwise.
    removeChildView: function removeChildView(
        view_id: string,
        placeholder_selector: string,
        view_name: string
    ): void {
        // If removeChildView is called with only 1 parameter, it will be the placeholder_selector only, and it will remove it from the default_view
        if (arguments.length < 1 || arguments.length > 3) {
            return this._reportError('INVALID_PARAM_COUNT', 'Incorrect number of parameters');
        }
        if (arguments.length === 2) {
            view_name = placeholder_selector;
            placeholder_selector = view_id;
            view_id = this._getDefaultView();
        } else if (arguments.length === 1) {
            view_name = view_id;
            placeholder_selector = view_id;
            view_id = this._getDefaultView();
        }

        this._removeChildView(view_id, placeholder_selector, view_name);
    },

    _removeChildView: function removeChildView(
        viewId: string,
        placeholderSelector: string,
        viewName: string
    ): void {
        if (isModuleLoaded(viewId)) {
            if (!this._isViewComponent(viewId)) {
                console.warn(
                    'INVALID_PARAM',
                    `Invoking the method "removeChildView" with an incorrect parameter: (${viewId}).
				It will still work but it will be deprecated in the future. Please check the documentation.`
                );
            }
            viewName = viewName || placeholderSelector;

            SCBaseComponentChildViewsComponent.removeChildView(
                viewId,
                placeholderSelector,
                viewName
            );
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    isDataTypeValid: function(dataType: string | []): boolean {
        const validDataTypes = ['number', 'string', 'object', 'array', 'boolean', 'null'];
        if (_.isString(dataType)) {
            return _.indexOf(validDataTypes, dataType) >= 0;
        }
        if (_.isArray(dataType)) {
            return !_.difference(dataType, validDataTypes).length;
        }
        return false;
    },

    // @method addToViewContextDefinition Adds an extra property to the UI context of a view id to extend the interaction with its template
    // @public @extlayer
    // @param {String} view_id The identifier of the view, of the current component, that will have its context extended.
    // @param {String} property_name Name of the new property to be added
    // @param {String} type Name of the type of the result of the callback (function that generates the value of the new property)
    // @param {Function} callback Function in charge of generating the value for the new property.
    // @return {null} null if everything works as expected. An exception will be thrown otherwise.
    addToViewContextDefinition: function addToViewContextDefinition(
        viewId: string,
        propertyName: string,
        type: string,
        callback: (safeContext: any) => any
    ) {
        if (!_.isFunction(callback)) {
            this._reportError('INVALID_PARAM', 'The specified callback is not valid.');
        }

        if (!this.isDataTypeValid(type)) {
            this._reportError(
                'INVALID_DATA_TYPE',
                'Invalid data type. Please check the json-schema documentation for valid data types.'
            );
        }

        if (isModuleLoaded(viewId)) {
            if (!this._currentAddContextProperty[viewId]) {
                this._currentAddContextProperty[viewId] = {};
            }

            if (this._currentAddContextProperty[viewId][propertyName]) {
                this._reportError(
                    'DUPLICATED_CONTEXT_PROPERTY',
                    'Duplicated propertyName. Trying to add more than one extra context property with the same name.'
                );
            }

            SCBaseComponentChildViewsComponent.addToViewContextDefinition(
                viewId,
                propertyName,
                type,
                callback
            );

            this._currentAddContextProperty[viewId][propertyName] = true;
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    // @method removeToViewContextDefinition Removes an extra property to the UI context of a view.
    // @public @extlayer
    // @param {String} view_id The identifier of the view, of the current component, that will have its context extended.
    // @param {String} property_name Name of the new property to be added
    // @return {null} null if everything works as expected. An exception will be thrown otherwise.
    removeToViewContextDefinition: function removeToViewContextDefinition(
        viewId: string,
        propertyName: string
    ) {
        if (
            !(
                this._currentAddContextProperty[viewId] &&
                this._currentAddContextProperty[viewId][propertyName]
            )
        ) {
            this._reportError(
                'INVALID_PARAM',
                'The specified extra context property does not exists or is not custom.'
            );
        }

        if (isModuleLoaded(viewId)) {
            SCBaseComponentChildViewsComponent.removeToViewContextDefinition(viewId, propertyName);

            this._currentAddContextProperty[viewId][propertyName] = false;
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    // @method modifyViewJsonLd allows modify the JsonLd content for a given view.
    // @public @extlayera
    // @param {String} view_id The identifier of the view.
    // @return {null} null if everything works as expected. An exception will be thrown otherwise.
    modifyViewJsonLd: function modifyViewJsonLd(
        viewId: string,
        callback: (jsonLdResult: JSONObject) => JQuery.Deferred<JSONObject>
    ) {
        if (!_.isFunction(callback)) {
            this._reportError('INVALID_PARAM', 'The specified callback is not valid.');
        }

        if (isModuleLoaded(viewId)) {
            SCBaseComponentChildViewsComponent.modifyViewJsonLd(viewId, callback);
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    isEventSelectorValid: function(eventSelector: string) {
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
    },

    // @method addToViewEventsDefinition Allows to add an extra event handler over a particular view for the given event selector
    // @public @extlayer
    // @param {String} view_id The identifier of the view, of the current component, that will be extended with an extra event handler.
    // @param {String} event_selector
    // @param {Function} callback Event handler function called when the specified event occurs
    // @return {Void}
    addToViewEventsDefinition: function addToViewEventsDefinition(
        viewId: string,
        eventSelector: string,
        callback: any
    ) {
        if (!_.isFunction(callback)) {
            this._reportError('INVALID_PARAM', 'The specified callback is not valid.');
        }

        if (!this.isEventSelectorValid(eventSelector)) {
            this._reportError(
                'INVALID_PARAM',
                'The specified eventSelector parameter does not respect the required format.'
            );
        }

        if (isModuleLoaded(viewId)) {
            if (!this._currentAddEventHandler[viewId]) {
                this._currentAddEventHandler[viewId] = {};
            }

            if (this._currentAddEventHandler[viewId][eventSelector]) {
                this._reportError(
                    'DUPLICATED_CONTEXT_PROPERTY',
                    'Duplicated eventSelector. Trying to add more than one extra context property with the same name.'
                );
            }

            SCBaseComponentChildViewsComponent.addToViewEventsDefinition(
                viewId,
                eventSelector,
                callback
            );

            this._currentAddEventHandler[viewId][eventSelector] = true;
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    // @method removeToViewEventsDefinition Allows to remove and an extra event handler added previously.
    // @public @extlayer
    // @param {String} view_id The identifier of the view, of the current component.
    // @param {String} event_selector
    // @return {Void}
    removeToViewEventsDefinition: function removeToViewEventsDefinition(
        viewId: string,
        eventSelector: string
    ) {
        if (
            !(
                this._currentAddEventHandler[viewId] &&
                this._currentAddEventHandler[viewId][eventSelector]
            )
        ) {
            this._reportError(
                'INVALID_PARAM',
                'The specified event selector does not exists or is not custom.'
            );
        }

        if (isModuleLoaded(viewId)) {
            SCBaseComponentChildViewsComponent.removeToViewEventsDefinition(viewId, eventSelector);

            this._currentAddEventHandler[viewId][eventSelector] = true;
        } else {
            return this._reportError(
                'INVALID_PARAM',
                `The specified viewId (${viewId}) is not valid for the current component.`
            );
        }
    },

    // @method showMessage Allows to display a message with a type and timeout within an specific div.
    // @public @extlayer
    // @param {object} options The message options: {message: string, type: NotificationsTypes, selector?: string, timeout?: number}
    // @return {string}
    showMessage: function showMessage(options: {
        message: string;
        type: NotificationsTypes;
        selector?: string;
        timeout?: number;
    }): string {
        if (!options) {
            return this._reportError('INVALID_PARAM', 'The specified options can not be null.');
        }

        options.type = options.type ? options.type : NotificationsTypes.INFO;

        if (!(options.type.toUpperCase() in NotificationsTypes)) {
            return this._reportError(
                'INVALID_PARAM',
                `The specified notification type (${
                    options.type
                }) is not valid, the availables types are error, warning, info or success.'`
            );
        }

        options.selector = options.selector || 'Notifications';
        const selectedDiv = jQuery(
            `[data-view="${options.selector}"], [data-cms-area="${options.selector}"]`
        );

        if (selectedDiv.length === 0) {
            return this._reportError(
                'INVALID_PARAM',
                `The specified selector (${options.selector}) does not exist.'`
            );
        }

        const global_view_message = new GlobalViewsMessageView({
            message: options.message,
            type: options.type,
            closable: true
        });

        const message_id = _.uniqueId(`${options.type}_message_`);

        global_view_message.$el.attr('id', message_id);
        selectedDiv.append(global_view_message.render().$el);

        if (options.timeout) {
            setTimeout(() => {
                this.closeMessage(message_id);
            }, options.timeout);
        }

        return message_id;
    },

    closeMessage: function closeMessage(message_id: string) {
        const message = jQuery(`#${message_id}`);
        if (!message_id || !message) {
            return this._reportError(
                'INVALID_PARAM',
                `The specified message id (${message_id}) is not valid'`
            );
        }
        message.fadeOut(function() {
            message.remove();
        });
    }
});

export = visual_component;
