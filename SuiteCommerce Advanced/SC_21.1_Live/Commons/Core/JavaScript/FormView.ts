/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="FormView"/>
// @Typescript-full

import { View } from './View';
import { jQuery } from './jquery/JQueryExtras';

import * as Utils from '../../Utilities/JavaScript/Utils';
import { Model } from './Model';
import { Application } from '../../ApplicationSkeleton/JavaScript/Application';
import { Environment } from './Environment';
import { PropertiesName } from './Types';
import { InferModelEntity, InferModelServiceContract } from './backbone/backbone';
import { ValidationErrors } from './Validator';
import { Error, Errors } from './Error';

type HelpMessages<TEntity> = Partial<{ [key in PropertiesName<TEntity>]: string }>;
export interface FormFieldError {
    name: string;
    error: string;
}

export interface FormFieldsError<TEntity> extends Error {
    errorCode: Errors.FormValidation;
    errors: ValidationErrors<TEntity>;
}
export type FormFieldValue<T> =
    | { [K in PropertiesName<T>]: { name: K; value: T[K] } }[PropertiesName<T>]
    | FormFieldError;

export abstract class FormView<
    TModel extends Model<InferModelEntity<TModel>, InferModelServiceContract<TModel>, {}>,
    TContext extends object,
    TEvents extends object = {}
