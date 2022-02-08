/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocator.Details.View", ["require", "exports", "store_locator_details.tpl", "AjaxRequestsKiller", "Profile.Model", "StoreLocator.Map.View", "Location.VenueDetails.View", "StoreLocator.Model", "ReferenceMap", "Backbone.View"], function (require, exports, store_locator_details_tpl, AjaxRequestsKiller_1, Profile_Model_1, StoreLocatorMapView, LocationVenueDetailsView, StoreLocatorModel, ReferenceMap, BackboneView) {
    "use strict";
    var StoreLocatorDetailsView = BackboneView.extend({
        template: store_locator_details_tpl,
        // @property {Object} attributes
        attributes: {
            id: 'StoreLocatorDetails',
            class: 'StoreLocatorDetails'
        },
        // @method initialize
        // @params {Object} options
        initialize: function initialize(options) {
            this.reference_map = new ReferenceMap();
            this.model = new StoreLocatorModel();
            this.reference_map.model = this.model;
            this.routerArguments = options.routerArguments;
            this.application = options.application;
            this.profile_model = Profile_Model_1.ProfileModel.getInstance();
            // @property {String} title
            this.title = this.reference_map.configuration.title();
        },
        beforeShowContent: function beforeShowContent() {
            var id = this.routerArguments[0];
            return this.model.fetch({
                data: {
                    internalid: id
                },
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        },
        // @property {Object} childViews
        childViews: {
            LocatorMap: function () {
                return new StoreLocatorMapView({
                    application: this.application,
                    reference_map: this.reference_map,
                    model: this.model
                });
            },
            StoreLocationInfo: function () {
                return new LocationVenueDetailsView({
                    application: this.application,
                    model: this.model,
                    showAddress: true
                });
            }
        },
        // @method getContext @returns StoreLocator.Details.View.Context
        getContext: function getContext() {
            var last_navigation = this.profile_model.get('storeLocator_last_search');
            var direction_url = this.reference_map.getDirectionsUrl(last_navigation, this.model.get('location'));
            return {
                title: this.reference_map.configuration.title,
                directionUrl: direction_url,
                redirectUrl: last_navigation ? 'stores' : 'stores/all'
            };
        }
    });
    return StoreLocatorDetailsView;
});

//# sourceMappingURL=StoreLocator.Details.View.js.map
