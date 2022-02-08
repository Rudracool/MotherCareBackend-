/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Subscriptions.Line.View", ["require", "exports", "subscriptions_line.tpl", "Utils", "BackboneExtras", "View", "Subscriptions.Status.View", "Subscriptions.Pricing.View"], function (require, exports, subscriptions_line_tpl, Utils, Backbone, View_1, Subscriptions_Status_View_1, Subscriptions_Pricing_View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubscriptionLineView = /** @class */ (function (_super) {
        __extends(SubscriptionLineView, _super);
        function SubscriptionLineView(options) {
            var _this = _super.call(this) || this;
            _this.events = {
                'click [data-action="change"]': 'goToPDP'
            };
            _this.template = subscriptions_line_tpl;
            _this.childViews = {
                'Pricing.View': function () {
                    return new Subscriptions_Pricing_View_1.SubscriptionsPricingView({ model: _this.model });
                },
                StatusView: function () {
                    return new Subscriptions_Status_View_1.SubscriptionsStatusView({ status: _this.model.getStatusLabel() });
                }
            };
            _this.options = options;
            _this.subscription = options.subscription;
            _this.model = options.model;
            return _this;
        }
        SubscriptionLineView.prototype.goToPDP = function () {
            var subscription_id = this.subscription.get('internalid');
            var line_id = this.model.get('internalId');
            Backbone.history.navigate("subscription-addon-details/" + subscription_id + "/" + line_id, {
                trigger: true
            });
        };
        SubscriptionLineView.prototype.getContext = function () {
            var item = this.model.get('item');
            var name = item.get('storeDisplayName') || item.get('itemId') || '';
            var quantity = this.model.get('quantity') || Utils.translate('N/A');
            var start_date = this.model.get('startDate');
            var charge_type = this.model.get('subscriptionLineTypeObj') &&
                this.model.get('subscriptionLineTypeObj').subscriptionlinetypeText;
            return {
                // @property {Boolean} isPhoneDevice
                isPhoneDevice: Utils.isPhoneDevice(),
                // @property {Boolean} isProcessing
                isProcessing: this.model.getStatusLabel() === 'PROCESSING',
                // @propery {String} name
                name: name,
                // @property {Boolean} quantity
                quantity: quantity,
                // @property {Boolean} start_date
                startDate: start_date,
                // @property {String} subscriptionLineNumber
                subscriptionLineNumber: this.model.get('lineNumber'),
                // @property {number} type
                type: charge_type,
                // @property {Boolean} isChargeTypeUsage
                isChargeTypeUsage: charge_type === 'Usage',
                // @property {Boolean} isLineTypeOptional
                isLineTypeOptional: this.model.get('catalogType') === 'OPTIONAL',
                // @property {Boolean} hasPriceIntervals
                hasPriceIntervals: this.model.hasPriceIntervals()
            };
        };
        return SubscriptionLineView;
    }(View_1.View));
    exports.SubscriptionLineView = SubscriptionLineView;
});

//# sourceMappingURL=Subscriptions.Line.View.js.map
