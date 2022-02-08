/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.Address.Billing", ["require", "exports", "underscore", "Utils", "OrderWizard.Module.Address", "GlobalViews.Confirmation.View"], function (require, exports, _, Utils, OrderWizardModuleAddress, GlobalViewsConfirmationView) {
    "use strict";
    // @class OrderWizard.Module.Address.Billing @extend OrderWizard.Module.Address
    var OrderWizardModuleAddressBilling = OrderWizardModuleAddress.extend({
        manage: 'billaddress',
        sameAsManage: 'shipaddress',
        className: 'OrderWizard.Module.Address.Billing',
        errors: [
            'ERR_CHK_INCOMPLETE_ADDRESS',
            'ERR_CHK_SELECT_BILLING_ADDRESS',
            'ERR_CHK_INVALID_BILLING_ADDRESS',
            'ERR_WS_INVALID_BILLING_ADDRESS'
        ],
        sameAsMessage: Utils.translate('Same as shipping address'),
        selectAddressErrorMessage: {
            errorCode: 'ERR_CHK_SELECT_BILLING_ADDRESS',
            errorMessage: Utils.translate('Please select a billing address')
        },
        invalidAddressErrorMessage: {
            errorCode: 'ERR_CHK_INVALID_BILLING_ADDRESS',
            errorMessage: Utils.translate('The selected billing address is invalid')
        },
        // @method reRenderOnFirstAddressCreation Handle the case in OPC MST where there is not address at all and a new one is created, if there current address form does not have any
        // data entered we should re-render in order to reflect the new options (the new address created)
        reRenderOnFirstAddressCreation: function () {
            // if the address form (the one to create a new address) is empty
            if (!this.wizard.model.get("temp" + this.manage)) {
                this.render();
            }
        },
        // @method getIsCurrentUserGuest We override here to give support to guest user with Multi Ship To. The default implementation will notice that the current user is guest, and will select the first entered address
        // to be used in the in-line address form
        getIsCurrentUserGuest: function () {
            if (this.wizard.model.get('ismultishipto')) {
                return false;
            }
            return OrderWizardModuleAddress.prototype.getIsCurrentUserGuest.apply(this, arguments);
        },
        // @method onEventHandlersOn Attach to extra events
        onEventHandlersOn: function () {
            // In OPC is require to re-render when changing between SST and MST to hide or show the same as checkbox
            this.wizard.model.on('ismultishiptoUpdated', function () {
                this.sameAs = false;
                this.render();
            }, this);
            this.wizard.model.on('address_added', this.reRenderOnFirstAddressCreation, this); // This event is triggered by MST.Select.Addresses.Shipping module
        },
        // @method postEvaluateDisablingSameAsCheckBox Override the method in 'OrderWizard.Module.Address' that evaluates whether the 'same as' checkbox should be enabled or not.
        // This value is saved in the instance variable disableSameAsCheckBox.
        // If there is only one addresss saved and selected as the shipping address, the checkbox should be disabled. Once a new address is added the checkbox should be enable.
        postEvaluateDisablingSameAsCheckBox: function () {
            this.disableSameAsCheckBox =
                this.addresses &&
                    this.addresses.length === 1 &&
                    this.getSelectedAddress().id === this.addresses.models[0].id
                    ? true
                    : this.disableSameAsCheckBox;
        },
        // @method isAddressIdValidForRemoval Override the address removal control to take into account Multi Ship To scenario @return {Boolean}
        isAddressIdValidForRemoval: function (address_id) {
            if (!this.wizard.model.get('ismultishipto')) {
                return OrderWizardModuleAddress.prototype.isAddressIdValidForRemoval.apply(this, arguments);
            }
            return !_.find(this.wizard.model.getSetLines(), function (line) {
                return +line.get('shipaddress') === +address_id;
            });
        },
        // @method onEventHandlersOff Detach from extra added event handlers
        onEventHandlersOff: function () {
            this.wizard.model.off('ismultishiptoUpdated', null, this);
            this.wizard.model.off('address_added', null, this);
        },
        // @method getAddressListOptions Redefined the base getAddressListOptions method to add an option that checks if an address cannot be removed when the order has an item asigned to it
        // @return {showSelect:Boolean,selectMessage:String,hideDefaults:Boolean,disableRemoveButton:Function<String> => Boolean}
        getAddressListOptions: function () {
            var self = this;
            var base_result = OrderWizardModuleAddress.prototype.getAddressListOptions.apply(this, arguments);
            return _.extend(base_result, {
                disableRemoveButton: function (address_id) {
                    return !self.isAddressIdValidForRemoval(address_id);
                }
            });
        },
        // @method validateAddressRemoval Redefined validateAddressRemoval so user can not delete an address that is set as a shipping address
        // @param {String} address_id
        validateAddressRemoval: function (address_id) {
            if (this.isAddressIdValidForRemoval(address_id)) {
                var deleteConfirmationView = new GlobalViewsConfirmationView({
                    callBack: this.removeAddress,
                    callBackParameters: {
                        context: this,
                        addressId: address_id
                    },
                    title: Utils.translate('Remove Address'),
                    body: Utils.translate('Are you sure you want to delete this address?'),
                    autohide: true
                });
                this.wizard.application.getLayout().showInModal(deleteConfirmationView);
            }
        },
        submit: function () {
            if (!this.sameAs) {
                return OrderWizardModuleAddress.prototype.submit.apply(this, arguments);
            }
        }
    });
    return OrderWizardModuleAddressBilling;
});

//# sourceMappingURL=OrderWizard.Module.Address.Billing.js.map
