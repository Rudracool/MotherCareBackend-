/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Search.Component"/>
import { SCBaseComponent } from '../../SC/JavaScript/SC.BaseComponent';
import { ProfileModel } from '../../Profile/JavaScript/Profile.Model';
import * as Utils from '../../Utilities/JavaScript/Utils';
import Session = require('../../Session/JavaScript/Session');
import * as _ from 'underscore';

interface Filters {
    c: string;
    n: string;
    region: string;
    id: string;
    url: string;
    q: string;
    commercecategoryid: string;
    commercecategoryurl: string;
    commercecategoryname: string;
    use_pcv: string;
    pcv_entity: string;
    pcv_groups: string;
    fields: string;
    fieldset: string;
    matrixchilditems_fieldset: string;
    correlateditems_fieldset: string;
    relateditems_fieldset: string;
    limit: string;
    offset: string;
    include: string;
    'facet.exclude': string;
    sort: string;
    pricelevel: string;
    currency: string;
    language: string;
    country: string;
    callback: string;
    ssdebug: string;
    apiMasterOptions: string;
}

const SearchComponent = {
    mountToApp: function(container) {
        container.registerComponent(this.componentGenerator(container));
    },

    componentGenerator: function(container) {
        return SCBaseComponent.extend({
            componentName: 'Search',

            application: container,

            // @method getUrl Returns the Search API URL with the filters provided as parameters in the URL
            // @public @extlayer
            // @param Filters filters
            // @return string
            getUrl: function getUrl(filters?: Partial<Filters>): string {
                const profile = ProfileModel.getInstance();
                const apiMasterOptions = this._getSearchApiMasterOptions(filters);
                const url = Utils.addParamsToUrl(
                    profile.getSearchApiUrl(),
                    _.extend({}, Session.getSearchApiParams(), filters, apiMasterOptions),
                    profile.isAvoidingDoubleRedirect()
                );
                return url;
            },

            // @method _getSearchApiMasterOptions
            // @private
            // @param string apiMasterOptions
            _getSearchApiMasterOptions: function _getSearchApiMasterOptions(filters: Filters): Partial<Filters> {
                let apiMasterOptions = {};
                if (filters && filters.apiMasterOptions) {
                    apiMasterOptions = this.application.getConfig().searchApiMasterOptions[filters.apiMasterOptions];
                    delete(filters.apiMasterOptions);
                }
                return apiMasterOptions;
            },
        });
    }
};

export = SearchComponent;
