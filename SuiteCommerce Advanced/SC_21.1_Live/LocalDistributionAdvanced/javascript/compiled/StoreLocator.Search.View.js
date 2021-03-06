/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("StoreLocator.Search.View", ["require", "exports", "underscore", "store_locator_search.tpl", "Utils", "jQuery", "Configuration", "AjaxRequestsKiller", "Backbone", "Backbone.View", "Backbone.FormView"], function (require, exports, _, store_locator_search_tpl, Utils, jQuery, Configuration_1, AjaxRequestsKiller_1, Backbone, BackboneView, BackboneFormView) {
    "use strict";
    var StoreLocatorSearchView = BackboneView.extend({
        template: store_locator_search_tpl,
        events: {
            'click [data-action="use-geolocation"]': 'useGeolocation',
            'submit form': 'saveFormCustom',
            'keypress [name="city"]': 'saveFormCustom'
        },
        // @method saveFormCustom Saves the form but preventing collision with google maps by using a timeout
        // @param {jQuery.Event} e jQuery event
        saveFormCustom: function saveFormCustom(e) {
            if ((e.type === 'keypress' && e.keyCode === 13) || e.type === 'submit') {
                e.preventDefault();
                e.stopPropagation();
                var self_1 = this;
                var args_1 = arguments;
                setTimeout(function () {
                    self_1.saveForm.apply(self_1, args_1);
                }, 500);
            }
        },
        // @method initialize
        // @param {Object} options
        initialize: function initialize(options) {
            this.model = new Backbone.Model();
            var view = this;
            this.model.validation = {
                city: {
                    fn: function (value) {
                        var position = view.reference_map.getPosition();
                        if (!value) {
                            return Utils.translate('Please select an address.');
                        }
                        if (value && !position) {
                            return Utils.translate('Address not found.');
                        }
                        if (position.address !== value) {
                            return Utils.translate('Please select a valid address.');
                        }
                    }
                }
            };
            this.model.sync = _.bind(this.findStores, this);
            BackboneFormView.add(this, {
                noCloneModel: true
            });
            this.application = options.application;
            this.reference_map = options.reference_map;
            this.collection = options.collection;
            this.profileModel = options.profileModel;
            var self = this;
            var position_promise = jQuery.Deferred();
            var store_locator_last_search = this.profileModel.get('storeLocator_last_search');
            var position = this.reference_map.getPosition();
            if (!position.refineSearch) {
                if (store_locator_last_search) {
                    this.reference_map.setPosition({
                        latitude: store_locator_last_search.latitude,
                        longitude: store_locator_last_search.longitude,
                        address: store_locator_last_search.address
                    });
                    position_promise.resolve();
                }
                else if (this.options.useGeolocation) {
                    this.getCurrentPositionGeolocation().done(function () {
                        position_promise.resolve();
                    });
                }
            }
            position_promise.done(function () {
                self.findStores();
            });
            this.collection.on('sync, reset', this.render, this);
            this.reference_map.on('change:position', function () {
                self.setInputValue();
            });
        },
        // @method render
        render: function render() {
            if (!this.options.alwaysVisible && this.collection.length) {
                this.$el.empty();
                return this;
            }
            this._render();
            var self = this;
            this.$input = this.$('[data-type="autocomplete-input"]');
            this.reference_map.load().done(function () {
                self.reference_map.showAutoCompleteInput(self.$input.get(0));
                self.setInputValue();
            });
            return this;
        },
        // @method setInputValue
        // @return {void}
        setInputValue: function setInputValue() {
            var position = this.reference_map.getPosition();
            if (position) {
                this.$input && this.$input.val(position.address);
            }
        },
        getCurrentPositionGeolocation: function getCurrentPositionGeolocation() {
            var promise = jQuery.Deferred();
            var self = this;
            this.reference_map
                .getCurrentPositionGeolocation()
                .done(function () {
                self.reference_map.load().done(function () {
                    self.reference_map.getCityGeoCode().done(function () {
                        promise.resolveWith(self, self.reference_map.getPosition());
                    });
                });
            })
                .fail(function (error) {
                promise.rejectWith(self, arguments);
                self.blockPosition(error);
            });
            return promise;
        },
        // @method useGeolocation
        useGeolocation: function useGeolocation() {
            this.reference_map.clearPointList();
            var self = this;
            this.$('[data-action="message-warning"]').hide();
            this.getCurrentPositionGeolocation().done(function () {
                self.findStores();
            });
        },
        // @method blockPosition
        // @param {PositionError} error
        blockPosition: function blockPosition(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    this.$('[data-action="message-warning"]')
                        .html(Utils.translate('To use this functionality enable geolocation.'))
                        .show();
                    break;
                case error.POSITION_UNAVAILABLE:
                    this.$('[data-action="message-warning"]')
                        .html(Utils.translate('Location information is unavailable.'))
                        .show();
                    break;
                case error.TIMEOUT:
                    this.$('[data-action="message-warning"]')
                        .html(Utils.translate('The request to get user location timed out.'))
                        .show();
                    break;
                case error.UNKNOWN_ERROR:
                    this.$('[data-action="message-warning"]')
                        .html(Utils.translate('An unknown error occurred.'))
                        .show();
                    break;
            }
        },
        // @method findStores Find stores according to location
        // @param {String} method The http method used
        // @param {model} The model used in the form
        // @param {jQuery.Deferred} callbacks
        findStores: function findStores(method, model, callbacks) {
            this.collection.reset();
            var position = this.reference_map.getPosition();
            if (position && position.address) {
                this.profileModel.set('storeLocator_last_search', position);
                return this.collection.update({
                    latitude: position.latitude,
                    longitude: position.longitude,
                    radius: this.reference_map.configuration.getRadius(),
                    sort: 'distance',
                    page: 'all',
                    killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId(),
                    reset: true,
                    locationtype: Configuration_1.Configuration.get('storeLocator.defaultTypeLocations')
                }, callbacks);
            }
        },
        // @method getContext
        // @return StoreLocator.Location.View.Context
        getContext: function getContext() {
            return {
                showUseCurrentLocationButton: this.options.useGeolocation,
                showResults: !!this.collection.length
            };
        }
    });
    return StoreLocatorSearchView;
});

//# sourceMappingURL=StoreLocator.Search.View.js.map
