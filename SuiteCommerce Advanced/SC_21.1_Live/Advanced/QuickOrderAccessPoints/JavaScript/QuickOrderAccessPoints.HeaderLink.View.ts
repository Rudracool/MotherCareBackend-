/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="QuickOrderAccessPoints.HeaderLink.View"/>
// @module QuickOrderAccessPoints

import * as quickorder_accesspoints_headerlink_tpl from 'quickorder_accesspoints_headerlink.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { Configuration } from '../../SCA/JavaScript/Configuration';

import BackboneView = require('../../../Commons/BackboneExtras/JavaScript/Backbone.View');

// @class QuickOrderAccessPoints.HeaderLink.View @extend Backbone.View
export = BackboneView.extend({
    // @property {Function} template
    template: quickorder_accesspoints_headerlink_tpl,

    // @method getContext
    // @return {QuickOrderAccessPoints.HeaderLink.View.Context}
    getContext: function() {
        // @class QuickOrderAccessPoints.HeaderLink.View.Context
        return {
            // @property {String} title
            title: Configuration.get('quickOrder.textHyperlink'),
            // @property {Boolean} showTitle
            showTitle: Configuration.get('quickOrder.showHyperlink'),
            // @property {Boolean} hasClass
            hasClass: !!this.options.className,
            // @property {String} className
            className: this.options.className,
            // @property {String} cartTouchPoint --We must provide a different touchpoint depending on where we are:
            // -if we are in shopping, the data-touchpoint should be 'home',
            // -if we are elsewhere, it should be 'viewcart'.
            // The latter case, when the NavigationHelper manages the navigation, the goToCart.ssp is activated, doing the appropiate redirection.
            cartTouchPoint: Utils.getPathFromObject(
                Configuration,
                'modulesConfig.Cart.startRouter',
                false
            )
                ? Configuration.currentTouchpoint
                : 'viewcart'
        };
        // @class QuickOrderAccessPoints.HeaderLink.View
    }
});
