/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Header.Menu.View", ["require", "exports", "header_menu.tpl", "jQuery", "Configuration", "Profile.Model", "Header.Profile.View", "Header.Menu.MyAccount.View", "GlobalViews.HostSelector.View", "GlobalViews.CurrencySelector.View", "Backbone.View", "jQuery.sidebarMenu"], function (require, exports, header_menu, jQuery, Configuration_1, Profile_Model_1, HeaderProfileView, HeaderMenuMyAccountView, GlobalViewsHostSelectorView, GlobalViewsCurrencySelectorView, BackboneView) {
    "use strict";
    return BackboneView.extend({
        template: header_menu,
        events: {
            'mouseenter [data-toggle="categories-menu"]': 'menuOpen',
            'mouseleave [data-toggle="categories-menu"]': 'menuClose',
            'click [data-toggle="categories-menu"]': 'menuClose'
        },
        menuOpen: function (e) {
            jQuery(e.currentTarget).addClass('open');
        },
        menuClose: function (e) {
            jQuery(e.currentTarget).removeClass('open');
        },
        initialize: function () {
            var _this = this;
            var self = this;
            this.application = this.options.application;
            this.application.on('Configuration.navigationData', function () { return _this.render(); });
            Profile_Model_1.ProfileModel.getPromise().done(function () {
                self.render();
            });
        },
        childViews: {
            'Header.Profile': function () {
                return new HeaderProfileView({
                    showMyAccountMenu: false,
                    application: this.application
                });
            },
            'Header.Menu.MyAccount': function () {
                return new HeaderMenuMyAccountView(this.options);
            },
            'Global.HostSelector': function () {
                return new GlobalViewsHostSelectorView();
            },
            'Global.CurrencySelector': function () {
                return new GlobalViewsCurrencySelectorView();
            }
        },
        render: function () {
            BackboneView.prototype.render.apply(this, arguments);
            this.$('[data-type="header-sidebar-menu"]').sidebarMenu();
        },
        // @method getContext
        // @return {Header.Sidebar.View.Context}
        getContext: function () {
            var profile = Profile_Model_1.ProfileModel.getInstance();
            var is_loading = !Configuration_1.Configuration.get('performance.waitForUserProfile', true) &&
                Profile_Model_1.ProfileModel.getPromise().state() !== 'resolved';
            var is_loged_in = profile.get('isLoggedIn') === 'T' && profile.get('isGuest') === 'F';
            var environment = SC.ENVIRONMENT;
            var show_languages = environment.availableHosts && environment.availableHosts.length > 1;
            var show_currencies = environment.availableCurrencies &&
                environment.availableCurrencies.length > 1 &&
                !Configuration_1.Configuration.get('header.notShowCurrencySelector');
            // @class Header.Sidebar.View.Context
            return {
                isStandalone: this.application.isStandalone(),
                // @property {Array<NavigationData>} navigationItems
                categories: Configuration_1.Configuration.navigationData || [],
                // @property {Boolean} showExtendedMenu
                showExtendedMenu: !is_loading && is_loged_in,
                // @property {Boolean} showLanguages
                showLanguages: show_languages,
                // @property {Boolean} showCurrencies
                showCurrencies: show_currencies
            };
        }
    });
});

//# sourceMappingURL=Header.Menu.View.js.map
