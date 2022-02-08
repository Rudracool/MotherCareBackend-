/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PickupInStore.StoreSelector.List.Row.View", ["require", "exports", "pickup_in_store_store_selector_list_row.tpl", "jQuery", "Location.VenueDetails.View", "LiveOrder.Model", "Backbone.View", "js.cookie"], function (require, exports, pickup_in_store_store_selector_list_row_tpl, jQuery, LocationVenueDetailsView, LiveOrderModel, BackboneView, Cookies) {
    "use strict";
    var PickupInStoreStoreSelectorListRowView = BackboneView.extend({
        // @property {Function} template
        template: pickup_in_store_store_selector_list_row_tpl,
        //@property {Object} events
        events: {
            'click [data-store-id]': 'selectStore',
            'show.bs.dropdown': 'setFlyoutPosition'
        },
        // @method initialize
        initialize: function initialize(options) {
            this.model = options.model;
            this.product = options.product;
            this.application = options.application;
            this.source = options.source;
        },
        // @property {ChildViews} childViews
        childViews: {
            'PickupInStore.StoreLocationInfo': function () {
                var self = this;
                return new LocationVenueDetailsView({
                    model: self.model,
                    application: self.application,
                    showAddress: false
                });
            }
        },
        // @method selectStore Sets up the store according to the user's selection
        selectStore: function selectStore(e) {
            e.preventDefault();
            this.product.set('location', this.model);
            this.product.set('fulfillmentChoice', 'pickup');
            Cookies.set('myStore', this.model.get('internalid'), { expires: 365 });
            if (this.source && this.source === 'cart') {
                var self_1 = this;
                var cart_promise = LiveOrderModel.getInstance().updateLine(this.product);
                cart_promise.done(function () {
                    self_1.options.application.getLayout().closeModal();
                });
            }
        },
        // @method setFlyoutPosition Sets flyout position regarding if it should be shown up or down
        setFlyoutPosition: function setFlyoutPosition(e) {
            var element_link = jQuery(e.relatedTarget);
            var element_dropdown = element_link.siblings('[data-type="opening-hours-flyout"]');
            var element_parent_list = element_link.closest('[data-type="store-row"]');
            var bottom_distance = element_parent_list.offset().top +
                element_parent_list.height() -
                (element_link.offset().top + element_link.height());
            if (bottom_distance < element_dropdown.height()) {
                element_dropdown.addClass('pickup-in-store-store-selector-list-row-opening-hours-flyout-content-up');
            }
            else {
                element_dropdown.removeClass('pickup-in-store-store-selector-list-row-opening-hours-flyout-content-up');
            }
        },
        // @method getContext @return {PickupInStore.StoreSelector.List.Row.View.Context}
        getContext: function getContext() {
            var is_store_selected = parseInt(this.product.get('location').get('internalid'), 10) ===
                parseInt(this.model.get('internalid'), 10);
            return {
                //@property {Object} location
                location: this.model,
                //@property {Boolean} showStoreAddress
                showStoreAddress: !!this.model.get('address1'),
                //@property {Boolean} areSetCityAndAddress
                areSetCityAndAddress: !!this.model.get('address1') && !!this.model.get('city'),
                //@property {Boolean} showCity
                showCity: !!this.model.get('city'),
                //@property {Boolean} showStoresState
                showStoreState: !!this.model.get('state'),
                //@property {Boolean} showZipCode
                showZipCode: !!this.model.get('zip'),
                //@property {Boolean} showServiceHours
                showServiceHours: !!this.model.get('servicehours') &&
                    !!this.model.get('servicehours').length &&
                    !!this.model.get('servicehours')[0].starttime,
                //@property {Boolean} showPhone
                showPhone: !!this.model.get('phone'),
                //@property {Boolean} storeHasStock
                storeHasStock: this.model.get('qtyavailableforstorepickup') > 0,
                //@property {Boolean} isStoreSelected
                isStoreSelected: is_store_selected
            };
        }
    });
    return PickupInStoreStoreSelectorListRowView;
});

//# sourceMappingURL=PickupInStore.StoreSelector.List.Row.View.js.map
