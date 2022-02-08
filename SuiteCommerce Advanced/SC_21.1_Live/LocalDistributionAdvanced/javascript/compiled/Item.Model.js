/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Item.Model", ["require", "exports", "underscore", "Utils", "Configuration", "Profile.Model", "UrlHelper", "Backbone.CachedModel", "Session", "Item.Option.Collection"], function (require, exports, _, Utils, Configuration_1, Profile_Model_1, UrlHelper_1, BackboneCachedModel, Session, ItemOptionCollection) {
    "use strict";
    var ItemCollection = null;
    var forceAvoidRedirect;
    var originalFetch = BackboneCachedModel.prototype.fetch;
    var ItemModel = BackboneCachedModel.extend({
        moduleName: 'Item.Model',
        constructor: function (attributes) {
            this.sanitize(attributes);
            BackboneCachedModel.apply(this, arguments);
        },
        // @method url
        // @return {String}
        url: function url() {
            var profile = Profile_Model_1.ProfileModel.getInstance();
            var url = Utils.addParamsToUrl(profile.getSearchApiUrl(), _.extend({}, this.searchApiMasterOptions, Session.getSearchApiParams()), profile.isAvoidingDoubleRedirect(forceAvoidRedirect));
            return url;
        },
        // @method fetch overrides fetch so we make sure that options are set, so we wrap it
        fetch: function (options) {
            Utils.deepExtend(options || {}, this.options);
            if (options.cache === undefined) {
                options.cache = true;
            }
            forceAvoidRedirect = options && options.data && options.data.force_avoid_redirect;
            return originalFetch.apply(this, arguments);
        },
        // @method parse The API returns the items as an array always this takes care of returning the object
        // @return {Item.Model.Model.Attributes}
        parse: function parse(response) {
            // if we are performing a direct API call the item is response.items[0]
            // but if you are using the Item.Collection to fetch this guys
            // The item is the response
            var single_item = response.items && response.items[0];
            if (single_item) {
                single_item.facets = response.facets;
            }
            return single_item ? this.sanitize(single_item) : this.sanitize(response);
        },
        sanitize: function (attributes) {
            if (attributes &&
                attributes.onlinecustomerprice_detail &&
                attributes.onlinecustomerprice_detail.onlinecustomerprice === '') {
                attributes.onlinecustomerprice_detail.onlinecustomerprice = null;
            }
            return attributes;
        },
        // @method generateURL Returns the current URL. This method is just an alias over get('_url') to provide a unified interface with the Product.Model
        // @return {String}
        generateURL: function generateURL() {
            return this.get('_url');
        },
        // @method getFullLink Generates a String ready to be used to a link for a PDP. In difference to the method generateURL, getFullLink
        // returns a string that contains the value of href, data-hashtag and data-touchpoint.
        // output example: href="/Californium-Mtr" data-touchpoint="home" data-hashtag="#/Californium-Mtr"
        // @return {Object}
        getFullLink: function getFullLink() {
            var url = this.generateURL();
            var link_attributes = {
                href: url
            };
            if (SC.ENVIRONMENT.siteSettings.sitetype === 'ADVANCED') {
                _.extend(link_attributes, {
                    data: {
                        touchpoint: 'home',
                        hashtag: Configuration_1.Configuration.get('currentTouchpoint') !== 'home'
                            ? encodeURIComponent(url)
                            : url
                    }
                });
            }
            return Utils.objectToAtrributes(link_attributes);
        },
        // @method initialize
        // @return {Void}
        initialize: function initialize() {
            // Wires the config options to the URL of the model
            this.searchApiMasterOptions = Configuration_1.Configuration.get('searchApiMasterOptions.itemDetails', {});
            this.itemOptionsConfig = Configuration_1.Configuration.get('ItemOptions.optionsConfiguration', []);
            var self = this;
            this.set('options', this.getPosibleOptions(), { silent: true });
            this.on('change:itemoptions_detail', function () {
                self.set('options', self.getPosibleOptions(), { silent: true });
            }, this);
        },
        deepCopy: function deepCopy() {
            var self = this;
            var obj = this.attributes || {};
            var item_key_mapping = this.getKeyMapping(Configuration_1.Configuration);
            _.each(item_key_mapping, function (value, attr) {
                if (attr.charAt(0) === '_') {
                    attr = "keyMapping" + attr;
                }
                obj[attr] = _.isFunction(value) ? value(self) : value;
            });
            return obj;
        },
        // @method getPosibleOptions
        // @returns {Item.Options.Collection} an array of all the possible options with values and information
        getPosibleOptions: function getPosibleOptions() {
            if (this.cachedPosibleOptions) {
                return this.cachedPosibleOptions;
            }
            var result = new ItemOptionCollection();
            if (this.get('_optionsDetails') && this.get('_optionsDetails').fields) {
                var self_1 = this;
                // Prepares a simple map of the configuration
                var options_config_map_1 = {};
                _.each(this.itemOptionsConfig, function (option) {
                    if (option.cartOptionId) {
                        options_config_map_1[option.cartOptionId] = option;
                    }
                });
                // if you are an child in the cart it then checks for the options of the parent
                var fields = this.get('_matrixParent').get('_id')
                    ? this.get('_matrixParent').get('_optionsDetails').fields
                    : this.get('_optionsDetails').fields;
                // Walks the _optionsDetails to generate a standard options response.
                _.each(fields, function (option_details) {
                    // @class Item.Model.Option.Value
                    // @property {String} internalid
                    // @property {String} label
                    // @property {String} url The url of the option to navigate to the PDP with that option selected by default
                    // @class Item.Model.Option
                    var option = {
                        // @property {String} label Visible option name
                        label: option_details.label,
                        // @property {Array<Item.Model.Option.Value>} values
                        values: option_details.values,
                        // @property {String} type Type of the option. Possible values are: select, textarea, email, text
                        type: option_details.type,
                        // @property {String} cartOptionId Value used to set options in the Commerce API
                        cartOptionId: option_details.internalid,
                        // @property {String} itemOptionId Value returned from the Search API (API value 'sourcefrom')
                        itemOptionId: option_details.sourcefrom || '',
                        // @property {Boolean} isMatrixDimension
                        isMatrixDimension: !!option_details.ismatrixdimension || false,
                        // @property {Boolean} isMandatory Indicate if the options is required or not
                        isMandatory: !!option_details.ismandatory || false,
                        // @property {String} urlParameterName Parameter used to generate the url of this options. For example size instead or custcol12 in www.yourdomain.com/item?size=12&custcol12=3
                        urlParameterName: option_details.internalid,
                        // @property {Boolean} useLabelsOnUrl Indicate if this option should show the label's value when displayed in the URL
                        // or instead the internalid's value should be used (the second is the default)
                        useLabelsOnUrl: false,
                        // @property {Number} index Property used to sort options. 10 by default
                        index: 10
                    };
                    // Makes sure all options are availabe by defualt
                    _.each(option.values, function (value) {
                        value.isAvailable = true;
                    });
                    // Merges this with the configuration object
                    if (options_config_map_1[option.cartOptionId]) {
                        option = _.extend(option, options_config_map_1[option.cartOptionId]);
                    }
                    option.values = _.map(option.values, function (value) {
                        value.url = UrlHelper_1.UrlHelper.setUrlParameter(self_1.get('_url'), option.urlParameterName, option.useLabelsOnUrl ? value.label : value.internalid);
                        return value;
                    });
                    if (option_details.ismatrixdimension && self_1.get('_matrixChilds').length) {
                        var item_values_1 = self_1.get('_matrixChilds').pluck(option.itemOptionId);
                        option.values = _.filter(option.values, function (value) {
                            if (value.internalid) {
                                return _.contains(item_values_1, value.label);
                            }
                            return true;
                        });
                    }
                    result.add(option);
                });
                // Since this is not going to change in the life of the model we can cache it
                this.cachedPosibleOptions = result;
            }
            return result;
        },
        // @method isProperlyConfigured Check in case the item has options all options have a itemOptionId property and in the item is matrix
        // check there are child matrix items
        // @returns {Boolean} true If the current item is properly configured
        isProperlyConfigured: function isProperlyConfigured() {
            var options = this.getPosibleOptions();
            var option = null;
            if (options && options.length) {
                for (var i = 0; i < options.length; i++) {
                    option = options.at(i);
                    if (option.get('isMatrixDimension') && !option.get('itemOptionId')) {
                        return false;
                    }
                }
            }
            // If you omit item options from the field set and use matrix, that's an issue.
            else if (this.get('_matrixChilds') && this.get('_matrixChilds').length) {
                return false;
            }
            return true;
        },
        // @method getKeyMapping
        // @return {ItemsKeyMapping}
        getKeyMapping: function getKeyMapping() {
            if (!this._keyMapping) {
                // This should be migrated, don't use SC.Application because of type checking.
                // Application should be received as parameter
                this._keyMapping = SC.Application.getKeyMapping();
            }
            return this._keyMapping;
        },
        // @method get We have override the get function for this model in order to honor the ItemKeyMapping
        // It also makes sure that _matrixChilds and _relatedItems are Item.Collection and _matrixParent is an Item.Model
        // @param {String} attr
        // @param {Boolean} dont_cache if true it won't return the cached attribute value.
        get: function get(attr, dont_cache) {
            var keyMapping = this.getKeyMapping();
            // var keyMapping = this.keyMapping || (this.collection && this.collection.keyMapping); // TODO: Dev Tools migration concern...
            if (dont_cache || (keyMapping && !this.attributes[attr] && keyMapping[attr])) {
                var mapped_key = keyMapping[attr];
                if (_.isFunction(mapped_key)) {
                    this.attributes[attr] = mapped_key(this);
                }
                else if (_.isArray(mapped_key)) {
                    // then the value is get(arr[0]) || get(arr[1]) || ...
                    for (var i = 0; i < mapped_key.length; i++) {
                        if (this.attributes[mapped_key[i]]) {
                            this.attributes[attr] = this.attributes[mapped_key[i]];
                            break;
                        }
                    }
                }
                else {
                    this.attributes[attr] = this.attributes[mapped_key];
                }
                if (attr === '_matrixChilds' || attr === '_relatedItems') {
                    ItemCollection = ItemCollection || Utils.requireModules('Item.Collection');
                    if (!(this.attributes[attr] instanceof ItemCollection)) {
                        this.attributes[attr] = new ItemCollection(this.attributes[attr] || []);
                    }
                }
                else if (attr === '_matrixParent') {
                    if (!(this.attributes[attr] instanceof ItemModel)) {
                        this.attributes[attr] = new ItemModel(this.attributes[attr] || {});
                    }
                }
            }
            return this.attributes[attr];
        },
        // SCIS specific, added as workaround
        getSelectedMatrixChilds: function (selection) {
            selection = selection || this.getMatrixOptionsSelection();
            var selection_key = JSON.stringify(selection);
            // Creates the Cache container
            if (!this.matrixSelectionCache) {
                this.matrixSelectionCache = {};
            }
            if (!this.get('_matrixChilds')) {
                return [];
            }
            // Caches the entry for the item
            if (!this.matrixSelectionCache[selection_key]) {
                this.matrixSelectionCache[selection_key] = _.values(selection).length
                    ? this.get('_matrixChilds').where(selection)
                    : this.get('_matrixChilds').models;
            }
            return this.matrixSelectionCache[selection_key];
        },
        // SCIS specific, added as workaround
        getMatrixOptionsSelection: function () {
            var matrix_options = _.where(this.getPosibleOptions(), { isMatrixDimension: true });
            var result = {};
            var self = this;
            _.each(matrix_options, function (matrix_option) {
                var value = self.getOption(matrix_option.cartOptionId);
                if (value && value.label) {
                    result[matrix_option.itemOptionId] = value.label;
                }
            });
            return result;
        },
        // SCIS specific, added as workaround
        getQueryStringWithQuantity: function (quantity, exclude_matrix_options) {
            var self = this;
            var result = "?quantity=" + (quantity || 1);
            var matrixParent = this.get('_matrixParent');
            // If this item is a child of a matrix use the options of the parent
            if (!_.isEmpty(matrixParent) && matrixParent.get('internalid')) {
                var childItem_1 = matrixParent.get('_matrixChilds').get(self.id);
                if (childItem_1) {
                    _.each(matrixParent.getPosibleOptions(), function (option) {
                        if (exclude_matrix_options && option.isMatrixDimension) {
                            return;
                        }
                        var value = childItem_1.get(option.itemOptionId || option.cartOptionId);
                        if (!value) {
                            var selectedOption = self.getOption(option.itemOptionId || option.cartOptionId);
                            value = selectedOption && selectedOption.internalid;
                        }
                        result += "&" + option.url + "=" + encodeURIComponent(value);
                    });
                }
            }
            else {
                var options = this.getPosibleOptions();
                if (options && options.length) {
                    for (var i = 0; i < options.length; i++) {
                        var option = options.at(i);
                        if (exclude_matrix_options && option.get('isMatrixDimension')) {
                            return;
                        }
                        var value = self.getOption(option.get('cartOptionId'));
                        if (value) {
                            result += "&" + option.url + "=" + encodeURIComponent(value.internalid);
                        }
                    }
                }
            }
            return result;
        },
        // SCIS specific, added as workaround
        getQueryString: function () {
            return this.getQueryStringWithQuantity(this.get('quantity'));
        },
        // @method  getDefaultPrice Given the price details of an item (class OnlineCustomerPriceDetail) returns the default onlinecustomerprice_formatted and onlinecustomerprice
        // @param {OnlineCustomerPriceDetail} details_object
        // @return {ItemPrice}
        getDefaultPrice: function getDefaultPrice(details_object) {
            // @class ItemPrice
            return {
                // @property {Number} price
                price: _.isNumber(details_object.onlinecustomerprice)
                    ? details_object.onlinecustomerprice
                    : this.get('onlinecustomerprice'),
                // @property {String} price_formatted
                price_formatted: _.isNumber(details_object.onlinecustomerprice)
                    ? details_object.onlinecustomerprice_formatted
                    : Utils.formatCurrency(this.get('onlinecustomerprice'))
            };
            // @class Item.Model
        },
        // IMPORTANT: The following method are shared with Product.Model, allowing to use Products or Items interchangeably
        // If you edit them, please consider reflect the same changes in the Product.Model and potentially in the
        // Transaction.Line.Model
        // @method getPrice Gets the price based on the selection of the item and the quantity
        // @param {Number} quantity
        // @param {Array<Item.Model>?} selected_matrix_children
        // @return {ItemPrice}
        getPrice: function getPrice(quantity, selected_matrix_children) {
            selected_matrix_children =
                selected_matrix_children ||
                    (this.get('_matrixChilds') ? this.get('_matrixChilds').models : []);
            quantity = quantity || 1;
            var details_object = this.get('_priceDetails') || {};
            var result = this.getDefaultPrice(details_object);
            // Computes Quantity pricing based on the quantity specified as parameter
            if (details_object.priceschedule && details_object.priceschedule.length) {
                var price_schedule = void 0;
                var min = void 0;
                var max = void 0;
                for (var i = 0; i < details_object.priceschedule.length; i++) {
                    price_schedule = details_object.priceschedule[i];
                    min = parseInt(price_schedule.minimumquantity, 10);
                    max = parseInt(price_schedule.maximumquantity, 10);
                    if ((min <= quantity && quantity < max) || (min <= quantity && !max)) {
                        result = {
                            price: price_schedule.price,
                            price_formatted: price_schedule.price_formatted
                        };
                    }
                }
            }
            // if it's a matrix it will compute the matrix price
            if (selected_matrix_children.length) {
                // Gets the price of each child
                var children_prices_1 = [];
                _.each(selected_matrix_children, function (child) {
                    children_prices_1.push(child.getPrice(quantity));
                });
                if (children_prices_1.length === 1) {
                    // If there is only one it means there is only one price to show
                    result = children_prices_1[0];
                }
                else {
                    // otherwise we should compute max and min to show a range in the GUI
                    var children_prices_values = _.pluck(children_prices_1, 'price');
                    var min_value = _.min(children_prices_values); // Minimum price from all children items
                    var max_value = _.max(children_prices_values); // Maximum price from all children items
                    if (min_value !== max_value) {
                        // We return them alongside the result of the parent
                        // @class ItemPrice
                        // @property {Number?} min This value will be present only in the case the current item is Matrix, has a partial selection and its children have different range
                        // of prices. When this property is present will contain the minimum price of all the children items valid to be selected.
                        result.min = _.where(children_prices_1, { price: min_value })[0];
                        // @property {Number?} max This value will be present only in the case the current item is Matrix, has a partial selection and its children have different range
                        // of prices. When this property is present will contain the maximum price of all the children items valid to be selected.
                        result.max = _.where(children_prices_1, { price: max_value })[0];
                        // @class Item.Model
                    }
                    else {
                        // they are all alike so we can show any of them
                        result = children_prices_1[0];
                    }
                }
            }
            // Adds the compare against price if its not set by one of the children
            if (!result.compare_price && this.get('_comparePriceAgainst')) {
                // @class ItemPrice
                // @property {Number} compare_price
                result.compare_price = this.get('_comparePriceAgainst');
                // @property {String} compare_price_formatted
                result.compare_price_formatted = this.get('_comparePriceAgainstFormated');
                // @class Item.Model
            }
            return result;
        },
        // @method getThumbnail Gets the thumbnail. This method acts as an alias for get('_thumbnail') which allows to use
        // Item.Model in places where Product.Model or Transaction.Line.Model is expected
        // @return {ImageContainer}
        getThumbnail: function getThumbnail() {
            return this.get('_thumbnail');
        },
        // @method getSku Returns the sky of the current item. This method exist to complain with the Product.Model interface
        // @return {String}
        getSku: function getSku() {
            return this.get('_sku');
        },
        // @method getImages Returns the first image should be displayed
        // @return ImageContainer
        getFirstImage: function (flattenedImages) {
            for (var i = 0; i < flattenedImages.length; i++) {
                var detail = flattenedImages[i];
                var splitted = detail.url.split('.');
                if (splitted[splitted.length - 2] === 'default') {
                    return detail;
                }
            }
            return flattenedImages[0];
        },
        // @method getImages Returns the list of the item images
        // @return {Array<ImageContainer>}
        getImages: function getImages(filter) {
            var result = [];
            var item_images_detail = this.get('itemimages_detail') || {};
            item_images_detail = item_images_detail.media || item_images_detail;
            if (filter) {
                var image_filters = Configuration_1.Configuration.get('productline.multiImageOption', []);
                item_images_detail = filter.filterImages(item_images_detail, image_filters);
            }
            result = Utils.imageFlatten(item_images_detail);
            if (result.length > 1) {
                var firstImage_1 = this.getFirstImage(result);
                result = _.filter(result, function (image) {
                    return firstImage_1 != image;
                });
                result.unshift(firstImage_1);
            }
            // @class ImageContainer
            return result.length
                ? result
                : [
                    {
                        // @property {String} url
                        url: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/no_image_available.jpeg', Configuration_1.Configuration.get('imageNotAvailable')),
                        // @property {String} altimagetext
                        altimagetext: this.get('_name')
                    }
                ];
            // @class Item.Model
        },
        // @method getOption
        // Returns an item option
        // @param {String} cart_option_id
        // @return {Item.Option.Model}
        getOption: function getOption(cart_option_id) {
            return this.get('options').findWhere({ cartOptionId: cart_option_id });
        },
        // @method getStockInfo
        // Returns an standard formated object for the stock info taking in consideration current matrix option selection.
        // the login is the following: if there is an unique child selected use that. Else use the parent as default
        // values and open children properties if it has the same value for all selected children.
        // @param {Array<Item.Model>} selected_matrix_children
        // @param {OptionHelper.MatrixSelection} options_selection
        // @return {Item.StockInfo} the stock information of the current item
        getStockInfo: function getStockInfo(selected_matrix_children, options_selection) {
            options_selection = options_selection || {};
            // Standardize the result object
            selected_matrix_children = selected_matrix_children || [];
            // if we have one selected child we use that - else we use the parent as default
            var model = selected_matrix_children.length === 1 ? selected_matrix_children[0] : this;
            var parent = this.get('_matrixParent');
            // @class Item.StockInfo
            var stock_info = {
                // @property {Object}stock
                stock: model.get('_stock'),
                // @property {Boolean} isInStock
                isInStock: model.get('_isInStock'),
                // @property {String} outOfStockMessage
                outOfStockMessage: model.get('_outOfStockMessage') ||
                    this.get('_outOfStockMessage') ||
                    (parent && parent.get('_outOfStockMessage')) ||
                    Utils.translate('Out of Stock'),
                // @property {Boolean} showOutOfStockMessage
                showOutOfStockMessage: model.get('_showOutOfStockMessage') || this.get('_showOutOfStockMessage'),
                // @property {String} inStockMessage
                inStockMessage: model.get('_inStockMessage'),
                // @property {Boolean} showInStockMessage
                showInStockMessage: model.get('_showInStockMessage'),
                // @property {String} stockDescription
                stockDescription: model.get('_stockDescription') || this.get('_stockDescription'),
                // @property {Boolean} showStockDescription
                showStockDescription: model.get('_showStockDescription'),
                // @property {String} stockDescriptionClass
                stockDescriptionClass: model.get('_stockDescriptionClass'),
                // @property {Boolean} isNotAvailableInStore Indicate if the item is present in the store (returned by the store item and the search API)
                isNotAvailableInStore: _.isUndefined(model.get('_isPurchasable')) || model.get('isdisplayable') === false,
                // @property {Boolean} isPurchasable
                isPurchasable: !!model.get('_isPurchasable'),
                // @property {Object} stockPerLocation
                stockPerLocation: model.get('_quantityavailableforstorepickup_detail'),
                // @propery {Boolean} isAvailableForPickUp
                isAvailableForPickup: !!model.get('_isstorepickupallowed'),
                // @propery {Boolean} showQuantityAvailable
                showQuantityAvailable: !!model.get('_showQuantityAvailable')
            };
            // @class Item.Model
            var is_something_selected = _(options_selection).keys().length;
            // if this is an open selection we compute them all
            if (is_something_selected && selected_matrix_children.length > 1) {
                var matrix_children_stock_info_1 = [];
                _.each(selected_matrix_children, function (child) {
                    matrix_children_stock_info_1.push(child.getStockInfo());
                });
                // If all matrix children return the same value for a given attribute that becomes the output,
                // with the exception of stock that is an addition of the stocks of the children - but only if the parent has
                _.each(stock_info, function (value, key) {
                    var children_values_for_attribute = _.pluck(matrix_children_stock_info_1, key);
                    if (key === 'stock') {
                        stock_info.stock = _.reduce(children_values_for_attribute, function (memo, num) {
                            return memo + num;
                        }, 0);
                        if (isNaN(stock_info.stock)) {
                            delete stock_info.stock;
                        }
                    }
                    else if (key === 'isInStock') {
                        // the parent is in stock if any of the child items is in stock
                        // so, if in the array of the values of 'isInStock' for the childs
                        // there is a 'true', then the parent item is in stock
                        stock_info.isInStock = _.contains(children_values_for_attribute, true);
                    }
                    else {
                        children_values_for_attribute = _.uniq(children_values_for_attribute);
                        if (children_values_for_attribute.length === 1) {
                            stock_info[key] = children_values_for_attribute[0];
                        }
                    }
                });
            }
            return stock_info;
        },
        // @method getBetterPrice
        // Returns a standard formated object for the price taking in consideration de Base Price and the OnlineCustomerPrice.
        getBetterPrice: function getBetterPrice(quantity) {
            var _this = this;
            var priceLevelEnabled = SC &&
                SC.CONFIGURATION &&
                SC.CONFIGURATION.priceLevel &&
                SC.CONFIGURATION.priceLevel.enabled;
            var defaultPriceLevel = SC &&
                SC.CONFIGURATION &&
                SC.CONFIGURATION.priceLevel &&
                SC.CONFIGURATION.priceLevel.default;
            // We're checking this, besides whether is enabled, because price could not be configured or PCV Item Purchasability functionality (prices are removed from api result)
            if (!priceLevelEnabled || !this.get("" + defaultPriceLevel))
                return null;
            var priceObject = this.getPrice(quantity);
            var hasPriceSchedule = this.get('onlinecustomerprice_detail') &&
                this.get('onlinecustomerprice_detail').priceschedule &&
                this.get('onlinecustomerprice_detail').priceschedule.length;
            var defaultItemPrice = this.get("" + defaultPriceLevel);
            var defaultItemPrice_formatted = this.get(defaultPriceLevel + "_formatted");
            var priceByQuantity;
            var priceByQuantity_formatted;
            if (hasPriceSchedule) {
                var priceSchedule_1 = this.get('onlinecustomerprice_detail').priceschedule;
                _.forEach(priceSchedule_1, function (tier, index) {
                    if (!tier.maximumquantity)
                        tier.maximumquantity = _this.get('quantityavailable');
                    tier.index = index;
                });
                var itemMaximumQuantity_1 = this.get('maximumquantity');
                var tiersAmount_1 = (priceSchedule_1 && priceSchedule_1.length) || 0;
                var currentTier = _.filter(priceSchedule_1, function (tier, index) {
                    if (!tier.maximumquantity && quantity) {
                        return priceSchedule_1[priceSchedule_1.length - 1];
                    }
                    if (tier.maximumquantity === quantity &&
                        tier.maximumquantity === itemMaximumQuantity_1 &&
                        index === tiersAmount_1 - 1) {
                        return true;
                    }
                    return tier.minimumquantity <= quantity && tier.maximumquantity > quantity;
                });
                if (currentTier.length) {
                    var firstCurrentTierIndex = currentTier[0].index;
                    var currentRange = priceSchedule_1[firstCurrentTierIndex];
                    priceByQuantity = currentRange.price;
                    priceByQuantity_formatted = currentRange.price_formatted;
                    var previousIndex = firstCurrentTierIndex - 1;
                    var previousRange = priceSchedule_1[previousIndex];
                    defaultItemPrice = previousIndex >= 0 ? previousRange.price : defaultItemPrice;
                    defaultItemPrice_formatted =
                        previousIndex >= 0 ? previousRange.price_formatted : defaultItemPrice_formatted;
                }
                else {
                    priceByQuantity = priceSchedule_1[0].price;
                    priceByQuantity_formatted = priceSchedule_1[0].price_formatted;
                }
            }
            else {
                priceByQuantity =
                    this.get('onlinecustomerprice_detail') &&
                        this.get('onlinecustomerprice_detail').onlinecustomerprice;
                priceByQuantity_formatted =
                    this.get('onlinecustomerprice_detail') &&
                        this.get('onlinecustomerprice_detail').onlinecustomerprice_formatted;
            }
            var betterPrice = priceByQuantity < defaultItemPrice && {
                defaultItemPrice: defaultItemPrice_formatted,
                betterItemPrice: priceByQuantity_formatted
            };
            return betterPrice || null;
        }
    });
    return ItemModel;
});

//# sourceMappingURL=Item.Model.js.map
