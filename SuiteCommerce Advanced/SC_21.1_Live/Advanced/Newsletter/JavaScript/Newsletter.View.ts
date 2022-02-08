/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Newsletter.View"/>
// @Typescript-full
import * as newsletter_tpl from 'newsletter.tpl';
import { Newsletter, NewsletterModel } from './Newsletter.Model';
import {
    FormFieldsError,
    FormFieldValue,
    FormView
} from '../../../Commons/Core/JavaScript/FormView';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { ChildViews, EventsHash } from '../../../Commons/Core/JavaScript/View';
import {
    InferModelEntity,
    InferModelServiceContract
} from '../../../Commons/Core/JavaScript/backbone/backbone';
import { Errors } from '../../../Commons/Core/JavaScript/Error';

import { GlobalViewsMessageView } from '../../../Commons/GlobalViews/JavaScript/GlobalViews.Message.View';

interface NewsletterViewState {
    code: string; // The answer string code
    message: string; // The text we need to show as feedback
    messageType: string; // The kind of message we need to display as feedback (error, warning or success)
}
interface NewsletterViewContext {
    isFeedback: boolean;
    model: NewsletterModel;
}
export class NewsletterView extends FormView<NewsletterModel, NewsletterViewContext> {
    protected template = newsletter_tpl;

    protected getEvents(): EventsHash | null {
        return {
            'submit form': 'saveForm',
            'blur [name="email"]': 'onFormFieldChange'
        };
    }

    // @property {Object} feedback Keeps the text and kind of message we need to show as feedback
    private feedback = {
        OK: {
            type: 'success',
            message: Utils.translate('Thank you! Welcome to our newsletter')
        },
        ERR_USER_STATUS_ALREADY_SUBSCRIBED: {
            type: 'warning',
            message: Utils.translate('Sorry, the specified email is already subscribed.')
        },
        ERR_USER_STATUS_DISABLED: {
            type: 'error',
            message: Utils.translate('Sorry, the specified email cannot be subscribed.')
        },
        ERROR: {
            type: 'error',
            message: Utils.translate('Sorry, subscription cannot be done. Try again later.')
        }
    };

    private state: NewsletterViewState;

    public constructor() {
        super(new NewsletterModel());
        this.state = {
            code: '',
            message: '',
            messageType: ''
        };
    }

    protected saveForm(
        e: JQuery.TriggeredEvent
    ): JQuery.jqXHR<InferModelServiceContract<NewsletterModel>> | false {
        e.preventDefault();

        const promise = super.saveForm(e);

        if (promise) {
            promise
                .fail((jqXhr: JQuery.jqXHR<InferModelServiceContract<NewsletterModel>>) => {
                    (<any>jqXhr).preventDefault = true;
                    const errorCode =
                        jqXhr &&
                        jqXhr.responseJSON &&
                        jqXhr.responseJSON.errorCode &&
                        this.feedback[jqXhr.responseJSON.errorCode]
                            ? jqXhr.responseJSON.errorCode
                            : 'ERROR';

                    this.state.code = errorCode;
                    this.state.message = this.feedback[errorCode].message;
                    this.state.messageType = this.feedback[errorCode].type;
                })
                .done(() => {
                    this.state.code = this.formModel.get('code');
                    this.state.message = this.feedback[this.formModel.get('code')].message;
                    this.state.messageType = this.feedback[this.formModel.get('code')].type;

                    this.formModel.set('email', '');
                })
                .always(() => {
                    this.render();
                });
        }
        return promise;
    }

    protected getChildViews(): ChildViews {
        return {
            GlobalMessageFeedback: () => {
                return new GlobalViewsMessageView({
                    message: this.state.message,
                    type: this.state.messageType,
                    closable: true
                });
            }
        };
    }

    protected getFormValues(
        $savingForm: JQuery<HTMLElement>
    ):
        | Partial<InferModelEntity<NewsletterModel>>
        | FormFieldsError<InferModelEntity<NewsletterModel>> {
        const formValues = $savingForm.serializeObject();
        if ('email' in formValues && typeof formValues.email === 'string') {
            return {
                email: formValues.email
            };
        }
        return {
            errorCode: Errors.FormValidation,
            errors: {
                email: Utils.translate('Please provide a valid email')
            }
        };
    }

    protected getFormFieldValue(changedInput: JQuery<HTMLElement>): FormFieldValue<Newsletter> {
        const newVal = changedInput.val();
        const fieldName = changedInput.attr('name');
        if (fieldName === 'email' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        return {
            name: fieldName || '',
            error: Utils.translate('Please provide a valid email')
        };
    }

    public getContext(): NewsletterViewContext {
        return {
            isFeedback: !!this.state.code,
            model: this.formModel
        };
    }
}
