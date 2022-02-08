/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.PromocodeNotifications", ["require", "exports", "underscore", "order_wizard_promocodenotifications.tpl", "notifications.tpl", "jQuery", "Wizard.StepModule", "Cart.Promocode.Notifications.View", "Backbone.CollectionView"], function (require, exports, _, order_wizard_promocodenotifications_tpl, notifications_tpl, jQuery, Wizard_StepModule_1, CartPromocodeNotificationsView, BackboneCollectionView) {
    "use strict";
    return Wizard_StepModule_1.WizardStepModule.extend({
        // @property {Function} template
        template: order_wizard_promocodenotifications_tpl,
        // @method initialize
        initialize: function initialize() {
            Wizard_StepModule_1.WizardStepModule.prototype.initialize.apply(this, arguments);
            if (this.isActive()) {
                this.wizard.model.on('change:promocodes', this.render, this);
                this.wizard.model.on('promocodeNotificationShown', this.removePromocodeNotification, this);
            }
        },
        isActive: function isActive() {
            return !notifications_tpl && !!order_wizard_promocodenotifications_tpl;
        },
        render: function () {
            if (this.isActive()) {
                if (!this.was_rendered) {
                    this.was_rendered = true;
                    this._render();
                }
                var promocodes = _.filter(this.wizard.model.get('promocodes') || [], function (promocode) {
                    return promocode.notification === true;
                });
                if (promocodes.length) {
                    var message_collection_view = new BackboneCollectionView({
                        collection: promocodes,
                        viewsPerRow: 1,
                        childView: CartPromocodeNotificationsView,
                        childViewOptions: {
                            parentModel: this.wizard.model
                        }
                    });
                    message_collection_view.render();
                    jQuery('[data-type="Promocode.Notifications"]').html(message_collection_view.$el.html());
                }
            }
        },
        // @method removePromocodeNotification
        // @param String promocode_id
        // @return {Void}
        removePromocodeNotification: function (promocode_id) {
            var promocode = _.findWhere(this.wizard.model.get('promocodes'), {
                internalid: promocode_id
            });
            delete promocode.notification;
        },
        // @method getContext
        // @returns {OrderWizard.Module.PromocodeNotifications.Context}
        getContext: function getContext() {
            // @class OrderWizard.Module.PromocodeNotifications.Context
            return {};
            // @class OrderWizard.Module.PromocodeNotifications
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.PromocodeNotifications.js.map
