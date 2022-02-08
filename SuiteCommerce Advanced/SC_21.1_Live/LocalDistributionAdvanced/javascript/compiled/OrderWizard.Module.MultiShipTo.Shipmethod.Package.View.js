/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.MultiShipTo.Shipmethod.Package.View", ["require", "exports", "underscore", "order_wizard_msr_shipmethod_package.tpl", "Utils", "Backbone.CollectionView", "Address.Details.View", "Backbone.View", "Transaction.Line.Views.Cell.Navigable.View", "LiveOrder.Model"], function (require, exports, _, order_wizard_msr_shipmethod_package_tpl, Utils, BackboneCollectionView, Address_Details_View_1, BackboneView, Transaction_Line_Views_Cell_Navigable_View_1, LiveOrderModel) {
    "use strict";
    return BackboneView.extend({
        template: order_wizard_msr_shipmethod_package_tpl,
        childViews: {
            'Shipping.Address': function () {
                return new Address_Details_View_1.AddressDetailsView({
                    model: this.model.get('address'),
                    hideActions: true,
                    hideDefaults: true,
                    manage: 'shipaddress',
                    hideSelector: true
                });
            },
            'Items.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.model.get('lines'),
                    childView: Transaction_Line_Views_Cell_Navigable_View_1.TransactionLineViewsCellNavigableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: !this.options.hide_item_link,
                        detail1Title: Utils.translate('Qty:'),
                        detail1: 'quantity',
                        detail2Title: Utils.translate('Unit price'),
                        detail2: 'rate_formatted',
                        detail3Title: Utils.translate('Amount:'),
                        detail3: 'total_formatted'
                    }
                });
            }
        },
        getContext: function () {
            /* var packages = view.getPackages()
            ,	non_shippable_lines = view.wizard.model.getNonShippableLines()
            ,	general_collapse_elements =  view.getDefaultCollapseItem()
            ,	show_edit_address_url = !!view.options.show_edit_address_url
            ,	show_combo = view.options.show_combo
            ,	is_read_only = view.is_read_only
            ,	hide_accordion = view.options.hide_accordion
            ,	show_items = !view.options.hide_items
            ,	application = view.wizard.application;
    
            var items = package.lines
            ,	selected_address = package.address
            ,	delivery_methods = package.deliveryMethods
            ,	collapse_elements = _.isUndefined(package.collapse_elements) ? general_collapse_elements : package.collapse_elements;
            */
            var shipping_methods = this.model.get('deliveryMethods').map(function (shipmethod) {
                return {
                    name: shipmethod.get('name'),
                    rate_formatted: shipmethod.get('rate_formatted'),
                    internalid: shipmethod.get('internalid'),
                    isActive: shipmethod.get('check')
                };
            });
            var selected_shipmethod = _.findWhere(shipping_methods, { isActive: true });
            var lines = this.model.get('lines');
            var total_items = LiveOrderModel.countItems(lines);
            return {
                // @property {String} addressId
                addressId: this.model.get('address').get('internalid'),
                // @property {Boolean} showEditButton
                showEditAddressButton: !!this.options.show_edit_address_url,
                // @property {String} editUrl
                editUrl: this.options.edit_url,
                // @property {Boolean} showDeliveryMethods
                showDeliveryMethods: !!shipping_methods.length,
                // @property {Boolean} showCombo
                showCombo: this.options.show_combo,
                // @property {Array} shippingMethods
                shippingMethods: shipping_methods,
                // @property {Object} selectedShipmethod
                selectedShipmethod: selected_shipmethod,
                // @property {Boolean} showSelectedShipmethod
                showSelectedShipmethod: !!selected_shipmethod,
                // @property {Boolean} showActions
                showActions: !this.options.is_read_only,
                // @property {Boolean} showAccordion
                showAccordion: !this.options.hide_accordion,
                // @property {Boolean} showItems
                showItems: !this.options.hide_items,
                // @property {Boolean} showLines
                showLines: !!lines.length,
                // @property {Orderline.Collection} lines
                lines: lines,
                // @property {Number} totalItems
                totalItems: total_items,
                // @property {Boolean} linesLengthGreaterThan1
                totalItemsGreaterThan1: total_items > 1,
                // @property {Boolean} collapseElements
                collapseElements: _.isUndefined(this.model.get('collapse_elements'))
                    ? !!this.options.general_collapse_elements
                    : !!this.model.get('collapse_elements'),
                // @property {Boolean} showEditShipment
                showEditShipmentButton: !!this.options.edit_shipment_url,
                // @property {String} editShipmentUrl
                editShipmentUrl: this.options.edit_shipment_url
            };
        }
    });
});

//# sourceMappingURL=OrderWizard.Module.MultiShipTo.Shipmethod.Package.View.js.map
