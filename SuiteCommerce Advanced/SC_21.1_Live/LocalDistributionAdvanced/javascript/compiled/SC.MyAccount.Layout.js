/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("SC.MyAccount.Layout", ["require", "exports", "myaccount_layout.tpl", "MyAccountMenu", "Utils", "ApplicationOnlineLayout", "MenuTree.View", "Header.View", "Backbone"], function (require, exports, myaccount_layout_tpl, MyAccountMenu_1, Utils, ApplicationOnlineLayout_1, MenuTreeView, HeaderView, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MyAccountLayout = /** @class */ (function (_super) {
        __extends(MyAccountLayout, _super);
        function MyAccountLayout(application) {
            var _this = _super.call(this, application) || this;
            _this.template = myaccount_layout_tpl;
            _this.className = 'layout-container';
            _this.breadcrumbPrefix = [
                {
                    href: '#',
                    'data-touchpoint': 'home',
                    'data-hashtag': '#',
                    text: Utils.translate('Home')
                },
                {
                    href: '#',
                    'data-touchpoint': 'customercenter',
                    'data-hashtag': '#overview',
                    text: Utils.translate('My Account')
                }
            ];
            _this.on('afterAppendView', function (view) { return _this.afterAppendView(view); });
            return _this;
        }
        MyAccountLayout.prototype.afterAppendView = function (view) {
            var selected_menu = this.getSelectedMenu(view);
            var menuTree = MenuTreeView.getInstance();
            menuTree.updateSidebar(selected_menu);
            this.updateLayoutSB(selected_menu);
        };
        MyAccountLayout.prototype.updateOnReSize = function () {
            _super.prototype.updateOnReSize.call(this);
            this.updateLayoutSB();
        };
        MyAccountLayout.prototype.updateLayoutSB = function (selectedMenu) {
            this.selectedMenu = selectedMenu || this.selectedMenu;
            var siteSettings = this.application.getConfig().siteSettings || {};
            if (siteSettings.sitetype === 'STANDARD') {
                if (Utils.isPhoneDevice() && this.selectedMenu === 'home') {
                    // show side nav hide content
                    this.$('.myaccount-layout-side-nav').removeClass('hide');
                    this.$('.myaccount-layout-main').hide();
                }
                else if (!Utils.isPhoneDevice()) {
                    // show side nav and content
                    this.$('.myaccount-layout-side-nav').removeClass('hide');
                    this.$('.myaccount-layout-main').show();
                }
                else {
                    // hide side nav show content
                    this.$('.myaccount-layout-side-nav').addClass('hide');
                    this.$('.myaccount-layout-main').show();
                }
            }
        };
        // @method showContent Extends the original show content and adds support
        // to update the sidebar and the breadcrumb
        MyAccountLayout.prototype.showContent = function (view, dontScroll) {
            var promise = _super.prototype.showContent.call(this, view, dontScroll);
            var selectedMenu = this.getSelectedMenu(view);
            MenuTreeView.getInstance().updateSidebar(selectedMenu);
            this.updateLayoutSB(selectedMenu);
            return promise;
        };
        MyAccountLayout.prototype.getSelectedMenu = function (view) {
            var myAccountMenu = MyAccountMenu_1.MyAccountMenu.getInstance();
            var selected_menu = '';
            if (view.getSelectedMenu) {
                selected_menu = view.getSelectedMenu();
            }
            else {
                selected_menu = myAccountMenu.getMenuIdByUrl(Backbone.history.fragment);
            }
            return selected_menu;
        };
        // @propery {Object} childViews
        MyAccountLayout.prototype.getChildViews = function () {
            var _this = this;
            var childViews = _super.prototype.getChildViews.call(this);
            childViews.Header = function () {
                return new HeaderView({
                    application: _this.application
                });
            };
            childViews.MenuTree = function () {
                var menuTreeViewInstance = MenuTreeView.getInstance();
                menuTreeViewInstance.addChildViewInstances(menuTreeViewInstance.getChildViews(), true);
                return menuTreeViewInstance;
            };
            return childViews;
        };
        MyAccountLayout.prototype.getContext = function () {
            return {
                // @property {Boolean} isStandalone
                isStandalone: this.application.isStandalone()
            };
        };
        return MyAccountLayout;
    }(ApplicationOnlineLayout_1.ApplicationOnlineLayout));
    exports.MyAccountLayout = MyAccountLayout;
});

//# sourceMappingURL=SC.MyAccount.Layout.js.map
