/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Profile.ChangeEmailAddress.View", ["require", "exports", "profile_change_email.tpl", "Utils", "GlobalViews.Message.View", "Backbone.View", "Backbone.FormView"], function (require, exports, profile_change_email_tpl, Utils, GlobalViews_Message_View_1, BackboneView, BackboneFormView) {
    "use strict";
    // @class Profile.ChangeEmailAddress.View @extends Backbone.View
    var ProfileChangeEmailAddress = BackboneView.extend({
        template: profile_change_email_tpl,
        page_header: Utils.translate('Change Email'),
        title: Utils.translate('Change Email'),
        events: {
            'submit form': 'saveFormCustom'
        },
        bindings: {
            '[name="current_password"]': 'current_password',
            '[name="new_email"]': 'new_email',
            '[name="confirm_email"]': 'confirm_email'
        },
        initialize: function () {
            BackboneView.prototype.initialize.apply(this, arguments);
            BackboneFormView.add(this);
        },
        saveFormCustom: function () {
            this.new_email = this.$('[name="new_email"]').val();
            BackboneFormView.saveForm.apply(this, arguments);
        },
        showSuccess: function (placeholder) {
            var global_view_message = new GlobalViews_Message_View_1.GlobalViewsMessageView({
                message: Utils.translate('A confirmation email has been sent to <strong>') +
                    this.new_email + "</strong>",
                type: 'success',
                closable: true
            });
            placeholder.html(global_view_message.render().$el.html());
        }
    });
    return ProfileChangeEmailAddress;
});

//# sourceMappingURL=Profile.ChangeEmailAddress.View.js.map
