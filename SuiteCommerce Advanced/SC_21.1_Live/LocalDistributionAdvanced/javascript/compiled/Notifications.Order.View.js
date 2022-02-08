/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Notifications.Order.View", ["require", "exports", "underscore", "notifications_order.tpl", "jQuery", "Notifications.Order.Promocodes.View", "LiveOrder.Model", "Backbone.View", "Backbone.CollectionView"], function (require, exports, _, notifications_order_tpl, jQuery, NotificationsOrderPromocodesView, LiveOrderModel, BackboneView, BackboneCollectionView) {
    "use strict";
    // @class Notifications.Order.View @extends Backbone.View
    var NotificationsOrderView = BackboneView.extend({
        template: notifications_order_tpl,
        initialize: function () {
            this.model = LiveOrderModel.getInstance();
            this.model.on('change', this.render, this);
            this.model.get('lines').on('add remove', this.render, this);
            this.model.on('promocodeNotificationShown', this.removePromocodeNotification, this);
            this.notification_shown = false;
            this.on('afterCompositeViewRender', function () {
                if (this.notification_shown) {
                    jQuery('body').animate({
                        scrollTop: this.$el.offset().top
                    }, 600);
                    this.notification_shown = false;
                }
            });
        },
        removePromocodeNotification: function (promocode_id) {
            var promocode = _.findWhere(this.model.get('promocodes'), {
                internalid: promocode_id
            });
            delete promocode.notification;
        },
        // @property {ChildViews} childViews
        childViews: {
            'Promocode.Notifications': function () {
                var promotions = _.filter(this.model.get('promocodes') || [], function (promocode) {
                    return promocode.notification === true;
                });
                if (promotions.length) {
                    this.notification_shown = true;
                    return new BackboneCollectionView({
                        collection: promotions,
                        viewsPerRow: 1,
                        childView: NotificationsOrderPromocodesView,
                        childViewOptions: {
                            parentModel: this.model
                        }
                    });
                }
            }
        },
        // @method getContext @return Notifications.Order.View.Context
        getContext: function () {
            // @class Notifications.Order.View.Context
            return {};
        }
    });
    return NotificationsOrderView;
});

//# sourceMappingURL=Notifications.Order.View.js.map
