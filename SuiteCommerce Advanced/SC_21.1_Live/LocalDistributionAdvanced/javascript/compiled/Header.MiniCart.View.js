/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Header.MiniCart.View", ["require", "exports", "header_mini_cart.tpl", "Utils", "Configuration", "Profile.Model", "LiveOrder.Model", "Header.MiniCartSummary.View", "Header.MiniCartItemCell.View", "Tracker", "Backbone.CollectionView", "Backbone.View", "Backbone"], function (require, exports, header_mini_cart_tpl, Utils, Configuration_1, Profile_Model_1, LiveOrderModel, HeaderMiniCartSummaryView, HeaderMiniCartItemCellView, Tracker, BackboneCollectionView, BackboneView, Backbone) {
    "use strict";
    return BackboneView.extend({
        template: header_mini_cart_tpl,
        // @property {Object} attributes List of HTML attributes applied by Backbone into the $el
        attributes: {
            id: 'Header.MiniCart.View',
            'data-root-component-id': 'Header.MiniCart.View'
        },
        events: {
            'click [data-touchpoint="checkout"]': 'trackEvent'
        },
        initialize: function initialize() {
            var self = this;
            this.isLoading = true;
            this.itemsInCart = 0;
            this.model = LiveOrderModel.getInstance();
            LiveOrderModel.loadCart().done(function () {
                self.isLoading = false;
                self.render();
            });
            this.model.on('change', this.render, this);
            this.model.get('lines').on('add remove', this.render, this);
        },
        trackEvent: function () {
            Tracker.getInstance().trackProceedToCheckout();
        },
        render: function render() {
            this.itemsInCart = this.model.getTotalItemCount();
            BackboneView.prototype.render.apply(this, arguments);
            // on tablet or desktop make the minicart dropdown
            if (Utils.isTabletDevice() ||
                Utils.isDesktopDevice() ||
                SC.CONFIGURATION.addToCartBehavior === 'showMiniCart') {
                this.$('[data-type="mini-cart"]').attr('data-toggle', 'dropdown');
            }
        },
        destroy: function destroy() {
            this._destroy();
            this.model.off('change', this.render, this);
            this.model.get('lines').off('add remove', this.render, this);
        },
        childViews: {
            'Header.MiniCartSummary': function () {
                return new HeaderMiniCartSummaryView();
            },
            'Header.MiniCartItemCell': function () {
                return new BackboneCollectionView({
                    collection: !this.isLoading ? this.model.get('lines') : new Backbone.Collection(),
                    childView: HeaderMiniCartItemCellView,
                    viewsPerRow: 1
                });
            }
        },
        // @method getContext
        // @return {Header.MiniCart.View.Context}
        getContext: function () {
            var summary = this.model.get('summary');
            // @class Header.MiniCart.View.Context
            return {
                // @property {LiveOrder.Model} model
                model: this.model,
                // @property {Number} itemsInCart
                itemsInCart: this.itemsInCart,
                // @property {Boolean} showPluraLabel
                showPluraLabel: this.itemsInCart !== 1,
                // @property {Boolean} showLines
                showLines: this.itemsInCart > 0,
                // @property {Boolean} isLoading
                isLoading: this.isLoading,
                // @property {String} subtotalFormatted
                subtotalFormatted: !this.isLoading ? summary && summary.subtotal_formatted : '',
                // @property {String} cartTouchPoint
                cartTouchPoint: Configuration_1.Configuration.get('modulesConfig.Cart.startRouter', false)
                    ? Configuration_1.Configuration.get('currentTouchpoint')
                    : 'viewcart',
                // @property {Boolean} isPriceEnabled
                isPriceEnabled: !Profile_Model_1.ProfileModel.getInstance().hidePrices()
            };
            // @class Header.MiniCart.View
        }
    });
});

//# sourceMappingURL=Header.MiniCart.View.js.map
