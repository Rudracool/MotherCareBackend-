/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Plugin.PostRender", ["require", "exports", "SC.BaseComponent.Plugin.PostRender"], function (require, exports, SC_BaseComponent_Plugin_PostRender_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
        Loads the cmsPostRender plugin responsible of re-rendering CCTs when views are being updated.
    */
    function CMSadapterPluginPostRender(application) {
        return {
            name: 'cmsPostRender',
            priority: 10,
            execute: SC_BaseComponent_Plugin_PostRender_1.scBaseComponentPluginPostRender
        };
    }
    exports.CMSadapterPluginPostRender = CMSadapterPluginPostRender;
});

//# sourceMappingURL=CMSadapter.Plugin.PostRender.js.map
