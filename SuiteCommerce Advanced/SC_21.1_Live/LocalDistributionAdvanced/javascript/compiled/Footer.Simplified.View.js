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
define("Footer.Simplified.View", ["require", "exports", "footer_simplified.tpl", "jQuery", "View", "GlobalViews.BackToTop.View", "Configuration"], function (require, exports, footer_simplified_tpl, jQuery, View_1, GlobalViews_BackToTop_View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @Typescript-partial
    // window object could be undefined
    var FooterSimplifiedView = /** @class */ (function (_super) {
        __extends(FooterSimplifiedView, _super);
        function FooterSimplifiedView(options) {
            var _this = _super.call(this) || this;
            _this.template = footer_simplified_tpl;
            _this.childViews = {
                'Global.BackToTop': function () {
                    return new GlobalViews_BackToTop_View_1.GlobalViewsBackToTopView();
                }
            };
            _this.application = options.application;
            _this.application.getLayout().on('afterAppendView', function () {
                // after appended to DOM, we add the footer height as the content bottom padding,
                // so the footer doesn't go on top of the content
                var footer_height = _this.$el.find('#site-footer').height();
                if (footer_height) {
                    _this.$el.find('#content').css('padding-bottom', footer_height);
                }
                // Please note that this solution is taken from this view relative 'Footer.View',
                // and its way to solve sticky footer behavior.
                // Also see the comments there as they apply to here as well.
                setTimeout(function () {
                    var headerMargin = parseInt(jQuery('#site-header').css('marginBottom'), 10);
                    var contentHeight = jQuery(window).innerHeight() -
                        jQuery('#site-header')[0].offsetHeight -
                        headerMargin -
                        jQuery('#site-footer')[0].offsetHeight;
                    jQuery('#main-container').css('min-height', contentHeight);
                }, 10);
            });
            return _this;
        }
        FooterSimplifiedView.prototype.getContext = function () {
            return {};
        };
        return FooterSimplifiedView;
    }(View_1.View));
    exports.FooterSimplifiedView = FooterSimplifiedView;
});

//# sourceMappingURL=Footer.Simplified.View.js.map
