/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GlobalViews.Modal.View", ["require", "exports", "underscore", "global_views_modal.tpl", "Backbone.View"], function (require, exports, _, global_views_modal_tpl, BackboneView) {
    "use strict";
    // @class GlobalViews.Modal.View @extends Backbone.View
    var GlobalViewsModalView = BackboneView.extend({
        template: global_views_modal_tpl,
        childViews: {
            'Child.View': function () {
                return this.options.childViewIstance;
            }
        },
        // @method getContext @return GlobalViews.Modal.View.Context
        getContext: function () {
            // @class GlobalViews.Modal.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.options.pageHeader || ' ',
                // @property {Boolean} showPageHeader
                showPageHeader: _.isUndefined(this.options.childViewIstance.showModalPageHeader)
                    ? !!this.options.pageHeader
                    : this.options.childViewIstance.showModalPageHeader,
                // @property {Boolean} modalDialogClass
                modalDialogClass: this.options.childViewIstance.modalClass || '',
                headerModalClass: this.options.childViewIstance.headerClass || '',
                iconHeaderModalClass: this.options.childViewIstance.iconHeaderClass || ''
            };
        }
    });
    return GlobalViewsModalView;
});

//# sourceMappingURL=GlobalViews.Modal.View.js.map
