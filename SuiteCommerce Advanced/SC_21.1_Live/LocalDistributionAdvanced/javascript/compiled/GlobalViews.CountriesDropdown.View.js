/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GlobalViews.CountriesDropdown.View", ["require", "exports", "underscore", "global_views_countriesDropdown.tpl", "Backbone.View"], function (require, exports, _, global_views_countriesDropdown_tpl, BackboneView) {
    "use strict";
    // @class GlobalViews.CountriesDropdown.View @extends Backbone.View
    var GlobalViewsCountriesDropdownView = BackboneView.extend({
        template: global_views_countriesDropdown_tpl,
        // @method getContext @return GlobalViews.CountriesDropdown.View.Context
        getContext: function () {
            // @class GlobalViews.CountriesDropdown.View.Context
            return {
                // @property {String} cssclass
                cssclass: this.options.cssclass || '',
                // @property {Boolean} isCSSclass
                showCSSclass: !!this.options.cssclass,
                // @property {String} id
                id: this.options.manage || '',
                // @property {Array<Country>} countries
                countries: _.values(this.options.countries)
            };
        }
    });
    return GlobalViewsCountriesDropdownView;
});
// @class Country
// @property {Number} code
// @property {String} name
// @class GlobalViews.CountriesDropdown.View.Options
// @property {String} cssclass
// @property {Array<Country>} countries
// @property {Number} selectedCountry
// @property {String} manage

//# sourceMappingURL=GlobalViews.CountriesDropdown.View.js.map
