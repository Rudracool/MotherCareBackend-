/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Merchandising.Item.Collection", ["require", "exports", "underscore", "Utils", "Profile.Model", "Item.Collection", "Session"], function (require, exports, _, Utils, Profile_Model_1, ItemCollection, Session) {
    "use strict";
    return ItemCollection.extend({
        url: function () {
            var profile = Profile_Model_1.ProfileModel.getInstance();
            return Utils.addParamsToUrl(profile.getSearchApiUrl(), _.extend({}, this.searchApiMasterOptions, Session.getSearchApiParams()), profile.isAvoidingDoubleRedirect());
        }
    });
});

//# sourceMappingURL=Merchandising.Item.Collection.js.map
