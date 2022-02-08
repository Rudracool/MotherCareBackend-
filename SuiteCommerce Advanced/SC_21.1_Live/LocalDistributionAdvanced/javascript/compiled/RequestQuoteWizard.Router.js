/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("RequestQuoteWizard.Router", ["require", "exports", "Utils", "jQuery", "AjaxRequestsKiller", "Wizard.Router", "RequestQuoteWizard.View", "RequestQuoteWizard.Step", "RequestQuoteWizard.Permission.Error.View", "Backbone"], function (require, exports, Utils, jQuery, AjaxRequestsKiller_1, WizardRouter, RequestQuoteWizardView, RequestQuoteWizardStep, RequestQuoteWizardPermissionErrorView, Backbone) {
    "use strict";
    return WizardRouter.extend({
        // @property {RequestQuoteWizardStep.Step} step
        step: RequestQuoteWizardStep,
        // @property {RequestQuoteWizardStep.View} view
        view: RequestQuoteWizardView,
        initialize: function () {
            var init_promise = WizardRouter.prototype.initialize.apply(this, arguments);
            this.application.waitForPromise(init_promise);
        },
        _registerPageType: function _registerPageType(options) {
            var pageType = this.application.getComponent('PageType');
            pageType.registerPageType({
                name: 'request-quote-wizard',
                routes: options.routes,
                view: RequestQuoteWizardView,
                defaultTemplate: {
                    name: 'requestquote_wizard_layout.tpl',
                    displayName: 'Request quote wizard default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-request-quote-wizard.png')
                }
            });
        },
        // @method runStep override default runstep method to validate that a quote id has been specified in the URL and the corresponding quote is already loaded
        // @return {Void}
        runStep: function () {
            // Computes the position of the user in the flow
            var fragments = Backbone.history.fragment.split('?');
            var url = fragments[0];
            var str_options = fragments.length ? fragments[1] : '';
            var position = this.getStepPosition(url); // this.getStepPosition(url)
            var content = '';
            var page_header = '';
            var layout = this.application.getLayout();
            var options = Utils.parseUrlOptions(str_options);
            var self = this;
            var quoteid = str_options && ~str_options.indexOf('quoteid=');
            var promise = jQuery.Deferred();
            if (SC.ENVIRONMENT.permissions.transactions.tranEstimate < 2) {
                var error_view = new RequestQuoteWizardPermissionErrorView({
                    application: this.application
                });
                error_view.showContent();
                return promise.reject();
            }
            if (quoteid) {
                // wizard just finished and user refreshed the page
                page_header = Utils.translate('Your Quote Request has been Placed');
                content +=
                    Utils.translate('You can review your quote request at <a href="/quotes/$(0)">Your Account</a> ', options.quoteid) +
                        Utils.translate('or continue Shopping on our <a data-touchpoint="home" data-hashtag="#/" href="/">Home Page</a>.');
                layout.internalError &&
                    layout.internalError(content, page_header, Utils.translate('My Account'));
                return promise.reject();
            }
            if (position.fromBegining === 0) {
                self.model.clear();
                // this is done because many OrderWizard Modules dont check if the summary is set
                self.model.set('summary', {}, { silent: true });
                self.model.set('internalid', 'null');
                return self.model
                    .fetch({
                    killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
                })
                    .then(function () {
                    self.model.trigger('init');
                    return WizardRouter.prototype.runStep.apply(self);
                });
            }
            return WizardRouter.prototype.runStep.apply(self, arguments);
        }
    });
});

//# sourceMappingURL=RequestQuoteWizard.Router.js.map
