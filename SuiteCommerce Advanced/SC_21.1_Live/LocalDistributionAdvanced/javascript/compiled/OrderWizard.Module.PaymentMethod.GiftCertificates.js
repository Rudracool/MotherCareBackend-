/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PaymentMethod.GiftCertificates", ["require", "exports", "underscore", "order_wizard_paymentmethod_giftcertificates_module.tpl", "Utils", "jQuery", "Wizard.StepModule", "OrderWizard.Module.PaymentMethod.GiftCertificates.Record", "GlobalViews.Confirmation.View", "Backbone", "Backbone.CollectionView"], function (require, exports, _, order_wizard_paymentmethod_giftcertificates_module_tpl, Utils, jQuery, Wizard_StepModule_1, OrderWizardModulePaymentMethodGiftCertificatesRecord, GlobalViewsConfirmationView, Backbone, BackboneCollectionView) {
    "use strict";
    // @class OrderWizard.Module.PaymentMethod.GiftCertificates @extends WizardModule.extend
    var OrderWizardModulePaymentMethodGiftCertificates = Wizard_StepModule_1.WizardStepModule.extend({
        template: order_wizard_paymentmethod_giftcertificates_module_tpl,
        className: 'OrderWizard.Module.PaymentMethod.GiftCertificates',
        events: {
            'submit form': 'applyGiftCertificate',
            'click [data-action="remove"]': 'removeGiftCertificate',
            'shown [data-action="gift-certificate-form"]': 'onShownGiftCertificateForm'
        },
        initialize: function () {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
        },
        errors: [
            'ERR_WS_INVALID_GIFTCERTIFICATE',
            'ERR_WS_APPLIED_GIFTCERTIFICATE',
            'ERR_WS_EMPTY_GIFTCERTIFICATE'
        ],
        // Determines if the current module is valid to be shown and operate with
        isActive: function () {
            return SC.ENVIRONMENT.giftCertificatesEnabled;
        },
        render: function () {
            // Is Active is overridden by child modules, like Shipping to hide this module in Multi Ship To
            if (!this.isActive()) {
                this.$el.attr('class', '');
                return this.$el.empty();
            }
            this.giftCertificates =
                this.model.get('paymentmethods').where({
                    type: 'giftcertificate'
                }) || [];
            this.trigger('ready', true);
            this._render();
        },
        eventHandlersOff: function () {
            this.model.off('change:paymentmethods', this.render, this);
        },
        past: function () {
            this.eventHandlersOff();
        },
        present: function () {
            this.eventHandlersOff();
            this.model.on('change:paymentmethods', this.render, this);
        },
        future: function () {
            this.eventHandlersOff();
        },
        updateGiftCertificates: function (codes) {
            var self = this;
            codes = _.map(codes, function (code) {
                return { code: code };
            });
            // disable navigation buttons
            this.wizard.getCurrentStep().disableNavButtons();
            // disable inputs and buttons
            this.$('input, button').prop('disabled', true);
            return new Backbone.Model()
                .save({
                giftcertificates: codes
            }, {
                url: Utils.getAbsoluteUrl('services/LiveOrder.GiftCertificate.Service.ss'),
                success: function (model, attributes) {
                    self.model.set({
                        paymentmethods: attributes.paymentmethods,
                        summary: attributes.summary,
                        touchpoints: attributes.touchpoints
                    });
                },
                error: function (model, jqXhr) {
                    jqXhr.preventDefault = true;
                    self.wizard.manageError(JSON.parse(jqXhr.responseText));
                }
            })
                .always(function () {
                // enable navigation buttons
                self.wizard.getCurrentStep().enableNavButtons();
                // enable inputs and buttons
                self.$('input, button').prop('disabled', false);
            });
        },
        applyGiftCertificate: function (e) {
            e.preventDefault();
            var code = String(jQuery(e.target)
                .find('[name="code"]')
                .val()).trim();
            var is_applied = _.find(this.giftCertificates, function (certificate) {
                return certificate.get('giftcertificate').code === code;
            });
            if (!code) {
                this.wizard.manageError({
                    errorCode: 'ERR_WS_EMPTY_GIFTCERTIFICATE',
                    errorMessage: Utils.translate('Gift Certificate is empty')
                });
            }
            else if (is_applied) {
                this.wizard.manageError({
                    errorCode: 'ERR_WS_APPLIED_GIFTCERTIFICATE',
                    errorMessage: Utils.translate('Gift Certificate is applied')
                });
            }
            else {
                this.updateGiftCertificates(this.getGiftCertificatesCodes().concat(code));
            }
        },
        removeGiftCertificate: function (e) {
            var code = jQuery(e.target)
                .data('id')
                .toString();
            var is_applied = _.find(this.giftCertificates, function (payment_method) {
                return payment_method.get('giftcertificate').code === code;
            });
            if (is_applied) {
                var deleteConfirmationView = new GlobalViewsConfirmationView({
                    callBack: this._removeGiftCertificate,
                    callBackParameters: {
                        context: this,
                        code: code
                    },
                    title: Utils.translate('Remove Gift certificate'),
                    body: Utils.translate('Are you sure you want to remove this Gift certificate?'),
                    autohide: true
                });
                this.wizard.application.getLayout().showInModal(deleteConfirmationView);
            }
        },
        _removeGiftCertificate: function (options) {
            options.context.updateGiftCertificates(_.without(options.context.getGiftCertificatesCodes(), options.code));
        },
        getGiftCertificatesCodes: function () {
            return _.map(this.giftCertificates, function (payment_method) {
                return payment_method.get('giftcertificate').code;
            });
        },
        showError: function () {
            this.$('.control-group').addClass('error');
            Wizard_StepModule_1.WizardStepModule.prototype.showError.apply(this, arguments);
        },
        // onShownGiftCertificateForm
        // Handles the shown of promocode form
        onShownGiftCertificateForm: function (e) {
            jQuery(e.target)
                .find('input[name="code"]')
                .focus();
        },
        // @property {Object} childViews
        childViews: {
            GiftCertificatesRecords: function () {
                return new BackboneCollectionView({
                    collection: this.giftCertificates,
                    childView: OrderWizardModulePaymentMethodGiftCertificatesRecord,
                    viewsPerRow: 1
                });
            }
        },
        // @method getContext @return OrderWizard.Module.PaymentMethod.GiftCertificates.Context
        getContext: function () {
            // @class OrderWizard.Module.PaymentMethod.GiftCertificates.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.getTitle(),
                // @property {Boolean} hasGiftCertificates
                hasGiftCertificates: this.giftCertificates.length > 0
            };
        }
    });
    return OrderWizardModulePaymentMethodGiftCertificates;
});

//# sourceMappingURL=OrderWizard.Module.PaymentMethod.GiftCertificates.js.map
