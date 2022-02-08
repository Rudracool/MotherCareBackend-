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
define("FormView", ["require", "exports", "View", "JQueryExtras", "Utils", "Environment"], function (require, exports, View_1, JQueryExtras_1, Utils, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormView = /** @class */ (function (_super) {
        __extends(FormView, _super);
        function FormView(formModel) {
            var _this = _super.call(this) || this;
            _this.selectors = {
                controlGroup: { attr: 'data-validation', value: 'control-group' },
                control: { attr: 'data-validation', value: 'control' },
                error: { attr: 'data-validation-error', value: '' },
                errorInline: { attr: 'data-validation-error', value: 'inline' },
                errorBlock: { attr: 'data-validation-error', value: 'block' },
                field: { attr: 'name' },
                build: function (selectorName) {
                    var selector = _this.selectors[selectorName];
                    return "[" + selector.attr + "=\"" + selector.value + "\"]";
                }
            };
            _this.helpMessages = {};
            _this.formModel = formModel;
            _this.application = Environment_1.Environment.getApplication();
            return _this;
        }
        FormView.prototype.onFormFieldChange = function (event) {
            event.preventDefault();
            var eventTarget = JQueryExtras_1.jQuery(event.target);
            // removes back-end errors
            this.application.getLayout().hideError();
            var field = this.getFormFieldValue(eventTarget);
            if ('error' in field) {
                this.displayValidationError(field.name, field.error);
            }
            else {
                this.formModel.set(field.name, field.value);
                this.handleErrorMessage(field.name);
            }
        };
        FormView.prototype.handleErrorMessage = function (field) {
            var errors = this.formModel.getValidationErrors();
            if (errors !== null && field in errors) {
                this.displayValidationError(field, errors[field]);
            }
            else {
                this.removeErrorMessage(field);
            }
        };
        FormView.prototype.removeErrorMessage = function (field) {
            var $control = this.$el.find("[" + this.selectors.field.attr + "=\"" + field + "\"]");
            // if its valid we remove the error classnames
            var $group = $control
                .closest(this.selectors.build('controlGroup'))
                .removeAttr(this.selectors.error.attr);
            var $target = $control.data('error-style') === 'inline'
                ? $group.find(this.selectors.build('errorInline'))
                : $group.find(this.selectors.build('errorBlock'));
            if (field in this.helpMessages) {
                $target.text(this.helpMessages[field]);
            }
            // we also need to remove all of the error messages
            $target.remove();
        };
        FormView.prototype.displayValidationError = function (attr, error) {
            var $target;
            var $control = this.$el.find("[" + this.selectors.field.attr + "=\"" + attr + "\"]");
            var $group = $control
                .closest(this.selectors.build('controlGroup'))
                .attr(this.selectors.error.attr, this.selectors.error.value);
            if ($control.data('error-style') === 'inline') {
                // if we don't have a place holder for the error
                // we need to add it. $target will be the placeholder
                if (!$group.find(this.selectors.build('errorInline')).length) {
                    $group
                        .find(this.selectors.build('control'))
                        .append("<span " + this.selectors.errorInline.attr + "=\"" + this.selectors.errorInline.value + "\"></span>");
                }
                $target = $group.find(this.selectors.build('errorInline'));
            }
            else {
                // if we don't have a place holder for the error
                // we need to add it. $target will be the placeholder
                if (!$group.find(this.selectors.build('errorBlock')).length) {
                    $group
                        .find(this.selectors.build('control'))
                        .append("<p " + this.selectors.errorBlock.attr + "=\"" + this.selectors.errorBlock.value + "\"></p>");
                }
                $target = $group.find(this.selectors.build('errorBlock'));
            }
            this.helpMessages[attr] = $target.text();
            return $target.text(error);
        };
        FormView.prototype.displayValidationErrors = function (validationErrors) {
            var _this = this;
            if (validationErrors) {
                Object.keys(validationErrors).forEach(function (field) {
                    _this.displayValidationError(field, validationErrors[field]);
                });
            }
        };
        /**
         * Call save method of "formModel" attribute. if saving goes ok then
         * buttons are shown and if form is in a modal, it will be closed.
         * if something goes wrong then re-enable the submit button and errors are displayed
         *
         * Typically this method will be attached to the submit event of a form like:
         * getEvents(){return {'submit form': 'saveForm'}}
         * @param event
         */
        FormView.prototype.saveForm = function (event) {
            var _this = this;
            event.preventDefault();
            this.application.getLayout().hideError();
            var $savingForm = JQueryExtras_1.jQuery(event.target).closest('form');
            if ($savingForm.length) {
                var formValues = this.getFormValues($savingForm);
                if ('errorCode' in formValues) {
                    this.displayValidationErrors(formValues.errors);
                    this.focusOnFirstValidationError($savingForm);
                }
                else {
                    var saveOperation = this.formModel.save(formValues, {
                        wait: true
                    });
                    if (saveOperation) {
                        // there aren't front-end validation errors
                        this.changeControlButtonsToProcessingMode($savingForm);
                        saveOperation
                            .then(function () {
                            _this.application.getLayout().closeModal();
                        })
                            .always(function () {
                            _this.restoreControlButtons($savingForm);
                        });
                    }
                    else {
                        this.displayValidationErrors(this.formModel.getValidationErrors());
                        this.focusOnFirstValidationError($savingForm);
                    }
                    return saveOperation;
                }
            }
            return false;
        };
        FormView.prototype.setSubmitButtonToProcessing = function ($savingForm) {
            $savingForm.find('[type="submit"]').each(function (index, elem) {
                var element = JQueryExtras_1.jQuery(elem);
                element.attr('disabled', 'disabled');
                element.data('default-text', JQueryExtras_1.jQuery.trim(element.text()));
                element.text(Utils.translate('Processing...'));
            });
        };
        FormView.prototype.restoreSubmitButton = function ($savingForm) {
            $savingForm.find('[type="submit"]').each(function (index, elem) {
                var element = JQueryExtras_1.jQuery(elem);
                element.attr('disabled', null);
                element.text(element.data('default-text'));
            });
        };
        FormView.prototype.focusOnFirstValidationError = function ($savingForm) {
            var $firstInputError = $savingForm.find("[" + this.selectors.error.attr + "]:first input");
            if ($firstInputError) {
                var $controlGroup = $firstInputError.closest(this.selectors.build('controlGroup'));
                if ($controlGroup.length) {
                    JQueryExtras_1.jQuery('body').animate({
                        scrollTop: $controlGroup.offset().top
                    }, 600);
                }
                $firstInputError.trigger('focus');
            }
        };
        FormView.prototype.changeControlButtonsToProcessingMode = function ($savingForm) {
            $savingForm.find('input[type="reset"], button[type="reset"]').hide();
            this.setSubmitButtonToProcessing($savingForm);
        };
        FormView.prototype.restoreControlButtons = function ($savingForm) {
            $savingForm.find('input[type="reset"], button[type="reset"]').show();
            this.restoreSubmitButton($savingForm);
        };
        return FormView;
    }(View_1.View));
    exports.FormView = FormView;
});

//# sourceMappingURL=FormView.js.map
