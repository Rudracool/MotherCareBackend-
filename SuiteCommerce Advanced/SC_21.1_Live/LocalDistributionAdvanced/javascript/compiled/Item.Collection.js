/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Item.Collection", ["require", "exports", "underscore", "Utils", "Profile.Model", "Backbone.CachedCollection", "Item.Model", "Session"], function (require, exports, _, Utils, Profile_Model_1, BackboneCachedCollection, ItemModel, Session) {
    "use strict";
    var ItemCollection = BackboneCachedCollection.extend({
        url: function () {
            var profile = Profile_Model_1.ProfileModel.getInstance();
            var url = Utils.addParamsToUrl(profile.getSearchApiUrl(), _.extend({}, this.searchApiMasterOptions, Session.getSearchApiParams()), profile.isAvoidingDoubleRedirect());
            return url;
        },
        model: ItemModel,
        // http://backbonejs.org/#Model-parse
        parse: function (response) {
            // NOTE: Compact is used to filter null values from response
            return _.compact(response.items) || null;
        }
    });
    return ItemCollection;
});

//# sourceMappingURL=Item.Collection.js.map
