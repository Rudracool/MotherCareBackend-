/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory.Cancel.View", ["require", "exports", "order_history_cancel.tpl", "Backbone.View"], function (require, exports, order_history_cancel_tpl, BackboneView) {
    "use strict";
    // @class ReturnAuthorization.Cancel.View @extend Backbone.Vie
    var OrderHistoryCancelview = BackboneView.extend({
        template: order_history_cancel_tpl,
        events: {
            'click [data-action="delete"]': 'confirm'
        },
        initialize: function (options) {
            this.application = options.application;
        },
        confirm: function () {
            var _this = this;
            var recordTypeParam = { recordtype: 'salesorder' };
            this.model.set('status', 'cancelled', { silent: false });
            this.model.save(recordTypeParam).done(function (result) {
                _this.model.addToCache(result, recordTypeParam);
            });
        },
        // @method getContext @returns OrderHistory.Cancel.View.Context
        getContext: function () {
            // @class OrderHistory.Cancel.View.Context
            return {
                // @property {OrderHistory.Model} model
                model: this.model
            };
        }
    });
    return OrderHistoryCancelview;
});

//# sourceMappingURL=OrderHistory.Cancel.View.js.map
