/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="JQueryExtras"/>

/// <reference path="./JQueryExtrasTypeDefinition.d.ts" />

import '../../../jQueryExtras/JavaScript/jQuery.serializeObject';
// this import is using require so that calls to jQuery() can be used
// while running unit-tests
import jQuery = require('../jQuery');
// Here we will apply all jQuery mixins
jQuery.ajaxSetup({
    beforeSend: function(jqXhr, options): void {
        // BTW: "!~" means "== -1"
        if (!~(<any>options.contentType).indexOf('charset')) {
            // If there's no charset, we set it to UTF-8
            jqXhr.setRequestHeader('Content-Type', `${options.contentType}; charset=UTF-8`);
        }

        if (!SC.dontSetRequestHeaderTouchpoint) {
            // Add header so that suitescript code can know the current touchpoint
            jqXhr.setRequestHeader('X-SC-Touchpoint', SC.ENVIRONMENT.SCTouchpoint);
        }
    }
});
export { jQuery };
