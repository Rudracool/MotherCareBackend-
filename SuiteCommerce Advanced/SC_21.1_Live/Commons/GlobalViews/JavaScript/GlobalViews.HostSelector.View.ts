/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="GlobalViews.HostSelector.View"/>

import * as _ from 'underscore';
import * as global_views_host_selector_tpl from 'global_views_host_selector.tpl';
import * as Utils from '../../Utilities/JavaScript/Utils';
import * as jQuery from '../../Core/JavaScript/jQuery';
import { Configuration } from '../../Utilities/JavaScript/Configuration';

import BackboneView = require('../../BackboneExtras/JavaScript/Backbone.View');
import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');

// @class GlobalViews.HostSelector.View @extends Backbone.View
const GlobalViewsHostSelectorView: any = BackboneView.extend({
    template: global_views_host_selector_tpl,

    events: {
        'change select[data-toggle="host-selector"]': 'selectHost',
        'click select[data-toggle="host-selector"]': 'selectHostClick'
    },

    // @method selectHostClick @param {HTMLEvent} e
    selectHostClick: function(e) {
        e.stopPropagation();
    },

    // @method selectHost @param {HTMLEvent} e
    selectHost: function(e) {
        this.setHost(e);
    },

    // @method setHref @param {String} url
    setHref: function(url) {
        window.location.href = Utils.getAbsoluteUrl(
            `redirections.ssp?location=${!Utils.isHttpsSupported() ? 'http:' : 'https:'}//${url}`
        );
    },

    // @method getCurrentPath @returns {String}
    getCurrentPath: function() {
        return location.pathname;
    },

    // @method setHost @param {HTMLEvent} e
    setHost: function(e) {
        const host = jQuery(e.target).val();
        const BackboneHistory: any = Backbone.History;
        // if _hasPushState is true
        // Seo Engine is on, send him to the host
        const url =
            !BackboneHistory._hasPushState && SC.ENVIRONMENT.SCTouchpoint === 'shopping'
                ? host + this.getCurrentPath()
                : host;
        // redirects to url
        this.setHref(url);
    },

    // @method getContext @return GlobalViews.HostSelector.View.Context
    getContext: function() {
        const is_home_touchpoint = Configuration.currentTouchpoint === 'home';

        const use_parameter = !is_home_touchpoint;
        const current_host = is_home_touchpoint
            ? SC.ENVIRONMENT.currentHostString
            : SC.ENVIRONMENT.currentLanguage.locale;
        const available_hosts: any = _.map(SC.ENVIRONMENT.availableHosts, function(host: any) {
            // @class GlobalViews.HostSelector.View.Context.Host
            return {
                // @property {Boolean} hasLanguages
                hasLanguages: host.languages && host.languages.length,
                // @property {String} title
                title: host.title,
                // @property {Array<GlobalViews.HostSelector.View.Context.Host.Language>} languages
                languages: _.map(host.languages, function(language: any) {
                    // @class GlobalViews.HostSelector.View.Context.Host.Language
                    return {
                        // @property {String} host
                        host: language.host,
                        // @property {String} displayName
                        displayName: language.title || language.name,
                        // @property {Boolean} isSelected
                        isSelected: !!(
                            (use_parameter && language.locale === current_host) ||
                            language.host === current_host
                        )
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

export = GlobalViewsHostSelectorView;
