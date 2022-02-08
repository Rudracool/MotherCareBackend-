/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("LivePayment", ["require", "exports", "LivePayment.Model"], function (require, exports, LivePaymentModel) {
    "use strict";
    var LivePayment = {
        mountToApp: function () {
            if (SC.ENVIRONMENT.LIVEPAYMENT) {
                LivePaymentModel.getInstance().set(SC.ENVIRONMENT.LIVEPAYMENT);
            }
        }
    };
    return LivePayment;
});

//# sourceMappingURL=LivePayment.js.map
