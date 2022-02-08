/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.View", ["require", "exports", "CheckoutStepsFactory", "Profile.Model", "Wizard.View", "LiveOrder.Model"], function (require, exports, CheckoutStepsFactory_1, Profile_Model_1, WizardView, LiveOrderModel) {
    "use strict";
    // @class Wizard.View  Frame component, Renders the steps @extends Backbone.View
    var OrderWizardView = WizardView.extend({
        attributes: {
            id: 'checkout',
            'data-root-component-id': 'Wizard.View'
        },
        initialize: function initialize() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.model = LiveOrderModel.getInstance();
            this.profile = Profile_Model_1.ProfileModel.getInstance();
            this.steps = CheckoutStepsFactory_1.CheckoutStepsFactory.getInstance().getCheckoutSteps();
            this.wizard = this.constructor.wizard;
            WizardView.prototype.initialize.apply(this, args);
        },
        beforeShowContent: function beforeShowContent() {
            if (this.wizard.indirectURL) {
                this.wizard.indirectURL = false;
                return this.wizard._runStep();
            }
            return this.wizard.runStep();
        }
    });
    return OrderWizardView;
});

//# sourceMappingURL=OrderWizard.View.js.map
