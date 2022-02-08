/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.TermsAndConditions", ["require", "exports", "underscore", "order_wizard_termsandconditions_module.tpl", "Utils", "jQuery", "Configuration", "Wizard.StepModule", "Backbone.View"], function (require, exports, _, order_wizard_termsandconditions_module_tpl, Utils, jQuery, Configuration_1, Wizard_StepModule_1, BackboneView) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        template: order_wizard_termsandconditions_module_tpl,
        events: {
            'click [data-toggle="show-terms"]': 'showTerms',
            'click input[name="termsandconditions"]': 'acceptTerms'
        },
        errors: ['ERR_CHK_ACCEPT_TERMS'],
        initialize: function (options) {
            this.wizard = options.wizard;
            this.step = options.step;
            this.model = options.wizard.model;
            this.options = _.extend({
                show_checkbox: true
            }, this.options || {});
        },
        render: function () {
            // the module is rendered only if the site requires agreement to the terms and conditions
            if (Configuration_1.Configuration.get('siteSettings.checkout.requiretermsandconditions') === 'T') {
                this._render();
                var is_ready = Configuration_1.Configuration.get('siteSettings.checkout.requiretermsandconditions') !== 'T' ||
                    !this.options.show_checkbox ||
                    this.$('input[name=termsandconditions]').is(':checked');
                this.trigger('ready', is_ready);
            }
            else {
                this.trigger('ready', true);
            }
        },
        submit: function () {
            var value = Configuration_1.Configuration.get('siteSettings.checkout.requiretermsandconditions') !== 'T' ||
                !this.options.show_checkbox ||
                this.$('input[name=termsandconditions]').is(':checked');
            this.model.set('agreetermcondition', value);
            return this.isValid();
        },
        showTerms: function () {
            var TermsView = BackboneView.extend({
                title: Utils.translate('Terms and Conditions'),
                render: function () {
                    this.$el.html(Configuration_1.Configuration.get('siteSettings.checkout.termsandconditionshtml'));
                    return this;
                }
            });
            this.wizard.application.getLayout().showInModal(new TermsView());
        },
        acceptTerms: function (data) {
            var isSelected = jQuery(data.target).prop('checked');
            var boxes = jQuery('input[name=termsandconditions]');
            jQuery.each(boxes, function (index) {
                jQuery(boxes[index]).prop('checked', isSelected);
            });
        },
        isValid: function () {
            var promise = jQuery.Deferred();
            var value = Configuration_1.Configuration.get('siteSettings.checkout.requiretermsandconditions') !== 'T' ||
                !this.options.show_checkbox ||
                this.model.get('agreetermcondition');
            if (!value) {
                return promise.reject({
                    errorCode: 'ERR_CHK_ACCEPT_TERMS',
                    errorMessage: Utils.translate('You must accept the Terms and Conditions')
                });
            }
            return promise.resolve();
        },
        // @method getContext @return OrderWizard.Module.TermsAndConditions.Context
        getContext: function () {
            // @class OrderWizard.Module.TermsAndConditions.Context
            return {
                // @property {Boolean} showCheckbox
                showCheckbox: this.options.show_checkbox,
                // @property {Boolean} isAgreeTermCondition
                isAgreeTermCondition: this.wizard.model.get('agreetermcondition'),
                // @property {Boolean} showWrapper
                showWrapper: !!this.options.showWrapper,
                // @property {String} wrapperClass
                wrapperClass: this.options.wrapperClass
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.TermsAndConditions.js.map