> extends View<TContext, TEvents> {
    protected formModel: TModel;
    protected application: Application;
    private readonly selectors = {
        controlGroup: { attr: 'data-validation', value: 'control-group' },
        control: { attr: 'data-validation', value: 'control' },
        error: { attr: 'data-validation-error', value: '' },
        errorInline: { attr: 'data-validation-error', value: 'inline' },
        errorBlock: { attr: 'data-validation-error', value: 'block' },
        field: { attr: 'name' },
        build: (selectorName): string => {
            const selector = this.selectors[selectorName];
            return `[${selector.attr}="${selector.value}"]`;
        }
    };

    private readonly helpMessages: HelpMessages<InferModelEntity<TModel>> = {};

    protected constructor(formModel: TModel) {
        super();
        this.formModel = formModel;
        this.application = Environment.getApplication();
    }

    protected onFormFieldChange(event: JQuery.TriggeredEvent): void {
        event.preventDefault();
        const eventTarget = jQuery(event.target);
        // removes back-end errors
        this.application.getLayout().hideError();
        const field = this.getFormFieldValue(eventTarget);
        if ('error' in field) {
            this.displayValidationError(field.name, field.error);
        } else {
            this.formModel.set(field.name, field.value);
            this.handleErrorMessage(field.name);
        }
    }

    /**
     * Called by onFormFieldChange method
     * @param changedInput
     * @return the field name and value, the value will have the data type expected by the model,
     * if error attribute is returned the error will be displayed
     */
    protected abstract getFormFieldValue(
        changedInput: JQuery<HTMLElement>
    ): FormFieldValue<InferModelEntity<TModel>>;

    protected handleErrorMessage(field: PropertiesName<InferModelEntity<TModel>>): void {
        const errors = this.formModel.getValidationErrors();
        if (errors !== null && field in errors) {
            this.displayValidationError(field, errors[field]);
        } else {
            this.removeErrorMessage(field);
        }
    }

    protected removeErrorMessage<E extends PropertiesName<InferModelEntity<TModel>>>(
        field: E
    ): void {
        const $control = this.$el.find(`[${this.selectors.field.attr}="${field}"]`);
        // if its valid we remove the error classnames
        const $group = $control
            .closest(this.selectors.build('controlGroup'))
            .removeAttr(this.selectors.error.attr);
        const $target =
            $control.data('error-style') === 'inline'
                ? $group.find(this.selectors.build('errorInline'))
                : $group.find(this.selectors.build('errorBlock'));

        if (field in this.helpMessages) {
            $target.text(this.helpMessages[field]);
        }
        // we also need to remove all of the error messages
        $target.remove();
    }

    protected displayValidationError(attr: string, error: string): void {
        let $target;
        const $control = this.$el.find(`[${this.selectors.field.attr}="${attr}"]`);
        const $group = $control
            .closest(this.selectors.build('controlGroup'))
            .attr(this.selectors.error.attr, this.selectors.error.value);

        if ($control.data('error-style') === 'inline') {
            // if we don't have a place holder for the error
            // we need to add it. $target will be the placeholder
            if (!$group.find(this.selectors.build('errorInline')).length) {
                $group
                    .find(this.selectors.build('control'))
                    .append(
                        `<span ${this.selectors.errorInline.attr}="${
                            this.selectors.errorInline.value
                        }"></span>`
                    );
            }

            $target = $group.find(this.selectors.build('errorInline'));
        } else {
            // if we don't have a place holder for the error
            // we need to add it. $target will be the placeholder
            if (!$group.find(this.selectors.build('errorBlock')).length) {
                $group
                    .find(this.selectors.build('control'))
                    .append(
                        `<p ${this.selectors.errorBlock.attr}="${
                            this.selectors.errorBlock.value
                        }"></p>`
                    );
            }

            $target = $group.find(this.selectors.build('errorBlock'));
        }

        this.helpMessages[attr] = $target.text();

        return $target.text(error);
    }

    protected displayValidationErrors(
        validationErrors: ValidationErrors<InferModelEntity<TModel>> | null
    ): void {
        if (validationErrors) {
            Object.keys(validationErrors).forEach(
                (field): void => {
                    this.displayValidationError(field, validationErrors[field]);
                }
            );
        }
    }
    /**
     * Call save method of "formModel" attribute. if saving goes ok then
     * buttons are shown and if form is in a modal, it will be closed.
     * if something goes wrong then re-enable the submit button and errors are displayed
     *
     * Typically this method will be attached to the submit event of a form like:
     * getEvents(){return {'submit form': 'saveForm'}}
     * @param event
     */
    protected saveForm(
        event: JQuery.TriggeredEvent
    ): JQuery.jqXHR<InferModelServiceContract<TModel>> | false {
        event.preventDefault();
        this.application.getLayout().hideError();
        const $savingForm = jQuery(event.target).closest('form');
        if ($savingForm.length) {
            const formValues = this.getFormValues($savingForm);
            if ('errorCode' in formValues) {
                this.displayValidationErrors(formValues.errors);
                this.focusOnFirstValidationError($savingForm);
            } else {
                const saveOperation = this.formModel.save(formValues, {
                    wait: true
                });
                if (saveOperation) {
                    // there aren't front-end validation errors
                    this.changeControlButtonsToProcessingMode($savingForm);
                    saveOperation
                        .then(
                            (): void => {
                                this.application.getLayout().closeModal();
                            }
                        )
                        .always(
                            (): void => {
                                this.restoreControlButtons($savingForm);
                            }
                        );
                } else {
                    this.displayValidationErrors(this.formModel.getValidationErrors());
                    this.focusOnFirstValidationError($savingForm);
                }
                return saveOperation;
            }
        }
        return false;
    }

    protected abstract getFormValues(
        $savingForm: JQuery<HTMLElement>
    ): Partial<InferModelEntity<TModel>> | FormFieldsError<InferModelEntity<TModel>>;

    protected setSubmitButtonToProcessing($savingForm: JQuery<HTMLElement>): void {
        $savingForm.find('[type="submit"]').each(
            (index: number, elem: HTMLElement): void => {
                const element = jQuery(elem);
                element.attr('disabled', 'disabled');
                element.data('default-text', jQuery.trim(element.text()));
                element.text(Utils.translate('Processing...'));
            }
        );
    }

    protected restoreSubmitButton($savingForm: JQuery<HTMLElement>): void {
        $savingForm.find('[type="submit"]').each(
            (index: number, elem: HTMLElement): void => {
                const element = jQuery(elem);
                element.attr('disabled', null);
                element.text(element.data('default-text'));
            }
        );
    }

    protected focusOnFirstValidationError($savingForm: JQuery<HTMLElement>): void {
        const $firstInputError = $savingForm.find(`[${this.selectors.error.attr}]:first input`);
        if ($firstInputError) {
            const $controlGroup = $firstInputError.closest(this.selectors.build('controlGroup'));
            if ($controlGroup.length) {
                jQuery('body').animate(
                    {
                        scrollTop: $controlGroup.offset().top
                    },
                    600
                );
            }
            $firstInputError.trigger('focus');
        }
    }
    protected changeControlButtonsToProcessingMode($savingForm: JQuery<HTMLElement>): void {
        $savingForm.find('input[type="reset"], button[type="reset"]').hide();
        this.setSubmitButtonToProcessing($savingForm);
    }
    protected restoreControlButtons($savingForm: JQuery<HTMLElement>): void {
        $savingForm.find('input[type="reset"], button[type="reset"]').show();
        this.restoreSubmitButton($savingForm);
    }
}
