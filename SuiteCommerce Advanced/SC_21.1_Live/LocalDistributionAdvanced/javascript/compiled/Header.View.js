/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Header.View", ["require", "exports", "underscore", "header.tpl", "Utils", "jQuery", "Configuration", "Profile.Model", "Header.Logo.View", "Header.MiniCart.View", "Header.MiniCartSummary.View", "Header.Profile.View", "Header.Menu.View", "GlobalViews.HostSelector.View", "GlobalViews.CurrencySelector.View", "MyAccountMenu", "Backbone", "Backbone.View", "ProductList.Utils"], function (require, exports, _, header_tpl, Utils, jQuery, Configuration_1, Profile_Model_1, HeaderLogoView, HeaderMiniCartView, HeaderMiniCartSummaryView, HeaderProfileView, HeaderMenuView, GlobalViewsHostSelectorView, GlobalViewsCurrencySelectorView, MyAccountMenu_1, Backbone, BackboneView, ProductList_Utils_1) {
    "use strict";
    return BackboneView.extend({
        template: header_tpl,
        events: {
            'click [data-action="show-sitesearch"]': 'showSiteSearch',
            'click [data-action="header-sidebar-show"]': 'showSidebar',
            'click [data-action="header-sidebar-hide"]': 'hideSidebar',
            'click [data-type="header-sidebar-menu"]': 'hideSidebar'
        },
        initialize: function () {
            Backbone.history.on('all', this.verifyShowSiteSearch, this);
            this.application = this.options.application;
            this.productListModule = new ProductList_Utils_1.ProductListUtils(this.options.application);
            this.isProductListEnabled = this.productListModule.isProductListEnabled();
            this.debounced_render = _.debounce(_.bind(this.render, this), 250);
            if (this.isProductListEnabled) {
                this.productListsPromise = this.productListModule.getProductListsPromise();
            }
            else {
                this.productListsPromise = jQuery.Deferred();
            }
            MyAccountMenu_1.MyAccountMenu.getInstance()
                .getEmitter()
                .on('entriesChanged', this.debounced_render);
        },
        // @method showMiniCart
        // @return {Void}
        showMiniCart: function () {
            this.$('[data-type="mini-cart"]')
                .parent()
                .addClass('open');
        },
        // Keeping this here to be backward compatible with themes prior to 2018.2.0
        showSiteSearch: function (ev) {
            ev && ev.preventDefault();
            // This add a class 'active' to change button color
            this.$('[data-action="show-sitesearch"]').toggleClass('active');
            this.$('[data-type="SiteSearch"]').toggle();
            this.getChildViewInstance('SiteSearch').showSiteSearch();
        },
        // Keeping this here to be backward compatible with themes prior to 2018.2.0, do not use this!
        hideSiteSearch: function () {
            // This hide Sitesearch div
            if (Utils.getDeviceType() == 'phone') {
                this.$('[data-type="SiteSearch"]').hide();
            }
            this.$('[data-type="SiteSearch"]').show();
        },
        // Keeping this here to be backward compatible with themes prior to 2018.2.0, do not use this!
        verifyShowSiteSearch: function () {
            if (this.$('[data-action="show-sitesearch"]').length > 0) {
                var hash = Backbone.history.getFragment() || '';
                hash = hash.indexOf('?') === -1 ? hash : hash.substring(0, hash.indexOf('?'));
                var is_home = hash === '' || hash === '/';
                // if (Utils.getDeviceType() !== 'desktop' && is_home) {
                //     this.showSiteSearch(null, true);
                // } else {
                //     // This hide sitesearch when navigate
                //     this.hideSiteSearch();
                // }
            }
        },
        getChildViews: function () {
            var _this = this;
            var childViews = this.childViews;
            // condition to prevent showing the desktop menu in standalone
            if (!this.options.application.isStandalone() || Utils.isPhoneDevice()) {
                childViews['Header.Menu'] = function () {
                    var headerViewOptions = _.extend({
                        application: _this.options.application
                    }, _this.options.headerProfileViewOptions || {});
                    return new HeaderMenuView(headerViewOptions);
                };
            }
            return childViews;
        },
        // @method showSidebar
        // @return {Void}
        showSidebar: function () {
            jQuery('#main').addClass('header-sidebar-opened');
            jQuery('.header-secondary-wrapper').css("width", "100%");
            jQuery('.sidebar').css("overflow-y", "auto");
        },
        // @method hideSidebar
        // @return {Void}
        hideSidebar: function (e) {
            if (e.target.tagName === 'A') {
                if (this.activeLink) {
                    this.activeLink.removeClass('active');
                }
                this.activeLink = jQuery(e.target);
                this.activeLink.addClass('active');
            }
            jQuery('#main').removeClass('header-sidebar-opened');
        },
        childViews: {
            'Header.MiniCart': function () {
                return new HeaderMiniCartView();
            },
            'Header.MiniCartSummary': function () {
                return new HeaderMiniCartSummaryView();
            },
            'Header.Profile': function () {
                var password_protected_site = SC.ENVIRONMENT.siteSettings.siteloginrequired === 'T';
                var isLoggedIn = Profile_Model_1.ProfileModel.getInstance().get('isLoggedIn') === 'T';
                if (!password_protected_site || isLoggedIn) {
                    var header_profile_view_options = _.extend({
                        showMyAccountMenu: true,
                        application: this.application
                    }, this.options.headerProfileViewOptions || {});
                    return new HeaderProfileView(header_profile_view_options);
                }
                return null;
            },
            'Header.Logo': function () {
                return new HeaderLogoView(this.options);
            },
            'Global.HostSelector': function () {
                return new GlobalViewsHostSelectorView();
            },
            'Global.CurrencySelector': function () {
                return new GlobalViewsCurrencySelectorView();
            }
        },
        // @method getContext
        // @return {Header.View.Context}
        getContext: function getContext() {
            var wishlistArry = [];
            var wishlistData = MyAccountMenu_1.MyAccountMenu.getInstance().getEntries();
            var self = this;
            _.each(wishlistData, function (data) {
                if (data.id == 'productlists') {
                    var getProductName = data.children;
                    wishlistArry.push(data);
                    self.productlists = data;
                }
                // console.log(data);
            });
            // console.log(self.productlists,"Arry");
            var environment = SC.ENVIRONMENT;
            var isLoggedIn = Profile_Model_1.ProfileModel.getInstance().get('isLoggedIn') === 'T';
            var show_languages = !!(environment.availableHosts &&
                environment.availableHosts.length > 1 &&
                !(environment.SCTouchpoint === 'myaccount' ||
                    (isLoggedIn && environment.SCTouchpoint === 'checkout')));
            var show_currencies = environment.availableCurrencies &&
                environment.availableCurrencies.length > 1 &&
                !Configuration_1.Configuration.get('header.notShowCurrencySelector');
            // @class Header.View.Context
            return {
                list: self.productlists,
                // @property {Boolean} isStandalone
                isStandalone: this.application.isStandalone(),
                // @property {Boolean} isReorderEnabled
                isReorderEnabled: !this.application.isStandalone() ||
                    (this.application.isReorderEnabled() && isLoggedIn),
                // @property {Profile.Model} profileModel
                profileModel: Profile_Model_1.ProfileModel.getInstance(),
                // @property {Boolean} showLanguages
                showLanguages: show_languages,
                // @property {Boolean} showCurrencies
                showCurrencies: show_currencies,
                // @property {Boolean} showLanguagesOrCurrencies
                showLanguagesOrCurrencies: show_languages || show_currencies,
                // @property {Boolean} showLanguagesAndCurrencies
                showLanguagesAndCurrencies: show_languages && show_currencies,
                // @property {Boolean} isHomeTouchpoint
                isHomeTouchpoint: Configuration_1.Configuration.currentTouchpoint === 'home',
                // @property {String} cartTouchPoint
                cartTouchPoint: Configuration_1.Configuration.get('modulesConfig.Cart.startRouter', false)
                    ? Configuration_1.Configuration.currentTouchpoint
                    : 'viewcart',
                // @property {Boolean} isPhoneDevice
                isPhoneDevice: Utils.isPhoneDevice(),
                ifLogin: isLoggedIn
            };
            // @class Header.View
        },
        // @method destroy Override default destroy method to clean navigation event handlers
        // @return {Void}
        destroy: function () {
            BackboneView.prototype.destroy.apply(this, arguments);
            Backbone.history.off('all', this.verifyShowSiteSearch);
        }
    });
});

//# sourceMappingURL=Header.View.js.map
