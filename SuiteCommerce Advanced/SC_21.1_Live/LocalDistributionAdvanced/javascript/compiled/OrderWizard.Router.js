/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Router", ["require", "exports", "underscore", "Utils", "jQuery", "Profile.Model", "Wizard.Router", "Session", "OrderWizard.Step", "OrderWizard.Module.PaymentMethod.ThreeDSecure", "OrderWizard.Model", "OrderWizard.View", "Backbone", "LiveOrder.Model"], function (require, exports, _, Utils, jQuery, Profile_Model_1, WizardRouter, Session, OrderWizardStep, OrderWizardThreeDSecure, OrderWizardModel, OrderWizardView, Backbone) {
    "use strict";
    // @class OrderWizard.Router @extends Wizard.Router
    var OrderWizardRouter = WizardRouter.extend({
        // @property {OrderWizard.Step} step
        step: OrderWizardStep,
        view: OrderWizardView,
        // @method initialize
        initialize: function () {
            this.orderWizardModel = OrderWizardModel.getInstance();
            this.init_promise = WizardRouter.prototype.initialize.apply(this, arguments);
            this.application.waitForPromise(this.init_promise);
            this.profileModel = Profile_Model_1.ProfileModel.getInstance();
            var payment_methods = this.model.get('paymentmethods');
            var payment_method_credit_card = payment_methods.findWhere({ type: 'creditcard' });
            var credit_card = payment_method_credit_card && payment_method_credit_card.get('creditcard');
            // remove temporal credit card.
            if (credit_card && credit_card.internalid === '-temporal-') {
                payment_methods.remove(payment_method_credit_card);
            }
            var startCheckoutWizard = this.application.getConfig().startCheckoutWizard;
            if (startCheckoutWizard && !~_.indexOf(this.stepsOrder, '')) {
                var pageType = this.application.getComponent('PageType');
                pageType.registerPageType({
                    name: 'checkout',
                    routes: ['', '?:options'],
                    callback: _.bind(this.startWizard, this),
                    defaultTemplate: {
                        name: 'wizard.tpl',
                        displayName: 'Order Wizard Default',
                        thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-checkout.png')
                    }
                });
            }
        },
        // @method startWizard
        startWizard: function () {
            this.navigate(this.getFirstStepUrl(), { trigger: true, replace: true });
        },
        _registerPageType: function _registerPageType(options) {
            var pageType = this.application.getComponent('PageType');
            pageType.registerPageType({
                name: 'checkout',
                routes: options.routes,
                view: OrderWizardView
            });
        },
        _compileStep: function _compileStep(step, step_group_instance) {
            var self = this;
            var args = arguments;
            var event_data = {
                name: step.name,
                url: step.url,
                index: step.step_index,
                group_name: step_group_instance.name
            };
            return this.orderWizardModel
                .cancelableTrigger('before:OrderWizardRouter.compileStep', event_data)
                .then(function () {
                return WizardRouter.prototype._compileStep.apply(self, args).done(function () {
                    self.orderWizardModel.cancelableTrigger('after:OrderWizardRouter.compileStep', event_data);
                });
            });
        },
        _compileStepGroup: function _compileStepGroup(step_group, index) {
            var self = this;
            var args = arguments;
            var event_data = {
                name: step_group.name,
                url: step_group.steps[0].url,
                index: index
            };
            return this.orderWizardModel
                .cancelableTrigger('before:OrderWizardRouter.compileStepGroup', event_data)
                .then(function () {
                return WizardRouter.prototype._compileStepGroup.apply(self, args).done(function () {
                    self.orderWizardModel.cancelableTrigger('after:OrderWizardRouter.compileStepGroup', event_data);
                });
            });
        },
        // @method hidePayment
        hidePayment: function () {
            var siteSettings = this.application.getConfig().siteSettings;
            return (siteSettings.checkout.hidepaymentpagewhennobalance === 'T' &&
                this.model.get('summary').total === 0);
        },
        // @method isPaypal
        isPaypal: function () {
            var selected_paymentmethod = this.model
                .get('paymentmethods')
                .findWhere({ primary: true });
            return selected_paymentmethod && selected_paymentmethod.get('type') === 'paypal';
        },
        // @method isPaypalComplete
        isPaypalComplete: function () {
            var selected_paymentmethod = this.model
                .get('paymentmethods')
                .findWhere({ primary: true });
            return (selected_paymentmethod &&
                selected_paymentmethod.get('type') === 'paypal' &&
                selected_paymentmethod.get('complete'));
        },
        // @method isExternalCheckout
        isExternalCheckout: function () {
            var selected_paymentmethod = this.model
                .get('paymentmethods')
                .findWhere({ primary: true });
            return (selected_paymentmethod &&
                !!~selected_paymentmethod.get('type').indexOf('external_checkout'));
        },
        isMultiShipTo: function () {
            return this.model.get('ismultishipto');
        },
        isAutoPopulateEnabled: function () {
            var forms = this.application.getConfig().forms;
            var is_guest = this.profileModel.get('isGuest') === 'T';
            var autoPopulateNameAndEmail = this.application.getConfig().autoPopulateNameAndEmail;
            return autoPopulateNameAndEmail && ((is_guest && forms.loginAsGuest.showName) || !is_guest);
        },
        // @method runStep
        runStep: function runStep() {
            var self = this;
            var url = Backbone.history.fragment.split('?')[0];
            return this.orderWizardModel
                .cancelableTrigger('before:OrderWizardRouter.runStep', url)
                .then(function () {
                return self._runStep();
            });
        },
        _runStep: function _runStep() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Computes the position of the user in the flow
            var fragments = Backbone.history.fragment.split('?');
            var url = fragments[0];
            return this.orderWizardModel
                .cancelableTrigger('before:OrderWizardRouter._runStep', url)
                .then(function () {
                var options = fragments.length ? fragments[1] : '';
                var position = _this.getStepPosition(url);
                var content = '';
                var page_header = '';
                var last_order_id = Utils.parseUrlOptions(options).last_order_id;
                var self = _this;
                if (last_order_id && !_this.model.get('confirmation').get('internalid')) {
                    if (_this.profileModel.get('isGuest') !== 'T') {
                        // checkout just finnished and user refreshed the doc.
                        page_header = Utils.translate('Your Order has been placed');
                        content =
                            Utils.translate('If you want to review your last order you can go to <a href="#" data-touchpoint="$(0)" data-hashtag="#/purchases/view/salesorder/$(1)">Your Account</a>. ', 'customercenter', last_order_id) +
                                Utils.translate('Or you can continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>. ');
                    }
                    else {
                        page_header = Utils.translate('Your Shopping Cart is empty');
                        content = Utils.translate('Continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>. ');
                    }
                    var layout = _this.application.getLayout();
                    return (layout.internalError &&
                        layout.internalError(content, page_header, Utils.translate('Checkout')));
                }
                // if you have already placed the order you
                // can not be in any other step than the last
                if (_this.model &&
                    _this.model.get('confirmation') &&
                    (_this.model.get('confirmation').get('confirmationnumber') ||
                        _this.model.get('confirmation').get('tranid')) &&
                    position.toLast !== 0) {
                    window.location = Session.get('touchpoints.home');
                    return jQuery.Deferred().reject();
                }
                return WizardRouter.prototype.runStep.apply(_this, args).then(function () {
                    return self.orderWizardModel.cancelableTrigger('after:OrderWizardRouter.runStep', url);
                });
            });
        },
        // @method start3DSecure Start the process of 3D Secure CC payments.
        // @param {jQuery.Deferred} promise
        // @returns {jQuery.Deferred}
        start3DSecure: function (promise) {
            var _this = this;
            var wrapper_deferred = jQuery.Deferred();
            promise
                .done(function () {
                var confirmation = _this.model.get('confirmation');
                var statuscode = confirmation.get('statuscode');
                var success = false;
                if (statuscode) {
                    if (statuscode === 'success' || statuscode === 'redirect') {
                        wrapper_deferred.resolveWith(_this);
                        success = true;
                    }
                    else if (statuscode === 'error') {
                        // Order is not success since payment authorization is required
                        var reasoncode = confirmation.get('reasoncode');
                        if (reasoncode &&
                            (reasoncode === 'ERR_WS_REQ_PAYMENT_AUTHORIZATION' ||
                                reasoncode === 'ERR_WS_REQ_SHOPPER_CHALLENGE' ||
                                reasoncode === 'ERR_WS_REQ_DEVICE_AUTHENTICATION')) {
                            if (confirmation.get('paymentauthorization') ||
                                confirmation.get('authenticationformaction')) {
                                var view = new OrderWizardThreeDSecure({
                                    layout: _this.application.getLayout(),
                                    application: _this.application,
                                    wizard: _this,
                                    deferred: wrapper_deferred,
                                    confirmation: confirmation
                                });
                                view.showInModal();
                                success = true;
                            }
                        }
                    }
                }
                if (!success) {
                    wrapper_deferred.rejectWith(_this);
                }
            })
                .fail(function () {
                wrapper_deferred.rejectWith(_this);
            });
            return wrapper_deferred.promise();
        }
    });
    return OrderWizardRouter;
});

//# sourceMappingURL=OrderWizard.Router.js.map
