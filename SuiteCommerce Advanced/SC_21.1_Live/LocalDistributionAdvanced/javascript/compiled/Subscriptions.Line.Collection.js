/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Subscriptions.Line.Collection", ["require", "exports", "Subscriptions.Line.Model", "Backbone"], function (require, exports, Subscriptions_Line_Model_1, Backbone) {
    "use strict";
    var SubscriptionsLineCollection = Backbone.Collection.extend({
        model: Subscriptions_Line_Model_1.SubscriptionsLineModel
    });
    return SubscriptionsLineCollection;
});

//# sourceMappingURL=Subscriptions.Line.Collection.js.map
