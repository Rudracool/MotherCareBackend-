/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="OrderWizard.Module.PaymentMethod.PurchaseNumber"/>

import * as order_wizard_paymentmethod_purchasenumber_module_tpl from 'order_wizard_paymentmethod_purchasenumber_module.tpl';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { Configuration } from '../../SCA/JavaScript/Configuration';
import { WizardStepModule } from '../../Wizard/JavaScript/Wizard.StepModule';

const OrderWizardModulePaymentMethodPurchaseNumber: any = WizardStepModule.extend({
    // @property {Function} template
    template: order_wizard_paymentmethod_purchasenumber_module_tpl,

    // @property {String} className
    className: 'OrderWizard.Module.PaymentMethod.PurchaseNumber',

    isActive: function(): boolean {
        return Configuration.get('siteSettings.checkout.showpofieldonpayment', 'T') === 'T';
    },

    past: function() {
        this.eventHandlersOff();
    },

    present: function() {
        this.eventHandlersOff();
        this.wizard.model.on('change:purchasenumber', this.render, this);
    },

    future: function() {
        this.eventHandlersOff();
    },

    eventHandlersOff: function() {
        this.wizard.model.off('change:purchasenumber', this.render, this);
    },

    submit: function() {
        const purchase_order_number = this.$('[name=purchase-order-number]').val() || '';
        return purchase_order_number !== this.wizard.model.get('purchasenumber')
            ? this.wizard.model.setPurchaseOrderNumber(purchase_order_number)
            : jQuery.Deferred().resolve();
    },

    // @method getContext
    // @returns {OrderWizard.Module.PaymentMethod.Creditcard.Context}
    getContext: function() {
        return {
            // @property {String} purchaseNumber
            purchaseNumber: this.wizard.model.get('purchasenumber')
        };
    }
});

export = OrderWizardModulePaymentMethodPurchaseNumber;
