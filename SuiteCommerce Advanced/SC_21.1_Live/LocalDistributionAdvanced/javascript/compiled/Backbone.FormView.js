/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.FormView", ["require", "exports", "underscore", "Utils", "jQuery", "Loggers", "Backbone", "backbone.stickit", "Backbone.Validation"], function (require, exports, _, Utils, jQuery, Loggers_1, Backbone) {
    "use strict";
    // Wrapper to Logging customers usage into Kibana to analyze data to remove Stickit library
    // Check if are properties into binding that SC are not using
    // by default or are events that SC are not using by default.
    // WE USE:
    // onSet()
    // onGet()
    // observe: ....
    // setOptions: ...
    // events:['blur', 'change']
    function addBindingStickitLogger(fn, optionalModel, selector, binding) {
        var posibleBindings = [
            ':el',
            'getVal',
            'updateModel',
            'updateView',
            'afterUpdate',
            'updateMethod',
            'escape',
            'initialize',
            'destroy',
            'visibleFn',
            'visible'
        ];
        if (!_.isEmpty(binding)) {
            if (!_.isEmpty(_.intersection(Object.keys(binding), posibleBindings)) ||
                (binding.events &&
                    !_.isEmpty(binding.events) &&
                    !(binding.events[0] === 'blur' ||
                        (binding.events.length === 2 &&
                            (binding.events.includes('blur') && binding.events.includes('change')))))) {
                Loggers_1.Loggers.getLogger().info({
                    componentArea: 'BACKBONE_STICKIT_ADD_BINDING',
                    stickitSelector: selector,
                    stickitBinding: binding
                });
            }
        }
        var args = Array.prototype.slice.call(arguments, 1);
        return fn.apply(this, args);
    }
    function addHandlerStickitLogger(fn, handlers) {
        Loggers_1.Loggers.getLogger().info({
            componentArea: 'BACKBONE_STICKIT_ADD_HANDLER',
            stickitHandlers: handlers
        });
        var args = Array.prototype.slice.call(arguments, 1);
        return fn.apply(this, args);
    }
    function getConfigurationStickitLogger(fn, $el, binding) {
        Loggers_1.Loggers.getLogger().info({
            componentArea: 'BACKBONE_STICKIT_GET_CONFIGURATION',
            stickitElement: $el,
            stickitBinding: binding
        });
        var args = Array.prototype.slice.call(arguments, 1);
        return fn.apply(this, args);
    }
    Backbone.Stickit.addHandler = _.wrap(Backbone.Stickit.addHandler, addHandlerStickitLogger);
    Backbone.View.prototype.addBinding = _.wrap(Backbone.View.prototype.addBinding, addBindingStickitLogger);
    Backbone.Stickit.getConfiguration = _.wrap(Backbone.Stickit.getConfiguration, getConfigurationStickitLogger);
    function buttonSubmitProgress(savingForm) {
        savingForm.find('[type="submit"]').each(function () {
            var element = jQuery(this);
            element.attr('disabled', true);
            element.data('default-text', String(element.text()).trim());
            element.text(Utils.translate('Processing...'));
        });
    }
    function buttonSubmitDone(savingForm) {
        savingForm.find('[type="submit"]').each(function () {
            var element = jQuery(this);
            element.attr('disabled', false);
            element.text(element.data('default-text'));
        });
    }
    // override default handler to uncheck radio buttons.
    var handler_radio = (_.findWhere(Backbone.Stickit._handlers, { selector: 'input[type="radio"]' }));
    if (handler_radio) {
        handler_radio.update = function ($el, val) {
            if (val) {
                $el.filter('[value="' + val + '"]').prop('checked', true);
            }
            else {
                $el.prop('checked', false);
            }
        };
    }
    var BackboneFormView = {
        // override render() to add support to double binding using Backbone.stickit:
        bindViewToStickit: function () {
            var view = this;
            Backbone.Validation.bind(view, {
                model: view.validationModel,
                forceUpdate: true
            });
            view.stickit(view.validationModel, view.bindings);
        },
        formatBindings: function (view) {
            // we want to automatically add default desired configuration to stickit bindings without deleting stickit passed config.
            // The default action is 'blur' and model modifications will be silent - this can be customized for particular inputs
            _(view.bindings).each(function (binding, name) {
                if (_(binding).isString()) {
                    view.bindings[name] = {
                        observe: binding,
                        setOptions: {
                            validate: true,
                            silent: true
                        },
                        events: ['blur']
                    };
                }
                else if (!binding.setOptions || typeof binding.setOptions.validate === 'undefined') {
                    binding.setOptions = binding.setOptions || {};
                    binding.setOptions.validate = true;
                    binding.setOptions.silent = true;
                }
            });
        },
        // @method add makes the passed view a Form View. Views that want to be form views should call this method at initialize @static
        // @param {Backbone.View} view the view instance we want to transform in a FormView.
        add: function (view, options) {
            options = options || {};
            this.formatBindings(view);
            view.validationModel = options.noCloneModel ? view.model : view.model.clone();
            !options.noCloneModel && view.model.on('change', this.synchronizeModels, view);
            view.on(view.childViews ? 'afterCompositeViewRender' : 'afterViewRender', this.bindViewToStickit);
            var self = this;
            // overrides destroy() so we unstickit (remove bindings event listeners)
            view.destroy = _.wrap(view.destroy, function (fn) {
                this.unstickit();
                view.model.off('change', self.synchronizeModels);
                return fn.apply(this, Array.prototype.slice.call(arguments));
            });
            view.model.bind('validated', function (isValid) {
                // user clicked on submit AND there are validation errors -> focus on first error.
                if (view.isSavingForm && isValid === false) {
                    var $first_input_error = jQuery('body [data-validation-error]:first input');
                    if ($first_input_error) {
                        if (!jQuery('.global-views-message-error').length &&
                            $first_input_error.closest('[data-validation="control-group"]').length) {
                            jQuery('body').animate({
                                scrollTop: $first_input_error
                                    .closest('[data-validation="control-group"]')
                                    .offset().top
                            }, 600);
                        }
                        $first_input_error.focus();
                    }
                }
                // user clicked on submit AND form is OK -> show progress button.
                if (view.isSavingForm && isValid === true) {
                    buttonSubmitProgress(view.$savingForm);
                }
                view.isSavingForm = false;
            });
            // when we have two FormViews and we switch focus from one to another we want to erase the validation error messages from the first one:
            view.events = view.events || {};
            view.events['focusin *'] = 'formViewFocusHandler';
            var removeValidationErrors = function ($el) {
                $el.find('[data-validation-error="block"]').remove();
                $el.find('[data-validation-error]').removeAttr('data-validation-error');
            };
            // @method removeValidationErrors remove all visual validation errors of this form view if any
            view.removeValidationErrors = function () {
                removeValidationErrors(this.$el);
            };
            view.formViewFocusHandler = function (e) {
                var closestForm = jQuery(e.target).closest('form');
                if (!closestForm.hasClass('focused-form-view')) {
                    removeValidationErrors(jQuery('.focused-form-view'));
                    jQuery('.focused-form-view').removeClass('focused-form-view');
                }
                closestForm.addClass('focused-form-view');
            };
            view.saveForm = this.saveForm;
            view.transformResponseText = view.transformResponseText || this.transformResponseText;
            return view.validationModel;
        },
        // @method synchronizeModels Auxiliary method used to keep sync all changes made on the view's model and the cloned model
        // It is important to notice that this method is expected to run in the context of the view
        // @param {Backbone.Model} view_model Original view's model
        // @return {Void}
        synchronizeModels: function (view_model) {
            if (!view_model) {
                return;
            }
            var changed_attributes = view_model.changedAttributes();
            var view = this;
            _.each(changed_attributes, function (value, attribute) {
                view.validationModel.set(attribute, value);
            });
        },
        // @method transformResponseText transformResponseText allow to modify the response when an error is thrown
        // @param {ResponseError} response
        // @return {Void}
        transformResponseText: function (response) { },
        // @method saveForm will serialize the input of some form and save() the given model using it
        // @param {HTMLEvent} e @param {Backbone.Model} model @param {Object} props properties to pass to model.save()
        // @return {jQuery.Deferred}
        saveForm: function (e, model, props) {
            e.preventDefault();
            // Add validate method into the view.model
            Backbone.Validation.bind(this);
            model = model || this.model;
            this.$savingForm = jQuery(e.target).closest('form');
            this.isSavingForm = true;
            if (this.$savingForm.length) {
                // and hides reset buttons
                this.$savingForm.find('input[type="reset"], button[type="reset"]').hide();
            }
            this.hideError();
            var self = this;
            var options = self.selector ? { selector: self.selector } : {};
            // Returns the promise of the save action of the model
            var result = model.save(props || this.$savingForm.serializeObject(), _.extend({
                wait: true,
                forceUpdate: false,
                // Hides error messages, re enables buttons and triggers the save event
                // if we are in a modal this also closes it
                success: function (model, response) {
                    if (self.inModal && self.$containerModal) {
                        self.$containerModal
                            .removeClass('fade')
                            .modal('hide')
                            .data('bs.modal', null);
                    }
                    if (self.$savingForm.length) {
                        self.hideError(self.$savingForm);
                        buttonSubmitDone(self.$savingForm);
                        model.trigger('save', model, response);
                    }
                    model.trigger('saveCompleted');
                },
                // Re enables all button and shows an error message
                error: function (model, response) {
                    buttonSubmitDone(self.$savingForm);
                    if (response.responseText) {
                        self.transformResponseText(response);
                        model.trigger('error', JSON.parse(response.responseText || 'null'));
                    }
                }
            }, options));
            if (result === false) {
                this.$savingForm.find('input[type="reset"], button[type="reset"]').show();
                this.$savingForm.find('*[type=submit], *[type=reset]').attr('disabled', false);
            }
            return result;
        }
    };
    return BackboneFormView;
});

//# sourceMappingURL=Backbone.FormView.js.map
