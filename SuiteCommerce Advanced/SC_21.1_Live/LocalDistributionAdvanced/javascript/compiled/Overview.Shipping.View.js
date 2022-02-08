/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Overview.Shipping.View", ["require", "exports", "overview_shipping.tpl", "Address.Details.View", "Backbone.View"], function (require, exports, overview_shipping_tpl, Address_Details_View_1, BackboneView) {
    "use strict";
    var OverviewShippingView = BackboneView.extend({
        template: overview_shipping_tpl,
        initialize: function () { },
        childViews: {
            'Address.Details': function () {
                return new Address_Details_View_1.AddressDetailsView({
                    hideDefaults: true,
                    hideActions: true,
                    model: this.model,
                    hideSelector: true
                });
            }
        },
        // @method getContext @returns {Overview.Shipping.View.Context}
        getContext: function () {
            // @class Overview.Shipping.View.Context
            return {
                // @property {Boolean} hasDefaultShippingAddress
                hasDefaultShippingAddress: !!this.model,
                // @property {String} shippingAddressInternalid
                shippingAddressInternalid: this.model && this.model.get('internalid')
            };
        }
    });
    return OverviewShippingView;
});

//# sourceMappingURL=Overview.Shipping.View.js.map
