/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("jQuery.html", ["require", "exports", "Utils", "jQuery"], function (require, exports, utils, jQuery) {
    "use strict";
    var jQueryHtmlModule = {
        mountToApp: function () {
            if (utils.isPageGenerator()) {
                var jQuery_originalHtml_1 = jQuery.fn.html;
                jQuery.fn.html = function (html) {
                    if (typeof html === 'string') {
                        html = utils.minifyMarkup(html);
                        html = utils.removeScripts(html);
                    }
                    return jQuery_originalHtml_1.apply(this, [html]);
                };
                var jQuery_originalAppend_1 = jQuery.fn.append;
                jQuery.fn.append = function (html) {
                    if (typeof html === 'string') {
                        html = utils.minifyMarkup(html);
                        html = utils.removeScripts(html);
                    }
                    return jQuery_originalAppend_1.apply(this, [html]);
                };
            }
        }
    };
    return jQueryHtmlModule;
});

//# sourceMappingURL=jQuery.html.js.map
