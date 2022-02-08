/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Quote.ListExpirationDate.View", ["require", "exports", "quote_list_expiration_date.tpl", "Backbone.View"], function (require, exports, quote_list_expiration_date_tpl, BackboneView) {
    "use strict";
    return BackboneView.extend({
        // @property {Function} template
        template: quote_list_expiration_date_tpl,
        // @method getContext
        // @return {Quote.ListExpirationDate.View.Context}
        getContext: function () {
            // @class Quote.ListExpirationDate.View.Context
            return {
                // @property {Quote.Model} collection
                model: this.model
            };
            // @class Quote.ListExpirationDate.View
        }
    });
});

//# sourceMappingURL=Quote.ListExpirationDate.View.js.map
