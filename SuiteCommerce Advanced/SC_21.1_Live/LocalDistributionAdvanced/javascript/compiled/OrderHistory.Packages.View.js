/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderHistory.Packages.View", ["require", "exports", "underscore", "order_history_packages.tpl", "Utils", "Configuration", "Profile.Model", "Transaction.Line.Views.Cell.Actionable.View", "Transaction.Line.Views.QuantityAmount.View", "OrderHistory.Item.Actions.View", "Address.Details.View", "OrderHistory.List.Tracking.Number.View", "Location.VenueDetails.View", "Backbone", "Backbone.CollectionView", "Backbone.View"], function (require, exports, _, order_history_packages_tpl, Utils, Configuration_1, Profile_Model_1, TransactionLineViewsCellActionableView, TransactionLineViewsQuantityAmountView, OrderHistoryItemActionsView, Address_Details_View_1, OrderHistoryListTrackingNumberView, LocationVenueDetailsView, Backbone, BackboneCollectionView, BackboneView) {
    "use strict";
    // @class OrderHistory.Packages.View @extend Backbone.View
    var OrderHistoryPackagesView = BackboneView.extend({
        // @property {Function} template
        template: order_history_packages_tpl,
        // @method initialize
        initialize: function () {
            this.isInStore = false;
            if (this.model.get('packageGroup') === 'instore') {
                this.location = this.model.get('location');
                this.profile_model = Profile_Model_1.ProfileModel.getInstance();
                try {
                    var ReferenceMap = Utils.requireModules('ReferenceMap');
                    this.reference_map = new ReferenceMap();
                }
                catch (e) {
                    e;
                }
                this.isInStore = true;
                this.location.on('change', this.render, this);
            }
            else {
                this.address = this.model.get('shipaddress');
            }
        },
        // @property {Object} childViews
        childViews: {
            'Address.StoreLocationInfo': function () {
                return new LocationVenueDetailsView({
                    model: this.location,
                    application: this.options.application,
                    showAddress: true,
                    hideCutoffTime: true
                });
            },
            'Shipping.Address.View': function () {
                if (!this.isInStore) {
                    return new Address_Details_View_1.AddressDetailsView({
                        model: this.address,
                        hideDefaults: true,
                        hideActions: true,
                        hideSelector: true
                    });
                }
            },
            TrackingNumbers: function () {
                return new OrderHistoryListTrackingNumberView({
                    model: new Backbone.Model({ trackingNumbers: this.model.get('trackingnumbers') }),
                    showTrackPackagesLabel: true
                });
            },
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.model.get('lines'),
                    childView: TransactionLineViewsCellActionableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: !this.options.application.isStandalone(),
                        application: this.options.application,
                        SummaryView: TransactionLineViewsQuantityAmountView,
                        ActionsView: OrderHistoryItemActionsView,
                        showTaxDetails: Configuration_1.Configuration.get('showTaxDetailsPerLine'),
                        showAlert: !_.isUndefined(this.options.showAlert)
                            ? !!this.options.showAlert
                            : true,
                        ignorePriceVisibility: !!this.options.ignorePriceVisibility
                    }
                });
            }
        },
        // @method getContext @return OrderHistory.Packages.View.Context
        getContext: function () {
            var directions_url = '';
            if (this.reference_map &&
                this.location &&
                !this.location.isNew() &&
                this.location.get('location')) {
                directions_url = this.reference_map.getDirectionsUrl(this.profile_model.get('storeLocator_last_search'), this.location.get('location'));
            }
            // @class OrderHistory.Packages.View.Context
            return {
                isStandalone: this.options.application.isStandalone(),
                // @property {Model} model
                model: this.model,
                // @property {Boolean} showOrderAddress
                showOrderAddress: !!(this.address && this.address.get('fullname')),
                // @property {String} orderAddress
                orderAddress: this.address ? this.address.get('fullname') : '',
                // @property {Boolean} showDeliveryMethod
                showDeliveryMethod: !!(this.model.get('shipmethod') && this.model.get('shipmethod').get('name')),
                // @property {String} deliveryMethodName
                deliveryMethodName: this.model.get('shipmethod')
                    ? this.model.get('shipmethod').get('name')
                    : '',
                // @property {Boolean} showDeliverySatatus
                showDeliveryStatus: !this.isInStore &&
                    !!(this.model.get('status') && this.model.get('status').internalid) &&
                    !this.model.get('date'),
                // @property {Boolean} showPackageStatus
                showPackageStatus: !!(this.model.get('status') && this.model.get('status').name) &&
                    !this.model.get('date'),
                // @property {String} packageStatus
                packageStatus: this.model.get('status') && this.model.get('status').name,
                // @property {Boolean} showDate
                showDate: !!this.model.get('date'),
                // @property {Boolean} showTrackingNumbers
                showTrackingNumbers: !!this.model.get('trackingnumbers'),
                // @property {Boolean} isPackageInStore
                isPackageInStore: this.isInStore,
                // @property {String} date
                date: this.model.get('date') ? this.model.get('date') : '',
                // @property {Number} linesItemsAmount
                linesItemsAmount: !!this.model.get('lines') &&
                    _.reduce(this.model.get('lines'), function (count, line) {
                        return count + line.get('quantity');
                    }, 0),
                // @property {Boolean} showOrderLocation
                showOrderLocation: !!this.location && !!this.location.get('name'),
                // @property {StoreLocator.Model} orderLocation
                orderLocation: this.location,
                // @property {String} getDirectionsUrl
                getDirectionsUrl: directions_url,
                // @property {String} showGetDirectionButton
                showGetDirectionButton: !!directions_url,
                // @property {String} initiallyCollapsed
                initiallyCollapsed: Utils.isPhoneDevice() ? '' : 'in',
                // @property {String} initiallyCollapsedArrow
                initiallyCollapsedArrow: Utils.isPhoneDevice() ? 'collapsed' : '',
                // @property {String} targetId
                targetId: this.model.get('internalid')
            };
        }
    });
    return OrderHistoryPackagesView;
});

//# sourceMappingURL=OrderHistory.Packages.View.js.map
