/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Facets.Model", ["require", "exports", "underscore", "Utils", "Configuration", "Profile.Model", "Backbone.CachedModel", "Item.Collection", "Session"], function (require, exports, _, Utils, Configuration_1, Profile_Model_1, BackboneCachedModel, ItemCollection, Session) {
    "use strict";
    // @module Facets
    var original_fetch = BackboneCachedModel.prototype.fetch;
    return BackboneCachedModel.extend({
        options: {},
        searchApiMasterOptions: Configuration_1.Configuration.get('searchApiMasterOptions.Facets', {}),
        url: function () {
            var profile = Profile_Model_1.ProfileModel.getInstance();
            var url = Utils.addParamsToUrl(profile.getSearchApiUrl(), _.extend(Configuration_1.Configuration.get('matrixchilditems.enabled') &&
                Configuration_1.Configuration.get('matrixchilditems.fieldset')
                ? {
                    matrixchilditems_fieldset: Configuration_1.Configuration.get('matrixchilditems.fieldset')
                }
                : {}, this.searchApiMasterOptions, Session.getSearchApiParams()), profile.isAvoidingDoubleRedirect(this.force_avoid_redirect));
            return url;
        },
        initialize: function (options) {
            if (options && options.searchApiMasterOptions) {
                this.searchApiMasterOptions = options.searchApiMasterOptions;
            }
            // Listen to the change event of the items and converts it to an ItemCollection
            this.on('change:items', function (model, items) {
                if (!(items instanceof ItemCollection)) {
                    // NOTE: Compact is used to filter null values from response
                    model.set('items', new ItemCollection(_.compact(items)));
                }
            });
        },
        // @method fetch overrides fetch so we make sure that the cache is set to true, so we wrap it
        fetch: function (options) {
            Utils.deepExtend(options || {}, this.options);
            if (options.cache === undefined) {
                options.cache = true;
            }
            options.cache = !this.ignoreCache;
            this.force_avoid_redirect = options && options.data && options.data.force_avoid_redirect;
            return original_fetch.apply(this, arguments);
        }
    });
});

//# sourceMappingURL=Facets.Model.js.map
