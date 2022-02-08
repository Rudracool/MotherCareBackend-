/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Cart.Confirmation.Helpers", ["require", "exports", "underscore", "Utils", "jQuery", "Configuration", "LiveOrder.Model", "Cart.Confirmation.View", "Backbone"], function (require, exports, _, Utils, jQuery, Configuration_1, LiveOrderModel, CartConfirmationView, Backbone) {
    "use strict";
    return {
        // Cart.showCartConfirmation()
        // This reads the configuration object and execs one of the functions above
        showCartConfirmation: function showCartConfirmation(cart_promise, line, application) {
            // Available values are: goToCart, showMiniCart and showCartConfirmationModal
            var addToCartBehavior = Configuration_1.Configuration.get().addToCartBehavior || 'showCartConfirmationModal';
            this['_' + addToCartBehavior](cart_promise, line, application);
            var layout = application.getLayout();
            cart_promise.fail(function (error) {
                var output_message = '';
                var error_object = { errorCode: 'UNKNOWN' };
                var error_message = '';
                if (error) {
                    if (error.responseJSON) {
                        error_object = error.responseJSON;
                        error_message = layout.parseErrorMessage(error);
                    }
                    else if (_.isString(error)) {
                        // Error came from Frontend ExtLayer
                        error_object.errorCode = 'ERR_EXT_CANCELED_OPERATION';
                        error_message = error;
                    }
                }
                // if the error was caused by an extension canceling the operation,
                // then show the error message from the back-end
                if (error_object.errorCode === 'ERR_EXT_CANCELED_OPERATION' && error_message) {
                    output_message = error_message;
                }
                else {
                    output_message = Utils.translate('Sorry, there is a problem with this Item and can not be purchased at this time. Please check back later.');
                }
                layout.showErrorInModal(output_message);
            });
        },
        _showCartConfirmationModal: function _showCartConfirmationModal(cart_promise, line, application) {
            if (line.isNew()) {
                return this._showOptimisticCartConfirmation(cart_promise, line, application);
            }
            return cart_promise.done(function () {
                var view = new CartConfirmationView({
                    application: application,
                    model: LiveOrderModel.getInstance().getLatestAddition()
                });
                view.showInModal();
            });
        },
        _showOptimisticCartConfirmation: function _showOptimisticCartConfirmation(cart_promise, line, application) {
            var cart_model = LiveOrderModel.getInstance();
            // search the item in the cart to merge the quantities
            if (LiveOrderModel.loadCart().state() === 'resolved') {
                var cart_line_1 = cart_model.findLine(line);
                if (cart_line_1) {
                    if (line.get('source') !== 'cart') {
                        cart_line_1.set('quantity', cart_line_1.get('quantity') + parseInt(line.get('quantity'), 10));
                    }
                    else {
                        cart_line_1.set('quantity', line.get('quantity'));
                    }
                    cart_promise.fail(function () {
                        cart_line_1.set('quantity', cart_line_1.previous('quantity'));
                    });
                    line = cart_line_1;
                }
                else {
                    cart_model.get('lines').add(line, { at: 0 });
                    cart_promise.fail(function () {
                        cart_model.get('lines').remove(line);
                    });
                }
            }
            var view = new CartConfirmationView({
                application: application,
                model: line
            });
            cart_promise.done(function () {
                view.model = cart_model.getLatestAddition();
                view.render();
            });
            view.showInModal();
        },
        // Cart.goToCart()
        _goToCart: function _goToCart(cart_promise) {
            cart_promise.done(function () {
                Backbone.history.navigate('cart', { trigger: true });
            });
        },
        _showMiniCart: function _showMiniCart(cart_promise, line, application) {
            var layout = application.getLayout();
            cart_promise.done(function () {
                jQuery(document).scrollTop(0);
                layout.closeModal().done(function () {
                    if (layout.headerViewInstance) {
                        layout.headerViewInstance.showMiniCart();
                    }
                });
            });
        }
    };
});

//# sourceMappingURL=Cart.Confirmation.Helpers.js.map
