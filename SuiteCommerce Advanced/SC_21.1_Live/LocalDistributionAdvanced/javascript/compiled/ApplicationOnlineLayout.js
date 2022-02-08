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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("ApplicationOnlineLayout", ["require", "exports", "underscore", "jQuery", "ApplicationLayout", "Loggers", "Configuration", "BackboneExtras", "Footer.View", "Profile.Model", "Header.View", "ErrorManagementOnline.ForbiddenError.View", "UrlHelper", "Session", "GlobalViews.Breadcrumb.View", "ErrorManagementOnline.ResponseErrorParser", "GlobalViews.Modal.View"], function (require, exports, _, jQuery, ApplicationLayout_1, Loggers_1, Configuration_1, Backbone, Footer_View_1, Profile_Model_1, HeaderView, ForbiddenErrorView, UrlHelper_1, Session, GlobalViewsBreadcrumbView, ResponseErrorParser, GlobalViewsModalView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplicationOnlineLayout = /** @class */ (function (_super) {
        __extends(ApplicationOnlineLayout, _super);
        function ApplicationOnlineLayout(application) {
            var _this = _super.call(this, application) || this;
            _this.errorMessageParser = ResponseErrorParser;
            _this.headerView = HeaderView;
            _this.footerView = Footer_View_1.FooterView;
            _this.originalHeaderView = _this.headerView;
            _this.originalFooterView = _this.footerView;
            return _this;
        }
        ApplicationOnlineLayout.prototype.updateOnReSize = function () {
            this.updateHeader();
            this.updateFooter();
        };
        ApplicationOnlineLayout.prototype.getBreadcrumbPrefix = function () {
            return this.breadcrumbPrefix;
        };
        ApplicationOnlineLayout.prototype.getBreadcrumbPages = function () {
            return this.breadcrumbPages;
        };
        ApplicationOnlineLayout.prototype.updateHeader = function () {
            var siteSettings = this.application.getConfig().siteSettings || {};
            if (siteSettings.sitetype === 'ADVANCED' && this.headerViewInstance) {
                this.headerViewInstance.render();
            }
        };
        ApplicationOnlineLayout.prototype.updateFooter = function () {
            var siteSettings = this.application.getConfig().siteSettings || {};
            if (siteSettings.sitetype === 'ADVANCED' && this.footerViewInstance) {
                this.footerViewInstance.render();
            }
        };
        ApplicationOnlineLayout.prototype.updateLayout = function () {
            // update the header and footer
            this.headerView =
                this.currentView.getHeaderView && this.currentView.getHeaderView()
                    ? this.currentView.getHeaderView()
                    : this.originalHeaderView;
            this.footerView =
                this.currentView.getFooterView && this.currentView.getFooterView()
                    ? this.currentView.getFooterView()
                    : this.originalFooterView;
            if ((this.headerViewInstance && !(this.headerViewInstance instanceof this.headerView)) ||
                (this.footerViewInstance && !(this.footerViewInstance instanceof this.footerView))) {
                var headerChildViewInst = this.getChildViewInstance('Header');
                if (headerChildViewInst) {
                    headerChildViewInst.undelegateEvents();
                }
                var footerChildViewInst = this.getChildViewInstance('Footer');
                if (footerChildViewInst) {
                    footerChildViewInst.undelegateEvents();
                }
                this.addChildViewInstances({
                    Header: this.childViews.Header,
                    Footer: this.childViews.Footer
                });
                this.render();
            }
            // update the breadcrumb
            var breadcrumb_pages = this.currentView.getBreadcrumbPages
                ? this.currentView.getBreadcrumbPages()
                : null;
            if (breadcrumb_pages && this.breadcrumbViewInstance) {
                this.breadcrumbViewInstance.pages = this.updateCrumbtrail(breadcrumb_pages || []);
                this.breadcrumbViewInstance.render();
            }
            else {
                this.hideBreadcrumb();
            }
        };
        ApplicationOnlineLayout.prototype.updateCrumbtrail = function (pages) {
            if (!_.isArray(pages)) {
                pages = [pages];
            }
            this.breadcrumbPages = _.union(this.breadcrumbPrefix, pages);
            return this.breadcrumbPages;
        };
        ApplicationOnlineLayout.prototype.hideBreadcrumb = function () {
            if (this.breadcrumbViewInstance) {
                this.breadcrumbViewInstance.$el.empty();
            }
        };
        ApplicationOnlineLayout.prototype.processJsonLd = function () {
            // If the JsonLd markup is selected on the configuration and the properties used
            // in markup microdata do not exist, JsonLd script will be added to head.
            var configuration = this.application.getConfig();
            var structureddatamarkup = configuration.structureddatamarkup || {};
            if (structureddatamarkup.type !== 'JSON-LD') {
                return;
            }
            if (jQuery('[itemscope]').length || jQuery('[itemtype^="https://schema.org"]').length) {
                // eslint-disable-next-line no-console
                console.warn('This template is not compatible with JsonLd. Template must be based on 20.1 Base Theme.');
                return;
            }
            var fullJsonLd = [];
            var promises = [
                this.currentView.getViewJsonLd(),
                this.breadcrumbViewInstance.getJsonLd()
            ];
            jQuery.when.apply(jQuery, promises).then(function () {
                var jsonLds = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    jsonLds[_i] = arguments[_i];
                }
                _.each(jsonLds, function (jsonLdResult) {
                    if (!_.isEmpty(jsonLdResult)) {
                        var jsonLdWithContext = {
                            '@context': 'https://schema.org'
                        };
                        jsonLdWithContext = __assign({}, jsonLdWithContext, jsonLdResult);
                        fullJsonLd.push(jsonLdWithContext);
                    }
                });
                if (!_.isEmpty(fullJsonLd)) {
                    jQuery('head script[type="application/ld+json"]').remove();
                    jQuery("<script type=\"application/ld+json\">" + JSON.stringify(fullJsonLd) + "</script>").appendTo('head');
                }
            });
        };
        ApplicationOnlineLayout.prototype.forbiddenError = function () {
            var view = new ForbiddenErrorView({
                application: this.application
            });
            view.showContent().done(function () {
                Loggers_1.Loggers.getLogger().endLast('Navigation');
            });
        };
        ApplicationOnlineLayout.prototype.getChildViews = function () {
            var childViews = _super.prototype.getChildViews.call(this);
            childViews.Header = function () {
                var options = {
                    application: this.application
                };
                if (this.currentView && this.currentView.getHeaderViewOptions) {
                    _.extend(options, this.currentView.getHeaderViewOptions());
                }
                var View = this.headerView;
                this.headerViewInstance = new View(options);
                return this.headerViewInstance;
            };
            childViews.Footer = function () {
                var options = {
                    application: this.application
                };
                if (this.currentView && this.currentView.getFooterViewOptions) {
                    _.extend(options, this.currentView.getFooterViewOptions());
                }
                var View = this.footerView;
                this.footerViewInstance = new View(options);
                return this.footerViewInstance;
            };
            childViews['Global.Breadcrumb'] = function () {
                this.breadcrumbViewInstance = new GlobalViewsBreadcrumbView({
                    pages: this.breadcrumbPages
                });
                return this.breadcrumbViewInstance;
            };
            return childViews;
        };
        ApplicationOnlineLayout.prototype.unauthorizedError = function (user_session_timedOut) {
            var currentTouchpoint = this.application.getConfig().currentTouchpoint;
            if (currentTouchpoint === 'login') {
                // This case can happen when more than one concurrent XHR is made and both
                // return a user session time-out error
                return;
            }
            Profile_Model_1.ProfileModel.getInstance().set({
                isLoggedIn: 'F',
                isGuest: 'F'
            });
            var base_url = UrlHelper_1.UrlHelper.setUrlParameter(Session.get('touchpoints.login'), 'origin', currentTouchpoint);
            base_url = UrlHelper_1.UrlHelper.setUrlParameter(base_url, 'origin_hash', Backbone.history.fragment);
            Configuration_1.Configuration.currentTouchpoint = 'login';
            window.location = user_session_timedOut
                ? UrlHelper_1.UrlHelper.setUrlParameter(base_url, 'timeout', 'T')
                : base_url;
        };
        ApplicationOnlineLayout.prototype.getGlobalModalViewClass = function () {
            return GlobalViewsModalView;
        };
        return ApplicationOnlineLayout;
    }(ApplicationLayout_1.ApplicationLayout));
    exports.ApplicationOnlineLayout = ApplicationOnlineLayout;
});

//# sourceMappingURL=ApplicationOnlineLayout.js.map
