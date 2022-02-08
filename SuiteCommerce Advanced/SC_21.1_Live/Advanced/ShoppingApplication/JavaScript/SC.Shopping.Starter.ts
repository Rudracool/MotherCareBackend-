/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Shopping.Starter"/>

// ---------------MIXINS-----------------
import '../../../Commons/NativesExtras/JavaScript/String.format';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
// ---------------END-----------------
import { Shopping } from './SC.Shopping';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';
import { entryPointModules } from './SC.Shopping.Starter.Dependencies';

import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');
import extensionsPromise = require('../../../Commons/SC.Extensions/JavaScript/SC.Extensions');

const shoppingApp = Shopping.getInstance();

let allEntryPointModules = [];
function startShopping(): void {
    const SC = Environment.getSC();

    // we don't want to start the application if it is served externally,
    // like in google cached pages.
    if (SC.isCrossOrigin()) {
        // an user seeing the page in cache.google with js enabled won't
        // see the images unless we unwrap it:
        jQuery('noscript').each(function(): void {
            jQuery(this)
                .parent()
                .append(jQuery(this).text());
        });
        return;
    }

    // The page generator needs to run in sync in order to work properly
    if (SC.isPageGenerator()) {
        jQuery.ajaxSetup({ async: false });
    }

    (<any>jQuery).fn.modal.Constructor.BACKDROP_TRANSITION_DURATION = 0; // This is in order to prevent Quick View redrawing issues

    // When the document is ready we call the application.start,
    // and once that's done we bootstrap and start backbone
    shoppingApp.start(allEntryPointModules, function(): void {
        // Checks for errors in the context
        if (SC.ENVIRONMENT.contextError) {
            // Hide the header and footer.
            shoppingApp
                .getLayout()
                .$('#site-header')
                .hide();
            shoppingApp
                .getLayout()
                .$('#site-footer')
                .hide();

            // Shows the error.
            shoppingApp
                .getLayout()
                .internalError(
                    SC.ENVIRONMENT.contextError.errorMessage,
                    `Error ${SC.ENVIRONMENT.contextError.errorStatusCode}: ${
                        SC.ENVIRONMENT.contextError.errorCode
                    }`
                );
        } else {
            const { fragment } = Utils.parseUrlOptions(location.search);

            if (fragment && !location.hash) {
                location.hash = decodeURIComponent(fragment.toString());
            }

            if (shoppingApp.getUser) {
                shoppingApp.getUser().done(function(): void {
                    // Only do push state client side.
                    Backbone.history.start({
                        pushState: !SC.isDevelopment && SC.ENVIRONMENT.jsEnvironment === 'browser'
                    });
                });
            } else {
                // Only do push state client side.
                Backbone.history.start({
                    pushState: !SC.isDevelopment && SC.ENVIRONMENT.jsEnvironment === 'browser'
                });
            }
        }

        shoppingApp.getLayout().appendToDom();
    });
}

// If the UA is google and main div is not empty (was pre-rendered) then avoid the starter execution
if (
    !navigator.userAgent.match(/googlebot/i) ||
    !jQuery('#main') ||
    !String(jQuery('#main').html()).trim()
) {
    jQuery(document).ready(function(): void {
        extensionsPromise.then(function(...entryPointExtensionsModules): void {
            // At starting time all the modules Array is initialized
            allEntryPointModules = entryPointModules.concat(entryPointExtensionsModules);
            startShopping();
        });
    });
}
