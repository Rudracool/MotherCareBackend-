/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Case.Detail.View"/>
// @Typescript-full

import * as _ from 'underscore';
import * as case_detail_tpl from 'case_detail.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { CaseModel } from './Case.Model';
import { CaseFieldsModel } from './Case.Fields.Model';
import { AjaxRequestsKiller } from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import { PageTypeFormView } from '../../../Commons/Core/JavaScript/PageTypeFormView';
import { BreadCrumbPage, PageTypeViewOptions } from '../../../Commons/Core/JavaScript/PageTypeView';
import { EventsHash } from '../../../Commons/Core/JavaScript/View';
import { InferModelServiceContract } from '../../../Commons/Core/JavaScript/backbone/backbone';
import { FormFieldsError, FormFieldValue } from '../../../Commons/Core/JavaScript/FormView';
import { Errors } from '../../../Commons/Core/JavaScript/Error';
import { Case, CaseFields } from '../../../ServiceContract/SC/Case/Case';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';

interface CaseDetailViewContext {
    model: CaseModel;
    pageHeader: string;
    collapseElements: string;
    closeStatusId: boolean;
}

export interface BeforeShowContentPromise {
    caseResult: Case;
    caseFieldsResult: CaseFields;
}

export class CaseDetailView extends PageTypeFormView<CaseModel, CaseDetailViewContext> {
    private fields: CaseFieldsModel;

    protected template = case_detail_tpl;

    protected title = Utils.translate('Case Details');

    public attributes = {
        id: '',
        class: 'caseDetail'
    };

    public constructor(options: PageTypeViewOptions) {
        super(options, new CaseModel());

        const caseInternalId = options.routerArguments[0];
        this.formModel.set('internalid', caseInternalId);

        this.fields = new CaseFieldsModel();
    }

    protected getEvents(): EventsHash {
        return {
            'submit form': 'saveForm',
            'click [data-action="reset"]': 'resetForm',
            'click [data-action="close-case"]': 'closeCase',
            'blur [name="reply"]': 'onFormFieldChange'
        };
    }

    protected saveForm(
        event: JQuery.TriggeredEvent
    ): JQuery.jqXHR<InferModelServiceContract<CaseModel>> | false {
        const saveForm = super.saveForm(event);
        if (saveForm) {
            saveForm.then(
                (): void => {
                    this.showContent().then(() => {
                        this.options.application
                            .getLayout()
                            .showConfirmationMessage(
                                Utils.translate(
                                    'Good! Your message was sent. A support representative should contact you briefly.'
                                )
                            );
                    });
                }
            );
        }
        return saveForm;
    }

    protected getFormFieldValue(changedInput: JQuery<HTMLElement>): FormFieldValue<Case> {
        const newVal = changedInput.val();
        const fieldName = changedInput.attr('name');
        if (fieldName === 'reply' && typeof newVal === 'string') {
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

    protected getFormValues(
        $savingForm: JQuery<HTMLElement>
    ): Partial<Case> | FormFieldsError<Case> {
        const formValues = $savingForm.serializeObject();
        let reply = '';
        const errorsResult: FormFieldsError<Case> = {
            errorCode: Errors.FormValidation,
            errors: {}
        };

        if ('reply' in formValues && typeof formValues.reply === 'string' && formValues.reply) {
            reply = formValues.reply;
        } else {
            errorsResult.errors.reply = Utils.translate('reply is required');
        }

        if (reply) {
            return {
                reply
            };
        }

        return errorsResult;
    }

    public beforeShowContent<BeforeShowContentPromise>(): Promise<BeforeShowContentPromise> {
        return jQuery
            .when(
                this.formModel.fetch({
                    killerId: AjaxRequestsKiller.getKillerId()
                }),
                this.fields.fetch({
                    killerId: AjaxRequestsKiller.getKillerId()
                })
            )
            .then((caseResult: Case, caseFieldsResult: CaseFields) => {
                return { caseResult, caseFieldsResult };
            });
    }

    public getSelectedMenu(): string {
        return 'cases';
    }

    public getBreadcrumbPages = (): BreadCrumbPage[] => {
        return [
            {
                text: Utils.translate('Support Cases'),
                href: '/cases'
            },
            {
                text: Utils.translate('Case #$(0)', this.formModel.get('internalid') || ''),
                href: `/case/${this.formModel.get('internalid')}`
            }
        ];
    };

    private showError(message, type?, closable?, disableElements?) {
        const Application = Environment.getApplication();
        const layout = Application.getLayout();
        layout.showError(message, type, closable, disableElements);
    }

    private closeCase(event: JQuery.TriggeredEvent): void {
        event.preventDefault();

        this.formModel.set('reply', '');
        this.formModel.set('status', {
            id: this.options.application.getConfig().cases.defaultValues.statusClose.id,
            name: ''
        });

        this.formModel.isClosing = true;

        const saveResult = this.formModel.save();

        if (saveResult) {
            saveResult.done(() => {
                this.formModel.isClosing = false;
                this.showContent().then(() => {
                    this.options.application
                        .getLayout()
                        .showConfirmationMessage(Utils.translate('Case successfully closed'));
                });
            });
        }
    }

    private resetForm(event: JQuery.TriggeredEvent): void {
        event.preventDefault();
        this.showContent();
    }

    public getContext(): CaseDetailViewContext {
        _.each(this.formModel.get('grouped_messages'), function(groupMessage) {
            _.each(groupMessage.messages, function(message) {
                message.text = Utils.parseRichText(message.text);
            });
        });
        return {
            model: this.formModel,
            pageHeader: Utils.translate('Case #$(0):', this.formModel.get('caseNumber')),
            collapseElements: this.options.application.getConfig().sca.collapseElements,
            closeStatusId:
                this.formModel.get('status').id !==
                this.options.application.getConfig().cases.defaultValues.statusClose.id
        };
    }
}
