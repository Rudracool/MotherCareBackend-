/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PaymentMethod.Creditcard", ["require", "exports", "underscore", "order_wizard_paymentmethod_creditcard_module.tpl", "backbone_collection_view_cell.tpl", "backbone_collection_view_row.tpl", "paymentinstrument_creditcard_edit.tpl", "Utils", "jQuery", "Configuration", "Profile.Model", "OrderWizard.Module.PaymentMethod", "PaymentInstrument.CreditCard.Edit.View", "PaymentInstrument.CreditCard.Model", "Backbone.CollectionView", "PaymentMethod.Helper", "GlobalViews.Confirmation.View", "Backbone.View"], function (require, exports, _, order_wizard_paymentmethod_creditcard_module_tpl, backbone_collection_view_cell_tpl, backbone_collection_view_row_tpl, paymentinstrument_creditcard_edit_tpl, Utils, jQuery, Configuration_1, Profile_Model_1, OrderWizardModulePaymentMethod, CreditCardEditView, CreditCardModel, BackboneCollectionView, PaymentMethodHelper, GlobalViewsConfirmationView, BackboneView) {
    "use strict";
    // @class OrderWizard.Module.PaymentMethod.Creditcard @extends OrderWizard.Module.PaymentMethod
    var OrderWizardModulePaymentMethodCreditcard = OrderWizardModulePaymentMethod.extend({
        // @property {Function} template
        template: order_wizard_paymentmethod_creditcard_module_tpl,
        // @property {Object} securityNumberErrorMessage
        securityNumberErrorMessage: {
            errorCode: 'ERR_CHK_INCOMPLETE_SECURITY_NUMBER',
            errorMessage: undefined
        },
        // @property {String} selectMessage
        selectMessage: Utils.translate('Use this Card'),
        // @events {Object} events
        events: {
            'click [data-action="select"]': 'selectCreditCard',
            'click [data-action="change-creditcard"]': 'changeCreditCard',
            'click [data-action="remove"]': 'removeCreditCard',
            'mouseover [data-toggle="popover"]': 'openPopover',
            'click [data-action="show-safe-secure-info"]': 'showSecureInfo'
        },
        // @property {Array<String>} errors
        errors: [
            'ERR_CHK_INCOMPLETE_CREDITCARD',
            'ERR_CHK_SELECT_CREDITCARD',
            'ERR_CHK_EXPIRED_CREDITCARD',
            'ERR_CHK_INCOMPLETE_SECURITY_NUMBER',
            'ERR_WS_INVALID_PAYMENT'
        ],
        // @method initialize
        // @return {Vodi}
        initialize: function () {
            var _this = this;
            this.requireccsecuritycode =
                Configuration_1.Configuration.get('siteSettings.checkout.requireccsecuritycode', 'T') === 'T';
            OrderWizardModulePaymentMethod.prototype.initialize.apply(this, arguments);
            this.paymentmethodview = PaymentMethodHelper.getCreditCardView();
            Profile_Model_1.ProfileModel.getInstance().on('change:paymentmethods', function () {
                _this.render();
            });
        },
        // @method isActive Indicate if in the current state this module is active to be shown or not
        // @return {Boolean}
        isActive: function () {
            var a_credit_card = _.findWhere(Configuration_1.Configuration.get('siteSettings.paymentmethods', []), {
                creditcard: 'T'
            });
            return a_credit_card && !!a_credit_card.internalid;
        },
        // @method part Override default implementation to clean the saves credit card verification code
        // @return {Void}
        past: function () {
            this.ccsecuritycode = '';
            this.unsetSecurityNumber();
        },
        // @method render
        render: function () {
            var self = this;
            // currently we only support 1 credit card as payment method
            var order_payment_method = this.model
                .get('paymentmethods')
                .findWhere({ type: 'creditcard' });
            this.paymentmethod = null;
            this.paymentMethod = order_payment_method || new CreditCardModel({ type: 'creditcard' });
            var order_creditcard = this.paymentMethod.get('creditcard') || this.paymentMethod;
            this.paymentMethodSelected = order_creditcard.internalid;
            // credit-card set up
            this.paymentmethods = Profile_Model_1.ProfileModel.getInstance().get('paymentmethods');
            // Removes previously added events on the address collection
            this.paymentmethods.off(null, null, this);
            this.paymentmethods.on('reset destroy change add remove', function () {
                // search for the paymentmethod in the order that is creditcard
                var order_payment_method = self.model
                    .get('paymentmethods')
                    .findWhere({ type: 'creditcard' });
                var order_creditcard_id = (order_payment_method &&
                    order_payment_method.get('creditcard') &&
                    order_payment_method.get('creditcard').internalid) ||
                    this.getDefaultCreditCardId();
                // used by the view to show radio input selected
                self.paymentMethodSelected = order_creditcard_id;
                // if the order has a credit card and that credit card exists on
                // the profile we set it (making sure it is the same as in the profile)
                if (order_creditcard_id && self.paymentmethods.get(order_creditcard_id)) {
                    self.setCreditCard({ id: order_creditcard_id });
                }
                // if the credit-card in the order is not longer in the profile we delete it.
                else if (order_creditcard_id) {
                    self.unsetCreditCard();
                }
                self.render();
            }, this);
            if (!this.paymentmethods.length) {
                this.paymentmethod = new CreditCardModel({}, {
                    paymentMethdos: Configuration_1.Configuration.get('siteSettings.paymentmethods')
                });
            }
            else if (order_creditcard && order_creditcard.internalid) {
                this.paymentmethod = this.paymentmethods.get(order_creditcard.internalid);
            }
            else if (Profile_Model_1.ProfileModel.getInstance().get('isGuest') === 'T') {
                // if the order is empty and is a guest use the first credit card in the list
                this.paymentmethod = this.paymentmethods.at(0);
                this.setCreditCard({
                    id: this.paymentmethod.id
                });
            }
            else if (!this.unset) {
                this.paymentmethod = this.paymentmethods.findWhere({
                    isdefault: 'T'
                });
                if (this.paymentmethod && this.paymentmethod.id) {
                    this.setCreditCard({
                        id: this.paymentmethod.id
                    });
                }
            }
            this._render();
            this.isValid().done(function () {
                self.trigger('ready', !self.requireccsecuritycode);
            });
        },
        // @method removeCreditCard dispatch the remove event
        removeCreditCard: function (e) {
            e.preventDefault();
            var deleteConfirmationView = new GlobalViewsConfirmationView({
                callBack: this._removeCreditCardFromCollection,
                callBackParameters: {
                    context: this,
                    creditcardId: jQuery(e.target).data('id')
                },
                title: Utils.translate('Remove Credit Card'),
                body: Utils.translate('Are you sure you want to remove this Credit Card?'),
                autohide: true
            });
            return this.wizard.application.getLayout().showInModal(deleteConfirmationView);
        },
        _removeCreditCardFromCollection: function (options) {
            options.context.unsetCreditCard();
            if (options.creditcardId !== '-temporal-') {
                options.context.paymentmethods.get(options.creditcardId).destroy({ wait: true });
            }
            else {
                options.context.paymentmethods.remove(options.creditcardId);
            }
        },
        // @method changeCreditCard
        changeCreditCard: function (e) {
            if (Profile_Model_1.ProfileModel.getInstance().get('isGuest') !== 'T' ||
                this.paymentmethod.get('internalid') === '-temporal-') {
                if (this.paymentmethod.get('internalid') === '-temporal-') {
                    var internalid = this.paymentmethod.get('internalid');
                    this.paymentmethods.remove(internalid);
                    Profile_Model_1.ProfileModel.getInstance()
                        .get('paymentmethods')
                        .remove(internalid);
                }
                this.unsetCreditCard(e);
            }
            else {
                var self_1 = this;
                e.preventDefault();
                e.stopPropagation();
                this.paymentmethod.destroy({ wait: true }).then(function () {
                    self_1.paymentmethods.reset([]);
                    Profile_Model_1.ProfileModel.getInstance()
                        .get('paymentmethods')
                        .reset([]);
                });
            }
        },
        // @method openPopover
        openPopover: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $link = this.$(e.target);
            $link
                .popover({
                trigger: 'manual',
                html: true
            })
                .popover('toggle');
            // add more close popover
            this.closePopover($link);
        },
        // @method closePopover
        closePopover: function (link) {
            // close mouseout
            link.on('mouseout', function (e) {
                e.preventDefault();
                link.popover('hide');
            });
            // close for mobile
            this.$el.one('click', '[data-type="close-popover"]', function (e) {
                e.preventDefault();
                link.popover('hide');
            });
        },
        // @method selectCreditCard
        selectCreditCard: function (e) {
            var id_selected = jQuery(e.target).data('id');
            if (id_selected) {
                this.paymentMethodSelected = id_selected.toString();
                this.setCreditCard({
                    id: id_selected
                });
            }
            // re render so if there is changes to be shown they are represented in the view
            this.render();
            // As we alreay set the credit card, we let the step know that we are ready
            this.trigger('ready', !this.requireccsecuritycode);
        },
        // @method setSecurityNumber
        setSecurityNumber: function () {
            if (this.requireccsecuritycode) {
                var creditcard = this.paymentMethod.get('creditcard');
                if (creditcard) {
                    creditcard.ccsecuritycode = this.ccsecuritycode;
                }
            }
        },
        // @method unsetSecurityNumber
        unsetSecurityNumber: function () {
            var creditcard = this.paymentMethod && this.paymentMethod.get('creditcard');
            if (creditcard) {
                creditcard.ccsecuritycode = null;
            }
        },
        isExpiredCreditCard: function (credit_card) {
            var credit_card_expire_year = parseInt(credit_card.expyear, 10);
            var credit_card_expire_month = parseInt(credit_card.expmonth, 10);
            var today = new Date();
            var today_year = today.getFullYear();
            var today_month = today.getMonth() + 1;
            return (credit_card_expire_year < today_year ||
                (credit_card_expire_year === today_year && credit_card_expire_month < today_month));
        },
        getExpiredCreditCardError: function () {
            return {
                errorCode: 'ERR_CHK_EXPIRED_CREDITCARD',
                errorMessage: Utils.translate('Your credit card has expired, please select another one.')
            };
        },
        // @method setCreditCard
        setCreditCard: function (options) {
            var credit_card = options.model ||
                (this.paymentmethods.get(options.id) &&
                    this.paymentmethods.get(options.id).attributes) ||
                this.paymentmethods.get(options);
            this.paymentMethod = new CreditCardModel({
                type: 'creditcard',
                creditcard: credit_card
            });
            this.setSecurityNumber();
            OrderWizardModulePaymentMethod.prototype.submit.apply(this, arguments);
            // when credit card is expired we immediately show a message
            if (credit_card && this.isExpiredCreditCard(credit_card)) {
                var error = this.getExpiredCreditCardError();
                OrderWizardModulePaymentMethod.prototype.manageError.call(this, error);
            }
        },
        // @method unsetCreditCard
        unsetCreditCard: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.unset = true;
            this.paymentMethod = new CreditCardModel({
                type: 'creditcard'
            });
            this.ccsecuritycode = null;
            OrderWizardModulePaymentMethod.prototype.submit.apply(this, arguments);
            // We re render so if there is changes to be shown they are represented in the view
            this.render();
        },
        // @method submit
        submit: function () {
            // This order is bing payed with some other method (Gift Cert probably)
            if (this.wizard.hidePayment()) {
                return jQuery.Deferred().resolve();
            }
            var self = this;
            if (this.requireccsecuritycode) {
                this.isSecurityNumberInvalid = false;
                // we need to store this temporally (frontend) in case a module in the same step
                // fails validation, making the credit card section re-rendered.
                // We don't want the user to have to type the security number multiple times
                this.ccsecuritycode = this.$('input[name="ccsecuritycode"]').val();
            }
            // if we are adding a new credit card
            if (this.creditcardView) {
                var fake_event = jQuery.Event('click', {
                    target: this.creditcardView.$('form').get(0)
                });
                var result = this.creditcardView.saveForm(fake_event);
                if (!result || result.frontEndValidationError) {
                    // There were errors so we return a rejected promise
                    return jQuery.Deferred().reject({
                        errorCode: 'ERR_CHK_INCOMPLETE_CREDITCARD',
                        errorMessage: Utils.translate('The Credit Card is incomplete')
                    });
                }
                var save_result_1 = jQuery.Deferred();
                result
                    .done(function (model) {
                    self.creditcardView = null;
                    Profile_Model_1.ProfileModel.getInstance()
                        .get('paymentmethods')
                        .add(model, {
                        silent: true
                    });
                    self.setCreditCard({
                        model: model
                    });
                    save_result_1.resolve();
                })
                    .fail(function (error) {
                    save_result_1.reject(error.responseJSON);
                });
                return save_result_1;
            }
            // if there are already credit cards
            this.setSecurityNumber();
            OrderWizardModulePaymentMethod.prototype.submit.apply(this, arguments);
            this.setCreditCard({
                model: this.paymentMethod.get('creditcard')
            });
            return this.isValid()
                .fail(function (error) {
                if (error === self.securityNumberErrorMessage) {
                    self.isSecurityNumberInvalid = true;
                }
            })
                .done(function () {
                self.isSecurityNumberInvalid = false;
            })
                .always(function () {
                // Call self.render() instead of self._render() because the last one didn't asign the events to the DOM
                self.render();
            });
        },
        // @method isValid
        isValid: function () {
            // This order is bing payed with some other method (Gift Cert probably)
            if (this.wizard.hidePayment()) {
                return jQuery.Deferred().resolve();
            }
            // user's credit cards
            var paymentmethods = Profile_Model_1.ProfileModel.getInstance().get('paymentmethods');
            // current order payment method
            var order_payment_method = this.model.get('paymentmethods').findWhere({
                type: 'creditcard'
            });
            // current order credit card
            var order_creditcard = order_payment_method && order_payment_method.get('creditcard');
            // Order is using a credit card
            // it is a temporal credit card
            // or there is a collection of creditcards
            // and the order's creditcard is on that collection
            if (order_creditcard &&
                (order_creditcard.internalid === '-temporal-' ||
                    (paymentmethods.length &&
                        (paymentmethods.get(order_creditcard.internalid) ||
                            paymentmethods.get(order_creditcard.id) ||
                            (SC.ENVIRONMENT.paymentInstrumentEnabled &&
                                paymentmethods.get('-temporal-')))))) {
                this.securityNumberErrorMessage.errorMessage = Utils.validateSecurityCode(order_creditcard.ccsecuritycode);
                if (this.isExpiredCreditCard(order_creditcard)) {
                    var error = this.getExpiredCreditCardError();
                    return jQuery.Deferred().reject(error);
                }
                if (!this.requireccsecuritycode || !this.securityNumberErrorMessage.errorMessage) {
                    return jQuery.Deferred().resolve();
                }
                return jQuery.Deferred().reject(this.securityNumberErrorMessage);
            }
            // if it not set, then lets reject it
            return jQuery.Deferred().reject({
                errorCode: 'ERR_CHK_SELECT_CREDITCARD',
                errorMessage: Utils.translate('Please select a credit card')
            });
        },
        // @method manageError
        manageError: function (error) {
            if (error && error.errorCode !== 'ERR_CHK_INCOMPLETE_CREDITCARD') {
                var control_error = this.$('.creditcard-edit-form-securitycode-group');
                var errorBlock = { attr: 'data-validation-error', value: 'block' };
                if (error.errorCode === 'ERR_CHK_INCOMPLETE_SECURITY_NUMBER') {
                    control_error.attr('data-validation-error', '');
                    this.$('.creditcard-edit-form-securitycode-controls').append("<p " + errorBlock.attr + "=\"" + errorBlock.value + "\">" + error.errorMessage + "</p>");
                }
                else {
                    if (error.errorCode === 'ERR_WS_INVALID_PAYMENT') {
                        this.unsetCreditCard();
                    }
                    OrderWizardModulePaymentMethod.prototype.manageError.apply(this, arguments);
                }
            }
        },
        // @method showSecureInfo Shows
        showSecureInfo: function () {
            var view = new BackboneView({ application: this.wizard.application });
            var self = this;
            view.setTitle(Utils.translate('Safe and Secure Shopping'));
            view.render = function () {
                var creditCard = self.wizard.application.getConfig().creditCard;
                this.$el.html(Utils.translate(creditCard.creditCardShowSecureInfo));
                return this;
            };
            view.showInModal();
        },
        prepopulateCreditCardModel: function () {
            if (this.wizard.isAutoPopulateEnabled && this.wizard.isAutoPopulateEnabled()) {
                this.paymentmethod.set('ccname', this.wizard.options.profile.get('firstname') + " " + this.wizard.options.profile.get('lastname'));
            }
            return this.paymentmethod;
        },
        // @method getPaymentMethodsToShow returns a copy of the payment methods collection including the new card button available to show
        getPaymentMethodsToShow: function () {
            var payment_methods_to_show;
            if (this.paymentmethods && !!this.paymentmethods.length) {
                payment_methods_to_show = paymentinstrument_creditcard_edit_tpl
                    ? this.paymentmethods.getCollectionForRendering()
                    : this.paymentmethods;
            }
            return payment_methods_to_show ? payment_methods_to_show.models : [];
        },
        getDefaultCreditCardId: function () {
            var defaultcc;
            if (this.paymentmethods && !!this.paymentmethods.length) {
                defaultcc = this.paymentmethods.findWhere({ ccdefault: 'T' });
            }
            return defaultcc ? defaultcc.id : '';
        },
        // @property {Object} childViews
        childViews: {
            'CreditCard.List': function () {
                if (this.paymentMethodSelected) {
                    this.setCreditCard({
                        id: this.paymentMethodSelected
                    });
                }
                return new BackboneCollectionView({
                    collection: this.getPaymentMethodsToShow(),
                    childView: this.paymentmethodview,
                    childViewOptions: {
                        showActions: true,
                        showDefaults: this.showDefaults,
                        showSelect: true,
                        hideSelector: false,
                        selectMessage: this.selectMessage,
                        showSecurityCodeForm: this.requireccsecuritycode && paymentinstrument_creditcard_edit_tpl,
                        selectedCreditCardId: this.paymentMethodSelected || this.getDefaultCreditCardId()
                    },
                    viewsPerRow: this.itemsPerRow ||
                        (Utils.isDesktopDevice() ? 3 : Utils.isTabletDevice() ? 2 : 1),
                    cellTemplate: backbone_collection_view_cell_tpl,
                    rowTemplate: backbone_collection_view_row_tpl
                });
            },
            'CreditCard.Form': function () {
                this.creditcardView = new CreditCardEditView({
                    model: this.prepopulateCreditCardModel(),
                    isCreditCardCollectionEmpty: true,
                    hideHeader: true,
                    hideFooter: true,
                    hideSelector: true,
                    showSecurityCodeForm: this.requireccsecuritycode,
                    allowTemporalCreditCard: true
                });
                return this.creditcardView;
            },
            SelectedCreditCard: function () {
                return new this.paymentmethodview({
                    model: this.paymentmethod,
                    securityNumberError: this.isSecurityNumberInvalid && this.securityNumberErrorMessage,
                    ccsecuritycode: this.ccsecuritycode,
                    showCreditCardHelp: Configuration_1.Configuration.get('creditCard.showCreditCardHelp', true),
                    creditCardHelpTitle: Utils.translate(Configuration_1.Configuration.get('creditCard.creditCardHelpTitle', true)),
                    collapseElements: Configuration_1.Configuration.get('sca.collapseElements', true),
                    selectedCreditCardId: this.paymentMethodSelected || this.getDefaultCreditCardId(),
                    showSecurityCodeForm: this.requireccsecuritycode
                });
            }
        },
        // @method getContext @returns {OrderWizard.Module.PaymentMethod.Creditcard.Context}
        getContext: function () {
            var showForm = this.paymentmethods.length === 0 &&
                (!this.paymentmethod || (this.paymentmethod && this.paymentmethod.isNew()));
            var showSelectedCreditCard = paymentinstrument_creditcard_edit_tpl
                ? false
                : !!(this.paymentmethod && !this.paymentmethod.isNew());
            if (!showForm) {
                // Skip_Login fix, because when starting the wizard, the user is guest, he has no credit cards so we show the CreditCard.Form and we set it on this.creditCardView
                // But then when the user logs in, this.creditCardView still exists and the submit thinks it's a new credit card
                this.creditcardView = null;
            }
            // @class OrderWizard.Module.PaymentMethod.Creditcard.Context
            return {
                // @property {Boolean} showForm
                showForm: showForm,
                // @property {Boolean} showSelectedCreditCard
                showSelectedCreditCard: showSelectedCreditCard,
                // @property {Boolean} showList
                showList: this.paymentmethods.length >= 1 && !showSelectedCreditCard,
                // @property {Boolean} showTitle
                showTitle: !!this.getTitle(),
                // @property {String} title
                title: this.getTitle(),
                // @property {CreditCard.Model} selectedCreditCard
                selectedCreditCard: this.paymentmethod,
                // @property {CreditCard.Collection} creditCards
                creditCards: this.paymentmethods
            };
        }
    });
    return OrderWizardModulePaymentMethodCreditcard;
});

//# sourceMappingURL=OrderWizard.Module.PaymentMethod.Creditcard.js.map
