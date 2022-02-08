/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Sensors.Cart", ["require", "exports", "LiveOrder.Model"], function (require, exports, LiveOrderModel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function cart() {
        var cartLines = LiveOrderModel.getInstance().get('lines');
        return cartLines ? "" + cartLines.length : '';
    }
    exports.cart = cart;
});

//# sourceMappingURL=Loggers.Appender.Sensors.Cart.js.map
