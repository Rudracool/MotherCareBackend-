/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductLine.Option.Collection", ["require", "exports", "Backbone", "ProductLine.Option.Model"], function (require, exports, Backbone, ProductLineOptionModel) {
    "use strict";
    return Backbone.Collection.extend({
        // @property {ProdctLine.Option.Model}
        model: ProductLineOptionModel
    });
});

//# sourceMappingURL=ProductLine.Option.Collection.js.map
