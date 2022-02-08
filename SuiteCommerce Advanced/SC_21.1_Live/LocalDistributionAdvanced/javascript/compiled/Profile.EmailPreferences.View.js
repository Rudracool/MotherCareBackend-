/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Profile.EmailPreferences.View", ["require", "exports", "underscore", "profile_emailpreferences.tpl", "Utils", "jQuery", "Configuration", "Profile.Model", "GlobalViews.Message.View", "Backbone.FormView", "Backbone.View"], function (require, exports, _, profile_emailpreferences_tpl, Utils, jQuery, Configuration_1, Profile_Model_1, GlobalViews_Message_View_1, BackboneFormView, BackboneView) {
    "use strict";
    // @class Profile.EmailPreferences.View @extends Backbone.View
    var ProfileEmailPreferencesView = BackboneView.extend({
        template: profile_emailpreferences_tpl,
        title: Utils.translate('Email Preferences'),
        page_header: Utils.translate('Email Preferences'),
        attributes: {
            id: 'EmailPreferences',
            class: 'ProfileEmailPreferencesView'
        },
        events: {
            'submit form': 'save',
            'change form:has([data-action="reset"])': 'toggleReset',
            'click [data-action="reset"]': 'resetForm',
            'keyup form:has([data-action="reset"])': 'toggleReset',
            'change [data-type="emailsubscribe-checkbox"]': 'emailSubscribeChange'
        },
        initialize: function () {
            this.model = Profile_Model_1.ProfileModel.getInstance();
            BackboneFormView.add(this);
            this.useLayoutError = true;
            this.model.on('save', this.showSuccess, this);
        },
        // @method getSelectedMenu
        getSelectedMenu: function () {
            return 'emailpreferences';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: 'emailpreferences'
            };
        },
        showSuccess: function () {
            if (this.$savingForm) {
                var global_view_message_1 = new GlobalViews_Message_View_1.GlobalViewsMessageView({
                    message: Utils.translate('Email Preferences successfully saved!'),
                    type: 'success',
                    closable: true
                });
                this.showContent().then(function () {
                    this.$('[data-type="alert-placeholder"]').append(global_view_message_1.render().$el.html());
                });
            }
        },
        save: function (e) {
            e.preventDefault();
            var $target = jQuery(e.target);
            var props = $target.serializeObject();
            var subscriptions_by_id = {};
            var campaignsubscriptions = this.model.get('campaignsubscriptions');
            // generate an object with the subscriptions and it's corresponding value
            _.each(props, function (val, key) {
                if (~key.indexOf('subscription-')) {
                    subscriptions_by_id[key.replace('subscription-', '')] = val === 'T';
                }
            });
            _.each(campaignsubscriptions, function (subscription) {
                subscription.subscribed = subscriptions_by_id[subscription.internalid];
            });
            var fixed_props = {
                campaignsubscriptions: campaignsubscriptions,
                emailsubscribe: props.emailsubscribe === 'T'
            };
            this.saveForm(e, this.model, fixed_props);
        },
        resetForm: function (e) {
            e.preventDefault();
            this.showContent();
        },
        // if the user doesn't want email notifications we disable all the campaign's checkboxes
        emailSubscribeChange: function (e) {
            var disabled = jQuery(e.target).prop('checked');
            this.$('[data-type="subscription-checkbox"]').prop('disabled', !disabled);
        },
        // @method getContext @return Profile.EmailPreferences.View.Context
        getContext: function () {
            var campaign_subscriptions = this.model.get('campaignsubscriptions') || [];
            // @class Profile.EmailPreferences.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Array} subscriptions
                subscriptions: campaign_subscriptions,
                // @property {Boolean} isEmailSuscribe
                isEmailSuscribe: this.model.get('emailsubscribe') === 'T',
                // @property {Boolean} campaignSubscriptions
                campaignSubscriptions: !!(Configuration_1.Configuration.get('siteSettings.campaignsubscriptions') &&
                    campaign_subscriptions.length),
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD'
            };
        }
    });
    return ProfileEmailPreferencesView;
});

//# sourceMappingURL=Profile.EmailPreferences.View.js.map
