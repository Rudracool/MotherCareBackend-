/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Search.Component", ["require", "exports", "SC.BaseComponent", "Profile.Model", "Utils", "Session", "underscore"], function (require, exports, SC_BaseComponent_1, Profile_Model_1, Utils, Session, _) {
    "use strict";
    var SearchComponent = {
        mountToApp: function (container) {
            container.registerComponent(this.componentGenerator(container));
        },
        componentGenerator: function (container) {
            return SC_BaseComponent_1.SCBaseComponent.extend({
                componentName: 'Search',
                application: container,
                // @method getUrl Returns the Search API URL with the filters provided as parameters in the URL
                // @public @extlayer
                // @param Filters filters
                // @return string
                getUrl: function getUrl(filters) {
                    var profile = Profile_Model_1.ProfileModel.getInstance();
                    var apiMasterOptions = this._getSearchApiMasterOptions(filters);
                    var url = Utils.addParamsToUrl(profile.getSearchApiUrl(), _.extend({}, Session.getSearchApiParams(), filters, apiMasterOptions), profile.isAvoidingDoubleRedirect());
                    return url;
                },
                // @method _getSearchApiMasterOptions
                // @private
                // @param string apiMasterOptions
                _getSearchApiMasterOptions: function _getSearchApiMasterOptions(filters) {
                    var apiMasterOptions = {};
                    if (filters && filters.apiMasterOptions) {
                        apiMasterOptions = this.application.getConfig().searchApiMasterOptions[filters.apiMasterOptions];
                        delete (filters.apiMasterOptions);
                    }
                    return apiMasterOptions;
                },
            });
        }
    };
    return SearchComponent;
});

//# sourceMappingURL=Search.Component.js.map
