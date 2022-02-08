/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PromocodeSupport", ["require", "exports", "LiveOrder.Model", "UrlHelper", "Backbone"], function (require, exports, LiveOrderModel, UrlHelper_1, Backbone) {
    "use strict";
    var PromocodeSupport = {
        mountToApp: function () {
            // Method defined in file UrlHelper.js
            UrlHelper_1.UrlHelper.addTokenListener('promocode', function (value) {
                // Because this is passed from the URL and there might be spaces and special chars,
                // we need to fix this so it does not invalidate our promocode
                value = unescape(value.replace(/[+]/g, ' '));
                var liveorder = LiveOrderModel.getInstance();
                var promocodes = liveorder.get('promocodes') || [];
                var new_promocodes = promocodes.concat({ code: value });
                var url;
                // We get the instance of the ShoppingCart and apply the promocode
                liveorder.save({ promocodes: new_promocodes }).always(function savePromocodeEnded() {
                    liveorder.trigger('promocodeUpdated', 'applied');
                });
                url = Backbone.history.fragment
                    .replace('&promocode=' + value, '')
                    .replace('?promocode=' + value, '');
                Backbone.history.navigate(url, { trigger: false, replace: true });
                return false;
            });
        }
    };
    return PromocodeSupport;
});

//# sourceMappingURL=PromocodeSupport.js.map
