/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Cart.Promocode.Notifications.View", ["require", "exports", "cart_promocode_notifications.tpl", "Utils", "GlobalViews.Message.View", "Backbone.View"], function (require, exports, cart_promocode_notifications, Utils, GlobalViews_Message_View_1, BackboneView) {
    "use strict";
    return BackboneView.extend({
        // @property {Function} template
        template: cart_promocode_notifications,
        // @method initialize
        // @return {Void}
        initialize: function initialize() {
            this.on('afterCompositeViewRender', this.afterViewRender, this);
        },
        // @property {ChildViews} childViews
        childViews: {
            'Promocode.Notification': function () {
                var notification;
                if (this.model.get('type') === 'FREEGIFT' && !!this.model.get('freegiftinfo')) {
                    notification = this.getFreeGiftNotification(this.model.get('freegiftinfo')[0], this.model.get('freegiftinfo')[1]);
                }
                else {
                    notification = this.getNotification();
                }
                return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: notification.message,
                    type: notification.type,
                    closable: true
                });
            }
        },
        // @method afterViewRender lets parent model know the promotion
        // already shwoed its current notification
        // @return {Void}
        afterViewRender: function () {
            this.options.parentModel.trigger('promocodeNotificationShown', this.model.get('internalid'));
        },
        // @method getNotification
        // @return {Notification}
        getNotification: function () {
            var notification = {};
            if (this.model.get('applicabilitystatus') === 'APPLIED') {
                notification.type = 'success';
                notification.message = Utils.translate('Promotion <strong>$(0)</strong> is now discounting your order.', this.model.get('code'));
            }
            else if (this.model.get('applicabilityreason') === 'CRITERIA_NOT_MET') {
                notification.type = !this.model.get('isautoapplied') ? 'warning' : 'info';
                notification.message = Utils.translate('Promotion <strong>$(0)</strong> is not discounting your order. $(1)', this.model.get('code'), this.model.get('errormsg'));
            }
            else if (this.model.get('applicabilityreason') === 'DISCARDED_BEST_OFFER') {
                notification.type = 'info';
                notification.message = Utils.translate('We have chosen the best possible offer for you. Promotion <strong>$(0)</strong> is not discounting your order.', this.model.get('code'));
            }
            return notification;
        },
        // @method getFreeGiftNotification
        // @return {Notification}
        getFreeGiftNotification: function (free_gift_info_old, free_gift_info_current) {
            if (!free_gift_info_old) {
                return this.setFreeGifttNotification('success', free_gift_info_current.qtygiven);
            }
            if (!free_gift_info_current) {
                return this.setFreeGifttNotification('warning', free_gift_info_old.qtygiven);
            }
            var qty_diff = free_gift_info_current.qtygiven - free_gift_info_old.qtygiven;
            if (qty_diff > 0) {
                return this.setFreeGifttNotification('success', qty_diff);
            }
            return this.setFreeGifttNotification('warning', qty_diff * -1);
        },
        setFreeGifttNotificationText: function (message_type, gift_quantity) {
            var notification = {};
            notification.type = message_type;
            if (message_type === 'success') {
                if (gift_quantity > 1) {
                    notification.message = Utils.translate('Congratulations! $(0) FREE $(1) were added to your cart.', gift_quantity, this.model.get('freegiftname'));
                }
                else {
                    notification.message = Utils.translate('Congratulations! $(0) FREE $(1) was added to your cart.', gift_quantity, this.model.get('freegiftname'));
                }
            }
            else if (message_type === 'warning') {
                var errormsg = this.model.get('errormsg') ? this.model.get('errormsg') : '';
                if (gift_quantity > 1) {
                    notification.message = Utils.translate('$(0) $(1) were removed from your cart. $(2)', gift_quantity, this.model.get('freegiftname'), errormsg);
                }
                else {
                    notification.message = Utils.translate('$(0) $(1) was removed from your cart. $(2)', gift_quantity, this.model.get('freegiftname'), errormsg);
                }
            }
            return notification;
        },
        // @method getContext
        // @return {Cart.Promocode.Notifications.View.context}
        getContext: function getContext() {
            // @class Cart.Promocode.Notifications.View.context
            return {};
            // @class Cart.Promocode.Notifications.View
        }
    });
});

//# sourceMappingURL=Cart.Promocode.Notifications.View.js.map
