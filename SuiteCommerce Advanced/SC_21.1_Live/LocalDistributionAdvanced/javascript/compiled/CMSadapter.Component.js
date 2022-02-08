/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Component", ["require", "exports", "underscore", "Utils", "jQuery", "CustomContentType.Container.View", "SC.BaseComponent", "SC.BaseComponent.ChildViewsComponent"], function (require, exports, _, Utils, jQuery, CustomContentTypeContainerView, SC_BaseComponent_1, SC_BaseComponent_ChildViewsComponent_1) {
    "use strict";
    var rawCCTs = null;
    var procecedCCTs = [];
    var customContentTypesViews = {};
    return function CMSadapterComponentGenerator(application) {
        // @class CMSComponent Allows the user to interact with CMS related
        // concepts like enhanced content, landing pages, commerce categories,
        // custom content types, etc.
        // @extends SC.BaseComponent
        var CMSAdapterComponent = SC_BaseComponent_1.SCBaseComponent.extend({
            componentName: 'CMS',
            application: application,
            // @property {CMSadapter.Component.CustomContentTypeStore}
            // _customContentTypes Custom content type store
            // @private
            _customContentTypes: {},
            // @method _createError Internal error to centralize the generation of errors
            // @param {String} error_code Code of the error (Capitalized word)
            // @param {String} error_message Details error message
            // @return {CMSadapter.Component.Error}
            _createError: function _createError(error_code, error_message) {
                // @class CMSadapter.Component.Error
                return {
                    // @property {String} code
                    title: error_code,
                    // @property {String} message
                    message: error_message
                };
                // @class CMSadapterComponent
            },
            // @method _installContent Internal method to handle the
            // installation of a CCT (call the install method)
            // @private
            // @param {CustomContentType.Base.View} cct A CCT instance
            // @param {Object} cct_settings Any object to be sent to the cct instance
            // @return {jQuery.Deferred}
            _installContent: function _installContent(cct, cct_settings, context_data) {
                var self = this;
                return jQuery.when(cct.install(cct_settings, context_data)).then(function () {
                    return jQuery.Deferred().resolve();
                }, function (e) {
                    var message = (e && _.isFunction(e.toString) && e.toString()) ||
                        Utils.translate('Unknown error installing CCT. CCT Instance Id: $(0)', cct.instanceId);
                    return jQuery
                        .Deferred()
                        .reject(self._createError('ERR_INSTALLING_CCT', message));
                });
            },
            // @method _updateSettings Internal method to handle the
            // update of the CCT settings (call the update method)
            // @private
            // @param {CustomContentType.Base.View} cct A CCT instance
            // @param {Object} cct_settings Any object to be sent to the cct instance
            // @return {jQuery.Deferred}
            _updateSettings: function _updateSettings(cctContainer, cct_settings) {
                var self = this;
                var cct = cctContainer.getChildViewInstance('CCT-View');
                return jQuery.when(cct.update(cct_settings)).then(function () {
                    cct.render();
                    return jQuery.Deferred().resolve();
                }, function (e) {
                    var message = (e && _.isFunction(e.toString) && e.toString()) ||
                        Utils.translate('Unknown error updating CCT. CCT Instance Id: $(0)', cct.instanceId);
                    return jQuery.Deferred().reject(self._createError('ERR_UPDATING_CCT', message));
                });
            },
            setRawCCTs: function setRawCCTs(ccts) {
                rawCCTs = {};
                _.each(ccts, function (cct) {
                    rawCCTs[cct.instance_id] = cct;
                });
            },
            // @method registerCustomContentType Register a new CCT for the running application
            // @public
            // @param {CustomContentType.Base.View} cct Custom Content Type View constructor
            // @return {Void}
            registerCustomContentType: function registerCustomContentType(cct) {
                this._customContentTypes[cct.id.toLowerCase()] = cct;
            },
            // @method addContents Add multiple CCTs.
            // If the CCT was already added, then it just will attach the
            // previous CCT view instance again
            // (that means that new settings or render_settings will be ignored)
            // Otherwise it will create a new CCT and add it to the current view
            // @public
            // @return {jQuery.Deferred}
            addContents: function addContents() {
                var _this = this;
                var old_instances = _.keys(customContentTypesViews);
                var new_instances = [];
                SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.resetViewsToRerender();
                var ccts = [];
                if (rawCCTs) {
                    ccts = _.values(rawCCTs);
                }
                else {
                    ccts = procecedCCTs;
                }
                ccts = this._sortCCTs(ccts);
                // Calculate what ccts needs to be preserved and what ccts are new
                _.each(ccts, function (cct) {
                    var index = _.indexOf(old_instances, cct.instance_id);
                    if (index >= 0 &&
                        customContentTypesViews[cct.instance_id] &&
                        (customContentTypesViews[cct.instance_id].dataCmsArea ===
                            cct.selector['data-cms-area'] &&
                            customContentTypesViews[cct.instance_id].position ===
                                cct.render_settings.position)) {
                        old_instances.splice(index, 1);
                    }
                    new_instances.push(cct);
                });
                procecedCCTs = ccts;
                rawCCTs = null;
                // Remove old instances
                if (!this.application.getLayout().getCurrentView().inModal) {
                    _.each(old_instances, function (old_instance_id) {
                        _this.removeContent(old_instance_id, true);
                    });
                }
                customContentTypesViews = {};
                _.each(new_instances, function (cct) {
                    _this.addContent(cct.id, cct.instance_id, cct.selector, cct.settings, cct.render_settings);
                });
            },
            // @method addContent Adds a new CCT into the specified placeholder
            // @public
            // @param {String} cct_id Id of the CCT constructor. This value
            // must have been registered previously
            // @param {String} cct_instance_id. Unique identifier of the new CCT
            // @param {Selector} cct_selector Where the cct should be inserted
            // @param {Object} cct_settings Any setting that will be sent to the new cct instance
            // @param {CMSadapter.Component.addContent.RenderSettings} render_settings
            // Setting on how the rendering should be done
            // @return {jQuery.Deferred}
            addContent: function addContent(cctId, cctInstanceId, cctSelector, cctSettings, renderSettings) {
                if (rawCCTs) {
                    if (!rawCCTs[cctInstanceId]) {
                        rawCCTs[cctInstanceId] = {
                            id: cctId,
                            instance_id: cctInstanceId,
                            selector: cctSelector,
                            settings: cctSettings,
                            render_settings: renderSettings
                        };
                        return jQuery.Deferred().resolve();
                    }
                    else {
                        return jQuery
                            .Deferred()
                            .reject(this._createError('ERR_INVALID_INSTANCE_ID', Utils.translate("Invalid content type instance id: " + cctInstanceId + ", already exists")));
                    }
                }
                else {
                    if (!customContentTypesViews[cctInstanceId]) {
                        var selector = SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getPlaceholder(cctSelector);
                        var container = selector
                            ? SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getPlaceholderViews(this.selectorToString(selector))
                            : null;
                        var asyncOperations_1 = [];
                        cctId = cctId.toLowerCase();
                        if (!selector ||
                            !container.views ||
                            !container.views.length ||
                            !this._customContentTypes[cctId]) {
                            return jQuery.Deferred().resolve();
                        }
                        var cctGenerator_1 = {
                            cctId: cctId,
                            cctInstanceId: cctInstanceId,
                            cctConstructor: this._customContentTypes[cctId].view,
                            cctConstructorOptions: this._customContentTypes[cctId].options || {},
                            cctContainerConstructor: CustomContentTypeContainerView,
                            cctRenderSettings: renderSettings,
                            cctSelector: container.selector,
                            cctSettings: cctSettings,
                            cctErrorContextNotFound: this._createError('ERR_CONTEXTNOTFOUND_CCT', Utils.translate("Context for CCT not found. CCT Instance Id: " + cctInstanceId))
                        };
                        customContentTypesViews[cctInstanceId] = {
                            position: renderSettings.position,
                            dataCmsArea: cctSelector['data-cms-area']
                        };
                        _.each(container.views, function (parentViewInstance) {
                            var cctContainer = parentViewInstance.getChildViewInstance(cctSelector['data-cms-area'], cctInstanceId);
                            if (!cctContainer) {
                                var generatorConstructor = function (parentView, asyncOperations) {
                                    var childViewConstructor = function () {
                                        var cctInstance = new cctGenerator_1.cctConstructor(_.extend(cctGenerator_1.cctConstructorOptions, {
                                            id: cctGenerator_1.cctId,
                                            instanceId: cctGenerator_1.cctInstanceId
                                        }));
                                        var cctContainerInstance = new cctGenerator_1.cctContainerConstructor({
                                            innerCustomContentType: cctInstance,
                                            instanceId: cctGenerator_1.cctInstanceId,
                                            classes: cctGenerator_1.cctRenderSettings.classes
                                        });
                                        var contextData = parentView.getContextData(cctInstance.getContextDataRequest());
                                        if (cctInstance.validateContextDataRequest(contextData)) {
                                            var installPromise = cctInstance.install(cctGenerator_1.cctSettings, contextData);
                                            if (asyncOperations) {
                                                asyncOperations.push(installPromise);
                                            }
                                            cctContainerInstance.parentView = parentView;
                                            cctContainerInstance.hasParent = true;
                                            return cctContainerInstance;
                                        }
                                        else if (asyncOperations) {
                                            asyncOperations.push(cctGenerator_1.cctErrorContextNotFound);
                                        }
                                    };
                                    return {
                                        childViewConstructor: childViewConstructor,
                                        childViewInstance: childViewConstructor(),
                                        childViewIndex: 1000 +
                                            parseInt(cctGenerator_1.cctRenderSettings.position, 10),
                                        childViewSelector: cctGenerator_1.cctSelector,
                                        childViewIsExternal: true
                                    };
                                };
                                var childViewInstancesGenerator = {};
                                childViewInstancesGenerator["cms:" + cctSelector['data-cms-area']] = {};
                                childViewInstancesGenerator["cms:" + cctSelector['data-cms-area']][cctInstanceId] = generatorConstructor;
                                var generator = generatorConstructor(parentViewInstance, asyncOperations_1);
                                var childViewInstances = {};
                                childViewInstances["cms:" + cctSelector['data-cms-area']] = {};
                                childViewInstances["cms:" + cctSelector['data-cms-area']][cctInstanceId] = generator;
                                parentViewInstance.addChildViewInstances(childViewInstances, true);
                                SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.addViewsToRerender(parentViewInstance, childViewInstancesGenerator);
                            }
                        });
                        return jQuery.when.apply(jQuery, asyncOperations_1);
                    }
                    else {
                        return jQuery
                            .Deferred()
                            .reject(this._createError('ERR_INVALID_INSTANCE_ID', Utils.translate("Invalid content type instance id: " + cctInstanceId + ", already exists")));
                    }
                }
            },
            // @method updateContent Updates a CCT settings and
            // its render settings
            // @public
            // @param {String} cct_id Id of the CCT constructor.
            // This value must have been registered previously
            // @param {String} cctInstanceId. Unique identifier
            // of the new CCT
            // @param {Selector} cct_selector Where the cct should be inserted
            // @param {Object} cct_settings Any setting that will be sent to the new cct instance
            // @param {CMSadapter.Component.addContent.RenderSettings} render_settings
            // Setting on how the rendering should be done
            // @return {jQuery.Deferred}
            updateContent: function updateContent(cctId, cctInstanceId, cctSelector, cctSettings, renderSettings) {
                var _this = this;
                if (rawCCTs) {
                    if (rawCCTs[cctInstanceId]) {
                        rawCCTs[cctInstanceId] = {
                            id: cctId,
                            instance_id: cctInstanceId,
                            selector: cctSelector,
                            settings: cctSettings,
                            render_settings: renderSettings
                        };
                        return jQuery.Deferred().resolve();
                    }
                    else {
                        return jQuery
                            .Deferred()
                            .reject(this._createError('ERR_INVALID_INSTANCE_ID', Utils.translate("Invalid content type instance id: " + cctInstanceId + ", does not exists")));
                    }
                }
                else {
                    var self_1 = this;
                    var dataCmsArea_1 = customContentTypesViews[cctInstanceId] &&
                        customContentTypesViews[cctInstanceId].dataCmsArea;
                    var asyncOperations_2 = [];
                    if (dataCmsArea_1) {
                        if (renderSettings.position === customContentTypesViews[cctInstanceId].position) {
                            var placeholder = SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getPlaceholderViews("[data-cms-area=\"" + dataCmsArea_1 + "\"]");
                            var views = placeholder && placeholder.views;
                            _.each(views, function (view) {
                                var cctContainerView = view.getChildViewInstance(dataCmsArea_1, cctInstanceId);
                                if (cctContainerView) {
                                    asyncOperations_2.push(_this._updateSettings(cctContainerView, cctSettings));
                                }
                            });
                            return jQuery.when.apply(jQuery, asyncOperations_2);
                        }
                        else {
                            self_1.removeContent(cctInstanceId, true);
                            return self_1.addContent(cctId, cctInstanceId, cctSelector, cctSettings, renderSettings);
                        }
                    }
                    return jQuery
                        .Deferred()
                        .reject(self_1._createError('ERR_INVALID_INSTANCE_ID', Utils.translate("Invalid content type instance id: " + cctInstanceId + ", does not exists")));
                }
            },
            // @method _sortCCTs Internal method to sort a list of cct to be rendered
            // @param {Array<CustomContentType.Base.View>} ccts List of ccts to be sorted
            // @private
            // @return {Array<CustomContentType.Base.View>}
            _sortCCTs: function _sortCCTs(ccts) {
                var self = this;
                // sort first by placeholder and then by position
                ccts.sort(function (cct_a, cct_b) {
                    var cct_a_selector = SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getPlaceholder(cct_a.selector);
                    var cct_b_selector = SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getPlaceholder(cct_b.selector);
                    var cct_a_key = cct_a_selector ? self.selectorToString(cct_a_selector) : '';
                    var cct_b_key = cct_b_selector ? self.selectorToString(cct_b_selector) : '';
                    if (cct_a_key === cct_b_key) {
                        return (parseInt(cct_a.render_settings.position, 10) -
                            parseInt(cct_b.render_settings.position, 10));
                    }
                    return cct_a_key < cct_b_key ? 1 : 0;
                });
                return ccts;
            },
            // @method removeContent Removes a CCT from its location
            // @public
            // @param {String} cct_instance_id Unique CCT identifier
            // @param {Boolean} skip_destroy_call Indicate if should destroy the instance or not
            // @return {jQuery.Deferred}
            removeContent: function removeContent(cctInstanceId, destroyCall) {
                if (rawCCTs) {
                    if (rawCCTs[cctInstanceId]) {
                        delete rawCCTs[cctInstanceId];
                        return jQuery.Deferred().resolve();
                    }
                    else {
                        return jQuery
                            .Deferred()
                            .reject(this._createError('ERR_INVALID_INSTANCE_ID', Utils.translate("The specified instance id is not registered. Instance Id: " + cctInstanceId)));
                    }
                }
                else {
                    var dataCmsArea_2 = customContentTypesViews[cctInstanceId] &&
                        customContentTypesViews[cctInstanceId].dataCmsArea;
                    var placeholder = SC_BaseComponent_ChildViewsComponent_1.SCBaseComponentChildViewsComponent.getPlaceholderViews("[data-cms-area=\"" + dataCmsArea_2 + "\"]");
                    var views = placeholder && placeholder.views;
                    var async_operations_1 = [];
                    if (views) {
                        _.each(views, function (view) {
                            async_operations_1.push(view.removeChildViewInstance(dataCmsArea_2, cctInstanceId, destroyCall));
                        });
                        if (destroyCall) {
                            delete customContentTypesViews[cctInstanceId];
                        }
                        return jQuery.when.apply(jQuery, async_operations_1);
                    }
                    return jQuery
                        .Deferred()
                        .reject(this._createError('ERR_INVALID_INSTANCE_ID', Utils.translate("The specified instance id is not registered. Instance Id: " + cctInstanceId)));
                }
            },
            getContentIds: function getContentIds() {
                return _.keys(this._customContentTypes);
            },
            // @method selectorToString returns the string key for a json selector
            // @param {Selector} placeholder
            // @return {String} the string key for a json selector
            selectorToString: function selectorToString(placeholder) {
                var str = '';
                _.each(placeholder, function (value, key) {
                    str += '[' + key + '="' + value + '"]';
                });
                return str;
            }
        });
        return CMSAdapterComponent;
    };
});
// @class Selector an obj with the form
// { data-cms-attr1: "placeholder1", data-cms-attr2: "placeholder2" }
// @class PlaceholderViews an obj with the form
// { "selector_key": selector: {Selector}, views: Array<Backbone.View>}
// @class CMSadapter.Component.CustomContentTypeStore
// A dictionary by custom content type id of all CCTs register for the running application
// @extend Dictionary<String, CustomContentType.Base.View>
// @class CMSadapter.Component.CustomerContentTypeInstance.Store
// A dictionary to store the generated CCT instances
// @extend Dictionary<String, CMSadapter.Component.CustomerContentTypeInstance.Container>
// @class CMSadapter.Component.addContent.RenderSettings
// @property {Number} position Indicate where the CCT should be inserted

//# sourceMappingURL=CMSadapter.Component.js.map
