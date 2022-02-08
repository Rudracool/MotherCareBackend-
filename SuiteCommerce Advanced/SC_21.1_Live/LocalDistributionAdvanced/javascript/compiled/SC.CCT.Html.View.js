/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("SC.CCT.Html.View", ["require", "exports", "sc_cct_html.tpl", "CustomContentType.Base.View"], function (require, exports, sc_cct_html_tpl, CustomContentTypeBaseView) {
    "use strict";
    return CustomContentTypeBaseView.extend({
        template: sc_cct_html_tpl,
        getContext: function getContext() {
            // @class SC.CCT.Html.View.Context
            return {
                // @property {String} htmlString
                htmlString: this.settings.html_string,
                // @property {Boolean} hasHtmlString
                hasHtmlString: !!this.settings.html_string
            };
            // @class SC.CCT.Html.View
        }
    });
});

//# sourceMappingURL=SC.CCT.Html.View.js.map
