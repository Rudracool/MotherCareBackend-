/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Address.Edit.View", ["require", "exports", "underscore", "address_edit.tpl", "Loggers", "Utils", "jQuery", "Configuration", "Profile.Model", "Address.Model", "Backbone.View", "Backbone", "Address.Edit.Fields.View", "Backbone.FormView"], function (require, exports, _, address_edit_tpl, Loggers_1, Utils, jQuery, Configuration_1, Profile_Model_1, Address_Model_1, BackboneView, Backbone, AddressEditFieldView, BackboneFormView) {
    "use strict";
    // @class Address.Edit.View @extend Backbone.View
    var AddressEditView = BackboneView.extend({
        template: address_edit_tpl,
        attributes: {
            id: 'AddressEdit',
            class: 'AddressListView'
        },
        events: {
            'submit form': 'saveForm'
        },
        bindings: {
            '[name="fullname"]': 'fullname',
            '[name="company"]': 'company',
            '[name="addr1"]': 'addr1',
            '[name="city"]': 'city',
            '[name="country"]': 'country',
            '[name="zip"]': 'zip',
            '[name="phone"]': 'phone'
        },
        initialize: function (options) {
            this.profileModel = Profile_Model_1.ProfileModel.getInstance();
            this.collection = options.collection || this.profileModel.get('addresses');
            this.manage = options.manage;
            this.application = options.application;
            var id = (options.routerArguments &&
                options.routerArguments.length &&
                options.routerArguments[0]) ||
                '';
            if (id && id !== 'new') {
                this.model = this.collection.get(id);
                this.model.on('reset destroy change add', function () {
                    if (this.inModal && this.$containerModal) {
                        this.$containerModal
                            .removeClass('fade')
                            .modal('hide')
                            .data('bs.modal', null);
                        this.destroy();
                    }
                    else {
                        Backbone.history.navigate('#addressbook', { trigger: true });
                    }
                }, this);
            }
            else if (options.model) {
                this.model = options.model;
            }
            else {
                this.model = new Address_Model_1.AddressModel();
                this.model.on('change', function (model) {
                    this.collection.add(model);
                    if (this.inModal && this.$containerModal) {
                        this.$containerModal
                            .removeClass('fade')
                            .modal('hide')
                            .data('bs.modal', null);
                        this.destroy();
                    }
                    else {
                        Backbone.history.navigate('#addressbook', { trigger: true });
                    }
                }, this);
            }
            var addNewAddresLabel = Utils.translate('Add New Address');
            var editAddressLabel = Utils.translate('Edit Address');
            this.title = this.model.isNew() ? addNewAddresLabel : editAddressLabel;
            this.page_header = this.title;
            this.countries = Configuration_1.Configuration.get('siteSettings.countries');
            this.selectedCountry =
                this.model.get('country') || Configuration_1.Configuration.get('siteSettings.defaultshipcountry');
            if (!this.selectedCountry && _.size(this.countries) === 1) {
                this.selectedCountry = _.first(_.keys(this.countries));
            }
            if (this.selectedCountry) {
                this.model.set({ country: this.selectedCountry }, { silent: true });
            }
            BackboneFormView.add(this);
            this.saveForm = function saveForm() {
                var _this = this;
                var loggers = Loggers_1.Loggers.getLogger();
                var actionId = loggers.start('Save Address');
                var promise = BackboneFormView.saveForm.apply(this, arguments);
                if (promise) {
                    promise.done(function () {
                        loggers.end(actionId, {
                            operationIds: _this.model.getOperationIds(),
                            status: 'success'
                        });
                    });
                }
                return promise;
            };
        },
        destroy: function destroy() {
            this.model.off(null, null, this);
            this._destroy();
        },
        beforeShowContent: function beforeShowContent() {
            var promise = jQuery.Deferred();
            if (this.profileModel.get('isLoggedIn') !== 'T') {
                promise.reject();
                this.application.getLayout().notFound();
            }
            else {
                promise.resolve();
            }
            return promise;
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'addressbook';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return [
                {
                    text: Utils.translate('Address Book'),
                    href: '/addressbook'
                },
                {
                    text: this.title,
                    href: '/addressbook/new'
                }
            ];
        },
        render: function () {
            BackboneView.prototype.render.apply(this, arguments);
            this.$('[rel="tooltip"]')
                .tooltip({
                placement: 'right'
            })
                .on('hide', function (e) {
                e.preventDefault();
                jQuery(e.target)
                    .next('.tooltip')
                    .hide();
            });
        },
        childViews: {
            'Address.Edit.Fields': function () {
                return new AddressEditFieldView({
                    model: this.model,
                    countries: this.countries,
                    selectedCountry: this.selectedCountry,
                    hideDefaults: Configuration_1.Configuration.get('currentTouchpoint') !== 'customercenter',
                    application: this.options.application,
                    manage: this.manage
                });
            }
        },
        // @method getContext @return Address.Edit.View.Context
        getContext: function () {
            // @class Address.Edit.View.Context
            return {
                // @property {Address.Model} model
                model: this.model,
                // @property {Boolean} isAddressNew
                isAddressNew: this.model.isNew(),
                // @property {Boolean} isCollectionEmpty
                isCollectionEmpty: !this.collection.length,
                // @property {Boolean} isInModal
                isInModal: this.inModal,
                // @property {Boolean} isInModalOrHideHeader
                isInModalOrHideHeader: this.inModal || !!this.options.hideHeader,
                // @property {Boolean} showFooter
                showFooter: !this.options.hideFooter,
                // @property {Boolean} isInModalOrCollectionNotEmpty
                isInModalOrCollectionNotEmpty: !!(this.inModal || this.collection.length)
            };
        }
    });
    return AddressEditView;
});

//# sourceMappingURL=Address.Edit.View.js.map
