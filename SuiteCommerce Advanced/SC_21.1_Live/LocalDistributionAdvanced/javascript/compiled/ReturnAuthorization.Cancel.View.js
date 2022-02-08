/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ReturnAuthorization.Cancel.View", ["require", "exports", "Utils", "return_authorization_cancel.tpl", "jQuery", "Backbone.View"], function (require, exports, Utils, return_authorization_cancel_tpl, jQuery, BackboneView) {
    "use strict";
    // @class ReturnAuthorization.Cancel.View @extend Backbone.View
    var ReturnAuthorizationCancelView = BackboneView.extend({
        template: return_authorization_cancel_tpl,
        title: Utils.translate('Cancel Return Request'),
        page_header: Utils.translate('Cancel Return Request'),
        events: {
            'click [data-action="delete"]': 'confirm'
        },
        initialize: function (options) {
            this.application = options.application;
        },
        confirm: function () {
            this.model
                .save({
                status: 'cancelled'
            })
                .then(jQuery.proxy(this, 'dismiss'));
        },
        dismiss: function () {
            this.$containerModal &&
                this.$containerModal
                    .removeClass('fade')
                    .modal('hide')
                    .data('bs.modal', null);
        }
    });
    return ReturnAuthorizationCancelView;
});

//# sourceMappingURL=ReturnAuthorization.Cancel.View.js.map
