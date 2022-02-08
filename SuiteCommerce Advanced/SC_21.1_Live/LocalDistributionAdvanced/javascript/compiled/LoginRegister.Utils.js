/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("LoginRegister.Utils", ["require", "exports", "Configuration"], function (require, exports, Configuration_1) {
    "use strict";
    var LoginRegisterUtils = {
        skipLoginCloseModal: function () {
            if (this.$containerModal && Configuration_1.Configuration.get('checkoutApp.skipLogin')) {
                this.$containerModal
                    .removeClass('fade')
                    .modal('hide')
                    .data('bs.modal', null);
            }
        }
    };
    return LoginRegisterUtils;
});

//# sourceMappingURL=LoginRegister.Utils.js.map
