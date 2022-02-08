/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ExternalPayment", ["require", "exports", "Utils"], function (require, exports, Utils) {
    "use strict";
    var ExternalPayment = {
        mountToApp: function (application) {
            var _this = this;
            if (SC.ENVIRONMENT.EXTERNALPAYMENT && SC.ENVIRONMENT.EXTERNALPAYMENT.parameters) {
                var params_1 = SC.ENVIRONMENT.EXTERNALPAYMENT && SC.ENVIRONMENT.EXTERNALPAYMENT.parameters;
                var external_fragment = void 0;
                if (!params_1.errorCode) {
                    switch (params_1.externalPayment) {
                        case 'DONE':
                            external_fragment =
                                '#' +
                                    SC.CONFIGURATION.externalPayment[params_1.recordType.toUpperCase()]
                                        .doneFragment;
                            break;
                        case 'FAIL':
                            external_fragment =
                                '#' +
                                    SC.CONFIGURATION.externalPayment[params_1.recordType.toUpperCase()]
                                        .failFragment;
                            break;
                    }
                    if (external_fragment) {
                        delete params_1.errorCode;
                        external_fragment = Utils.addParamsToUrl(external_fragment, params_1);
                        window.location.hash = external_fragment;
                    }
                }
                else if (params_1.errorCode) {
                    var layout_1 = application.getLayout();
                    layout_1.once('afterAppendView', function () {
                        layout_1.internalError(_this.getErrorMessage(params_1.errorCode), Utils.translate('External Payment Error'), Utils.translate('External Payment Error'));
                    });
                }
            }
        },
        // @method getErrorMessage
        // @param {String} error_code
        getErrorMessage: function (error_code) {
            var message;
            switch (error_code) {
                case 'externalPaymentValidationStatusFail':
                    message = Utils.translate('Invalid payment event.');
                    break;
                case 'externalPaymentRequestInvalidParameters':
                    message = Utils.translate('Invalid parameters.');
                    break;
                case 'externalPaymentMissingImplementation':
                    message = Utils.translate('Invalid external payment method implementation.');
                    break;
                case 'externalPaymentRecordValidationStatusFail':
                    message = Utils.translate('Invalid record status.');
                    break;
                default:
                    message = Utils.translate('Invalid error code.');
            }
            return message;
        }
    };
    return ExternalPayment;
});

//# sourceMappingURL=ExternalPayment.js.map
