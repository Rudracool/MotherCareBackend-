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
define("Case.Detail.View", ["require", "exports", "underscore", "case_detail.tpl", "Utils", "jQuery", "Case.Model", "Case.Fields.Model", "AjaxRequestsKiller", "PageTypeFormView", "Error", "Environment"], function (require, exports, _, case_detail_tpl, Utils, jQuery, Case_Model_1, Case_Fields_Model_1, AjaxRequestsKiller_1, PageTypeFormView_1, Error_1, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CaseDetailView = /** @class */ (function (_super) {
        __extends(CaseDetailView, _super);
        function CaseDetailView(options) {
            var _this = _super.call(this, options, new Case_Model_1.CaseModel()) || this;
            _this.template = case_detail_tpl;
            _this.title = Utils.translate('Case Details');
            _this.attributes = {
                id: '',
                class: 'caseDetail'
            };
            _this.getBreadcrumbPages = function () {
                return [
                    {
                        text: Utils.translate('Support Cases'),
                        href: '/cases'
                    },
                    {
                        text: Utils.translate('Case #$(0)', _this.formModel.get('internalid') || ''),
                        href: "/case/" + _this.formModel.get('internalid')
                    }
                ];
            };
            var caseInternalId = options.routerArguments[0];
            _this.formModel.set('internalid', caseInternalId);
            _this.fields = new Case_Fields_Model_1.CaseFieldsModel();
            return _this;
        }
        CaseDetailView.prototype.getEvents = function () {
            return {
                'submit form': 'saveForm',
                'click [data-action="reset"]': 'resetForm',
                'click [data-action="close-case"]': 'closeCase',
                'blur [name="reply"]': 'onFormFieldChange'
            };
        };
        CaseDetailView.prototype.saveForm = function (event) {
            var _this = this;
            var saveForm = _super.prototype.saveForm.call(this, event);
            if (saveForm) {
                saveForm.then(function () {
                    _this.showContent().then(function () {
                        _this.options.application
                            .getLayout()
                            .showConfirmationMessage(Utils.translate('Good! Your message was sent. A support representative should contact you briefly.'));
                    });
                });
            }
            return saveForm;
        };
        CaseDetailView.prototype.getFormFieldValue = function (changedInput) {
            var newVal = changedInput.val();
            var fieldName = changedInput.attr('name');
            if (fieldName === 'reply' && typeof newVal === 'string') {
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
        CaseDetailView.prototype.getFormValues = function ($savingForm) {
            var formValues = $savingForm.serializeObject();
            var reply = '';
            var errorsResult = {
                errorCode: Error_1.Errors.FormValidation,
                errors: {}
            };
            if ('reply' in formValues && typeof formValues.reply === 'string' && formValues.reply) {
                reply = formValues.reply;
            }
            else {
                errorsResult.errors.reply = Utils.translate('reply is required');
            }
            if (reply) {
                return {
                    reply: reply
                };
            }
            return errorsResult;
        };
        CaseDetailView.prototype.beforeShowContent = function () {
            return jQuery
                .when(this.formModel.fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            }), this.fields.fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            }))
                .then(function (caseResult, caseFieldsResult) {
                return { caseResult: caseResult, caseFieldsResult: caseFieldsResult };
            });
        };
        CaseDetailView.prototype.getSelectedMenu = function () {
            return 'cases';
        };
        CaseDetailView.prototype.showError = function (message, type, closable, disableElements) {
            var Application = Environment_1.Environment.getApplication();
            var layout = Application.getLayout();
            layout.showError(message, type, closable, disableElements);
        };
        CaseDetailView.prototype.closeCase = function (event) {
            var _this = this;
            event.preventDefault();
            this.formModel.set('reply', '');
            this.formModel.set('status', {
                id: this.options.application.getConfig().cases.defaultValues.statusClose.id,
                name: ''
            });
            this.formModel.isClosing = true;
            var saveResult = this.formModel.save();
            if (saveResult) {
                saveResult.done(function () {
                    _this.formModel.isClosing = false;
                    _this.showContent().then(function () {
                        _this.options.application
                            .getLayout()
                            .showConfirmationMessage(Utils.translate('Case successfully closed'));
                    });
                });
            }
        };
        CaseDetailView.prototype.resetForm = function (event) {
            event.preventDefault();
            this.showContent();
        };
        CaseDetailView.prototype.getContext = function () {
            _.each(this.formModel.get('grouped_messages'), function (groupMessage) {
                _.each(groupMessage.messages, function (message) {
                    message.text = Utils.parseRichText(message.text);
                });
            });
            return {
                model: this.formModel,
                pageHeader: Utils.translate('Case #$(0):', this.formModel.get('caseNumber')),
                collapseElements: this.options.application.getConfig().sca.collapseElements,
                closeStatusId: this.formModel.get('status').id !==
                    this.options.application.getConfig().cases.defaultValues.statusClose.id
            };
        };
        return CaseDetailView;
    }(PageTypeFormView_1.PageTypeFormView));
    exports.CaseDetailView = CaseDetailView;
});

//# sourceMappingURL=Case.Detail.View.js.map
