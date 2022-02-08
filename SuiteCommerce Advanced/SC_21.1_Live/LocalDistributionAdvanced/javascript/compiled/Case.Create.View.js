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
define("Case.Create.View", ["require", "exports", "case_new.tpl", "Case.Model", "Utils", "Case.Fields.Model", "AjaxRequestsKiller", "PageTypeFormView", "Error", "Profile.Model", "BackboneExtras", "Environment"], function (require, exports, case_new_tpl, Case_Model_1, Utils, Case_Fields_Model_1, AjaxRequestsKiller_1, PageTypeFormView_1, Error_1, Profile_Model_1, Backbone, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CaseCreateView = /** @class */ (function (_super) {
        __extends(CaseCreateView, _super);
        function CaseCreateView(options) {
            var _this = _super.call(this, options, new Case_Model_1.CaseModel()) || this;
            _this.template = case_new_tpl;
            _this.title = Utils.translate('How can we help you?');
            _this.pageHeader = Utils.translate('How can we help you?');
            _this.attributes = {
                id: 'NewCase',
                class: 'newCase'
            };
            _this.getBreadcrumbPages = function () {
                return [
                    {
                        text: _this.title,
                        href: '/newcase'
                    }
                ];
            };
            _this.fields = new Case_Fields_Model_1.CaseFieldsModel();
            _this.user = Profile_Model_1.ProfileModel.getInstance();
            _this.formModel.set('isNewCase', true);
            _this.newCaseId = '';
            _this.newCaseMessage = '';
            return _this;
        }
        CaseCreateView.prototype.getEvents = function () {
            return {
                'submit form': 'saveForm',
                'click [data-action="include_email"]': 'includeAnotherEmail',
                'keypress [data-action="text"]': 'preventEnter',
                'blur [name="title"]': 'onFormFieldChange',
                'blur [name="category"]': 'onFormFieldChange',
                'blur [name="message"]': 'onFormFieldChange',
                'blur [name="email"]': 'onFormFieldChange'
            };
        };
        CaseCreateView.prototype.beforeShowContent = function () {
            return this.fields.fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        };
        CaseCreateView.prototype.getFormValues = function ($savingForm) {
            var formValues = $savingForm.serializeObject();
            var title = '';
            var category = '';
            var message = '';
            var email = '';
            var includeEmail = false;
            var errorsResult = {
                errorCode: Error_1.Errors.FormValidation,
                errors: {}
            };
            if ('title' in formValues && typeof formValues.title === 'string' && formValues.title) {
                title = formValues.title;
            }
            else {
                errorsResult.errors.title = Utils.translate('Subject is required');
            }
            if ('category' in formValues &&
                typeof formValues.category === 'string' &&
                formValues.category) {
                category = formValues.category;
            }
            if ('message' in formValues &&
                typeof formValues.message === 'string' &&
                formValues.message) {
                message = formValues.message;
            }
            else {
                errorsResult.errors.message = Utils.translate('message is required');
            }
            if ('include_email' in formValues &&
                typeof formValues.include_email === 'string' &&
                formValues.include_email === 'on') {
                includeEmail = true;
                if ('email' in formValues && typeof formValues.email === 'string' && formValues.email) {
                    email = formValues.email;
                }
                else {
                    errorsResult.errors.email = Utils.translate('Please provide a valid email');
                }
            }
            if (title && category && message) {
                var result = {
                    title: title,
                    category: category,
                    message: message
                };
                if (includeEmail) {
                    result.email = email;
                }
                return result;
            }
            return errorsResult;
        };
        CaseCreateView.prototype.saveForm = function (event) {
            var _this = this;
            var saveForm = _super.prototype.saveForm.call(this, event);
            if (saveForm) {
                saveForm.then(function () {
                    _this.showSuccess();
                });
            }
            return saveForm;
        };
        CaseCreateView.prototype.getFormFieldValue = function (changedInput) {
            var newVal = changedInput.val();
            var fieldName = changedInput.attr('name');
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
                error: Utils.translate("Please provide a valid " + fieldName)
            };
        };
        CaseCreateView.prototype.preventEnter = function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        };
        CaseCreateView.prototype.showSuccess = function () {
            var caseLinkName = Utils.translate('support case #$(0)', this.formModel.get('caseNumber'));
            var newCaseInternalId = "" + this.formModel.get('internalid');
            var newCaseMessage = Utils.translate('Good! your <a href="/cases/$(0)">$(1)</a> was submitted. We will contact you briefly.', newCaseInternalId, caseLinkName);
            this.newCaseId = newCaseInternalId;
            this.newCaseMessage = newCaseMessage;
            Backbone.history.navigate('cases', { trigger: true });
        };
        CaseCreateView.prototype.getSelectedMenu = function () {
            return 'newcase';
        };
        CaseCreateView.prototype.showError = function (message, type, closable, disableElements) {
            var Application = Environment_1.Environment.getApplication();
            var layout = Application.getLayout();
            layout.showError(message, type, closable, disableElements);
        };
        CaseCreateView.prototype.includeAnotherEmail = function () {
            var emailInput = this.$('[data-case-email]');
            var status = emailInput.prop('disabled');
            emailInput.prop('disabled', !status);
            this.$el.find('[data-collapse-content]').collapse(status ? 'show' : 'hide');
        };
        CaseCreateView.prototype.getContext = function () {
            return {
                pageHeader: this.pageHeader,
                categories: this.fields.get('categories'),
                showBackToAccount: this.options.application.getConfig().siteSettings.sitetype === 'STANDARD'
            };
        };
        return CaseCreateView;
    }(PageTypeFormView_1.PageTypeFormView));
    exports.CaseCreateView = CaseCreateView;
});

//# sourceMappingURL=Case.Create.View.js.map
