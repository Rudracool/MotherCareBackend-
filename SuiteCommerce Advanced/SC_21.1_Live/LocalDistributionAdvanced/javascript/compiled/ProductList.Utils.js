/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductList.Utils", ["require", "exports", "underscore", "MyAccountMenu", "Utils", "jQuery", "Environment", "ProductList.Collection", "ProductList.Model", "ProductList.ControlSingle.View", "ProductList.Control.View", "ProductList.Item.Model", "MenuTree.View", "ProductList.CartSaveForLater.View"], function (require, exports, _, MyAccountMenu_1, Utils, jQuery, Environment_1, ProductListCollection, ProductListModel, ProductListControlSingleView, ProductListControlView, ProductListItemModel, MenuTreeView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var productListsInstancePromise;
    var productListsInstance;
    // @class ProductList.Utils an utility class to support the ProductList ApplicationModule.
    // It will define shortcut accessors to product lists, render the controls on 'afterAppendView'
    // and show and define the MyAccount menu items.
    var ProductListUtils = /** @class */ (function () {
        function ProductListUtils(app) {
            // @property {control:String} placeholder this application will render some of
            // its views in existing DOM elements (placeholders)
            this.placeholder = { control: '[data-type="product-lists-control"]' };
            this.application = app;
        }
        // @method getProductListsPromise Loads Product Lists collection model
        // singleton @return {jQuery.Deferred}
        ProductListUtils.prototype.getProductListsPromise = function () {
            var SC = Environment_1.Environment.getSC();
            if (SC.ENVIRONMENT.PRODUCTLIST_ENABLED) {
                if (!productListsInstancePromise) {
                    productListsInstancePromise = jQuery.Deferred();
                    productListsInstance = new ProductListCollection();
                    productListsInstance.application = this.application;
                    productListsInstance.fetch({ cache: false }).done(function (jsonCollection) {
                        productListsInstance.reset(jsonCollection);
                        productListsInstancePromise.resolve(productListsInstance);
                    });
                }
            }
            else {
                productListsInstancePromise = jQuery
                    .Deferred()
                    .reject('The Product List feature is not enabled in this account');
            }
            return productListsInstancePromise;
        };
        ProductListUtils.buildSubMenuEntry = function (productlist, entryId) {
            return {
                entryId: entryId,
                id: 'productlist_' +
                    (productlist.get('internalid') || 'tmpl_' + productlist.get('templateId')),
                url: 'wishlist/' +
                    (productlist.get('internalid') || 'tmpl_' + productlist.get('templateId')),
                name: (productlist.get('name') === 'My list'
                    ? Utils.translate('My list')
                    : productlist.get('name')) +
                    ' (' +
                    productlist.get('items').length +
                    ')',
                index: 2
            };
        };
        ProductListUtils.prototype.updateProductListMenu = function () {
            var _this = this;
            var utils = this;
            var product_lists = utils.getProductLists();
            var menu = MyAccountMenu_1.MyAccountMenu.getInstance();
            function buildNewEntry() {
                var actual_object = {
                    id: 'productlists',
                    name: Utils.translate('Wishlist'),
                    url: '',
                    // Index of the menu item for menu order
                    index: 2
                };
                return actual_object;
            }
            function buildSingleListNewEntry() {
                var the_single_list = product_lists.at(0);
                var actual_object = {
                    id: 'productlist_' +
                        (the_single_list.get('internalid')
                            ? the_single_list.get('internalid')
                            : 'tmpl_' + the_single_list.get('templateId')),
                    name: the_single_list.get('name'),
                    url: 'wishlist/' +
                        (the_single_list.get('internalid')
                            ? the_single_list.get('internalid')
                            : 'tmpl_' + the_single_list.get('templateId')),
                    // Index of the menu item for menu order
                    index: 2
                };
                return actual_object;
            }
            if (!utils.isProductListEnabled()) {
                menu.removeEntry('product_list_dummy');
            }
            else {
                var newMenuEntry_1 = utils.isSingleList() ? buildSingleListNewEntry() : buildNewEntry();
                this.entryId = newMenuEntry_1.id;
                menu.replaceEntry('product_list_dummy', {
                    id: newMenuEntry_1.id,
                    name: newMenuEntry_1.name,
                    index: newMenuEntry_1.index,
                    url: newMenuEntry_1.url
                });
                if (!utils.isSingleList()) {
                    menu.addSubEntry({
                        entryId: newMenuEntry_1.id,
                        id: 'productlist_all',
                        name: Utils.translate('All my lists'),
                        url: 'wishlist',
                        index: 1
                    });
                    // Then add all the lists
                    product_lists.each(function (productlist) {
                        menu.addSubEntry(ProductListUtils.buildSubMenuEntry(productlist, newMenuEntry_1.id));
                    });
                }
            }
            _.each(product_lists.models, function (list) {
                list.get('items').on('add remove', function () {
                    var subMenuEntry = ProductListUtils.buildSubMenuEntry(list, _this.entryId);
                    MyAccountMenu_1.MyAccountMenu.getInstance().replaceSubEntry(subMenuEntry.id, subMenuEntry);
                    MenuTreeView.getInstance().updateMenuItemsUI();
                });
            });
            MenuTreeView.getInstance().updateMenuItemsUI();
            product_lists.on('add', function (model) {
                MyAccountMenu_1.MyAccountMenu.getInstance().addSubEntry(ProductListUtils.buildSubMenuEntry(model, _this.entryId));
                MenuTreeView.getInstance().updateMenuItemsUI();
            });
            product_lists.on('remove', function (model) {
                MyAccountMenu_1.MyAccountMenu.getInstance().removeSubEntry(ProductListUtils.buildSubMenuEntry(model, _this.entryId).id);
                MenuTreeView.getInstance().updateMenuItemsUI();
            });
        };
        // @method productListsPromiseDone method to be called once the product lists are
        // loaded to show the MyAccount's menu item
        ProductListUtils.prototype.productListsPromiseDone = function () {
            var layout = this.application.getLayout();
            if (this.application.ProductListModule.Utils.isSingleList()) {
                // Update header profile link for single product list...
                var the_single_list = this.application.ProductListModule.Utils.getProductLists().at(0);
                var product_list_menu_item = layout.$('.header-profile-single-productlist');
                if (the_single_list && product_list_menu_item) {
                    var product_list_hashtag = '#wishlist/' +
                        (the_single_list.get('internalid')
                            ? the_single_list.get('internalid')
                            : 'tmpl_' + the_single_list.get('templateId'));
                    product_list_menu_item.text(the_single_list.get('name'));
                    product_list_menu_item.attr('data-hashtag', product_list_hashtag);
                }
            }
        };
        // @method profileModelPromiseDone method to be executed once the user
        // profile has loaded. We need this to start working with product lists.
        ProductListUtils.prototype.profileModelPromiseDone = function () {
            var utils = this.application.ProductListModule.Utils;
            // if Product Lists are not enabled, return...
            if (!utils.isProductListEnabled()) {
                return;
            }
            var layout = this.application.getLayout();
            // rendering product lists
            utils.renderProductLists();
            layout.on('afterAppendView', function (view) {
                utils.renderProductLists(view);
            });
            layout.on('afterAppendToDom', function () {
                utils.renderProductLists();
            });
            // Put this code block outside afterAppendView to avoid infinite loop!
            utils.getProductListsPromise().done(function () { return utils.productListsPromiseDone(); });
            ProductListItemModel.prototype.keyMapping = this.application.getConfig('itemKeyMapping', {});
            ProductListItemModel.prototype.itemOptionsConfig = this.application.getConfig('itemOptions', []);
        };
        // @method getProductLists @return {ProductList.Collection}
        ProductListUtils.prototype.getProductLists = function () {
            if (!productListsInstance) {
                productListsInstance = new ProductListCollection();
                productListsInstance.application = this.application;
            }
            return productListsInstance;
        };
        // @method getProductList obtain a single ProductList with all its item's data
        // @return {ProductList.Model}
        ProductListUtils.prototype.getProductList = function (id) {
            var productList = new ProductListModel();
            productList.set('internalid', id);
            return productList.fetch();
        };
        // @method getSavedForLaterProductList obtain a single Saved for Later ProductList with
        // all its item's data @return {jQuery.Deferred}
        ProductListUtils.prototype.getSavedForLaterProductList = function () {
            var productList = new ProductListModel();
            productList.set('internalid', 'later');
            return productList.fetch();
        };
        ProductListUtils.prototype.getRequestAQuoteProductList = function () {
            var productList = new ProductListModel();
            productList.set('internalid', 'quote');
            return productList.fetch();
        };
        // @method isProductListEnabled is the Product-List functionality available for this
        // application? @return {Boolean}
        ProductListUtils.prototype.isProductListEnabled = function () {
            return SC.ENVIRONMENT.PRODUCTLIST_ENABLED && !SC.ENVIRONMENT.standalone;
        };
        // @method isSingleList are we in the single-list modality ? @return {Boolean}
        ProductListUtils.prototype.isSingleList = function () {
            var productList = this.application.getConfig().productList;
            return (!(productList.additionEnabled || false) &&
                _.filter(productList.listTemplates || [], function (pl) {
                    return !pl.typeName || (pl.typeName !== 'later' && pl.typeName !== 'quote');
                }).length === 1);
        };
        // @method renderProductLists render all product-lists related widgets
        // @param {Backbone.View} view
        ProductListUtils.prototype.renderProductLists = function (view) {
            if (!this.application.ProductListModule.Utils.isProductListEnabled()) {
                return;
            }
            this.application.ProductListModule.Utils.renderControl(view);
        };
        // @method internalGetProductId Gets the internal product id for a store item
        // considering it could be a matrix child.	// @param {Item.Model} product
        // @return {String}
        ProductListUtils.prototype.internalGetProductId = function (product) {
            // If its matrix its expected that only 1 item is selected, not more than one nor 0
            if (product.getPosibleOptions().length) {
                var selected_options = product.getSelectedMatrixChilds();
                if (selected_options.length === 1) {
                    return selected_options[0].get('internalid') + '';
                }
            }
            return product.get('_id') + '';
        };
        // @method renderControl renders the control used in shopping pdp and quickview
        // @param {Backbone.View} view
        ProductListUtils.prototype.renderControl = function (view_) {
            var utils = this.application.ProductListModule.Utils;
            jQuery(this.placeholder.control).each(function () {
                var view = view_ || this.application.getLayout().currentView;
                var is_single_list_mode = utils.isSingleList();
                var $container = jQuery(this);
                var product_lists_promise = utils.getProductListsPromise();
                product_lists_promise.done(function () {
                    // this control needs a reference to the StoreItem model !
                    if (view && view.model && view.model.getPosibleOptions) {
                        var control = null;
                        if (is_single_list_mode) {
                            control = new ProductListControlSingleView({
                                collection: utils.getProductLists(),
                                product: view.model,
                                application: this.application
                            });
                        }
                        else {
                            view.countedClicks = {};
                            control = new ProductListControlView({
                                collection: utils.getProductLists(),
                                product: view.model,
                                application: this.application,
                                isDisabledWishlistButton: !!jQuery(utils.placeholder.control).data('disabledbutton'),
                                countedClicks: view.countedClicks
                            });
                        }
                        $container.empty().append(control.$el);
                        control.render();
                    }
                });
                if (product_lists_promise.state() === 'pending') {
                    $container
                        .empty()
                        .append('<button class="product-list-control-button-wishlist">' +
                        (is_single_list_mode
                            ? Utils.translate('Loading List...')
                            : Utils.translate('Loading Lists...')) +
                        '</button>');
                }
            });
        };
        return ProductListUtils;
    }());
    exports.ProductListUtils = ProductListUtils;
});

//# sourceMappingURL=ProductList.Utils.js.map
