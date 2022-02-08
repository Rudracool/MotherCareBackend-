/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Overview.Profile.View", ["require", "exports", "overview_profile.tpl", "Utils", "Configuration", "Backbone.View"], function (require, exports, overview_profile_tpl, Utils, Configuration_1, BackboneView) {
    "use strict";
    var OverviewProfileView = BackboneView.extend({
        template: overview_profile_tpl,
        initialize: function () { },
        // @method getContext @returns {Overview.Banner.View.Context}
        getContext: function () {
            var first_name = this.model.get('firstname') || '';
            var middle_name = this.model.get('middlename') || '';
            var last_name = this.model.get('lastname') || '';
            var company_name = this.model.get('companyname');
            // @class Overview.Banner.View.Context
            return {
                // @property {String} name
                name: first_name + ' ' + middle_name + ' ' + last_name,
                // @property {Boolean} isCompany
                isCompany: !!company_name,
                // @property {Boolean} isNameTitle
                isNameTitle: !company_name,
                // @property {String} companyName
                companyName: company_name || '',
                // @property {String} email
                email: this.model.get('email'),
                // @property {String} phone
                phone: Utils.formatPhone(this.model.get('phone') || '', Configuration_1.Configuration.get('siteSettings.phoneformat'))
            };
        }
    });
    return OverviewProfileView;
});

//# sourceMappingURL=Overview.Profile.View.js.map
