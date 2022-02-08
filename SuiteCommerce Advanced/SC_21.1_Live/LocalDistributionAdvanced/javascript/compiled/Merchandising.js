/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Merchandising", ["require", "exports", "underscore", "Merchandising.Item.Collection", "Merchandising.Rule", "Merchandising.jQueryPlugin"], function (require, exports, _, MerchandisingItemCollection, Rule) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @module Merchandising1
    // Module to handle MerchandisingZones (ex: Featured Items section)
    function reRenderMerchandizing(application, view) {
        view.$('[data-type="merchandising-zone"]').merchandisingZone({
            application: application
        });
    }
    exports.reRenderMerchandizing = reRenderMerchandizing;
    // @class Merchandising It will listen onAfterAppendView to see if there is a new placeholder on
    // which to attach a merchandising @extends ApplicationModule
    function mountToApp(application) {
        if (SC.ENVIRONMENT.MERCHANDISING) {
            // we need to turn it into an array
            var definitions = _.map(SC.ENVIRONMENT.MERCHANDISING, function (value, key) {
                value.internalid = key;
                return value;
            });
            Rule.Collection.getInstance().reset(definitions);
            delete SC.ENVIRONMENT.MERCHANDISING;
        }
        // we add the default options to be added when fetching the items
        // this includes language and shoper's currency
        var searchApiMasterOptions = application.getConfig().searchApiMasterOptions || {};
        MerchandisingItemCollection.prototype.searchApiMasterOptions =
            searchApiMasterOptions.merchandisingZone;
        var current_selected_view;
        var self = this;
        // afterAppendView is triggered whenever a view or modal is appended
        application
            .getLayout()
            .on('afterAppendView', function (view) {
            if (!current_selected_view) {
                current_selected_view = view;
            }
            else {
                current_selected_view.off('afterViewRender', self.reRenderMerchandizing);
                current_selected_view.off('afterCompositeViewRender', self.reRenderMerchandizing);
                current_selected_view = view;
            }
            current_selected_view.on(view.childViews ? 'afterCompositeViewRender' : 'afterViewRender', _.bind(self.reRenderMerchandizing, self, application));
            self.reRenderMerchandizing(application, current_selected_view);
        })
            // content service triggers this event when rendering a new enhanced page
            .on('renderEnhancedPageContent', function (view, content_zone) {
            // if the type of the content zone is merchandising
            if (content_zone.contenttype === 'merchandising') {
                var target = content_zone.target;
                var $view_target = view.$(target);
                var merchandising_zone_options = {
                    application: application,
                    id: content_zone.content
                };
                // if the target is in the current view
                // we add the merchandising zone there
                if ($view_target.length) {
                    $view_target.merchandisingZone(merchandising_zone_options);
                }
                else {
                    // else, we search for the target in the layout
                    this.$(target)
                        .filter(':empty')
                        .merchandisingZone(merchandising_zone_options);
                }
            }
        });
        // @module ApplicationSkeleton @class ApplicationSkeleton
        // @method getMerchandisingRules
        // @return {MerchandisingRule.Collection}
        application.getMerchandisingRules = function getMerchandisingRules() {
            return Rule.Collection.getInstance();
        };
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=Merchandising.js.map
