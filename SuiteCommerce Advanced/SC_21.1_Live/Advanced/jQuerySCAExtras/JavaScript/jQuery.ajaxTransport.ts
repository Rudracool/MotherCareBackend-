/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="jQuery.ajaxTransport"/>

import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';

jQuery.ajaxTransport('+script', function(s) {
    // This transport only deals with cross domain requests
    if (s.crossDomain) {
        let script;
        const head = document.head || jQuery('head')[0] || document.documentElement;

        return {
            send: function(_, callback) {
                const win: any = window;
                const originalCallback = win[<any>s.jsonpCallback];
                const response = {};
                win[<any>s.jsonpCallback] = function(data) {
                    if (data.errorStatusCode) {
                        (<any>response).errorStatusCode = parseInt(data.errorStatusCode);
                    }
                    originalCallback.apply(this, arguments);
                };

                script = document.createElement('script');

                script.async = true;

                if (s.scriptCharset) {
                    script.charset = s.scriptCharset;
                }

                script.src = s.url;

                function clean() {
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;

                    // Remove the script
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }

                    // Dereference the script
                    script = null;
                }

                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function(_, isAbort) {
                    if (
                        isAbort ||
                        !script.readyState ||
                        /loaded|complete/.test(script.readyState)
                    ) {
                        clean();

                        // Callback if not abort
                        if (!isAbort) {
                            if ((<any>response).errorStatusCode) {
                                callback((<any>response).errorStatusCode, 'error');
                            } else {
                                callback(200, 'success');
                            }
                        }
                    }
                };
                script.onerror = function() {
                    clean();
                    callback(404, 'error');
                };

                // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                // Use native DOM manipulation to avoid our domManip AJAX trickery
                head.insertBefore(script, head.firstChild);
            },
            abort: function() {
                if (script) {
                    script.onload(undefined, true);
                }
            }
        };
    }
});
