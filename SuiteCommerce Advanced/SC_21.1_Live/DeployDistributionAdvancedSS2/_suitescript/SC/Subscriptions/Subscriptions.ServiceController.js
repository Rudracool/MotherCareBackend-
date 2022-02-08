/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
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
define(["require", "exports", "./Subscriptions.Model", "../../Common/Controller/RequestErrors", "../Libraries/Controller/SCAServiceController", "../../Common/Controller/HttpResponse", "../Libraries/Configuration/Configuration"], function (require, exports, Subscriptions_Model_1, RequestErrors_1, SCAServiceController_1, HttpResponse_1, Configuration_1) {
    "use strict";
    var SubscriptionsServiceController = /** @class */ (function (_super) {
        __extends(SubscriptionsServiceController, _super);
        function SubscriptionsServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.configuration = Configuration_1.Configuration.getInstance();
            _this.name = 'Subscriptions.ServiceController';
            _this.options = {
                common: {
                    requireLogin: true
                }
            };
            return _this;
        }
        SubscriptionsServiceController.prototype.getById = function () {
            var subscriptionsModel = new Subscriptions_Model_1.SubscriptionsModel(this.request.parameters.internalid);
            return new HttpResponse_1.HttpResponse(subscriptionsModel.get(this.request.parameters.internalid));
        };
        SubscriptionsServiceController.prototype.get = function () {
            var subscriptionsModel = new Subscriptions_Model_1.SubscriptionsModel();
            var billingAccounts = this.request.parameters.billingAccounts;
            if (billingAccounts) {
                return new HttpResponse_1.HttpResponse(subscriptionsModel.searchBillingAccounts());
            }
            var _a = this.request.parameters, filter = _a.filter, order = _a.order, sort = _a.sort, from = _a.from, to = _a.to, page = _a.page;
            return new HttpResponse_1.HttpResponse(subscriptionsModel.search({
                filter: filter,
                order: order,
                sort: sort,
                from: from,
                to: to,
                page: page || 1
            }));
        };
        SubscriptionsServiceController.prototype.put = function () {
            if (!this.data.internalid) {
                throw RequestErrors_1.badRequestError;
            }
            var subscriptionsModel = new Subscriptions_Model_1.SubscriptionsModel(this.data.internalid);
            if (this.data.action === 'delete' && !_.isUndefined(this.data.lineNumber)) {
                if (this.configuration.get('subscriptions.lineStatusChange') !== "Don't Allow Status Changes") {
                    subscriptionsModel.suspendLine(this.data);
                }
                else {
                    throw 'Cancelling subscription lines is not allowed. Please contact your sales representative.';
                }
            }
            else if (!_.isUndefined(this.data.quantity) && !_.isUndefined(this.data.lineNumber)) {
                subscriptionsModel.updateLine(this.data);
            }
            else if (this.configuration.get('subscriptions.generalStatusChange') ===
                'Allow Suspending / Resuming' &&
                _.isUndefined(this.data.lineNumber)) {
                subscriptionsModel.reactivateSubscription(this.data);
            }
            else {
                throw 'Resuming subscriptions is not allowed. Please contact your sales representative.';
            }
            return new HttpResponse_1.HttpResponse(subscriptionsModel.get(this.data.internalid));
        };
        SubscriptionsServiceController.prototype.delete = function () {
            var id = this.request.parameters.internalid;
            if (!id) {
                throw RequestErrors_1.badRequestError;
            }
            var subscriptionsModel = new Subscriptions_Model_1.SubscriptionsModel(id);
            if (this.configuration.get('subscriptions.generalStatusChange') !== "Don't Allow Status Changes") {
                subscriptionsModel.suspendSubscription();
            }
            else {
                throw 'Cancelling subscriptions is not allowed. Please contact your sales representative.';
            }
            return new HttpResponse_1.HttpResponse(subscriptionsModel.get(id));
        };
        return SubscriptionsServiceController;
    }(SCAServiceController_1.SCAServiceController));
    return {
        service: function (ctx) {
            new SubscriptionsServiceController(ctx).initialize();
        }
    };
});
