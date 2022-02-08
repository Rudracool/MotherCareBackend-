/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Backbone.CachedModel", ["require", "exports", "Backbone", "Backbone.CachedSync", "Backbone.Model"], function (require, exports, Backbone, BackboneCachedSync, BackboneModel) {
    "use strict";
    Backbone.CachedModel = BackboneModel.extend({
        sync: BackboneCachedSync.cachedSync,
        addToCache: BackboneCachedSync.addToCache,
        isCached: BackboneCachedSync.isCached
    });
    return Backbone.CachedModel;
});

//# sourceMappingURL=Backbone.CachedModel.js.map
