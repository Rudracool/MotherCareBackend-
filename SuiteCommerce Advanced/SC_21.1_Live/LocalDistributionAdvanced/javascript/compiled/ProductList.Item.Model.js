/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductList.Item.Model", ["require", "exports", "underscore", "Utils", "Product.Model", "Item.Model", "Backbone"], function (require, exports, _, Utils, ProductModel, Item, Backbone) {
    "use strict";
    function validateLength(value, name) {
        var max_length = 300;
        if (value && value.length > max_length) {
            return Utils.translate('$(0) must be at most $(1) characters', name, max_length);
        }
    }
    // @class ProductList.Item.Model @extends Product.Model
    var ProductListItemModel = ProductModel.extend({
        urlRoot: Utils.getAbsoluteUrl('services/ProductList.Item.Service.ss'),
        defaults: {
            priority: { id: '2', name: 'medium' },
            options: ''
        },
        // Name is required
        validation: _.extend({}, ProductModel.prototype.validation, {
            name: {
                required: true,
                msg: Utils.translate('Name is required')
            },
            description: { fn: validateLength }
        }),
        className: 'ProductList.Item.Model',
        // redefine url to avoid possible cache problems from browser
        url: function () {
            var base_url = Backbone.Model.prototype.url.apply(this, arguments);
            var product_list = this.get('productList');
            var url_params = {
                t: new Date().getTime()
            };
            if (product_list && product_list.owner) {
                url_params.user = product_list.owner;
            }
            return Utils.addParamsToUrl(base_url, url_params);
        },
        // @method initialize Overrides default method because in vinson optional item options with undefined value
        // were not accepted and now they are.
        // @constructor
        initialize: function (attributes) {
            // This workaround is made to maintain the compatility with product lists saving the child item in the record
            if (attributes && attributes.item && attributes.item.matrix_parent) {
                attributes.item = _.extend(attributes.item, attributes.item.matrix_parent);
                delete attributes.item.matrix_parent;
            }
            var item_aux = new Item(attributes.item);
            var item_options = item_aux.get('options');
            item_options.each(function (item_option, i) {
                var option = _.findWhere(attributes.options, {
                    cartOptionId: item_option.get('cartOptionId')
                });
                if (!option) {
                    attributes.options.push(item_option.toJSON());
                }
                else if (_.isObject(option.value) && _.isEmpty(option.value)) {
                    attributes.options[i] = item_option.toJSON();
                }
            });
            ProductModel.prototype.initialize.apply(this, arguments);
        },
        // @method getOptionsArray Returns options as an array. This is the way ItemDetailModel expects when initialized. @return {Array<Object>}
        getOptionsArray: function () {
            // Iterate on the stored Product List Item options and create an id/value object compatible with the existing options renderer...
            var option_values = [];
            var selected_options = this.get('options');
            _.each(selected_options, function (value, key) {
                option_values.push({
                    id: key,
                    value: value.value,
                    displayvalue: value.displayvalue
                });
            });
            return option_values;
        },
        // @method fulfillsMinimumQuantityRequirement Returns true if a product can be purchased due to minimum quantity requirements. @returns {Boolean}
        fulfillsMinimumQuantityRequirement: function () {
            return this.get('item').get('_minimumQuantity') <= this.get('quantity');
        },
        fulfillsMaximumQuantityRequirement: function () {
            return this.get('item').get('_maximumQuantity')
                ? this.get('item').get('_maximumQuantity') >= this.get('quantity')
                : true;
        },
        // @method getItemForCart Gets the ProductModel for the cart options_details should be passed together with options values,
        // otherwise they will not be validated and not set!!!
        // @return {internalid:String,quantity:Number,options:Object,options:Object}
        getItemForCart: function (id, qty, options_details, options) {
            return new ProductModel({
                internalid: id,
                quantity: qty,
                _optionsDetails: options_details,
                options: options
            });
        },
        // @method getMatrixItem Gets the subitem which properties has the values passed as parameters
        // @return matrix subitem model
        getMatrixItem: function (optionsSelected, optionsAvailable) {
            var objSearch = {};
            _.each(_.keys(optionsSelected), function (option) {
                var optionName = _.findWhere(optionsAvailable, { cartOptionId: option })
                    .itemOptionId;
                objSearch[optionName] = optionsSelected[option].label;
            });
            return _.findWhere(this.item.matrixchilditems_detail, objSearch);
        },
        // @method isMatrixChild
        // @return true if this item is matrix
        isMatrixChild: function () {
            return !!(this.item && this.item.matrix_parent && this.item.itemoptions_detail);
        },
        clone: function clone() {
            return new ProductListItemModel(this.toJSON());
        },
        toJSON: function toJSON() {
            var result = ProductModel.prototype.toJSON.apply(this, arguments);
            var self = this;
            result.description = this.get('description');
            result.productList = this.get('productList');
            result.priority = this.get('priority');
            result.created = this.get('created');
            result.createddate = this.get('createddate');
            result.lastmodified = this.get('lastmodified');
            result.item.internalid = this.getItem().get('internalid');
            _.each(result.options, function (option) {
                var opt = self.get('options').findWhere({ cartOptionId: option.cartOptionId });
                option.values = opt && opt.get('values');
            });
            return result;
        },
        getItemId: function () {
            // We override this method from the Product.Model so when generating the JSON representation of this model
            // we always return the parent item id
            return this.get('item').get('internalid');
        }
    }, {
        // @method createFromProduct
        // @param {Product.Model} product
        // @return {ProductList.Item.Model}
        createFromProduct: function (product) {
            var attributes = product.toJSON();
            delete attributes.internalid;
            _.each(attributes.options, function (option) {
                option.values = product
                    .get('options')
                    .findWhere({ cartOptionId: option.cartOptionId })
                    .get('values');
            });
            attributes.item = product.get('item').toJSON();
            return new ProductListItemModel(attributes);
        },
        // @method createFromProduct
        // @param {Product.Model} product
        // @return {ProductList.Item.Model}
        createFromTransactionLine: function (transaction_line) {
            var attributes = transaction_line.toJSON();
            delete attributes.internalid;
            _.each(attributes.options, function (option) {
                option.values = transaction_line
                    .get('options')
                    .findWhere({ cartOptionId: option.cartOptionId })
                    .get('values');
            });
            return new ProductListItemModel(attributes);
        }
    });
    return ProductListItemModel;
});

//# sourceMappingURL=ProductList.Item.Model.js.map
