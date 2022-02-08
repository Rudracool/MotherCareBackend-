/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.Collection", ["require", "exports", "Profile.Model", "Facets.Model", "Backbone.CachedCollection"], function (require, exports, Profile_Model_1, FacetsModel, BackboneCachedCollection) {
    "use strict";
    return BackboneCachedCollection.extend({
        url: Profile_Model_1.ProfileModel.getInstance().getSearchApiUrl(),
        model: FacetsModel,
        parse: function (response) {
            return [response];
        }
    });
});

//# sourceMappingURL=Facets.Collection.js.map
