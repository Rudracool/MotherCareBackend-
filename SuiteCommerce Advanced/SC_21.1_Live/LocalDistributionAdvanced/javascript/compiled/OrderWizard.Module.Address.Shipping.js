/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.Address.Shipping", ["require", "exports", "Utils", "jQuery", "OrderWizard.Module.Address"], function (require, exports, Utils, jQuery, OrderWizardModuleAddress) {
    "use strict";
    // @class OrderWizard.Module.Address.Shipping @extend OrderWizard.Module.Address
    var OrderWizardModuleAddressShipping = OrderWizardModuleAddress.extend({
        manage: 'shipaddress',
        sameAsManage: 'billaddress',
        className: 'OrderWizard.Module.Address.Shipping',
        errors: [
            'ERR_CHK_INCOMPLETE_ADDRESS',
            'ERR_CHK_SELECT_SHIPPING_ADDRESS',
            'ERR_CHK_INVALID_SHIPPING_ADDRESS',
            'ERR_WS_INVALID_SHIPPING_ADDRESS'
        ],
        sameAsMessage: Utils.translate('Same as billing address'),
        selectAddressErrorMessage: {
            errorCode: 'ERR_CHK_SELECT_SHIPPING_ADDRESS',
            errorMessage: Utils.translate('Please select a shipping address')
        },
        invalidAddressErrorMessage: {
            errorCode: 'ERR_CHK_INVALID_SHIPPING_ADDRESS',
            errorMessage: Utils.translate('The selected shipping address is invalid')
        },
        selectMessage: Utils.translate('Ship to this Address'),
        isActive: function () {
            return (!this.wizard.model.get('ismultishipto') && this.wizard.model.shippingAddressIsRequired());
        },
        eventHandlersOn: function () {
            OrderWizardModuleAddress.prototype.eventHandlersOn.apply(this, arguments);
            this.model.on('change:tempshipaddress', jQuery.proxy(this, 'estimateShipping'), this);
            this.wizard.model.on('ismultishiptoUpdated', this.render, this);
        },
        eventHandlersOff: function () {
            OrderWizardModuleAddress.prototype.eventHandlersOff.apply(this, arguments);
            this.model.off('change:tempshipaddress', null, this);
            this.model.off('change:ismultishipto', null, this);
        },
        changeAddress: function () {
            OrderWizardModuleAddress.prototype.changeAddress.apply(this, arguments);
            if (this.address) {
                this.model.trigger('change:' + this.manage);
            }
        },
        // @method postEvaluateDisablingSameAsCheckBox Override the method in 'OrderWizard.Module.Address' that evaluates whether the 'same as' checkbox should be enabled or not.
        // This value is saved in the instance variable disableSameAsCheckBox.
        // If there is only one addresss saved and selected as the shipping address and is the same as the billing address, the checkbox should be disabled. Once a new address is added the checkbox should be enable.
        postEvaluateDisablingSameAsCheckBox: function () {
            this.disableSameAsCheckBox =
                this.addresses &&
                    this.addresses.length === 1 &&
                    this.getSelectedAddress().id === this.addresses.models[0].id
                    ? true
                    : this.disableSameAsCheckBox;
        },
        estimateShipping: function (model, address) {
            var siteSettings = this.wizard.application.getConfig().siteSettings;
            var countries = siteSettings.countries;
            var country_value = address && address.country;
            var state_value = address && address.state;
            var zip_value = address && address.zip;
            var country_ready = country_value && country_value !== model.previous('country');
            var state_ready = (country_value && !countries[country_value].states) ||
                (state_value && state_value !== model.previous('state'));
            var zip_ready = (country_value && countries[country_value].isziprequired === 'F') ||
                (zip_value && zip_value !== model.previous('zip'));
            if (country_ready && zip_ready && state_ready) {
                var addresses = this.model.get('addresses');
                var address_id = country_value + '-' + (state_value || '-') + '--' + (zip_value || '-') + '----null';
                var current_address = addresses.get(address_id);
                if (!current_address) {
                    addresses.add({
                        internalid: address_id,
                        country: country_value,
                        state: state_value,
                        zip: zip_value
                    });
                }
                else {
                    current_address.set({
                        country: country_value,
                        state: state_value,
                        zip: zip_value
                    });
                }
                if (this.addressId !== address_id) {
                    model.set({
                        shipaddress: address_id,
                        isEstimating: true
                    });
                }
            }
            else {
                model.set({ isEstimating: false });
            }
        }
    });
    return OrderWizardModuleAddressShipping;
});

//# sourceMappingURL=OrderWizard.Module.Address.Shipping.js.map
