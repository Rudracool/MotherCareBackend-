/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Checkout"/>

import * as _ from 'underscore';

import '../../../Commons/BackboneExtras/JavaScript/Backbone.Model';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.Sync';
import '../../../Commons/Core/JavaScript/backbone/BackboneExtras';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.View';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.View.render';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.View.saveForm';
import '../../../Commons/BackboneExtras/JavaScript/Backbone.View.toggleReset';
import '../../../Commons/BootstrapExtras/JavaScript/Bootstrap.Slider';
import '../../../Commons/NativesExtras/JavaScript/String.format';
import { jQuery } from '../../jQuerySCAExtras/JavaScript/jQuerySCAExtras';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { ApplicationOnline } from '../../SCA/JavaScript/ApplicationOnline';
import { CheckoutLayout } from './SC.Checkout.Layout';
import { CheckoutStepsFactory } from './CheckoutStepsFactory';

import Configuration = require('./SC.Checkout.Configuration');
import Session = require('../../../Commons/Session/JavaScript/Session');

/* !
 * Description: SuiteCommerce Reference Checkout
 *
 * @copyright (c) 2000-2013, NetSuite Inc.
 * @version 1.0
 */

// Application.js
// --------------
// Extends the application with Checkout specific core methods

export class Checkout extends ApplicationOnline {
    private appPromise: any = jQuery.Deferred();
    protected static instance: Checkout;

    private constructor() {
        super();
        this.layout = new CheckoutLayout(this);
        this.configuration = Configuration.get();
        // This is only to avoid break extensions in 20.2 release. Should be deleted asap
        this.Configuration = this.configuration;

        // This makes that Promo codes and GC travel to different servers (secure and unsecure)
        this.on('afterStart', (): void => this.afterStart());

        // Setup global cache for this application
        jQuery.ajaxSetup({ cache: false });
    }

    public start(modules: any[], done?: Function): void {
        const checkoutPromise = CheckoutStepsFactory.getInstance().loadCheckoutSteps();
        checkoutPromise.then((): void => super.start(modules, done));
    }

    public static getInstance(): Checkout {
        this.instance = this.instance || new Checkout();
        return this.instance;
    }

    private afterStart(): void {
        // Fix sitebuilder links, Examines the event target to check if its a touchpoint
        // and replaces it with the new version ot the touchpoint

        // As this fixCrossDomainNavigation only alters the href of the a we can append it
        // to the mouse down event, and not to the click thing will make us work a lot more :)
        jQuery(document.body).on('mousedown', 'a', this.fixCrossDomainNavigation);
        jQuery(document.body).on('touchstart', 'a', this.fixCrossDomainNavigation);
    }

    private fixCrossDomainNavigation(e): void {
        const $element = jQuery(e.target).closest('a');
        if (!$element.closest('#main').length) {
            const { href } = e.target;
            const url_prefix = href && href.split('?')[0];
            // get the value of the "is" url parameter
            const href_parameter_value_is = Utils.getParameterByName(href, 'is');
            const touchpoints = Session.get('touchpoints');

            _.each(touchpoints, function(touchpoint: any) {
                const touchpoint_parameter_value_is = Utils.getParameterByName(touchpoint, 'is');
                // If the href of the link is equal to the current touchpoint
                // then update the link with the
                // parameters of the touchpoint. To check if are equals is been used the url without
                // parameters and the parameter "is"
                if (url_prefix && ~touchpoint.indexOf(url_prefix)) {
                    // If the "is" parameter exist in the link, then must exist in the
                    // touchpoint and his values need to be equals.
                    if (
                        !(
                            href_parameter_value_is &&
                            (!touchpoint_parameter_value_is ||
                                touchpoint_parameter_value_is !== href_parameter_value_is)
                        )
                    ) {
                        e.target.href = touchpoint;
                    }
                }
            });
        }
    }

    public getName(): string {
        return 'Checkout';
    }
}
