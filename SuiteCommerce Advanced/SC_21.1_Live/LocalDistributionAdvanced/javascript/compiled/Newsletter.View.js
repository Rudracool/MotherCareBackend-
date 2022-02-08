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
define("Newsletter.View", ["require", "exports", "newsletter.tpl", "Newsletter.Model", "FormView", "Utils", "Error", "GlobalViews.Message.View"], function (require, exports, newsletter_tpl, Newsletter_Model_1, FormView_1, Utils, Error_1, GlobalViews_Message_View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NewsletterView = /** @class */ (function (_super) {
        __extends(NewsletterView, _super);
        function NewsletterView() {
            var _this = _super.call(this, new Newsletter_Model_1.NewsletterModel()) || this;
            _this.template = newsletter_tpl;
            // @property {Object} feedback Keeps the text and kind of message we need to show as feedback
            _this.feedback = {
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
            _this.state = {
                code: '',
                message: '',
                messageType: ''
            };
            return _this;
        }
        NewsletterView.prototype.getEvents = function () {
            return {
                'submit form': 'saveForm',
                'blur [name="email"]': 'onFormFieldChange'
            };
        };
        NewsletterView.prototype.saveForm = function (e) {
            var _this = this;
            e.preventDefault();
            var promise = _super.prototype.saveForm.call(this, e);
            if (promise) {
                promise
                    .fail(function (jqXhr) {
                    jqXhr.preventDefault = true;
                    var errorCode = jqXhr &&
                        jqXhr.responseJSON &&
                        jqXhr.responseJSON.errorCode &&
                        _this.feedback[jqXhr.responseJSON.errorCode]
                        ? jqXhr.responseJSON.errorCode
                        : 'ERROR';
                    _this.state.code = errorCode;
                    _this.state.message = _this.feedback[errorCode].message;
                    _this.state.messageType = _this.feedback[errorCode].type;
                })
                    .done(function () {
                    _this.state.code = _this.formModel.get('code');
                    _this.state.message = _this.feedback[_this.formModel.get('code')].message;
                    _this.state.messageType = _this.feedback[_this.formModel.get('code')].type;
                    _this.formModel.set('email', '');
                })
                    .always(function () {
                    _this.render();
                });
            }
            return promise;
        };
        NewsletterView.prototype.getChildViews = function () {
            var _this = this;
            return {
                GlobalMessageFeedback: function () {
                    return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                        message: _this.state.message,
                        type: _this.state.messageType,
                        closable: true
                    });
                }
            };
        };
        NewsletterView.prototype.getFormValues = function ($savingForm) {
            var formValues = $savingForm.serializeObject();
            if ('email' in formValues && typeof formValues.email === 'string') {
                return {
                    email: formValues.email
                };
            }
            return {
                errorCode: Error_1.Errors.FormValidation,
                errors: {
                    email: Utils.translate('Please provide a valid email')
                }
            };
        };
        NewsletterView.prototype.getFormFieldValue = function (changedInput) {
            var newVal = changedInput.val();
            var fieldName = changedInput.attr('name');
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
        };
        NewsletterView.prototype.getContext = function () {
            return {
                isFeedback: !!this.state.code,
                model: this.formModel
            };
        };
        return NewsletterView;
    }(FormView_1.FormView));
    exports.NewsletterView = NewsletterView;
});

//# sourceMappingURL=Newsletter.View.js.map
