/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="SC.Checkout.Starter"/>

import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { Checkout } from './SC.Checkout';
import { Environment } from '../../../Commons/Core/JavaScript/Environment';
import { entryPointModules } from './SC.Checkout.Starter.Dependencies';

import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');
import extensionsPromise = require('../../../Commons/SC.Extensions/JavaScript/SC.Extensions');

const application = Checkout.getInstance();

jQuery(function(): void {
    extensionsPromise.then(function(...entryPointExtensionsModules): void {
        const SC = Environment.getSC();
        // At starting time all the modules Array is initialized
        const extendedEntryPointModules = entryPointModules.concat(entryPointExtensionsModules);

        application.start(extendedEntryPointModules, function(): void {
            // Checks for errors in the context
            if (SC.ENVIRONMENT.contextError) {
                // Shows the error.
                if (SC.ENVIRONMENT.contextError.errorCode === 'ERR_WS_EXPIRED_LINK') {
                    application.getLayout().expiredLink(SC.ENVIRONMENT.contextError.errorMessage);
                } else {
                    application
                        .getLayout()
                        .internalError(
                            SC.ENVIRONMENT.contextError.errorMessage,
                            `Error ${SC.ENVIRONMENT.contextError.errorStatusCode}: ${
                                SC.ENVIRONMENT.contextError.errorCode
                            }`
                        );
                }
            } else {
                const { fragment } = Utils.parseUrlOptions(location.search);

                if (fragment && !location.hash) {
                    location.hash = decodeURIComponent(fragment.toString());
                }

                Backbone.history.start();
            }

            application.getLayout().appendToDom();
        });
    });
});
