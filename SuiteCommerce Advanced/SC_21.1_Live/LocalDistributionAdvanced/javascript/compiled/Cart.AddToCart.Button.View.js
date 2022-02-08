/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Cart.AddToCart.Button.View", ["require", "exports", "underscore", "cart_add_to_cart_button.tpl", "Utils", "Loggers", "InstrumentationAddToCart", "LiveOrder.Model", "LiveOrder.Line.Model", "Cart.Confirmation.Helpers", "Backbone.View"], function (require, exports, _, cart_add_to_cart_button_tpl, Utils, Loggers_1, InstrumentationAddToCart, LiveOrderModel, LiveOrderLineModel, CartConfirmationHelpers, BackboneView) {
    "use strict";
    return BackboneView.extend({
        // @property {Function} template
        template: cart_add_to_cart_button_tpl,
        events: {
            'mouseup [data-type="add-to-cart"]': 'addToCart',
            'click [data-type="add-to-cart"]': 'addToCart'
        },
        // @method initialize
        // @param {ProductDeatils.AddToCart.ViewCart.AddToCart.Button.View.Initialize.Options} options
        // @return {Void}
        initialize: function initialize() {
            BackboneView.prototype.initialize.apply(this, arguments);
            this.cart = LiveOrderModel.getInstance();
            this.model.on('change', this.render, this);
        },
        // @method destroy Override default method to detach from change event of the current model
        // @return {Void}
        destroy: function destroy() {
            BackboneView.prototype.destroy.apply(this, arguments);
            this.model.off('change', this.render, this);
        },
        // @method getAddToCartValidators Returns the extra validation to add a product into the cart
        // @return {BackboneValidationObject}
        getAddToCartValidators: function getAddToCartValidators() {
            var self = this;
            return {
                quantity: {
                    fn: function () {
                        var line_on_cart = self.cart.findLine(self.model);
                        var quantity = self.model.get('quantity');
                        var minimum_quantity = self.model.getItem().get('_minimumQuantity') || 1;
                        var maximum_quantity = self.model.getItem().get('_maximumQuantity');
                        if (!_.isNumber(quantity) || _.isNaN(quantity) || quantity < 1) {
                            return Utils.translate('Invalid quantity value');
                        }
                        if (!line_on_cart && quantity < minimum_quantity) {
                            return Utils.translate('Please add $(0) or more of this item', minimum_quantity);
                        }
                        if (maximum_quantity) {
                            maximum_quantity = !line_on_cart
                                ? maximum_quantity
                                : maximum_quantity - line_on_cart.get('quantity');
                            if (quantity > maximum_quantity) {
                                return Utils.translate('Please add $(0) or less of this item', maximum_quantity);
                            }
                        }
                    }
                }
            };
        },
        // @method submitHandler Public method that fulfill
        // the require interface of the Main action View of the PDP
        // @param {jQuery.Event} e
        // @return {Boolean}
        submitHandler: function submitHandler(e) {
            return this.addToCart(e);
        },
        // @method addToCart Updates the Cart to include the current model
        // also takes care of updating the cart if the current model is already in the cart
        // @param {jQuery.Event} e
        // @return {Boolean}
        addToCart: function addToCart(e) {
            var _this = this;
            try {
                setTimeout(function () {
                    for (var i = 0; i < document.getElementsByClassName("bx-pager-link").length; i++) {
                        var activeImgOptionURL = document.getElementsByClassName("bx-pager-link")[i].children[0].currentSrc.split("?")[0];
                        var mainImg = document.getElementsByClassName("product-details-image-gallery-container")[i + 1].innerHTML;
                        var mainImgSplit = mainImg.split(" ");
                        var mainImgSplitURL = mainImgSplit[1].split("?");
                        if (mainImgSplitURL[0] != ("src=\"" + activeImgOptionURL)) {
                            mainImgSplitURL[0] = "src=" + activeImgOptionURL;
                            mainImgSplit[1] = mainImgSplitURL.join("?");
                            var newImgSrc = mainImgSplit.join(" ");
                            document.getElementsByClassName("product-details-image-gallery-container")[i + 1].innerHTML = newImgSrc;
                        }
                    }
                }, 3000);
            }
            catch (e) {
                console.warn('The Zoom bug fix is throwing an error (Cart.AddToCart.Button.View): ' + JSON.stringify(e));
            }
            e.preventDefault();
            var self = this;
            var cart_promise;
            if (!this.model.areAttributesValid(['options', 'quantity'], self.getAddToCartValidators())) {
                return;
            }
            if (!this.model.isNew() && this.model.get('source') === 'cart') {
                cart_promise = this.cart.updateProduct(this.model);
                cart_promise.done(function () {
                    self.options.application.getLayout().closeModal();
                });
            }
            else {
                var line_1 = LiveOrderLineModel.createFromProduct(this.model);
                var itemTrack_1 = InstrumentationAddToCart.itemToTrack(line_1);
                var loggers_1 = Loggers_1.Loggers.getLogger();
                var actionId_1 = loggers_1.start('Add to Cart');
                cart_promise = this.cart.addLine(line_1);
                cart_promise.then(function () {
                    var addToCartOperationIds = InstrumentationAddToCart.getAddToCartOperationId(_this.cart.get('lines').models, line_1);
                    loggers_1.end(actionId_1, {
                        operationIds: addToCartOperationIds,
                        status: 'success',
                        itemId: itemTrack_1.itemId,
                        itemQuantity: itemTrack_1.itemQuantity
                    });
                });
                CartConfirmationHelpers.showCartConfirmation(cart_promise, line_1, self.options.application);
            }
            cart_promise.fail(function (jqXhr) {
                var error_details = null;
                try {
                    if (jqXhr && jqXhr.responseText) {
                        var response = JSON.parse(jqXhr.responseText);
                        error_details = response.errorDetails;
                    }
                }
                catch (error) {
                    console.error(error);
                }
                finally {
                    if (error_details && error_details.status === 'LINE_ROLLBACK') {
                        self.model.set('internalid', error_details.newLineId);
                    }
                }
            });
            this.disableElementsOnPromise(cart_promise, e.target);
            return false;
        },
        // @method getContext
        // @return {Cart.AddToCart.Button.View.Context}
        getContext: function getContext() {
            // @class Cart.AddToCart.Button.View.Context
            return {
                // @property {Boolean} isCurrentItemPurchasable
                // Indicate if the current item is valid to be purchase or not
                isCurrentItemPurchasable: this.model.getItem().get('_isPurchasable'),
                // @property {Boolean} isUpdate
                isUpdate: !this.model.isNew() && this.model.get('source') === 'cart'
            };
            // @class Cart.AddToCart.Button.View
        }
    });
});
// @class Cart.AddToCart.Button.View.Initialize.Options
// @property {Product.Model} model This view is only capable of adding new PRODUCTs into the cart.
// If you need to add something else please convert it into a Product.Model.
//

//# sourceMappingURL=Cart.AddToCart.Button.View.js.map
