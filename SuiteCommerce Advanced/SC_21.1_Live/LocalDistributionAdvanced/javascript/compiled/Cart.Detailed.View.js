/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Cart.Detailed.View", ["require", "exports", "underscore", "cart_detailed.tpl", "jQuery", "Configuration", "GlobalViews.Message.View", "Backbone.CollectionView", "Backbone.FormView", "Cart.Lines.View", "Cart.Lines.Free.View", "Cart.Promocode.Notifications.View", "Cart.Summary.View", "Cart.Item.Summary.View", "Cart.Item.Actions.View", "LiveOrder.Model", "Tracker", "Utils", "Backbone", "Backbone.View", "jQuery.scStickyButton"], function (require, exports, _, cart_detailed_tpl, jQuery, Configuration_1, GlobalViews_Message_View_1, BackboneCollectionView, BackboneFormView, CartLinesView, CartLinesFreeView, CartPromocodeNotifications, CartSummaryView, CartItemSummaryView, CartItemActionsView, LiveOrderModel, Tracker, Utils, Backbone, BackboneView) {
    "use strict";
    var colapsibles_states = {};
    return BackboneView.extend({
        // @property {Function} template
        template: cart_detailed_tpl,
        enhancedEcommercePage: true,
        // @property {String} title
        title: Utils.translate('Shopping Cart'),
        // @property {String} page_header
        page_header: Utils.translate('Shopping Cart'),
        // @property {Object} attributes
        attributes: {
            id: 'Cart.Detailed.View',
            'data-root-component-id': 'Cart.Detailed.View'
        },
        bindings: {
            '[name="zip"]': 'zip'
        },
        // @property {Object} events
        events: {
            'change [data-type="cart-item-quantity-input"]': 'updateItemQuantityEvent',
            'keypress [data-type="cart-item-quantity-input"]': 'updateItemQuantityEvent',
            'submit [data-action="update-quantity"]': 'updateItemQuantityFormSubmit',
            'click [data-action="remove-item"]': 'removeItem',
            'submit form[data-action="estimate-tax-ship"]': 'estimateTaxShip',
            'click [data-action="remove-shipping-address"]': 'removeShippingAddress',
            'click [data-touchpoint="checkout"]': 'trackEvent',
            'change [data-action="estimate-tax-ship-country"]': 'changeCountry'
        },
        // @method initialize
        // @param {Cart.Detailed.View.InitializeParameters} options
        // @return {Void}
        initialize: function (options) {
            this.application = options.application;
            this.showEstimated = false;
            this.model = LiveOrderModel.getInstance();
            this.options.model = this.model;
            this.standalone = options.application.isStandalone();
            BackboneFormView.add(this);
            this.model.on('change', this.render, this);
            this.model.get('lines').on('add remove', this.render, this);
            this.model.on('LINE_ROLLBACK', this.render, this);
            this.model.on('promocodeNotificationShown', this.removePromocodeNotification, this);
            this.on('afterCompositeViewRender', this.resetColapsiblesState, this);
            this.on('afterCompositeViewRender', this.initPlugins, this);
            this.urlOptions = Utils.parseUrlOptions((options.routerArguments && options.routerArguments[0]) || '');
        },
        beforeShowContent: function () {
            var self = this;
            return LiveOrderModel.loadCart().done(function () {
                Tracker.getInstance().trackPageviewForCart({
                    url: "/" + Backbone.history.fragment,
                    items: self.model.get("lines")
                });
            });
        },
        // @method getBreadcrumbPages
        // @return {BreadcrumbPage}
        getBreadcrumbPages: function () {
            return { href: '/cart', text: Utils.translate('Shopping Cart') };
        },
        // @method initPlugins
        // initialize plugins
        initPlugins: function initPlugins() {
            if (Configuration_1.Configuration.get('siteSettings.sitetype') === 'ADVANCED') {
                this.$('[data-action="sticky"]').scStickyButton();
            }
            Utils.initBxSlider(this.$('[data-type="carousel-items"]'), Configuration_1.Configuration.get('bxSliderDefaults'));
        },
        render: function render() {
            this.storeColapsiblesState();
            this._render();
            return this;
        },
        // @method hideError
        hideError: function hideError(selector) {
            var el = selector
                ? selector.find('[data-type=alert-placeholder]')
                : this.$('[data-type=alert-placeholder]');
            el.empty();
        },
        // @method showError
        showError: function showError(message, line, error_details) {
            var placeholder;
            this.hideError();
            if (line) {
                // if we detect its a rolled back item, (this i an item that was deleted
                // but the new options were not valid and was added back to it original state)
                // We will move all the references to the new line id
                if (error_details && error_details.status === 'LINE_ROLLBACK') {
                    var new_line_id = error_details.newLineId;
                    line.attr('id', new_line_id);
                    line.find('[name="internalid"]').attr({
                        id: "update-internalid-" + new_line_id,
                        value: new_line_id
                    });
                }
                placeholder = line.find('[data-type="alert-placeholder"]');
                this.hideError(line);
            }
            else {
                placeholder = this.$('[data-type="alert-placeholder"]');
                this.hideError();
            }
            // Finds or create the placeholder for the error message
            if (!placeholder.length) {
                placeholder = jQuery('<div/>', {
                    'data-type': 'alert-placeholder'
                });
                this.$el
                    .children()
                    .first()
                    .prepend(placeholder);
            }
            var global_view_message = new GlobalViews_Message_View_1.GlobalViewsMessageView({
                message: message,
                type: 'error',
                closable: true
            });
            // Renders the error message and into the placeholder
            placeholder.append(global_view_message.render().$el.html());
            // Re Enables all posible disableded buttons of the line or the entire view
            if (line) {
                line.find(':disabled').attr('disabled', false);
            }
            else {
                this.$(':disabled').attr('disabled', false);
            }
        },
        // @method validInputValue
        // Check if the input[type="number"] has empty string or NaN value
        // input.val() == '' && validInput == false: NaN
        // input.val() == '' && validInput == true: empty string
        validInputValue: function (input) {
            // html5 validation
            if ((input.validity && !input.validity.valid) || input.value === '') {
                return false;
            }
            // Fallback to browsers that don't yet support html5 input validation
            return !isNaN(input.value);
        },
        updateItemQuantityEvent: function (e) {
            if (e && e.type !== 'keypress') {
                e.preventDefault();
            }
            var $form = this.getItemForm(e);
            var options = $form.serializeObject();
            this.$el
                .find("#" + options.internalid + " a")
                .attr('disabled', 'disabled')
                .addClass('cart-item-link-disabled');
            this.debouncedUpdateItemQuantity(e);
        },
        getItemForm: function (e) {
            return jQuery(e.target).closest('form');
        },
        // @method updateItemQuantity
        // Finds the item in the cart model, updates its quantity and saves the cart model
        updateItemQuantity: function updateItemQuantity(e) {
            var self = this;
            var $form = this.getItemForm(e);
            var options = $form.serializeObject();
            var internalid = options.internalid;
            var line = this.model.get('lines').get(internalid);
            var $input = $form.find('[name="quantity"]');
            var validInput = this.validInputValue($input[0]);
            if (!line || this.isRemoving) {
                return;
            }
            if (!validInput || options.quantity) {
                var new_quantity = parseInt(options.quantity, 10);
                var item = line.get('item');
                var min_quantity = item
                    ? item.get('_minimumQuantity', true)
                    : line.get('minimumquantity');
                var max_quantity = item
                    ? item.get('_maximumQuantity', true)
                    : line.get('maximumquantity');
                var current_quantity_1 = parseInt(line.get('quantity'), 10);
                var new_valid_quantity = new_quantity >= min_quantity ? new_quantity : min_quantity;
                new_valid_quantity =
                    !!max_quantity && new_quantity > max_quantity
                        ? max_quantity
                        : new_quantity > min_quantity
                            ? new_quantity
                            : min_quantity;
                $input.val(new_valid_quantity);
                if (new_quantity !== current_quantity_1) {
                    $input.val(new_valid_quantity).prop('disabled', true);
                    line.set('quantity', new_valid_quantity);
                    var invalid = line.validate();
                    if (!invalid) {
                        var update_promise = this.model.updateLine(line, true);
                        this.disableElementsOnPromise(update_promise, "#" + internalid + " button");
                        update_promise
                            .fail(function (jqXhr) {
                            var result = JSON.parse(jqXhr.responseText);
                            var errorDetails = result.errorDetails;
                            if (errorDetails.newLineId) {
                                internalid = errorDetails.newLineId;
                                // we use the new line
                                line = self.model.get('lines').get(internalid);
                            }
                            // revert quantity to the last quantity
                            line.set('quantity', current_quantity_1);
                            self.render();
                        })
                            .always(function () {
                            $input.prop('disabled', false);
                        });
                    }
                    else {
                        var placeholder_1 = this.$("#" + internalid + " [data-type=\"alert-placeholder\"]");
                        placeholder_1.empty();
                        _.each(invalid, function (value) {
                            var global_view_message = new GlobalViews_Message_View_1.GlobalViewsMessageView({
                                message: value,
                                type: 'error',
                                closable: true
                            });
                            placeholder_1.append(global_view_message.render().$el.html());
                        });
                        $input.prop('disabled', false);
                        line.set('quantity', current_quantity_1);
                    }
                }
            }
        },
        debouncedUpdateItemQuantity: _.debounce(function (e) {
            this.updateItemQuantity(e);
        }, 1000),
        // @method updateItemQuantityFormSubmit
        updateItemQuantityFormSubmit: function updateItemQuantityFormSubmit(e) {
            e.preventDefault();
            this.updateItemQuantity(e);
        },
        // @method removeItem
        // handles the click event of the remove button
        // removes the item from the cart model and saves it.
        removeItem: function removeItem(e) {
            var self = this;
            var product = this.model.get('lines').get(this.$(e.target).data('internalid'));
            var remove_promise = this.model.removeLine(product);
            var internalid = product.get('internalid');
            this.isRemoving = true;
            this.disableElementsOnPromise(remove_promise, "article[id=\"" + internalid + "\"] a, article[id=\"" + internalid + "\"] button");
            remove_promise.always(function () {
                self.isRemoving = false;
            });
            return remove_promise;
        },
        // @method estimateTaxShip
        // Sets a fake address with country and zip code based on the options.
        estimateTaxShip: function estimateTaxShip(e) {
            e.preventDefault();
            var options = this.$(e.target).serializeObject();
            var self = this;
            var fake_address = {
                zip: options.zip,
                country: options.country,
                internalid: null
            };
            this.model
                .cancelableTrigger('before:LiveOrder.estimateShipping', fake_address)
                .then(function () {
                var address_internalid = fake_address.zip + "-" + fake_address.country + "-null";
                fake_address.internalid = address_internalid;
                self.model.get('addresses').push(fake_address);
                self.model.set('shipaddress', address_internalid);
                var promise = self.saveForm(e);
                if (promise) {
                    self.swapEstimationStatus();
                }
                promise.done(function (lines) {
                    self.model.cancelableTrigger('after:LiveOrder.estimateShipping', _.isUndefined(lines) ? false : lines);
                });
            });
        },
        // @method changeEstimationStatus
        swapEstimationStatus: function swapEstimationStatus() {
            this.showEstimated = !this.showEstimated;
        },
        // @method removeShippingAddress
        // sets a fake null address so it gets removed by the backend
        removeShippingAddress: function removeShippingAddress(e) {
            var self = this;
            var ship_address = self.model.get('addresses');
            self.model
                .cancelableTrigger('before:LiveOrder.clearEstimateShipping', ship_address)
                .then(function () {
                e.preventDefault();
                self.swapEstimationStatus();
                self.model.save({
                    shipmethod: null,
                    shipaddress: null
                });
                self.model.cancelableTrigger('after:LiveOrder.clearEstimateShipping', true);
            });
        },
        // @method changeCountry
        changeCountry: function changeCountry(e) {
            e.preventDefault();
            var options = this.$(e.target).serializeObject();
            var AddressModel = this.model.get('addresses').model;
            this.model
                .get('addresses')
                .add(new AddressModel({ country: options.country, internalid: options.country }));
            this.model.set({ shipaddress: options.country });
        },
        // @method resetColapsiblesState
        // @return {Void}
        resetColapsiblesState: function resetColapsiblesState() {
            var self = this;
            _.each(colapsibles_states, function (is_in, element_selector) {
                self.$(element_selector)[is_in ? 'addClass' : 'removeClass']('in')
                    .css('height', is_in ? 'auto' : '0');
            });
        },
        // @method storeColapsiblesState
        // @return {Void}
        storeColapsiblesState: function () {
            this.$('.collapse').each(function (index, element) {
                colapsibles_states[Utils.getFullPathForElement(element)] = jQuery(element).hasClass('in');
            });
        },
        // @method removePromocodeNotification
        // @param String promocode_id
        // @return {Void}
        removePromocodeNotification: function (promocode_id) {
            var promocode = _.findWhere(this.model.get('promocodes'), {
                internalid: promocode_id
            });
            delete promocode.notification;
        },
        trackEvent: function () {
            Tracker.getInstance().trackProceedToCheckout();
        },
        destroy: function () {
            colapsibles_states = {};
            this.model.off('change', this.render, this);
            this.model.get('lines').off('add remove', this.render, this);
            this.model.off('LINE_ROLLBACK', this.render, this);
            this.off('afterCompositeViewRender', this.resetColapsiblesState, this);
            this.off('afterCompositeViewRender', this.initPlugins, this);
            this._destroy();
        },
        // @property {ChildViews} childViews
        childViews: {
            'Cart.Summary': function () {
                return new CartSummaryView({
                    model: this.model,
                    showEstimated: this.showEstimated,
                    application: this.application
                });
            },
            'Item.ListNavigable': function () {
                var lines = _.filter(this.model.get('lines').models || [], function (line) {
                    return line.get('free_gift') !== true;
                });
                return new BackboneCollectionView({
                    collection: lines,
                    viewsPerRow: 1,
                    childView: CartLinesView,
                    childViewOptions: {
                        navigable: !this.standalone,
                        application: this.application,
                        SummaryView: CartItemSummaryView,
                        ActionsView: CartItemActionsView,
                        showAlert: false
                    }
                });
            },
            'Promocode.Notifications': function () {
                var promotions = _.filter(this.model.get('promocodes') || [], function (promocode) {
                    return promocode.notification === true;
                });
                if (promotions.length) {
                    return new BackboneCollectionView({
                        collection: promotions,
                        viewsPerRow: 1,
                        childView: CartPromocodeNotifications,
                        childViewOptions: {
                            parentModel: this.model
                        }
                    });
                }
            },
            'Item.FreeGift': function () {
                var free_gifts = _.filter(this.model.get('lines').models || [], function (line) {
                    return line.get('free_gift') === true;
                });
                if (free_gifts.length) {
                    return new BackboneCollectionView({
                        collection: free_gifts,
                        viewsPerRow: 1,
                        childView: CartLinesFreeView,
                        childViewOptions: {
                            navigable: true
                        }
                    });
                }
            },
            'FreeGift.Info': function () {
                var message;
                var free_gifts = _.filter(this.model.get('lines').models || [], function (line) {
                    return line.get('free_gift') === true;
                });
                if (free_gifts.length === 1) {
                    message = Utils.translate('The following item is free but it may generate shipping costs.');
                }
                else if (free_gifts.length > 1) {
                    message = Utils.translate('The following items are free but they may generate shipping costs.');
                }
                if (message) {
                    return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                        message: message,
                        type: 'info',
                        closable: false
                    });
                }
            }
        },
        // @method getExtraChildrenOptions Overridable method used to add params to url to open the accordion
        // @return {Cart.Detailed.View.ExtraChildrenOptions}
        getExtraChildrenOptions: function () {
            // @class Cart.Detailed.View.ExtraChildrenOptions
            return {
                // @property {String} urlOptions
                urlOptions: this.urlOptions
            };
            // @class Cart.Detailed.View
        },
        // @method getContext @return {Cart.Detailed.View.Context}
        getContext: function () {
            var lines = this.model.get('lines');
            var product_count = lines.length;
            var item_count = _.reduce(lines.models, function (memo, line) {
                return memo + line.get('quantity');
            }, 0);
            var product_and_items_count = '';
            if (product_count === 1) {
                if (item_count === 1) {
                    product_and_items_count = Utils.translate('1 Product, 1 Item');
                }
                else {
                    product_and_items_count = Utils.translate('1 Product, $(0) Items', item_count);
                }
            }
            else if (item_count === 1) {
                product_and_items_count = Utils.translate('$(0) Products, 1 Item', product_count);
            }
            else {
                product_and_items_count = Utils.translate('$(0) Products, $(1) Items', product_count, item_count);
            }
            // @class Cart.Detailed.View.Context
            return {
                // @property {LiveOrder.Model} model
                model: this.model,
                // @property {Boolean} showLines
                showLines: !!(lines && lines.length),
                // @property {Orderline.Collection} lines
                lines: lines,
                // @property {String} productsAndItemsCount
                productsAndItemsCount: product_and_items_count,
                // @property {Number} productCount
                productCount: product_count,
                // @property {Number} itemCount
                itemCount: item_count,
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {String} isStandalone
                isStandalone: this.standalone
            };
            // @class Cart.Detailed.View
        }
    });
});

//# sourceMappingURL=Cart.Detailed.View.js.map
