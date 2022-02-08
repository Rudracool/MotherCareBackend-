/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('CardHolderAuthentication.Model', ['SC.Model', 'SC.Models.Init', 'underscore', 'Utils'], function(
    SCModel,
    ModelsInit,
    _,
    Utils
) {
    // @class CardHolderAuthentication.Model Defines the model used for authentication in case of 3DSecure
    // Available methods allow to create, submit and search a cardHolder authentication record
    // @extends SCModel
    return SCModel.extend({
        name: 'CardHolderAuthentication',
        // @property {Object} addressType
        addressType: {
            SHIPPING: 'shippingaddress',
            BILLING: 'billingaddress'
        },

        create: function create(options) {
            let cardholderAuthenticationRecord = nlapiCreateRecord('cardholderauthentication');

            //Required field values
            cardholderAuthenticationRecord.setFieldValue('entity', nlapiGetUser());
            cardholderAuthenticationRecord.setFieldValue('amount', options.amount);
            cardholderAuthenticationRecord.setFieldValue('paymentoption', options.paymentOption);
            cardholderAuthenticationRecord.setFieldValue(
                'paymentprocessingprofile',
                options.paymentProcessingProfile
            );
            cardholderAuthenticationRecord.setFieldValue(
                'notificationurl',
                options.notificationURL
            );
            cardholderAuthenticationRecord.setFieldValue('challengewindowsize', '02');

            this.createAddress(
                cardholderAuthenticationRecord,
                this.addressType.SHIPPING,
                ModelsInit.order.getShippingAddress()
            );

            this.createAddress(
                cardholderAuthenticationRecord,
                this.addressType.BILLING,
                ModelsInit.order.getBillingAddress()
            );

            return nlapiSubmitRecord(cardholderAuthenticationRecord);
        },

        createAddress: function createAddress(record, type, address) {
            if (address && address.internalid && address.isvalid === 'T') {
                const addressInfo = record.createSubrecord(type);
                addressInfo.setFieldValue('country', address.country);
                addressInfo.setFieldValue('addressee', address.addressee);
                addressInfo.setFieldValue('addr1', address.addr1);
                addressInfo.setFieldValue('city', address.city);
                addressInfo.setFieldValue('state', address.state);
                addressInfo.setFieldValue('zip', address.zip);
                addressInfo.commit();
            }
        },

        searchById: function(id) {
            let filters = new Array();
            filters[0] = new nlobjSearchFilter('internalid', null, 'is', id);
            let columns = new Array();
            columns[0] = new nlobjSearchColumn('internalid');
            columns[1] = new nlobjSearchColumn('status');
            columns[2] = new nlobjSearchColumn('authenticatedeviceformid');
            columns[3] = new nlobjSearchColumn('authenticatedeviceformaction');
            columns[4] = new nlobjSearchColumn('challengeshopperformid');
            columns[5] = new nlobjSearchColumn('challengeshopperformaction');

            let searchresults = nlapiSearchRecord(
                'cardholderauthentication',
                null,
                filters,
                columns
            );

            if (searchresults.length > 0) {
                return searchresults[0];
            }

            throw notFoundError;
        },

        setStatus: function(id, status) {
            return nlapiSubmitField('cardholderauthentication', id, 'status', status);
        },

        searchAuthenticateDeviceInputFields: function(id) {
            var filters = new Array();
            filters[0] = new nlobjSearchFilter('cardholderauthentication', null, 'is', id);
            var columns = new Array();
            columns[0] = new nlobjSearchColumn('name');
            columns[1] = new nlobjSearchColumn('value');

            return nlapiSearchRecord('authenticatedeviceinput', null, filters, columns);
        },

        searchChallengeShopperInputFields: function(id) {
            var filters = new Array();
            filters[0] = new nlobjSearchFilter('cardholderauthentication', null, 'is', id);
            var columns = new Array();
            columns[0] = new nlobjSearchColumn('name');
            columns[1] = new nlobjSearchColumn('value');

            return nlapiSearchRecord('challengeshopperinput', null, filters, columns);
        },

        loadAndSubmitWithReturnedParameters: function(id, iframeType, returnedParameters) {
            var returnedParameters = JSON.parse(returnedParameters),
                cardholderAuthentication = nlapiLoadRecord('cardholderauthentication', id),
                group = 'challengeshopperresults';

            if (iframeType === 'AUTHENTICATE_DEVICE') {
                group = 'authenticatedeviceresults';
            }

            for (key in returnedParameters) {
                if (returnedParameters[key] !== '' && returnedParameters[key] !== 'null') {
                    cardholderAuthentication.selectNewLineItem(group);
                    cardholderAuthentication.setCurrentLineItemValue(group, 'name', key);
                    cardholderAuthentication.setCurrentLineItemValue(
                        group,
                        'value',
                        Utils.flatten(returnedParameters[key])
                    );
                    cardholderAuthentication.commitLineItem(group);
                }
            }

            nlapiSubmitRecord(cardholderAuthentication);
        }
    });
});
