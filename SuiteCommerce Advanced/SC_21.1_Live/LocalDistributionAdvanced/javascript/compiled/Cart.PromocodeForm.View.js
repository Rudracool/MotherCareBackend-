/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Cart.PromocodeForm.View", ["require", "exports", "underscore", "cart_promocode_form.tpl", "Utils", "jQuery", "GlobalViews.Message.View", "Backbone.View"], function (require, exports, _, cart_promocode_form_tpl, Utils, jQuery, GlobalViews_Message_View_1, BackboneView) {
    "use strict";
    return BackboneView.extend({
        // @property {Function} template
        template: cart_promocode_form_tpl,
        events: {
            'submit form[data-action="apply-promocode"]': 'applyPromocode'
        },
        // @method initialize Override default method to define internal
        // state and make this View composite
        // @param {Cart.PromocodeForm.View.Initialization.options} options
        // @return {Void}
        initialize: function (options) {
            this.promocode = options.promocode || {};
            this.state = {
                errorMessage: null,
                code: '',
                isSaving: false
            };
            this.applying_promocode = _.bind(this.applying_promocode, this);
            this.apply_promocode_succeeded = _.bind(this.apply_promocode_succeeded, this);
            this.apply_promocode_finished = _.bind(this.apply_promocode_finished, this);
            this.apply_promocode_failed = _.bind(this.apply_promocode_failed, this);
            this.model.cancelableOn('before:LiveOrder.addPromotion', this.applying_promocode);
            this.model.cancelableOn('after:LiveOrder.addPromotion', this.apply_promocode_succeeded);
            this.model.on('apply_promocode_finished', this.apply_promocode_finished);
            this.model.on('apply_promocode_failed', this.apply_promocode_failed);
        },
        destroy: function () {
            this.model.cancelableOff('before:LiveOrder.addPromotion', this.applying_promocode);
            this.model.cancelableOff('after:LiveOrder.addPromotion', this.apply_promocode_succeeded);
            this.model.off('apply_promocode_finished', this.apply_promocode_finished);
            this.model.off('apply_promocode_failed', this.apply_promocode_failed);
            this._destroy();
        },
        applying_promocode: function applying_promocode() {
            // @event {Void} applying_promocode
            this.trigger('applying_promocode');
        },
        apply_promocode_succeeded: function apply_promocode_succeeded() {
            // @event {Void} apply_promocode_succeeded
            this.trigger('apply_promocode_succeeded');
        },
        apply_promocode_finished: function apply_promocode_finished() {
            // @event {Void} apply_promocode_finished
            this.trigger('apply_promocode_finished');
        },
        apply_promocode_failed: function apply_promocode_failed() {
            // @event {Void} apply_promocode_failed
            this.trigger('apply_promocode_failed');
        },
        // @method applyPromocode Adds a new promocode into the current model (LiveOrder.Model)
        // @param {DOMEvent} e
        // @return {Void}
        applyPromocode: function applyPromocode(e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var $target = this.$(e.target);
            var options = $target.serializeObject();
            if (!options.promocode) {
                this.state.errorMessage = Utils.translate('Promo Code is required');
                this.render();
            }
            else {
                this.state.errorMessage = null;
                this.state.isSaving = true;
                this.model
                    .addPromotion(options.promocode)
                    .then(function savePromocodeSuccessed() {
                    jQuery('#order-wizard-promocode').collapse('hide');
                })
                    .fail(function savePromocodeFailed(jqXhr) {
                    var layout = self.options.application.getLayout();
                    self.state.errorMessage = layout.parseErrorMessage(jqXhr);
                })
                    .always(function savePromocodeEnded() {
                    self.state.isSaving = false;
                    self.state.code = '';
                    self.render();
                });
            }
        },
        childViews: {
            GlobalsViewErrorMessage: function () {
                var placeholder = jQuery('[data-type="promocode-error-placeholder"]');
                var global_view_message = new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: this.state.errorMessage,
                    type: 'error',
                    closable: true
                });
                placeholder.html(global_view_message.render().$el.html());
            }
        },
        // @method getContext
        // @return {Cart.PromocodeForm.View.Context}
        getContext: function getContext() {
            // @class Cart.PromocodeForm.View.Context
            return {
                // @property {Boolean} showErrorMessage
                showErrorMessage: !!this.state.errorMessage,
                // @property {String} errorMessage
                errorMessage: this.state.errorMessage,
                // @property {String} promocodeCode
                promocodeCode: this.state.code,
                // @property {Boolean} isSaving
                isSaving: this.state.isSaving
            };
            // @class Cart.PromocodeForm.View
        }
    });
});
// @class Cart.PromocodeForm.View.Initialization.options
// @property {LiveOrder.Model} model
// @property {ApplicationSkeleton} application

//# sourceMappingURL=Cart.PromocodeForm.View.js.map
