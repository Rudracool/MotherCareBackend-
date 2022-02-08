/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Newsletter", ["require", "exports", "Footer.View", "Newsletter.View"], function (require, exports, Footer_View_1, Newsletter_View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mountToApp() {
        // Set the Newsletter subscription form on the footer
        Footer_View_1.FooterView.addChildViews({
            FooterContent: function () {
                return new Newsletter_View_1.NewsletterView();
            }
        });
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=Newsletter.js.map
