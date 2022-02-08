/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Product.Option.Collection", ["require", "exports", "Product.Option.Model", "ProductLine.Option.Collection"], function (require, exports, ProductOptionModel, ProductLineOptionCollection) {
    "use strict";
    return ProductLineOptionCollection.extend({
        // @property {Product.Options.Model} model
        model: ProductOptionModel
    });
});

//# sourceMappingURL=Product.Option.Collection.js.map
