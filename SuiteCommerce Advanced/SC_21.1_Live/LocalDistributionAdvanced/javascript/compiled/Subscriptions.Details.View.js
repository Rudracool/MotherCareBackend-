/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.Details.View", ["require", "exports", "underscore", "subscriptions_details.tpl", "Utils", "Loggers", "Subscriptions.Line.View", "Subscriptions.Status.View", "Subscriptions.Model", "Configuration", "AjaxRequestsKiller", "jQuery", "Backbone.View", "GlobalViews.Confirmation.View", "Backbone.CollectionView", "Backbone"], function (require, exports, _, subscriptions_details_tpl, Utils, Loggers_1, Subscriptions_Line_View_1, Subscriptions_Status_View_1, Subscriptions_Model_1, Configuration_1, AjaxRequestsKiller_1, jQuery, BackboneView, GlobalViewsConfirmationView, BackboneCollectionView, Backbone) {
    "use strict";
    var SubscriptionsDetailsView = BackboneView.extend({
        template: subscriptions_details_tpl,
        title: Utils.translate('My Subscriptions'),
        page_header: Utils.translate('My Subscriptions'),
        events: {
            'click [data-action="goToAddOnsMarket"]': 'goToAddOnsMarket',
            'click [data-action="cancel-subscription"]': 'cancel',
            'click [data-action="reactivate-subscription"]': 'reactivate'
        },
        attributes: {
            id: 'Subscriptions',
            class: 'Subscriptions'
        },
        initialize: function (options) {
            this.application = options.application;
            this.options = options;
        },
        beforeShowContent: function beforeShowContent() {
            var promise = jQuery.Deferred();
            var loggersActionId = Loggers_1.Loggers.getLogger().start('SUBSCRIPTIONS_DETAILS');
            this.model = new Subscriptions_Model_1.SubscriptionsModel({ internalid: this.options.routerArguments[0] });
            this.model
                .fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            })
                .done(function () { return Loggers_1.Loggers.getLogger().end(loggersActionId); })
                .always(function () { return promise.resolve(); });
            return promise;
        },
        // @method getSelectedMenu @return {String}
        getSelectedMenu: function () {
            return 'subscriptions';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return [
                {
                    text: this.title,
                    href: '/subscriptions-list'
                },
                {
                    text: this.model.get('name'),
                    href: "subscription/" + this.model.get('internalid')
                }
            ];
        },
        goToAddOnsMarket: function () {
            var subscription_id = this.model.get('internalid');
            Backbone.history.navigate("subscription/" + subscription_id + "/addons", {
                trigger: true
            });
        },
        // @property {Object} childViews
        childViews: {
            StatusView: function () {
                return new Subscriptions_Status_View_1.SubscriptionsStatusView({ status: this.model.getStatusLabel('status') });
            },
            'Optional.Lines.Collection': function () {
                return new BackboneCollectionView({
                    childView: Subscriptions_Line_View_1.SubscriptionLineView,
                    viewsPerRow: 1,
                    collection: this.model.get('optionalSubscriptionLines'),
                    childViewOptions: _.extend(this.options, {
                        subscription: this.model
                    })
                });
            },
            'Required.Lines.Collection': function () {
                return new BackboneCollectionView({
                    childView: Subscriptions_Line_View_1.SubscriptionLineView,
                    viewsPerRow: 1,
                    collection: this.model.get('requiredSubscriptionLines'),
                    childViewOptions: _.extend(this.options, {
                        subscription: this.model
                    })
                });
            }
        },
        cancel: function (e) {
            e.preventDefault();
            var deleteConfirmationView = new GlobalViewsConfirmationView({
                callBack: this._cancelSubscription,
                callBackParameters: {
                    context: this
                },
                title: Utils.translate('Suspend Subscription'),
                body: Utils.translate('Are you sure you want to suspend your subscription?'),
                autohide: true
            });
            return this.application.getLayout().showInModal(deleteConfirmationView);
        },
        _cancelSubscription: function (options) {
            var componentArea = Configuration_1.Configuration.get('subscriptions.generalStatusChange') === 'Allow Suspending / Resuming'
                ? 'SUBSCRIPTIONS_PAUSED'
                : 'SUBSCRIPTIONS_CANCELED';
            var params = {
                componentArea: componentArea
            };
            var loggersActionId = Loggers_1.Loggers.getLogger().start(componentArea);
            options.context.model.destroy().done(function () {
                Loggers_1.Loggers.getLogger().end(loggersActionId);
                Backbone.history.navigate("subscription/" + options.context.model.get('internalid'), true);
            });
        },
        reactivate: function (e) {
            e.preventDefault();
            var deleteConfirmationView = new GlobalViewsConfirmationView({
                callBack: this._reactivateSubscription,
                callBackParameters: {
                    context: this
                },
                title: Utils.translate('Reactivate Subscription'),
                body: Utils.translate('Please, confirm you want to reactivate this subscription'),
                autohide: true
            });
            return this.application.getLayout().showInModal(deleteConfirmationView);
        },
        _reactivateSubscription: function (options) {
            var loggersActionId = Loggers_1.Loggers.getLogger().start('SUBSCRIPTIONS_RESUMED');
            options.context.model.save().done(function () {
                Loggers_1.Loggers.getLogger().end(loggersActionId);
                Backbone.history.navigate("subscription/" + options.context.model.get('internalid'), true);
            });
        },
        // @method getContext @return {Subscriptions.Details.View.Context}
        getContext: function () {
            // @class Subscriptions.List.View.Context
            var subscriptionplan_name = this.model.get('name') || '';
            var end_date = this.model.get('endDate') || Utils.translate('N/A');
            return {
                // @property {String} name
                name: subscriptionplan_name,
                // @property {Boolean} isOptionalLinesCountGreaterThan0
                isOptionalLinesCountGreaterThan0: this.model.get('optionalSubscriptionLines').length > 0,
                // @property {Boolean} isRequiredLinesCountGreaterThan0
                isRequiredLinesCountGreaterThan0: this.model.get('requiredSubscriptionLines').length > 0,
                // @property {Boolean} isNonIncludedLinesCountGreaterThan0
                isNonIncludedLinesCountGreaterThan0: this.model.get('nonIncludedLinesCollection').length > 0,
                // @property {String} internalId
                internalId: this.model.get('internalid'),
                // @property {Boolean) hasNextBillCycleDate
                hasNextBillCycleDate: !!this.model.get('nextBillCycleDate'),
                // @property {String} nextBillCycleDate
                nextBillCycleDate: this.model.get('nextBillCycleDate'),
                // @property {Boolean} hasLastBillDate
                hasLastBillDate: !!this.model.get('lastBillDate'),
                // @property {String} lastBillDate
                lastBillDate: this.model.get('lastBillDate'),
                // @property {Boolean} hasStartDate
                hasStartDate: !!this.model.get('startDate'),
                // @property {String} startDate
                startDate: this.model.get('startDate'),
                // @property {String} endDate
                endDate: end_date,
                // @property {Boolean} canBeSuspended
                canBeSuspended: this.model.get('canBeSuspended'),
                // @property {Boolean} canBeReactivated
                canBeReactivated: this.model.get('canBeReactivated'),
                // @property {Boolean} hasNextRenewalStartDate
                hasNextRenewalStartDate: !!this.model.get('nextRenewalStartDate'),
                // @property {String} nextRenewalStartDate
                nextRenewalStartDate: this.model.get('nextRenewalStartDate')
            };
        }
    });
    return SubscriptionsDetailsView;
});

//# sourceMappingURL=Subscriptions.Details.View.js.map
