/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.CCT.Html", ["require", "exports", "SC.CCT.Html.View"], function (require, exports, SCCCTHtmlView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @module SC.CCT.Html
    function mountToApp(application) {
        var component = application.getComponent('CMS');
        if (!component) {
            return;
        }
        component.registerCustomContentType({
            id: 'CMS',
            view: SCCCTHtmlView
        });
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=SC.CCT.Html.js.map
