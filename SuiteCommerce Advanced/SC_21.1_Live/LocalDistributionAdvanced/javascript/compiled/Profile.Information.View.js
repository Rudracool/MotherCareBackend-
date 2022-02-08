/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Profile.Information.View", ["require", "exports", "profile_information.tpl", "Utils", "jQuery", "Configuration", "GlobalViews.Message.View", "Profile.Model", "Profile.ChangeEmailAddress.Model", "Profile.ChangeEmailAddress.View", "Backbone.View", "Backbone.FormView"], function (require, exports, profile_information_tpl, Utils, jQuery, Configuration_1, GlobalViews_Message_View_1, Profile_Model_1, ProfileChangeEmailModel, ProfileChangeEmailView, BackboneView, BackboneFormView) {
    "use strict";
    // @class Profile.Information.View @extends Backbone.View
    var ProfileInformationView = BackboneView.extend({
        template: profile_information_tpl,
        page_header: Utils.translate('Profile Information'),
        title: Utils.translate('Profile Information'),
        attributes: {
            id: 'ProfileInfo',
            class: 'ProfileInformationView'
        },
        events: {
            'submit form': 'save',
            'change input[data-type="phone"]': 'formatPhone',
            'click [data-action="change-email"]': 'changeEmail'
        },
        bindings: {
            '[name="firstname"]': 'firstname',
            '[name="lastname"]': 'lastname',
            '[name="companyname"]': 'companyname',
            '[name="phone"]': 'phone'
        },
        save: function (e) {
            return this.saveForm(e, this.model);
        },
        initialize: function (options) {
            this.application = options.application;
            this.model = Profile_Model_1.ProfileModel.getInstance();
            BackboneFormView.add(this);
            this.useLayoutError = true;
            this.model.on('save', this.showSuccess, this);
        },
        formatPhone: function (e) {
            var $target = jQuery(e.target);
            $target.val(Utils.formatPhone($target.val()));
        },
        changeEmail: function () {
            var model = new ProfileChangeEmailModel(this.model.attributes);
            var view = new ProfileChangeEmailView({
                application: this.application,
                model: model
            });
            var self = this;
            model.on('save', function () {
                view.showSuccess(self.$('[data-type="alert-placeholder"]'));
            });
            view.useLayoutError = true;
            this.application.getLayout().showInModal(view);
        },
        showSuccess: function () {
            if (this.$savingForm) {
                var global_view_message_1 = new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: Utils.translate('Profile successfully updated!'),
                    type: 'success',
                    closable: true
                });
                this.showContent().then(function () {
                    this.$('[data-type="alert-placeholder"]').append(global_view_message_1.render().$el.html());
                });
            }
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'profileinformation';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: '/profileinformation'
            };
        },
        // @method getContext @return Profile.Information.View.Context
        getContext: function () {
            // @class Profile.Information.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Boolean} isNotCompany
                isNotCompany: this.model.get('type') !== 'COMPANY',
                // @property {String} phoneFormat
                phoneFormat: Configuration_1.Configuration.get('siteSettings.phoneformat'),
                // @property {Boolean} isCompanyAndShowCompanyField
                isCompanyAndShowCompanyField: this.model.get('type') === 'COMPANY' ||
                    Configuration_1.Configuration.get('siteSettings.registration.showcompanyfield') === 'T',
                // @property {Boolean} isCompanyFieldRequired
                isCompanyFieldRequired: Utils.getPathFromObject(this, 'model.validation.companyname.required', false),
                // @property {Boolean} isPhoneFieldRequired
                isPhoneFieldRequired: Utils.getPathFromObject(this, 'model.validation.phone.required', false),
                // @property {String} firstName
                firstName: this.model.get('firstname') || '',
                // @property {String} lastName
                lastName: this.model.get('lastname') || '',
                // @property {String} companyName
                companyName: this.model.get('companyname') || '',
                // @property {String} email
                email: this.model.get('email') || '',
                // @property {String} phone
                phone: this.model.get('phone') || '',
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD'
            };
        }
    });
    return ProfileInformationView;
});

//# sourceMappingURL=Profile.Information.View.js.map
