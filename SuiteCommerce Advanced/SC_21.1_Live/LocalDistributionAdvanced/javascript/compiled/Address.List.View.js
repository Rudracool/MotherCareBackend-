/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Address.List.View", ["require", "exports", "address_list.tpl", "backbone_collection_view_cell.tpl", "backbone_collection_view_row.tpl", "paymentinstrument_creditcard_edit.tpl", "Utils", "jQuery", "Configuration", "Profile.Model", "Backbone.View", "Backbone", "Backbone.CollectionView", "GlobalViews.Confirmation.View", "Address.Details.View", "Backbone.CompositeView"], function (require, exports, address_list_tpl, backbone_collection_view_cell_tpl, backbone_collection_view_row_tpl, paymentinstrument_creditcard_edit_tpl, Utils, jQuery, Configuration_1, Profile_Model_1, BackboneView, Backbone, BackboneCollectionView, GlobalViewsConfirmationView, Address_Details_View_1) {
    "use strict";
    // @class Address.List.View List profile's addresses @extend Backbone.View
    var AddressListView = BackboneView.extend({
        template: address_list_tpl,
        page_header: Utils.translate('Address Book'),
        title: Utils.translate('Address Book'),
        attributes: {
            id: 'AddressBook',
            class: 'AddressListView'
        },
        events: {
            'click [data-action="remove"]': 'removeAddress'
        },
        initialize: function () {
            this.profileModel = Profile_Model_1.ProfileModel.getInstance();
            this.collection = this.profileModel.get('addresses');
            this.collection.on('reset sync add remove change destroy', function () {
                if (this.collection.length) {
                    this.collection.sort();
                    this.render();
                }
                else {
                    Backbone.history.navigate('#addressbook/new', { trigger: true });
                }
            }, this);
        },
        destroy: function destroy() {
            this.collection.off(null, null, this);
            this._destroy();
        },
        beforeShowContent: function beforeShowContent() {
            var promise = jQuery.Deferred();
            if (this.profileModel.get('isLoggedIn') !== 'T') {
                promise.reject();
                this.application.getLayout().notFound();
            }
            else if (!this.collection.length) {
                promise.reject();
                Backbone.history.navigate('#addressbook/new', { trigger: true });
            }
            else {
                promise.resolve();
            }
            return promise;
        },
        // @method getAddressesToShow returns a copy of the addresses collection including the new address button available to show
        getAddressesToShow: function () {
            var addresses_to_show;
            if (this.collection && !!this.collection.length) {
                addresses_to_show = paymentinstrument_creditcard_edit_tpl
                    ? this.collection.getCollectionForRendering()
                    : this.collection;
            }
            return addresses_to_show ? addresses_to_show.models : [];
        },
        childViews: {
            'Addresses.Collection': function () {
                return new BackboneCollectionView({
                    childView: Address_Details_View_1.AddressDetailsView,
                    collection: this.getAddressesToShow(),
                    viewsPerRow: this.itemsPerRow ||
                        (Utils.isDesktopDevice() ? 3 : Utils.isTabletDevice() ? 2 : 1),
                    cellTemplate: backbone_collection_view_cell_tpl,
                    rowTemplate: backbone_collection_view_row_tpl,
                    childViewOptions: this.getAddressListOptions()
                });
            }
        },
        getAddressListOptions: function () {
            return {
                showSelect: false,
                selectMessage: this.selectMessage || '',
                hideDefaults: false,
                hideSelector: true
            };
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'addressbook';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: '/addressbook'
            };
        },
        // remove address
        removeAddress: function (e) {
            e.preventDefault();
            var deleteConfirmationView = new GlobalViewsConfirmationView({
                callBack: this.removeAddressModel,
                callBackParameters: {
                    context: this,
                    addressId: jQuery(e.target).data('id')
                },
                title: Utils.translate('Remove Address'),
                body: Utils.translate('Are you sure you want to delete this address?'),
                autohide: true
            });
            this.options.application.getLayout().showInModal(deleteConfirmationView);
        },
        removeAddressModel: function (options) {
            options.context.collection.get(options.addressId).destroy({ wait: true });
        },
        // @method getContext @return {Address.List.View.Context}
        getContext: function () {
            // @class Address.List.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Boolean} isAddressCollectionLengthGreaterThan0
                isAddressCollectionLengthGreaterThan0: this.collection.length > 0,
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD'
            };
        }
    });
    return AddressListView;
});

//# sourceMappingURL=Address.List.View.js.map
