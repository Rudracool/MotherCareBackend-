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
define("Subscriptions.Status.View", ["require", "exports", "underscore", "subscriptions_status.tpl", "View"], function (require, exports, _, subscriptions_status_tpl, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubscriptionsStatusView = /** @class */ (function (_super) {
        __extends(SubscriptionsStatusView, _super);
        function SubscriptionsStatusView(options) {
            var _this = _super.call(this) || this;
            _this.template = subscriptions_status_tpl;
            _this.options = options;
            return _this;
        }
        SubscriptionsStatusView.prototype.replaceStatusLabel = function (whatTo, forTo) {
            return this.options.status.toLowerCase().replace(whatTo, forTo);
        };
        SubscriptionsStatusView.prototype.getContext = function () {
            var has_status = !_.isUndefined(this.options.status) && !(this.options.status === 'NOT_INCLUDED');
            return {
                cssClass: this.replaceStatusLabel('_', ' '),
                has_status: has_status,
                status: this.replaceStatusLabel('_', '-')
            };
        };
        return SubscriptionsStatusView;
    }(View_1.View));
    exports.SubscriptionsStatusView = SubscriptionsStatusView;
});

//# sourceMappingURL=Subscriptions.Status.View.js.map
