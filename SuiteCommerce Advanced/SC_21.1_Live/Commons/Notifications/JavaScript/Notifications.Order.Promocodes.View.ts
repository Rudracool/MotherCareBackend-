/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Notifications.Order.Promocodes.View"/>
// @module Notifications.Order.Promocodes.View

import * as notifications_order_promocodes from 'notifications_order_promocodes.tpl';
import * as Utils from '../../Utilities/JavaScript/Utils';

import { GlobalViewsMessageView } from '../../GlobalViews/JavaScript/GlobalViews.Message.View';

import BackboneView = require('../../../Commons/BackboneExtras/JavaScript/Backbone.View');

// @class Notification.Order.Promocodes.View @extend Backbone.View
const NotificationsOrderPromocodesView: any = BackboneView.extend({
    // @property {Function} template
    template: notifications_order_promocodes,

    // @method initialize
    // @return {Void}
    initialize: function initialize() {
        this.on('afterCompositeViewRender', this.afterViewRender, this);
    },

    // @property {ChildViews} childViews
    childViews: {
        'Promocode.Notification': function() {
            let notification;

            if (this.model.get('type') === 'FREEGIFT' && !!this.model.get('freegiftinfo')) {
                notification = this.getFreeGiftNotification(
                    this.model.get('freegiftinfo')[0],
                    this.model.get('freegiftinfo')[1]
                );
            } else {
                notification = this.getNotification();
            }

            if (notification && notification.message && notification.type) {
                return new GlobalViewsMessageView({
                    message: notification.message,
                    type: notification.type,
                    closable: true
                });
            }
        }
    },

    // @method afterViewRender lets parent model know the promotion
    // already shwoed its current notification
    // @return {Void}
    afterViewRender: function() {
        this.options.parentModel.trigger(
            'promocodeNotificationShown',
            this.model.get('internalid')
        );
    },

    // @method getNotification
    // @return {Notification}
    getNotification: function() {
        const notification: any = {};

        if (this.model.get('applicabilitystatus') === 'APPLIED') {
            notification.type = 'success';
            notification.message = Utils.translate(
                'Promotion <strong>$(0)</strong> is now discounting your order.',
                this.model.get('code')
            );
        } else if (this.model.get('applicabilityreason') === 'CRITERIA_NOT_MET') {
            notification.type = !this.model.get('isautoapplied') ? 'warning' : 'info';
            notification.message = Utils.translate(
                'Promotion <strong>$(0)</strong> is not discounting your order. $(1)',
                this.model.get('code'),
                this.model.get('errormsg')
            );
        } else if (this.model.get('applicabilityreason') === 'DISCARDED_BEST_OFFER') {
            notification.type = 'info';
            notification.message = Utils.translate(
                'We have chosen the best possible offer for you. Promotion <strong>$(0)</strong> is not discounting your order.',
                this.model.get('code')
            );
        }

        return notification;
    },

    // @method getFreeGiftNotification
    // @return {Notification}
    getFreeGiftNotification: function(free_gift_info_old, free_gift_info_current) {
        let gift_quantity;
        let message_type;

        if (!free_gift_info_old) {
            gift_quantity = free_gift_info_current.added_quantity;
            message_type = 'success';
        } else if (!free_gift_info_current) {
            gift_quantity = free_gift_info_old.added_quantity;
            message_type = 'warning';
        } else {
            const qty_diff =
                free_gift_info_current.added_quantity - free_gift_info_old.added_quantity;

            if (qty_diff > 0) {
                gift_quantity = qty_diff;
                message_type = 'success';
            } else {
                gift_quantity = qty_diff * -1;
                message_type = 'warning';
            }
        }

        if (message_type && gift_quantity) {
            return this.setFreeGifttNotificationText(message_type, gift_quantity);
        }
    },

    setFreeGifttNotificationText: function(message_type, gift_quantity) {
        const notification: any = {};

        notification.type = message_type;

        if (message_type === 'success') {
            if (gift_quantity > 1) {
                notification.message = Utils.translate(
                    'Congratulations! $(0) FREE $(1) were added to your cart.',
                    gift_quantity,
                    this.model.get('freegiftname')
                );
            } else {
                notification.message = Utils.translate(
                    'Congratulations! $(0) FREE $(1) was added to your cart.',
                    gift_quantity,
                    this.model.get('freegiftname')
                );
            }
        } else if (message_type === 'warning') {
            const errormsg = this.model.get('errormsg') ? this.model.get('errormsg') : '';

            if (gift_quantity > 1) {
                notification.message = Utils.translate(
                    '$(0) $(1) were removed from your cart. $(2)',
                    gift_quantity,
                    this.model.get('freegiftname'),
                    errormsg
                );
            } else {
                notification.message = Utils.translate(
                    '$(0) $(1) was removed from your cart. $(2)',
                    gift_quantity,
                    this.model.get('freegiftname'),
                    errormsg
                );
            }
        }

        return notification;
    },

    // @method getContext
    // @return {Notifications.Order.Promocodes.View.context}
    getContext: function getContext() {
        // @class Notifications.Order.Promocodes.View.context
        return {};
        // @class Notifications.Order.Promocodes.View
    }
});

export = NotificationsOrderPromocodesView;
