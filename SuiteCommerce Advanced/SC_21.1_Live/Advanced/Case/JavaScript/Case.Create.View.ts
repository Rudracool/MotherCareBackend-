/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Case.Create.View"/>
// @Typescript-full

import * as case_new_tpl from 'case_new.tpl';
import { CaseModel } from './Case.Model';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { CaseFieldsModel } from './Case.Fields.Model';
import { AjaxRequestsKiller } from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import { PageTypeFormView } from '../../../Commons/Core/JavaScript/PageTypeFormView';
import { BreadCrumbPage, PageTypeViewOptions } from '../../../Commons/Core/JavaScript/PageTypeView';
import { EventsHash } from '../../../Commons/Core/JavaScript/View';
import { InferModelServiceContract } from '../../../Commons/Core/JavaScript/backbone/backbone';
import { FormFieldsError, FormFieldValue } from '../../../Commons/Core/JavaScript/FormView';
import { Errors } from '../../../Commons/Core/JavaScript/Error';
import { Case, CaseFieldText } from '../../../ServiceContract/SC/Case/Case';
import { ProfileModel } from '../../../Commons/Profile/JavaScript/Profile.Model';
import * as Backbone from '../../../Commons/Core/JavaScript/backbone/BackboneExtras';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';

interface CaseCreateViewContext {
    pageHeader: string;
    categories: CaseFieldText[];
    showBackToAccount: boolean;
}

export class CaseCreateView extends PageTypeFormView<CaseModel, CaseCreateViewContext> {
    protected template = case_new_tpl;

    protected title = Utils.translate('How can we help you?');

    protected pageHeader = Utils.translate('How can we help you?');
    private readonly fields: CaseFieldsModel;
    private user: ProfileModel;
    protected newCaseId: string;
    protected newCaseMessage: string;
    public attributes = {
        id: 'NewCase',
        class: 'newCase'
    };

    public constructor(options: PageTypeViewOptions) {
        super(options, new CaseModel());
        this.fields = new CaseFieldsModel();
        this.user = ProfileModel.getInstance();
        this.formModel.set('isNewCase', true);
        this.newCaseId = '';
        this.newCaseMessage = '';
    }

    protected getEvents(): EventsHash {
        return {
            'submit form': 'saveForm',
            'click [data-action="include_email"]': 'includeAnotherEmail',
            'keypress [data-action="text"]': 'preventEnter',
            'blur [name="title"]': 'onFormFieldChange',
            'blur [name="category"]': 'onFormFieldChange',
            'blur [name="message"]': 'onFormFieldChange',
            'blur [name="email"]': 'onFormFieldChange'
        };
    }

    public beforeShowContent<CaseFields>(): Promise<CaseFields> {
        return this.fields.fetch({
            killerId: AjaxRequestsKiller.getKillerId()
        });
    }

    protected getFormValues(
        $savingForm: JQuery<HTMLElement>
    ): Partial<Case> | FormFieldsError<Case> {
        const formValues = $savingForm.serializeObject();
        let title = '';
        let category = '';
        let message = '';
        let email = '';
        let includeEmail = false;
        const errorsResult: FormFieldsError<Case> = {
            errorCode: Errors.FormValidation,
            errors: {}
        };
        if ('title' in formValues && typeof formValues.title === 'string' && formValues.title) {
            title = formValues.title;
        } else {
            errorsResult.errors.title = Utils.translate('Subject is required');
        }
        if (
            'category' in formValues &&
            typeof formValues.category === 'string' &&
            formValues.category
        ) {
            category = formValues.category;
        }
        if (
            'message' in formValues &&
            typeof formValues.message === 'string' &&
            formValues.message
        ) {
            message = formValues.message;
        } else {
            errorsResult.errors.message = Utils.translate('message is required');
        }
        if (
            'include_email' in formValues &&
            typeof formValues.include_email === 'string' &&
            formValues.include_email === 'on'
        ) {
            includeEmail = true;
            if ('email' in formValues && typeof formValues.email === 'string' && formValues.email) {
                email = formValues.email;
            } else {
                errorsResult.errors.email = Utils.translate('Please provide a valid email');
            }
        }
        if (title && category && message) {
            const result: Partial<Case> = {
                title,
                category,
                message
            };
            if (includeEmail) {
                result.email = email;
            }
            return result;
        }
        return errorsResult;
    }

    protected saveForm(
        event: JQuery.TriggeredEvent
    ): JQuery.jqXHR<InferModelServiceContract<CaseModel>> | false {
        const saveForm = super.saveForm(event);
        if (saveForm) {
            saveForm.then(
                (): void => {
                    this.showSuccess();
                }
            );
        }
        return saveForm;
    }

    protected getFormFieldValue(changedInput: JQuery<HTMLElement>): FormFieldValue<Case> {
        const newVal = changedInput.val();
        const fieldName = changedInput.attr('name');
        if (fieldName === 'title' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'email' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'message' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'category' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }

        return {
            name: fieldName || '',
            error: Utils.translate(`Please provide a valid ${fieldName}`)
        };
    }

    private preventEnter(event: JQuery.TriggeredEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    private showSuccess(): void {
        const caseLinkName = Utils.translate(
            'support case #$(0)',
            this.formModel.get('caseNumber')
        );
        const newCaseInternalId = `${this.formModel.get('internalid')}`;
        const newCaseMessage = Utils.translate(
            'Good! your <a href="/cases/$(0)">$(1)</a> was submitted. We will contact you briefly.',
            newCaseInternalId,
            caseLinkName
        );

        this.newCaseId = newCaseInternalId;
        this.newCaseMessage = newCaseMessage;

        Backbone.history.navigate('cases', { trigger: true });
    }

    protected getSelectedMenu(): string {
        return 'newcase';
    }

    public getBreadcrumbPages = (): BreadCrumbPage[] => {
        return [
            {
                text: this.title,
                href: '/newcase'
            }
        ];
    };

    private showError(message, type?, closable?, disableElements?) {
        const Application = Environment.getApplication();
        const layout = Application.getLayout();
        layout.showError(message, type, closable, disableElements);
    }

    private includeAnotherEmail(): void {
        const emailInput = this.$('[data-case-email]');
        const status = emailInput.prop('disabled');

        emailInput.prop('disabled', !status);

        this.$el.find('[data-collapse-content]').collapse(status ? 'show' : 'hide');
    }

    public getContext(): CaseCreateViewContext {
        return {
            pageHeader: this.pageHeader,
            categories: this.fields.get('categories'),
            showBackToAccount:
                this.options.application.getConfig().siteSettings.sitetype === 'STANDARD'
        };
    }
}
