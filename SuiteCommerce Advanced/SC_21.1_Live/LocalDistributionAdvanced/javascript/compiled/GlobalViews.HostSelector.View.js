/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("GlobalViews.HostSelector.View", ["require", "exports", "underscore", "global_views_host_selector.tpl", "Utils", "jQuery", "Configuration", "Backbone.View", "Backbone"], function (require, exports, _, global_views_host_selector_tpl, Utils, jQuery, Configuration_1, BackboneView, Backbone) {
    "use strict";
    // @class GlobalViews.HostSelector.View @extends Backbone.View
    var GlobalViewsHostSelectorView = BackboneView.extend({
        template: global_views_host_selector_tpl,
        events: {
            'change select[data-toggle="host-selector"]': 'selectHost',
            'click select[data-toggle="host-selector"]': 'selectHostClick'
        },
        // @method selectHostClick @param {HTMLEvent} e
        selectHostClick: function (e) {
            e.stopPropagation();
        },
        // @method selectHost @param {HTMLEvent} e
        selectHost: function (e) {
            this.setHost(e);
        },
        // @method setHref @param {String} url
        setHref: function (url) {
            window.location.href = Utils.getAbsoluteUrl("redirections.ssp?location=" + (!Utils.isHttpsSupported() ? 'http:' : 'https:') + "//" + url);
        },
        // @method getCurrentPath @returns {String}
        getCurrentPath: function () {
            return location.pathname;
        },
        // @method setHost @param {HTMLEvent} e
        setHost: function (e) {
            var host = jQuery(e.target).val();
            var BackboneHistory = Backbone.History;
            // if _hasPushState is true
            // Seo Engine is on, send him to the host
            var url = !BackboneHistory._hasPushState && SC.ENVIRONMENT.SCTouchpoint === 'shopping'
                ? host + this.getCurrentPath()
                : host;
            // redirects to url
            this.setHref(url);
        },
        // @method getContext @return GlobalViews.HostSelector.View.Context
        getContext: function () {
            var is_home_touchpoint = Configuration_1.Configuration.currentTouchpoint === 'home';
            var use_parameter = !is_home_touchpoint;
            var current_host = is_home_touchpoint
                ? SC.ENVIRONMENT.currentHostString
                : SC.ENVIRONMENT.currentLanguage.locale;
            var available_hosts = _.map(SC.ENVIRONMENT.availableHosts, function (host) {
                // @class GlobalViews.HostSelector.View.Context.Host
                return {
                    // @property {Boolean} hasLanguages
                    hasLanguages: host.languages && host.languages.length,
                    // @property {String} title
                    title: host.title,
                    // @property {Array<GlobalViews.HostSelector.View.Context.Host.Language>} languages
                    languages: _.map(host.languages, function (language) {
                        // @class GlobalViews.HostSelector.View.Context.Host.Language
                        return {
                            // @property {String} host
                            host: language.host,
                            // @property {String} displayName
                            displayName: language.title || language.name,
                            // @property {Boolean} isSelected
                            isSelected: !!((use_parameter && language.locale === current_host) ||
                                language.host === current_host)
                        };
                    })
                };
            });
            // @class GlobalViews.HostSelector.View.Context
            return {
                // @property {Boolean} showHosts
                showHosts: !!(available_hosts && available_hosts.length > 1),
                // @property {Array<GlobalViews.HostSelector.View.Context.Host>} availableHosts
                availableHosts: available_hosts,
                // @property {String} currentHost
                currentHost: current_host,
                // @param {Boolean} useParameter
                useParameter: use_parameter
            };
        }
    });
    return GlobalViewsHostSelectorView;
});

//# sourceMappingURL=GlobalViews.HostSelector.View.js.map
