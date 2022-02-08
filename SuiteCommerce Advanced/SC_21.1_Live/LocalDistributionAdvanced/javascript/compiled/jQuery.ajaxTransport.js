/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("jQuery.ajaxTransport", ["require", "exports", "jQuery"], function (require, exports, jQuery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jQuery.ajaxTransport('+script', function (s) {
        // This transport only deals with cross domain requests
        if (s.crossDomain) {
            var script_1;
            var head_1 = document.head || jQuery('head')[0] || document.documentElement;
            return {
                send: function (_, callback) {
                    var win = window;
                    var originalCallback = win[s.jsonpCallback];
                    var response = {};
                    win[s.jsonpCallback] = function (data) {
                        if (data.errorStatusCode) {
                            response.errorStatusCode = parseInt(data.errorStatusCode);
                        }
                        originalCallback.apply(this, arguments);
                    };
                    script_1 = document.createElement('script');
                    script_1.async = true;
                    if (s.scriptCharset) {
                        script_1.charset = s.scriptCharset;
                    }
                    script_1.src = s.url;
                    function clean() {
                        // Handle memory leak in IE
                        script_1.onload = script_1.onreadystatechange = null;
                        // Remove the script
                        if (script_1.parentNode) {
                            script_1.parentNode.removeChild(script_1);
                        }
                        // Dereference the script
                        script_1 = null;
                    }
                    // Attach handlers for all browsers
                    script_1.onload = script_1.onreadystatechange = function (_, isAbort) {
                        if (isAbort ||
                            !script_1.readyState ||
                            /loaded|complete/.test(script_1.readyState)) {
                            clean();
                            // Callback if not abort
                            if (!isAbort) {
                                if (response.errorStatusCode) {
                                    callback(response.errorStatusCode, 'error');
                                }
                                else {
                                    callback(200, 'success');
                                }
                            }
                        }
                    };
                    script_1.onerror = function () {
                        clean();
                        callback(404, 'error');
                    };
                    // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    head_1.insertBefore(script_1, head_1.firstChild);
                },
                abort: function () {
                    if (script_1) {
                        script_1.onload(undefined, true);
                    }
                }
            };
        }
    });
});

//# sourceMappingURL=jQuery.ajaxTransport.js.map
