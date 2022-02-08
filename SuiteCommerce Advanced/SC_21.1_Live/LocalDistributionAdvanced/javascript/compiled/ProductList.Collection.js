/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("ProductList.Collection", ["require", "exports", "Utils", "Backbone", "ProductList.Model"], function (require, exports, Utils, Backbone, ProductListModel) {
    "use strict";
    return Backbone.Collection.extend({
        url: Utils.getAbsoluteUrl('services/ProductList.Service.ss'),
        model: ProductListModel,
        // Filter based on the iterator and return a collection of the same type
        filtered: function (iterator) {
            return new this.constructor(this.filter(iterator));
        }
    });
});

//# sourceMappingURL=ProductList.Collection.js.map
