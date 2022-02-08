/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Landing.View", ["require", "exports", "Utils", "cms_landing_page.tpl", "Backbone.View", "Backbone.Model"], function (require, exports, Utils, cms_landing_page_tpl, BackboneView, BackboneModel) {
    "use strict";
    return BackboneView.extend({
        template: cms_landing_page_tpl,
        title: '',
        page_header: '',
        attributes: {
            id: 'cms-landing-page',
            class: 'cms-landing-page'
        },
        initialize: function initialize(options) {
            BackboneView.prototype.initialize.apply(this, arguments);
            this.model = options.model || new BackboneModel(options.pageInfo);
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            var url = this.model.get('urlPath') || this.model.get('url');
            var path = Utils.correctURL(url);
            return [{ href: path, text: this.model.get('page_title') || this.model.get('title') }];
        },
        // @method getContext
        // @returns {CMSadapter.Landing.View.Context}
        getContext: function getContext() {
            // @class CMSadapter.Landing.View.Context
            return {
                // @property {Boolean} inModal
                inModal: this.inModal,
                // @property {String} title
                title: this.title,
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {CMSadapter.Page.Model} model
                model: this.options.pageInfo
            };
            // @class CMSadapter.Landing.View
        }
    });
});

//# sourceMappingURL=CMSadapter.Landing.View.js.map
