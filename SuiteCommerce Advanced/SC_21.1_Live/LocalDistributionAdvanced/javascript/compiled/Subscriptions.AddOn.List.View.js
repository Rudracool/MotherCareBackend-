/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.AddOn.List.View", ["require", "exports", "underscore", "backbone_collection_view_row.tpl", "subscriptions_addons.tpl", "Utils", "jQuery", "Subscriptions.Model", "Backbone.View", "Backbone.CollectionView", "Subscriptions.AddOn.View", "AjaxRequestsKiller", "Loggers"], function (require, exports, _, backbone_collection_view_row_tpl, subscriptions_addons, Utils, jQuery, Subscriptions_Model_1, BackboneView, BackboneCollectionView, SubscriptionsAddOnView, AjaxRequestsKiller_1, Loggers_1) {
    "use strict";
    var SubscriptionsAddOnListView = BackboneView.extend({
        template: subscriptions_addons,
        title: Utils.translate('My Subscriptions'),
        page_header: Utils.translate('My Subscriptions'),
        attributes: {
            id: 'Subscriptions',
            class: 'Subscriptions'
        },
        initialize: function (options) { },
        beforeShowContent: function beforeShowContent() {
            var _this = this;
            var promise = jQuery.Deferred();
            var loggersActionId = Loggers_1.Loggers.getLogger().start('SUBSCRIPTIONS_ADDONS_LIST');
            if (!this.options.subscription) {
                this.subscription = new Subscriptions_Model_1.SubscriptionsModel({
                    internalid: this.options.routerArguments[0]
                });
                var fetch_1 = this.subscription
                    .fetch({ killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId() })
                    .done(function () {
                    _this.collection = _this.subscription.get('nonIncludedLinesCollection');
                    _this.collection.add(_this.subscription.get('optionalSubscriptionLines').models);
                    _this.collection = _.sortBy(_this.collection.models, function (model) {
                        return model.getStatusLabel();
                    });
                    Loggers_1.Loggers.getLogger().end(loggersActionId);
                })
                    .always(function () { return promise.resolve(); });
                return fetch_1;
            }
            this.subscription = this.options.subscription;
            this.collection = this.subscription.get('nonIncludedLinesCollection');
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
                    text: this.subscription.get('name'),
                    href: "subscription/" + this.subscription.get('internalid')
                },
                {
                    text: Utils.translate('Add-ons'),
                    href: "subscription/" + this.subscription.get('internalid') + "/addons"
                }
            ];
        },
        childViews: {
            'Facets.Items': function () {
                return new BackboneCollectionView({
                    childView: SubscriptionsAddOnView,
                    childViewOptions: {
                        application: this.options.application,
                        subscription: this.subscription
                    },
                    viewsPerRow: Utils.isPhoneDevice() ? 2 : 3,
                    collection: this.collection,
                    rowTemplate: backbone_collection_view_row_tpl
                });
            }
        },
        // @method getContext @return {Subscriptions.AddOn.List.View.Context}
        getContext: function () {
            // @class Subscriptions.AddOn.List.View.Context
            return {
                //  @property {String} pageHeader
                pageHeader: this.subscription.get('name')
            };
        }
    });
    return SubscriptionsAddOnListView;
});

//# sourceMappingURL=Subscriptions.AddOn.List.View.js.map
